import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Dumbbell } from 'lucide-react-native';
import { getAllEquipment, searchEquipment } from '../../services/equipmentService';
import { Equipment } from '../../types/Equipment';
import SearchBar from '../../components/ui/SearchBar';
import EquipmentCard from '../../components/equipment/EquipmentCard';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function EquipmentScreen() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch all equipment on component mount
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const data = await getAllEquipment();
        setEquipment(data);
        setFilteredEquipment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipment();
  }, []);
  
  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredEquipment(equipment);
      return;
    }
    
    // Filter equipment locally
    const filtered = equipment.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.muscleGroups.some(muscle => 
        muscle.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setFilteredEquipment(filtered);
  };
  
  // Handle equipment selection - navigate to exercises for that equipment
  const handleEquipmentPress = (selectedEquipment: Equipment) => {
    router.push(`/equipment/${selectedEquipment.id}`);
  };
  
  // Render empty state
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.accent.primary} />
          <Text style={styles.emptyText}>Loading equipment...</Text>
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
    
    if (searchQuery && filteredEquipment.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Dumbbell size={48} color={Colors.text.tertiary} />
          <Text style={styles.emptyText}>No equipment found for "{searchQuery}"</Text>
        </View>
      );
    }
    
    return null;
  };
  
  // Render equipment item
  const renderEquipmentItem = ({ item, index }: { item: Equipment, index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify().damping(12)}
    >
      <EquipmentCard equipment={item} onPress={handleEquipmentPress} />
    </Animated.View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View 
        style={styles.container}
        entering={FadeIn.duration(300)}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Equipment</Text>
          <Text style={styles.subtitle}>Find equipment to start your workout</Text>
        </View>
        
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search equipment, muscle groups..."
          style={styles.searchBar}
        />
        
        {renderEmptyState() || (
          <FlatList
            data={filteredEquipment}
            renderItem={renderEquipmentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={10}
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
  listContent: {
    paddingBottom: Layout.Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.Spacing.xl,
  },
  emptyText: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Layout.Spacing.m,
  },
  errorText: {
    fontSize: Layout.FontSize.l,
    fontWeight: '600',
    color: Colors.status.error,
    textAlign: 'center',
    marginBottom: Layout.Spacing.m,
  },
});