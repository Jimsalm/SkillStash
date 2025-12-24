import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && !error.response.data.success) {
      console.error('API Error:', error.response.data.message);
    }
    return Promise.reject(error);
  }
);