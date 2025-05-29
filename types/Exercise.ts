export interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  equipmentId: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  createdAt: string;
  updatedAt: string;
}