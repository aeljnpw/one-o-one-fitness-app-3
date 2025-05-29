import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { User } from '../types/User';
import { loginUser, registerUser, getUserProfile } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on 
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        
        if (storedToken) {
          setToken(storedToken);
          // Fetch user profile with the token
          const userData = await getUserProfile(storedToken);
          setUser(userData);
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.error('Failed to load auth token', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { token, user } = await loginUser(email, password);
      setToken(token);
      setUser(user);
      await SecureStore.setItemAsync('userToken', token);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { token, user } = await registerUser(userData);
      setToken(token);
      setUser(user);
      await SecureStore.setItemAsync('userToken', token);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('userToken');
    router.replace('/login');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      error, 
      login, 
      register, 
      logout, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};