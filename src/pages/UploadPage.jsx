import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadProfiles } from '../api/profiles';
import styles from './UploadPage.module.css';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return false;
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Only .csv files are accepted');
      return false;
    }
    setFile(selectedFile);
    setError(null);
    setResult(null);
    return true;
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    validateAndSetFile(selected);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) setIsDragOver(true);
  }, [uploading]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (uploading) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  }, [uploading]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const response = await uploadProfiles(file);
      setResult(response.data);
      // Clear file input after success
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFile(null);
    } catch (err) {
      const message = err.response?.data?.detail?.message || err.message || 'Upload failed';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const triggerFilePicker = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/profiles')}>
          ← Back to Profiles
        </button>
        <h1 className={styles.title}>Upload Profiles (CSV)</h1>
        <p className={styles.subtitle}>Bulk import profiles using a CSV file</p>
      </div>

      <div className={styles.card}>
        {/* Visible file input – this ensures file selection, not folders */}
        <div className={styles.fileInputWrapper}>
          <label className={styles.fileLabel}>
            <span>📂 Choose CSV file</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          {file && (
            <div className={styles.selectedFile}>
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        {/* Drag & Drop Area (optional, works alongside the file picker) */}
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''} ${uploading ? styles.disabled : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={styles.dropContent}>
            <span className={styles.dropIcon}>📁</span>
            <p className={styles.dropText}>Drag & drop a CSV file here</p>
            <p className={styles.dropSubtext}>or use the button above</p>
          </div>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <div className={styles.uploadAction}>
          <button
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </div>

        <div className={styles.formatHint}>
          <p className={styles.hintTitle}>Expected CSV columns:</p>
          <code className={styles.code}>
            name,gender,gender_probability,age,age_group,country_id,country_name,country_probability
          </code>
          <p className={styles.note}>
            Gender: male/female · Age group: child/teenager/adult/senior · Country ID: ISO 2-letter code
          </p>
        </div>
      </div>

      {result && (
        <div className={styles.resultCard}>
          <h3 className={styles.resultTitle}>Upload Summary</h3>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total rows</span>
              <span className={styles.statValue}>{result.total_rows}</span>
            </div>
            <div className={`${styles.stat} ${styles.inserted}`}>
              <span className={styles.statLabel}>Inserted</span>
              <span className={styles.statValue}>{result.inserted}</span>
            </div>
            <div className={`${styles.stat} ${styles.skipped}`}>
              <span className={styles.statLabel}>Skipped</span>
              <span className={styles.statValue}>{result.skipped}</span>
            </div>
          </div>
          {result.reasons && Object.keys(result.reasons).length > 0 && (
            <div className={styles.reasons}>
              <p className={styles.reasonsTitle}>Skip reasons:</p>
              <ul className={styles.reasonsList}>
                {Object.entries(result.reasons).map(([reason, count]) => (
                  <li key={reason}>
                    <span className={styles.reasonName}>{reason.replace(/_/g, ' ')}</span>
                    <span className={styles.reasonCount}>{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}