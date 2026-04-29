import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach X-API-Version: 1 to EVERY request for HNG Stage 3 compliance
client.interceptors.request.use((config) => {
  config.headers['X-API-Version'] = '1'
  return config
})

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

    // Check if the failed request was an auth-related endpoint
    const isAuthUrl = url.includes('/auth/whoami') || url.includes('/auth/refresh')

    if (status === 401 && !isAuthUrl && !error.config._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => client(error.config))
          .catch((err) => Promise.reject(err))
      }

      error.config._retry = true
      isRefreshing = true

      try {
        await client.post('/auth/refresh')
        processQueue(null)
        return client(error.config)
      } catch (refreshError) {
        processQueue(refreshError)
        // Only redirect to login if the REFRESH itself fails
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // If whoami returns 401, just reject it so the UI can handle it (no loop)
    return Promise.reject(error)
  }
)

export default client
