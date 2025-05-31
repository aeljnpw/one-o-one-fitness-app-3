export type Exercise = {
  id: string;
  name: string;
  description: string;
  muscle_group: string;
  difficulty: string;
  type: string;
  equipment_id: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
};

export type Equipment = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  workouts_completed: number;
  streak: number;
  level: string;
  created_at: string;
  updated_at: string;
};