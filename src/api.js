import axios from 'axios';

/**
 * Central API client for the entire frontend.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://hng-stage-3-backend.vercel.app/api/',
  
  withCredentials: true, 
});


API.interceptors.request.use((config) => {
  config.headers['X-API-Version'] = '1';


  return config;
});

export default API;
