import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { logout } from '../api/auth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, isAdmin, clearUser } = useAuth()  // ← added isAdmin
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
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <span className={styles.logoMark}>IL</span>
        <span className={styles.brandName}>Insighta Labs+</span>
      </div>

      <div className={styles.links}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/profiles"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Profiles
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Search
        </NavLink>
        {/* Upload link – visible only to admin users */}
        {isAdmin && (
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Upload CSV
          </NavLink>
        )}
        <NavLink
          to="/account"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Account
        </NavLink>
      </div>

      <div className={styles.user}>
        {user?.avatar_url && (
          <img
            src={user.avatar_url}
            alt={user.username}
            className={styles.avatar}
          />
        )}
        <span className={styles.username}>@{user?.username}</span>
        <span className={styles.role}>{user?.role}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}