import axios from 'axios';

const api = axios.create({
  baseURL: 'https://servicetrack-crfm.onrender.com/', // Adjust in production
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
