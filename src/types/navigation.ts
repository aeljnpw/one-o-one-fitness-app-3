import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { Exercise } from './supabase';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  Workouts: {
    equipmentId: string;
  };
  ExerciseDetail: {
    exercise: Exercise;
  };
  WorkoutDetail: {
    id: string;
  };
};

export type TabParamList = {
  Home: undefined;
  Feed: undefined;
  Workouts: undefined;
  Nutrition: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  BottomTabScreenProps<TabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 