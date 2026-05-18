import axios from 'axios';

// Create a configured Axios instance pointing to our NestJS server
const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// The Interceptor: checks for a security token before every request leaves the browser
api.interceptors.request.use((config) => {    
  // Only access localStorage if we are running in the browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      // Inject the token into the Authorization header automatically
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
