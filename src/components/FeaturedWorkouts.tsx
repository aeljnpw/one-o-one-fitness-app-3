import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const WORKOUT_WIDTH = Dimensions.get('window').width * 0.7;

export function FeaturedWorkouts() {
  const workouts = [
    {
      id: '1',
      title: '8 Minute Abs',
      trainer: 'Jen Selter',
    },
    {
      id: '2',
      title: '7 Minutes to Stronger: Abs +',
      trainer: 'Strong Nation',
    },
    {
      id: '3',
      title: 'Post Workout Stretch',
      trainer: 'Dasha Gaivoronski',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Workouts</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {workouts.map(workout => (
          <TouchableOpacity key={workout.id} style={styles.workoutCard}>
            <View style={styles.workoutImagePlaceholder} />
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={styles.trainerName}>{workout.trainer}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAll: {
    color: '#666',
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  workoutCard: {
    width: WORKOUT_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2A2A2A',
  },
  workoutImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#3A3A3A',
  },
  workoutInfo: {
    padding: 12,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  trainerName: {
    fontSize: 14,
    color: '#666',
  },
}); 