import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import ProfilesPage from './pages/ProfilesPage'
import ProfileDetailPage from './pages/ProfileDetailPage'
import SearchPage from './pages/SearchPage'
import AccountPage from './pages/AccountPage'
import { useAuth } from './context/useAuth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: '#0a0a0f',
    color: '#6b7280',
    fontFamily: 'Courier New, monospace',
    fontSize: '0.9rem'
  }}>Loading...</div>

  if (!user) return <Navigate to="/login" replace />

  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/profiles" element={
          <ProtectedRoute><ProfilesPage /></ProtectedRoute>
        } />
        <Route path="/profiles/:id" element={
          <ProtectedRoute><ProfileDetailPage /></ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute><SearchPage /></ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute><AccountPage /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}