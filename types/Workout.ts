export interface WorkoutSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  reps: number;
  weight: number;
  duration?: number; // in seconds
  restTime?: number; // in seconds
  completed: boolean;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: string;
  duration: number; // in minutes
  caloriesBurned: number;
  sets: WorkoutSet[];
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}