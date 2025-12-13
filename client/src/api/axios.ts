import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor to handle common error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for a specific error structure from your backend
    if (error.response && !error.response.data.success) {
      console.error('API Error:', error.response.data.message);
    }
    return Promise.reject(error);
  }
);