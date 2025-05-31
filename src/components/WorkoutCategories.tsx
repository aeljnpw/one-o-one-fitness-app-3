import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export function WorkoutCategories() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.categoryButton, {backgroundColor: '#4CAF50'}]}>
        <Text style={styles.categoryText}>Home{'\n'}Fitplans</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.categoryButton, {backgroundColor: '#4CAF50'}]}>
        <Text style={styles.categoryText}>Gym{'\n'}Fitplans</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.categoryButton, {backgroundColor: '#2196F3'}]}>
        <Text style={styles.categoryText}>Free{'\n'}Workouts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 