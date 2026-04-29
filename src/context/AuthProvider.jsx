import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { getMe } from '../api/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const isAdmin = user?.role === 'admin'
  const isAnalyst = user?.role === 'analyst'
  const updateUser = (userData) => setUser(userData)
  const clearUser = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isAnalyst, updateUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  )
}