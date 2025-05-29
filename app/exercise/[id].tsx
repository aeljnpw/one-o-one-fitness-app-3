import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeInRight, 
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronLeft, 
  Play,
  Bookmark,
  CheckCircle,
  Info,
  Lightbulb,
} from 'lucide-react-native';
import { getExerciseById } from '../../services/exerciseService';
import { Exercise } from '../../types/Exercise';
import Button from '../../components/ui/Button';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const { width } = Dimensions.get('window');

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const imageScale = useSharedValue(1);
  
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('Exercise ID not provided');
        }
        
        const exerciseData = await getExerciseById(id);
        setExercise(exerciseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exercise data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercise();
  }, [id]);
  
  // Start animations once data is loaded
  useEffect(() => {
    if (!loading && exercise) {
      headerOpacity.value = withTiming(1, { duration: 700 });
      imageScale.value = withTiming(1, { duration: 500 });
    }
  }, [loading, exercise]);
  
  // Handle scroll events to animate header
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    
    // Animate header opacity based on scroll position
    if (scrollY > 150) {
      headerOpacity.value = withTiming(1, { duration: 200 });
    } else {
      headerOpacity.value = withTiming(0, { duration: 200 });
    }
    
    // Scale image on scroll
    const scale = Math.max(1, 1 + (scrollY * -0.001));
    imageScale.value = scale;
  };
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));
  
  // Toggle bookmark state
  const handleToggleBookmark = () => {
    setBookmarked(!bookmarked);
  };
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent.primary} />
          <Text style={styles.loadingText}>Loading exercise data...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Render error state
  if (error || !exercise) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.errorText}>{error || 'Exercise not found'}</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Fixed Header */}
        <Animated.View style={[styles.fixedHeader, headerAnimatedStyle]}>
          <Text style={styles.fixedHeaderTitle} numberOfLines={1}>
            {exercise.name}
          </Text>
        </Animated.View>
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        {/* Bookmark Button */}
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={handleToggleBookmark}
        >
          <Bookmark 
            size={24} 
            color={bookmarked ? Colors.accent.primary : Colors.text.primary}
            fill={bookmarked ? Colors.accent.primary : 'transparent'}
          />
        </TouchableOpacity>
        
        {/* Content Scroll */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Exercise Image */}
          <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
            <Image
              source={{ uri: exercise.imageUrl }}
              style={styles.exerciseImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
              style={styles.imageGradient}
            />
            
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              
              <View style={styles.tagsRow}>
                {exercise.muscleGroups.map((muscle, index) => (
                  <View key={index} style={styles.tagPill}>
                    <Text style={styles.tagText}>{muscle}</Text>
                  </View>
                ))}
                
                <View 
                  style={[
                    styles.difficultyBadge,
                    { 
                      backgroundColor: exercise.difficulty === 'beginner' 
                        ? Colors.status.success 
                        : exercise.difficulty === 'intermediate'
                        ? Colors.status.warning
                        : Colors.status.error
                    }
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
          
          {/* Video Tutorial Button */}
          {exercise.videoUrl && (
            <Animated.View
              style={styles.videoButtonContainer}
              entering={FadeInDown.delay(300).duration(500)}
            >
              <Button
                title="Watch Video Tutorial"
                icon={<Play size={16} color={Colors.button.primary.text} />}
                onPress={() => {/* Handle video playback */}}
                gradientColors={Colors.gradient.yellow}
                style={styles.videoButton}
              />
            </Animated.View>
          )}
          
          {/* Description */}
          <Animated.View 
            style={styles.descriptionContainer}
            entering={FadeInRight.delay(200).duration(500)}
          >
            <View style={styles.sectionHeader}>
              <Info size={18} color={Colors.text.primary} />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.descriptionText}>{exercise.description}</Text>
          </Animated.View>
          
          {/* Instructions */}
          <Animated.View 
            style={styles.instructionsContainer}
            entering={FadeInRight.delay(400).duration(500)}
          >
            <View style={styles.sectionHeader}>
              <CheckCircle size={18} color={Colors.text.primary} />
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </Animated.View>
          
          {/* Tips */}
          {exercise.tips.length > 0 && (
            <Animated.View 
              style={styles.tipsContainer}
              entering={FadeInRight.delay(600).duration(500)}
            >
              <View style={styles.sectionHeader}>
                <Lightbulb size={18} color={Colors.text.primary} />
                <Text style={styles.sectionTitle}>Tips</Text>
              </View>
              
              {exercise.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipIconContainer}>
                    <Text style={styles.tipIcon}>💡</Text>
                  </View>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </Animated.View>
          )}
          
          {/* Add to Workout Button */}
          <Animated.View 
            style={styles.addButtonContainer}
            entering={FadeIn.delay(700).duration(500)}
          >
            <Button
              title="Add to Workout"
              size="large"
              fullWidth
              onPress={() => {/* Handle adding to workout */}}
              style={styles.addButton}
            />
          </Animated.View>
        </ScrollView>
      </View>
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
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  fixedHeaderTitle: {
    fontSize: Layout.FontSize.l,
    fontWeight: '600',
    color: Colors.text.primary,
    width: width - 120, // Leave room for back/bookmark buttons
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Layout.Spacing.m,
    left: Layout.Spacing.m,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
  },
  bookmarkButton: {
    position: 'absolute',
    top: Layout.Spacing.m,
    right: Layout.Spacing.m,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  exerciseHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.Spacing.l,
  },
  exerciseName: {
    fontSize: Layout.FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.m,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Layout.Radius.circular,
    paddingVertical: Layout.Spacing.xs,
    paddingHorizontal: Layout.Spacing.s,
    marginRight: Layout.Spacing.xs,
    marginBottom: Layout.Spacing.xs,
  },
  tagText: {
    color: Colors.text.primary,
    fontSize: Layout.FontSize.xs,
  },
  difficultyBadge: {
    borderRadius: Layout.Radius.circular,
    paddingVertical: Layout.Spacing.xs,
    paddingHorizontal: Layout.Spacing.s,
    marginRight: Layout.Spacing.xs,
  },
  difficultyText: {
    color: Colors.text.primary,
    fontSize: Layout.FontSize.xs,
    fontWeight: '600',
  },
  videoButtonContainer: {
    paddingHorizontal: Layout.Spacing.l,
    marginTop: Layout.Spacing.l,
    marginBottom: Layout.Spacing.m,
  },
  videoButton: {},
  descriptionContainer: {
    padding: Layout.Spacing.l,
    backgroundColor: Colors.background.secondary,
    marginBottom: Layout.Spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.Spacing.m,
  },
  sectionTitle: {
    fontSize: Layout.FontSize.l,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: Layout.Spacing.s,
  },
  descriptionText: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  instructionsContainer: {
    padding: Layout.Spacing.l,
    backgroundColor: Colors.background.secondary,
    marginBottom: Layout.Spacing.m,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: Layout.Spacing.m,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    backgroundColor: Colors.accent.primary,
    color: Colors.button.primary.text,
    borderRadius: Layout.Radius.circular,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: Layout.FontSize.s,
    fontWeight: '600',
    marginRight: Layout.Spacing.m,
    overflow: 'hidden',
  },
  instructionText: {
    flex: 1,
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  tipsContainer: {
    padding: Layout.Spacing.l,
    backgroundColor: Colors.background.secondary,
    marginBottom: Layout.Spacing.xl,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: Layout.Spacing.m,
    backgroundColor: Colors.background.tertiary,
    borderRadius: Layout.Radius.m,
    padding: Layout.Spacing.m,
  },
  tipIconContainer: {
    marginRight: Layout.Spacing.m,
  },
  tipIcon: {
    fontSize: 16,
  },
  tipText: {
    flex: 1,
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  addButtonContainer: {
    padding: Layout.Spacing.l,
    marginBottom: Layout.Spacing.xxl,
  },
  addButton: {},
});