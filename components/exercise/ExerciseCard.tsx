import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Play } from 'lucide-react-native';
import Card from '../ui/Card';
import { Exercise } from '../../types/Exercise';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  // Generate a tag pill for each muscle group (limit to 3)
  const renderMuscleGroups = () => {
    const visibleGroups = exercise.muscleGroups.slice(0, 2);
    const remaining = exercise.muscleGroups.length - 2;
    
    return (
      <View style={styles.tagContainer}>
        {visibleGroups.map((muscle, index) => (
          <View key={index} style={styles.tagPill}>
            <Text style={styles.tagText}>{muscle}</Text>
          </View>
        ))}
        
        {remaining > 0 && (
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>+{remaining} more</Text>
          </View>
        )}
      </View>
    );
  };
  
  // Render difficulty badge
  const renderDifficultyBadge = () => {
    const badgeColors = {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336',
    };
    
    return (
      <View 
        style={[
          styles.difficultyBadge,
          { backgroundColor: badgeColors[exercise.difficulty] }
        ]}
      >
        <Text style={styles.difficultyText}>
          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
        </Text>
      </View>
    );
  };

  return (
    <Card
      title={exercise.name}
      imageUrl={exercise.imageUrl}
      onPress={() => onPress(exercise)}
      style={styles.card}
    >
      <View style={styles.contentRow}>
        {renderMuscleGroups()}
        {renderDifficultyBadge()}
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {exercise.description}
      </Text>
      
      {exercise.videoUrl && (
        <View style={styles.videoIndicator}>
          <Play color={Colors.accent.primary} size={14} />
          <Text style={styles.videoText}>Video tutorial available</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: Layout.Spacing.s,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.Spacing.s,
  },
  description: {
    color: Colors.text.secondary,
    fontSize: Layout.FontSize.s,
    marginBottom: Layout.Spacing.m,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: Layout.Radius.circular,
    paddingVertical: Layout.Spacing.xs,
    paddingHorizontal: Layout.Spacing.s,
    marginRight: Layout.Spacing.xs,
    marginBottom: Layout.Spacing.xs,
  },
  tagText: {
    color: Colors.text.secondary,
    fontSize: Layout.FontSize.xs,
  },
  difficultyBadge: {
    borderRadius: Layout.Radius.circular,
    paddingVertical: Layout.Spacing.xs,
    paddingHorizontal: Layout.Spacing.s,
  },
  difficultyText: {
    color: Colors.text.primary,
    fontSize: Layout.FontSize.xs,
    fontWeight: '500',
  },
  videoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoText: {
    color: Colors.accent.primary,
    fontSize: Layout.FontSize.xs,
    marginLeft: Layout.Spacing.xs,
  },
});

export default ExerciseCard;