import client from './client'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const loginWithGitHub = () => {
  window.location.href = `${BASE_URL}/auth/github`
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