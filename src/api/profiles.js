import client from './client'

export const getProfiles = (params = {}) => {
  return client.get('/api/profiles', { params })
}

export const getProfile = (id) => {
  return client.get(`/api/profiles/${id}`)
}

export const searchProfiles = (query, params = {}) => {
  return client.get('/api/profiles/search', {
    params: { q: query, ...params },
  })
}

export const createProfile = (name) => {
  return client.post('/api/profiles', { name })
}

export const deleteProfile = (id) => {
  return client.delete(`/api/profiles/${id}`)
}

export const exportProfiles = (params = {}) => {
  return client.get('/api/profiles/export', {
    params: { format: 'csv', ...params },
    responseType: 'blob',
  })
}