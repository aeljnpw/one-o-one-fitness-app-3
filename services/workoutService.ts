import apiClient from './apiClient';
import { Workout } from '../types/Workout';

// Get user's workouts
export const getUserWorkouts = async (): Promise<Workout[]> => {
  try {
    const response = await apiClient.get<Workout[]>('/workouts');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch workouts');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get workout by ID
export const getWorkoutById = async (id: string): Promise<Workout> => {
  try {
    const response = await apiClient.get<Workout>(`/workouts/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch workout details');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Create new workout
export const createWorkout = async (workoutData: Partial<Workout>): Promise<Workout> => {
  try {
    const response = await apiClient.post<Workout>('/workouts', workoutData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create workout');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Update workout
export const updateWorkout = async (id: string, workoutData: Partial<Workout>): Promise<Workout> => {
  try {
    const response = await apiClient.put<Workout>(`/workouts/${id}`, workoutData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update workout');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Delete workout
export const deleteWorkout = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/workouts/${id}`);
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete workout');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get workout statistics
export const getWorkoutStats = async (): Promise<{
  totalWorkouts: number;
  totalCaloriesBurned: number;
  workoutStreak: number;
  averageWorkoutDuration: number;
}> => {
  try {
    const response = await apiClient.get('/workouts/stats');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch workout statistics');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};