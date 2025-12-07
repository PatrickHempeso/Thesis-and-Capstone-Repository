import axios from 'axios';

// Create a custom axios instance
const axiosConfig = axios.create({
  baseURL: 'http://localhost:8000', // Your Laravel backend
  withCredentials: true,            // Needed for CSRF cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor to automatically add token if stored
axiosConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosConfig;