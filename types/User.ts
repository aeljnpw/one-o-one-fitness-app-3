export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  profileImage?: string;
  joinDate: string;
  workoutStreak: number;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  createdAt: string;
  updatedAt: string;
}