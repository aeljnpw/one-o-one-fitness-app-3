import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { supabase } from '../config/supabase';
import Icon from 'react-native-vector-icons/Ionicons';
import type { TabScreenProps } from '../types/navigation';
import type { Equipment, Exercise } from '../types/supabase';

export const WorkoutsTab = ({ navigation }: TabScreenProps<'Workouts'>) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      console.log('Fetching equipment...');
      
      const { data, error: err } = await supabase
        .from('equipment')
        .select('*')
        .order('name');

      if (err) {
        console.error('Supabase error:', err);
        throw err;
      }

      if (!data || data.length === 0) {
        console.warn('No equipment found or empty response');
      } else {
        console.log(`Successfully fetched ${data.length} equipment items`);
      }

      setEquipment(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async (equipmentId: string) => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('exercises')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('name');

      if (err) throw err;
      setExercises(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentPress = async (item: Equipment) => {
    setSelectedEquipment(item);
    await fetchExercises(item.id);
    setModalVisible(true);
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      style={styles.exerciseCard}
      onPress={() => {
        setModalVisible(false);
        navigation.navigate('ExerciseDetail', { exercise: item });
      }}
    >
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
      style={styles.card}
      onPress={() => handleEquipmentPress(item)}>
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
        style={styles.equipmentImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.name}</Text>
          <Icon name="chevron-forward" size={20} color="#666" />
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.category}>
          <Icon name="fitness-outline" size={14} color="#4CAF50" /> {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !modalVisible) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error && !modalVisible) {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workouts</Text>
      </View>
      <FlatList
        data={equipment}
        renderItem={renderEquipmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {selectedEquipment?.name} Exercises
              </Text>
            </View>
            
            {loading ? (
              <ActivityIndicator size="large" color="#4CAF50" style={styles.modalLoader} />
            ) : exercises.length > 0 ? (
              <FlatList
                data={exercises}
                renderItem={renderExerciseItem}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  equipmentImage: {
    width: '100%',
    height: 200,
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
  description: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  category: {
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
}); 