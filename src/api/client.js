import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach X-API-Version: 1 to every /api/* request
client.interceptors.request.use((config) => {
  if (config.url?.startsWith('/api')) {
    config.headers['X-API-Version'] = '1'
  }
  return config
})

// Global error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default client