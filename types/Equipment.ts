export interface Equipment {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}