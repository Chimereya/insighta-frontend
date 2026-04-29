import { useAuth } from '../context/useAuth'
import { logout } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import styles from './AccountPage.module.css'

export default function AccountPage() {
  const { user, isAdmin, clearUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // proceed anyway
    }
    clearUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>Account</h1>
        <p className={styles.subtitle}>Your profile and session details</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarFallback}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className={styles.username}>@{user?.username}</h2>
            <p className={styles.email}>{user?.email}</p>
          </div>
          <span className={`${styles.roleBadge} ${styles[user?.role]}`}>
            {user?.role}
          </span>
        </div>

        <div className={styles.grid}>
          <InfoItem label="User ID" value={user?.id} mono />
          <InfoItem label="Username" value={`@${user?.username}`} mono />
          <InfoItem label="Email" value={user?.email} mono />
          <InfoItem
            label="Role"
            value={user?.role}
            sub={isAdmin ? 'Can create and delete profiles' : 'Read-only access'}
          />
          <InfoItem
            label="Account Status"
            value="Active"
            valueColor="#10b981"
          />
          <InfoItem
            label="Auth Provider"
            value="GitHub OAuth"
            sub="via PKCE flow"
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Permissions</div>
        <div className={styles.permissions}>
          <Permission label="View profiles" allowed={true} />
          <Permission label="Search profiles" allowed={true} />
          <Permission label="Export CSV" allowed={true} />
          <Permission label="Create profiles" allowed={isAdmin} />
          <Permission label="Delete profiles" allowed={isAdmin} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Session</div>
        <p className={styles.sessionNote}>
          Your session is managed via HTTP-only cookies. Tokens are never
          accessible to JavaScript and are automatically refreshed.
        </p>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sign out of Insighta Labs+
        </button>
      </div>

    </div>
  )
}

function InfoItem({ label, value, sub, mono, valueColor }) {
  return (
    <div className={styles.infoItem}>
      <p className={styles.infoLabel}>{label}</p>
      <p
        className={mono ? styles.infoValueMono : styles.infoValue}
        style={valueColor ? { color: valueColor } : {}}
      >
        {value}
      </p>
      {sub && <p className={styles.infoSub}>{sub}</p>}
    </div>
  )
}

function Permission({ label, allowed }) {
  return (
    <div className={styles.permission}>
      <span className={allowed ? styles.allowed : styles.denied}>
        {allowed ? '✓' : '✗'}
      </span>
      <span className={styles.permLabel}>{label}</span>
    </div>
  )
}