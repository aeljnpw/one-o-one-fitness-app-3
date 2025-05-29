import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Dumbbell, Info } from 'lucide-react-native';
import { getEquipmentById } from '../../services/equipmentService';
import { getExercisesByEquipment } from '../../services/exerciseService';
import { Equipment } from '../../types/Equipment';
import { Exercise } from '../../types/Exercise';
import ExerciseCard from '../../components/exercise/ExerciseCard';
import SearchBar from '../../components/ui/SearchBar';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function EquipmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('Equipment ID not provided');
        }
        
        // Fetch equipment details
        const equipmentData = await getEquipmentById(id);
        setEquipment(equipmentData);
        
        // Fetch exercises for this equipment
        const exercisesData = await getExercisesByEquipment(id);
        setExercises(exercisesData);
        setFilteredExercises(exercisesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredExercises(exercises);
      return;
    }
    
    const filtered = exercises.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.muscleGroups.some(muscle => 
        muscle.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setFilteredExercises(filtered);
  };
  
  // Handle exercise press
  const handleExercisePress = (exercise: Exercise) => {
    router.push(`/exercise/${exercise.id}`);
  };
  
  // Render muscle group tags
  const renderMuscleGroups = () => {
    if (!equipment || loading) return null;
    
    return (
      <View style={styles.tagsContainer}>
        <Text style={styles.tagsTitle}>Targets:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsList}
        >
          {equipment.muscleGroups.map((muscle, index) => (
            <Animated.View 
              key={index}
              entering={SlideInRight.delay(index * 100)}
              style={styles.tagPill}
            >
              <Text style={styles.tagText}>{muscle}</Text>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent.primary} />
          <Text style={styles.loadingText}>Loading equipment data...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Render error state
  if (error || !equipment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.errorText}>{error || 'Equipment not found'}</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View 
        style={styles.container}
        entering={FadeIn.duration(300)}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]} // Make the search bar sticky
        >
          {/* Equipment Header */}
          <View style={styles.headerContainer}>
            <Image 
              source={{ uri: equipment.imageUrl }}
              style={styles.equipmentImage}
            />
            
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
              style={styles.imageGradient}
            />
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            
            <View style={styles.equipmentDetails}>
              <Text style={styles.equipmentName}>{equipment.name}</Text>
              <View style={styles.categoryContainer}>
                <Dumbbell size={16} color={Colors.accent.primary} />
                <Text style={styles.categoryText}>{equipment.category}</Text>
              </View>
            </View>
          </View>
          
          {/* Sticky Search Bar */}
          <View style={styles.searchBarContainer}>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search exercises..."
              style={styles.searchBar}
            />
          </View>
          
          {/* Description and Muscle Groups */}
          <View style={styles.descriptionContainer}>
            <View style={styles.infoHeader}>
              <Info size={16} color={Colors.text.secondary} />
              <Text style={styles.infoTitle}>About This Equipment</Text>
            </View>
            <Text style={styles.descriptionText}>{equipment.description}</Text>
            {renderMuscleGroups()}
          </View>
          
          {/* Exercises List */}
          <View style={styles.exercisesContainer}>
            <Text style={styles.exercisesTitle}>Exercises</Text>
            
            {filteredExercises.length === 0 ? (
              <View style={styles.noExercisesContainer}>
                <Text style={styles.noExercisesText}>
                  {searchQuery
                    ? `No exercises found for "${searchQuery}"`
                    : 'No exercises available for this equipment'}
                </Text>
              </View>
            ) : (
              <View>
                {filteredExercises.map((exercise, index) => (
                  <Animated.View
                    key={exercise.id}
                    entering={FadeInDown.delay(index * 100).springify().damping(12)}
                  >
                    <ExerciseCard 
                      exercise={exercise}
                      onPress={handleExercisePress}
                    />
                  </Animated.View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Layout.Spacing.m,
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.Spacing.xl,
  },
  errorText: {
    fontSize: Layout.FontSize.l,
    fontWeight: '600',
    color: Colors.status.error,
    textAlign: 'center',
    marginBottom: Layout.Spacing.m,
  },
  errorSubtext: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  headerContainer: {
    position: 'relative',
    height: 250,
  },
  equipmentImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: Layout.Spacing.l,
    left: Layout.Spacing.m,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  equipmentDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.Spacing.l,
  },
  equipmentName: {
    fontSize: Layout.FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.xs,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    marginLeft: Layout.Spacing.xs,
    fontSize: Layout.FontSize.s,
    color: Colors.text.secondary,
  },
  searchBarContainer: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Layout.Spacing.m,
    paddingVertical: Layout.Spacing.s,
    zIndex: 10,
  },
  searchBar: {},
  descriptionContainer: {
    padding: Layout.Spacing.m,
    backgroundColor: Colors.background.secondary,
    marginBottom: Layout.Spacing.m,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.Spacing.s,
  },
  infoTitle: {
    marginLeft: Layout.Spacing.xs,
    fontSize: Layout.FontSize.m,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  descriptionText: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: Layout.Spacing.m,
  },
  tagsContainer: {
    marginTop: Layout.Spacing.s,
  },
  tagsTitle: {
    fontSize: Layout.FontSize.s,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.xs,
  },
  tagsList: {
    paddingRight: Layout.Spacing.m,
  },
  tagPill: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: Layout.Radius.circular,
    paddingVertical: Layout.Spacing.xs,
    paddingHorizontal: Layout.Spacing.s,
    marginRight: Layout.Spacing.xs,
  },
  tagText: {
    color: Colors.accent.primary,
    fontSize: Layout.FontSize.xs,
    fontWeight: '500',
  },
  exercisesContainer: {
    padding: Layout.Spacing.m,
  },
  exercisesTitle: {
    fontSize: Layout.FontSize.l,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.m,
  },
  noExercisesContainer: {
    padding: Layout.Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noExercisesText: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});