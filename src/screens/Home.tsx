import React from 'react';
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
} from 'react-native';
import { useEquipments } from '../hooks/useSupabase';
import type { Equipment } from '../types/supabase';
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

export const Home = ({ navigation }: any) => {
  const { equipments, loading, error, refetch } = useEquipments();

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

  const renderEquipmentItem = ({ item, index }: { item: Equipment; index: number }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).springify()}
      layout={Layout.springify()}
      style={styles.equipmentCard}
    >
      <TouchableOpacity 
        onPress={() => navigation.navigate('Workouts', { equipmentId: item.id })}
      >
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
            <Text style={styles.equipmentSubtext}>Tap to view workouts</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#666" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Error loading workouts</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={refetch}>
          <Text style={styles.reloadButtonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor="#FFFFFF"
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.headerTitle}>Let's Crush It! 💪</Text>
        </View>

        {renderDailyProgress()}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Equipment</Text>
          <Text style={styles.sectionSubtitle}>Choose your workout gear</Text>
        </View>

        <FlatList
          data={equipments}
          renderItem={renderEquipmentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
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
    padding: 20,
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
}); 