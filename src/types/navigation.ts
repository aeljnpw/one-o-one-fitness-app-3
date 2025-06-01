import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { Exercise } from './supabase';

export type RootStackParamList = {
  Home: undefined;
  ExerciseDetail: { exercise: Exercise };
  Workouts: { equipmentId: string };
  Profile: undefined;
  Feed: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof RootStackParamList> = BottomTabScreenProps<
  RootStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 