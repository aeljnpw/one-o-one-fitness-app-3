import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import Card from '../ui/Card';
import { Equipment } from '../../types/Equipment';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface EquipmentCardProps {
  equipment: Equipment;
  onPress: (equipment: Equipment) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onPress }) => {
  // Generate a tag pill for each muscle group (limit to 3)
  const renderMuscleGroups = () => {
    const visibleGroups = equipment.muscleGroups.slice(0, 3);
    const remaining = equipment.muscleGroups.length - 3;
    
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
          { backgroundColor: badgeColors[equipment.difficulty] }
        ]}
      >
        <Text style={styles.difficultyText}>
          {equipment.difficulty.charAt(0).toUpperCase() + equipment.difficulty.slice(1)}
        </Text>
      </View>
    );
  };

  return (
    <Card
      title={equipment.name}
      imageUrl={equipment.imageUrl}
      onPress={() => onPress(equipment)}
      style={styles.card}
    >
      <View style={styles.contentRow}>
        <View style={styles.iconContainer}>
          <Dumbbell color={Colors.accent.primary} size={16} />
          <Text style={styles.categoryText}>{equipment.category}</Text>
        </View>
        
        {renderDifficultyBadge()}
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {equipment.description}
      </Text>
      
      {renderMuscleGroups()}
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: Colors.text.secondary,
    fontSize: Layout.FontSize.s,
    marginLeft: Layout.Spacing.xs,
  },
  description: {
    color: Colors.text.secondary,
    fontSize: Layout.FontSize.s,
    marginBottom: Layout.Spacing.m,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Layout.Spacing.xs,
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
});

export default EquipmentCard;