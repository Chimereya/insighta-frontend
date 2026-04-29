import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProfile, deleteProfile } from '../api/profiles'
import { useAuth } from '../context/AuthContext'
import styles from './ProfileDetailPage.module.css'

export default function ProfileDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getProfile(id)
      .then((res) => setProfile(res.data.data))
      .catch(() => setError('Profile not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return
    setDeleting(true)
    try {
      await deleteProfile(id)
      navigate('/profiles', { replace: true })
    } catch {
      alert('Failed to delete profile')
      setDeleting(false)
    }
  }

  if (loading) return <div className={styles.state}>Loading profile...</div>
  if (error) return <div className={`${styles.state} ${styles.error}`}>{error}</div>
  if (!profile) return null

  return (
    <div className={styles.page}>

      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/profiles')}>
          ← Back to Profiles
        </button>
        {isAdmin && (
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Profile'}
          </button>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.avatar}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.id}>ID: {profile.id}</p>
          </div>
          <span className={`${styles.genderBadge} ${styles[profile.gender]}`}>
            {profile.gender}
          </span>
        </div>

        <div className={styles.grid}>
          <StatItem
            label="Age"
            value={profile.age}
            sub={profile.age_group}
          />
          <StatItem
            label="Gender Probability"
            value={`${(profile.gender_probability * 100).toFixed(0)}%`}
            sub="confidence"
          />
          <StatItem
            label="Country"
            value={profile.country_name}
            sub={profile.country_id}
          />
          <StatItem
            label="Country Probability"
            value={`${(profile.country_probability * 100).toFixed(0)}%`}
            sub="confidence"
          />
          <StatItem
            label="Age Group"
            value={profile.age_group}
            sub="classification"
          />
          <StatItem
            label="Created"
            value={new Date(profile.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            sub={new Date(profile.created_at).toLocaleTimeString()}
          />
        </div>
      </div>

    </div>
  )
}

function StatItem({ label, value, sub }) {
  return (
    <div className={styles.statItem}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statSub}>{sub}</p>
    </div>
  )
}