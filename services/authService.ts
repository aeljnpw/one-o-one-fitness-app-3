import apiClient from './apiClient';
import { User } from '../types/User';

// Interface for login response
interface AuthResponse {
  token: string;
  user: User;
}

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Invalid credentials');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('An unexpected error occurred');
    }
  }
};

// Register new user
export const registerUser = async (
  userData: Partial<User> & { email: string; password: string }
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get user profile
export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch user profile');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Update user profile
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put<User>('/user/profile', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update profile');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};