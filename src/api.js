import axios from 'axios';

/**
 * Central API client for the entire frontend.
 * All HTTP requests to the backend go through here.
 */
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

/**
 * Automatically attach JWT token (if exists)
 * to every outgoing request.
 */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
