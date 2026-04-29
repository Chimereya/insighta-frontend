import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProfiles } from '../api/profiles'
import { useNavigate } from 'react-router-dom'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProfiles({ limit: 1 })
      .then((res) => {
        const data = res.data
        setStats({
          total: data.total,
          total_pages: data.total_pages,
        })
      })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            Good {getTimeOfDay()}, <span className={styles.name}>@{user?.username}</span>
          </h1>
          <p className={styles.subtitle}>Here's what's happening in Insighta Labs+</p>
        </div>
        {isAdmin && (
          <button
            className={styles.createBtn}
            onClick={() => navigate('/profiles')}
          >
            + New Profile
          </button>
        )}
      </div>

      <div className={styles.cards}>
        <StatCard
          label="Total Profiles"
          value={loading ? '—' : error ? 'Error' : stats?.total?.toLocaleString()}
          sub="in the database"
          accent="#6366f1"
        />
        <StatCard
          label="Total Pages"
          value={loading ? '—' : error ? 'Error' : stats?.total_pages?.toLocaleString()}
          sub="at 10 per page"
          accent="#8b5cf6"
        />
        <StatCard
          label="Your Role"
          value={user?.role}
          sub={isAdmin ? 'Full access' : 'Read-only access'}
          accent={isAdmin ? '#10b981' : '#f59e0b'}
        />
        <StatCard
          label="Account"
          value="Active"
          sub={user?.email || 'GitHub OAuth'}
          accent="#06b6d4"
        />
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actions}>
          <ActionCard
            title="Browse Profiles"
            description="View and filter all profiles in the system"
            onClick={() => navigate('/profiles')}
          />
          <ActionCard
            title="Search"
            description="Use natural language to find profiles"
            onClick={() => navigate('/search')}
          />
          <ActionCard
            title="Account"
            description="View your account details and session info"
            onClick={() => navigate('/account')}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={styles.card} style={{ '--accent': accent }}>
      <div className={styles.cardAccent} />
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value}</p>
      <p className={styles.cardSub}>{sub}</p>
    </div>
  )
}

function ActionCard({ title, description, onClick }) {
  return (
    <button className={styles.actionCard} onClick={onClick}>
      <p className={styles.actionTitle}>{title}</p>
      <p className={styles.actionDesc}>{description}</p>
      <span className={styles.actionArrow}>→</span>
    </button>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}