import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { getMe } from '../api/auth'

// In-memory token store — never touches localStorage
let memoryTokens = {
  access_token: null,
  refresh_token: null,
}

export function getTokens() {
  return memoryTokens
}

export function setTokens(access, refresh) {
  memoryTokens.access_token = access
  memoryTokens.refresh_token = refresh
}

export function clearTokens() {
  memoryTokens.access_token = null
  memoryTokens.refresh_token = null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if tokens came back in URL from OAuth redirect
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken)
      // Clean tokens from URL immediately
      window.history.replaceState({}, '', window.location.pathname)
    }

    getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const isAdmin = user?.role === 'admin'
  const isAnalyst = user?.role === 'analyst'
  const updateUser = (userData) => setUser(userData)
  const clearUser = () => {
    setUser(null)
    clearTokens()
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isAnalyst, updateUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  )
}
