import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Create a base API client that can be imported and used throughout the 
const apiClient = axios.create({
  // This URL should be replaced with your actual API URL
  baseURL: 'https://api.yourgym',
  headers: {
    'Content-Type': 'n',
  },
});

// Add a request interceptor to include the auth token in requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle authentication errors (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If using refresh tokens, you could implement token refresh logic here
      // For now, we'll just clear the token and redirect to login
      await SecureStore.deleteItemAsync('userToken');
      // We can't use router.replace here as it's outside React component
      // Instead, we'll publish an event that can be listened to in a React component
      
      // Create and dispatch a custom event (for web)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('AUTH_LOGOUT'));
      }
      
      return Promise.reject(error);
    }
    
    // Handle server errors (5xx)
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('A server error occurred. Please try again later.'));
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;