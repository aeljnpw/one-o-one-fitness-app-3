import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useEquipments } from '../hooks/useSupabase';
import type { Equipment, Exercise } from '../types/supabase';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { 
  FadeInDown,
  FadeInUp,
  Layout,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  EntryAnimationsValues,
  ComplexAnimationBuilder,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../config/supabase';
import { FeaturedWorkouts } from '../components/FeaturedWorkouts';
import type { RootStackScreenProps } from '../types/navigation';

const AnimatedView = Animated.createAnimatedComponent(View);
const { width } = Dimensions.get('window');

const enteringSpring = (index: number) => {
  'worklet';
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateY: 20 }],
    },
    animations: {
      opacity: withDelay(index * 100, withTiming(1, { duration: 500 })),
      transform: [{ translateY: withSpring(0) }],
    },
  };
};

export const Home = ({ navigation }: RootStackScreenProps<'Home'>) => {
  const { equipments, loading, error, refetch } = useEquipments();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [exercisesForModal, setExercisesForModal] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [errorExercises, setErrorExercises] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('equipment')
        .select('*')
        .order('name');

      if (err) throw err;
      setEquipment(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  };

  const fetchExercisesForSelectedEquipment = async (equipmentId: string) => {
    try {
      setLoadingExercises(true);
      setErrorExercises(null);
      const { data, error: err } = await supabase
        .from('exercises')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('name');

      if (err) throw err;
      setExercisesForModal(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setErrorExercises(err instanceof Error ? err.message : 'Failed to fetch exercises');
      setExercisesForModal([]);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleEquipmentPress = async (item: Equipment) => {
    setSelectedEquipment(item);
    await fetchExercisesForSelectedEquipment(item.id);
    setModalVisible(true);
  };

  const renderExerciseItemInModal = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => {
        setModalVisible(false);
        navigation.navigate('ExerciseDetail', { exercise: item });
      }}>
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={styles.exerciseImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseTitle}>{item.name}</Text>
        <Text style={styles.muscleGroup}>
          <Icon name="fitness-outline" size={14} color="#2196F3" /> {item.muscle_group}
        </Text>
        <Text style={[styles.difficulty, getDifficultyColor(item.difficulty)]}>
          <Icon name="speedometer-outline" size={14} /> {item.difficulty}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEquipmentItem = ({ item }: { item: Equipment }) => (
    <TouchableOpacity
      style={styles.equipmentCard}
      onPress={() => handleEquipmentPress(item)}>
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
        style={styles.equipmentImage}
        resizeMode="cover"
      />
      <View style={styles.equipmentContent}>
        <Text style={styles.equipmentTitle}>{item.name}</Text>
        <Text style={styles.equipmentCategory}>
          <Icon name="fitness-outline" size={14} color="#4CAF50" /> {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderDailyProgress = () => (
    <AnimatedView 
      entering={FadeInDown.springify().mass(0.5)}
      style={styles.progressContainer}
    >
      <LinearGradient
        colors={['#2E2E2E', '#1A1A1A']}
        style={styles.progressCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Icon name="fitness" size={24} color="#FF2D55" />
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>0/3</Text>
            <Text style={styles.metricLabel}>Workouts</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>0</Text>
            <Text style={styles.metricLabel}>Minutes</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>0</Text>
            <Text style={styles.metricLabel}>Calories</Text>
          </View>
        </View>
      </LinearGradient>
    </AnimatedView>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchEquipment}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Back!</Text>
      </View>

      <FeaturedWorkouts />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        <FlatList
          data={equipments}
          renderItem={renderEquipmentItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.equipmentList}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {selectedEquipment?.name} Exercises
              </Text>
            </View>

            {loadingExercises ? (
              <View style={styles.modalLoader}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            ) : errorExercises ? (
              <View style={styles.modalError}>
                <Icon name="alert-circle-outline" size={48} color="#FF6B6B" />
                <Text style={styles.error}>{errorExercises}</Text>
              </View>
            ) : exercisesForModal.length > 0 ? (
              <FlatList
                data={exercisesForModal}
                renderItem={renderExerciseItemInModal}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noExercises}>
                <Icon name="fitness-outline" size={48} color="#666" />
                <Text style={styles.noExercisesText}>
                  No exercises found for this equipment
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  equipmentList: {
    paddingRight: 20,
  },
  equipmentCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginLeft: 16,
    width: 200,
    overflow: 'hidden',
  },
  equipmentImage: {
    width: '100%',
    height: 150,
  },
  equipmentContent: {
    padding: 16,
  },
  equipmentTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  equipmentCategory: {
    color: '#4CAF50',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#000000',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
    marginRight: 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  modalList: {
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 150,
  },
  exerciseContent: {
    padding: 16,
  },
  exerciseTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  muscleGroup: {
    color: '#2196F3',
    fontSize: 14,
    marginBottom: 4,
  },
  difficulty: {
    fontSize: 14,
  },
  modalLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noExercises: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noExercisesText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressCard: {
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    color: '#666',
    fontSize: 14,
  },
}); 