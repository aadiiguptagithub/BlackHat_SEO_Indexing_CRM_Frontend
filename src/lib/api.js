import axios from 'axios';

// Create axios instance with environment config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add worker API key for worker endpoints
    const workerKey = import.meta.env.VITE_WORKER_API_KEY;
    if (workerKey && config.url?.includes('/submissions')) {
      config.headers['x-api-key'] = workerKey;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with normalized response format
api.interceptors.response.use(
  (response) => ({
    success: true,
    data: response.data?.data || response.data,
    message: response.data?.message || 'Success'
  }),
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject({
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred'
    });
  }
);

export default api;