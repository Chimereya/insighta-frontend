import client from './client'

// Use the base domain directly for the window.location redirect
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const loginWithGitHub = () => {
  // Redirecting to the backend OAuth initiation endpoint
  // Added source=web to match your backend logic
  window.location.href = `${BASE_URL}/auth/github?source=web`
}

export const logout = () => {
  return client.post('/auth/logout')
}

export const getMe = () => {
  return client.get('/auth/whoami')
}

export const refreshTokens = () => {
  return client.post('/auth/refresh')
}
