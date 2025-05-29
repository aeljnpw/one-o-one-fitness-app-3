import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { Calendar, Flame, Clock } from 'lucide-react-native';
import { getUserWorkouts } from '../../services/workoutService';
import { Workout } from '../../types/Workout';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const workoutCategories = [
  'All',
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core',
  'Cardio',
];

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Fetch workouts on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const data = await getUserWorkouts();
        setWorkouts(data);
        setFilteredWorkouts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, []);
  
  // Filter workouts by category and search query
  useEffect(() => {
    let filtered = [...workouts];
    
    // ter if not "All"
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(workout => 
        workout.name.includes(selectedCategory) // This is a simplification - your actual data might have a category field
      );
    }
    
    // r
    if (searchQuery.trim()) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredWorkouts(filtered);
  }, [selectedCategory, searchQuery, workouts]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Render category chips
  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <FlatList
        horizontal
        data={workoutCategories}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInRight.delay(index * 100).duration(300)}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.categoryChipTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
  
  // Render workout item
  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <Card
      title={item.name}
      style={styles.workoutCard}
    >
      <View style={styles.workoutDetails}>
        <View style={styles.workoutDetail}>
          <Calendar size={16} color={Colors.text.tertiary} />
          <Text style={styles.workoutDetailText}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.workoutDetail}>
          <Clock size={16} color={Colors.text.tertiary} />
          <Text style={styles.workoutDetailText}>{item.duration} min</Text>
        </View>
        
        <View style={styles.workoutDetail}>
          <Flame size={16} color={Colors.accent.tertiary} />
          <Text style={[styles.workoutDetailText, styles.caloriesText]}>
            {item.caloriesBurned} cal
          </Text>
        </View>
      </View>
      
      <View style={styles.workoutExercises}>
        <Text style={styles.exercisesTitle}>
          {item.sets.length} {item.sets.length === 1 ? 'Exercise' : 'Exercises'}
        </Text>
        
        <Button 
          title="View Details" 
          variant="outline" 
          size="small"
          onPress={() => {/* Navigate to workout details */}}
        />
      </View>
    </Card>
  );
  
  // Render empty state
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.accent.primary} />
          <Text style={styles.emptyText}>Loading workouts...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.emptyText}>Please try again later</Text>
        </View>
      );
    }
    
    if (filteredWorkouts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No workouts found</Text>
          
          {searchQuery ? (
            <Text style={styles.emptyText}>
              No workouts match "{searchQuery}"
            </Text>
          ) : (
            <>
              <Text style={styles.emptyText}>
                You don't have any workouts yet
              </Text>
              <Button
                title="Create Workout"
                variant="primary"
                style={styles.createButton}
                onPress={() => {/* Navigate to create workout */}}
              />
            </>
          )}
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View 
        style={styles.container}
        entering={FadeIn.duration(300)}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.subtitle}>Manage and track your sessions</Text>
        </View>
        
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search workouts..."
          style={styles.searchBar}
        />
        
        {renderCategories()}
        
        {renderEmptyState() || (
          <FlatList
            data={filteredWorkouts}
            renderItem={renderWorkoutItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  container: {
    flex: 1,
    padding: Layout.Spacing.m,
  },
  header: {
    marginTop: Layout.Spacing.xl,
    marginBottom: Layout.Spacing.l,
  },
  title: {
    fontSize: Layout.FontSize.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.xs,
  },
  subtitle: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
  },
  searchBar: {
    marginBottom: Layout.Spacing.m,
  },
  categoriesContainer: {
    marginBottom: Layout.Spacing.m,
  },
  categoriesList: {
    paddingRight: Layout.Spacing.m,
  },
  categoryChip: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: Layout.Radius.circular,
    paddingVertical: Layout.Spacing.s,
    paddingHorizontal: Layout.Spacing.m,
    marginRight: Layout.Spacing.s,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(255, 230, 0, 0.15)',
    borderColor: Colors.accent.primary,
  },
  categoryChipText: {
    color: Colors.text.secondary,
    fontSize: Layout.FontSize.s,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: Colors.accent.primary,
    fontWeight: '600',
  },
  workoutCard: {
    marginBottom: Layout.Spacing.m,
  },
  workoutDetails: {
    flexDirection: 'row',
    marginBottom: Layout.Spacing.m,
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.Spacing.l,
  },
  workoutDetailText: {
    color: Colors.text.secondary,
    fontSize: Layout.FontSize.s,
    marginLeft: Layout.Spacing.xs,
  },
  caloriesText: {
    color: Colors.accent.tertiary,
  },
  workoutExercises: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  exercisesTitle: {
    color: Colors.text.primary,
    fontSize: Layout.FontSize.s,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: Layout.Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.Spacing.xl,
  },
  emptyTitle: {
    fontSize: Layout.FontSize.l,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.m,
  },
  emptyText: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.Spacing.l,
  },
  errorText: {
    fontSize: Layout.FontSize.l,
    fontWeight: '600',
    color: Colors.status.error,
    textAlign: 'center',
    marginBottom: Layout.Spacing.m,
  },
  createButton: {
    marginTop: Layout.Spacing.m,
  },
});