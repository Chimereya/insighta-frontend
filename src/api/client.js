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

// Track if we're already trying to refresh
// to avoid multiple simultaneous refresh attempts
let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const url = error.config?.url

    
    const isAuthUrl = url === '/auth/whoami' || url === '/auth/refresh'

    if (status === 401 && !isAuthUrl && !error.config._retry) {
      // If already refreshing, queue this request until refresh is done
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => client(error.config))
          .catch((err) => Promise.reject(err))
      }

      // Marking this request so we don't retry it again
      error.config._retry = true
      isRefreshing = true

      try {
        // Trying to get new tokens using the refresh token cookie
        await client.post('/auth/refresh')

        // Refresh worked then we'll retry all queued requests
        processQueue(null)

        // Retrying the original request
        return client(error.config)
      } catch (refreshError) {
        // Refresh failed if session is fully expired
        processQueue(refreshError)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default client