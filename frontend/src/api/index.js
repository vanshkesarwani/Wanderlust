import axios from 'axios';

// When deployed separately or testing cross-device, VITE_API_URL can be configured.
// By default, relative '/api' works seamlessly with the Vite dev proxy and same-domain deployments.
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for cross-device network resilience
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && error.message === 'Network Error') {
      console.warn('Network Error: Unable to reach Wanderlust backend. Please verify your connection or backend server status.');
    }
    return Promise.reject(error);
  }
);

export default api;
