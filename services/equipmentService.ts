import apiClient from './apiClient';
import { Equipment } from '../types/Equipment';

// Get all equipment
export const getAllEquipment = async (): Promise<Equipment[]> => {
  try {
    const response = await apiClient.get<Equipment[]>('/equipment');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch equipment');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get equipment by ID
export const getEquipmentById = async (id: string): Promise<Equipment> => {
  try {
    const response = await apiClient.get<Equipment>(`/equipment/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch equipment details');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Search equipment by name
export const searchEquipment = async (query: string): Promise<Equipment[]> => {
  try {
    const response = await apiClient.get<Equipment[]>(`/equipment/search?q=${query}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to search equipment');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get equipment by category
export const getEquipmentByCategory = async (category: string): Promise<Equipment[]> => {
  try {
    const response = await apiClient.get<Equipment[]>(`/equipment/category/${category}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch equipment by category');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};