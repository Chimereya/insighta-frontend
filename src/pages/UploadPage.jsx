import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { uploadProfiles } from '../api/profiles';
import styles from './UploadPage.module.css';

export default function UploadPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Redirect non-admin users
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected);
      setError(null);
      setResult(null);
    } else {
      setFile(null);
      setError('Please select a valid .csv file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const data = await uploadProfiles(file);
      setResult(data);
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
        <div className={styles.uploadArea}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className={styles.fileInput}
            disabled={uploading}
          />
          {file && (
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}
          <button
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload CSV'}
          </button>
          {error && <div className={styles.errorMsg}>{error}</div>}
        </div>

        {/* Expected CSV format hint */}
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

      {/* Upload result summary */}
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