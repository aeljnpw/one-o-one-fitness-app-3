import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../config/supabase';
import { Exercise } from '../types/supabase';
import Icon from 'react-native-vector-icons/Ionicons';
import type { RootStackScreenProps } from '../types/navigation';

type WorkoutsProps = RootStackScreenProps<'Workouts'>;

export const Workouts = ({ route, navigation }: WorkoutsProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { equipmentId } = route.params;

  useEffect(() => {
    fetchExercisesByEquipment();
  }, [equipmentId]);

  const fetchExercisesByEquipment = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('exercises')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('name');

      if (err) {
        throw err;
      }

      setExercises(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
    >
      {item.image_url && (
        <Image 
          source={{ uri: item.image_url }} 
          style={styles.exerciseImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.name}</Text>
          <Icon name="chevron-forward" size={20} color="#666" />
        </View>
        <Text style={styles.muscleGroup}>
          <Icon name="fitness-outline" size={14} color="#2196F3" /> {item.muscle_group}
        </Text>
        <Text style={[styles.difficulty, getDifficultyColor(item.difficulty)]}>
          <Icon name="speedometer-outline" size={14} /> {item.difficulty}
        </Text>
        <Text style={styles.type}>
          <Icon name="barbell-outline" size={14} color="#FFC107" /> {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Icon name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text style={styles.error}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchExercisesByEquipment}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Available Exercises</Text>
      </View>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return { color: '#4CAF50' };
    case 'intermediate':
      return { color: '#FFC107' };
    case 'advanced':
      return { color: '#FF5252' };
    default:
      return { color: '#FFFFFF' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  header: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  muscleGroup: {
    color: '#2196F3',
    fontSize: 14,
    marginBottom: 4,
  },
  difficulty: {
    fontSize: 14,
    marginBottom: 4,
  },
  type: {
    color: '#FFC107',
    fontSize: 14,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 