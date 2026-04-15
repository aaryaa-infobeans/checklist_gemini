import axios from 'axios';

// const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://ec2-54-82-65-25.compute-1.amazonaws.com:8000/api/v1';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

// Response interceptor to handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic error handling: could integrate toast notifications here
    return Promise.reject(error);
  }
);

export default axiosInstance;
