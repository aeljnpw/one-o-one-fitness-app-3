import apiClient from './apiClient';
import { Exercise } from '../types/Exercise';

// Get all exercises
export const getAllExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await apiClient.get<Exercise[]>('/exercises');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch exercises');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get exercises by equipment ID
export const getExercisesByEquipment = async (equipmentId: string): Promise<Exercise[]> => {
  try {
    const response = await apiClient.get<Exercise[]>(`/exercises?equipmentId=${equipmentId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch exercises for this equipment');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get exercise by ID
export const getExerciseById = async (id: string): Promise<Exercise> => {
  try {
    const response = await apiClient.get<Exercise>(`/exercises/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch exercise details');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Search exercises by name
export const searchExercises = async (query: string): Promise<Exercise[]> => {
  try {
    const response = await apiClient.get<Exercise[]>(`/exercises/search?q=${query}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to search exercises');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get exercises by muscle group
export const getExercisesByMuscleGroup = async (muscleGroup: string): Promise<Exercise[]> => {
  try {
    const response = await apiClient.get<Exercise[]>(`/exercises/muscle/${muscleGroup}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch exercises for this muscle group');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};