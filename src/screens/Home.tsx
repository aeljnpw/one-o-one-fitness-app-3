import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useEquipments } from '../hooks/useSupabase';
import type { Equipment, Exercise } from '../types/supabase';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { 
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../config/supabase';
import type { TabScreenProps } from '../types/navigation';

const AnimatedView = Animated.createAnimatedComponent(View);

export const Home = ({ navigation }: TabScreenProps<'Home'>) => {
  const { equipments, loading, error, refetch } = useEquipments();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [exercisesForModal, setExercisesForModal] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [errorExercises, setErrorExercises] = useState<string | null>(null);

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

  const renderEquipmentItem = ({ item, index }: { item: Equipment; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100).springify()}
      layout={Layout.springify()}
      style={styles.equipmentCard}
    >
      <TouchableOpacity onPress={() => handleEquipmentPress(item)}>
        <LinearGradient
          colors={['#2E2E2E', '#1A1A1A']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            source={{ uri: item.image_url || 'https://via.placeholder.com/200' }}
            style={styles.equipmentImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.equipmentName}>{item.name}</Text>
            <Text style={styles.equipmentSubtext}>Tap to view exercises</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#666" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading && equipments.length === 0) {
    return (
      <View style={styles.centeredLoader}>
        <ActivityIndicator size="large" color="#FF2D55" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Error loading equipment</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={refetch}>
          <Text style={styles.reloadButtonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.headerTitle}>Let's Crush It! 💪</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        <Text style={styles.sectionSubtitle}>Choose your workout gear</Text>
      </View>

      <FlatList
        data={equipments}
        renderItem={renderEquipmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor="#FFFFFF"
          />
        }
      />

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
  centeredLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  welcomeText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#666',
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  equipmentCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  equipmentImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  equipmentName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  equipmentSubtext: {
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  reloadButton: {
    backgroundColor: '#FF2D55',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  reloadButtonText: {
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
  error: {
    color: '#FF6B6B',
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
}); 