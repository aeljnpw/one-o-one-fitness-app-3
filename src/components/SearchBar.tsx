import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search workouts"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 8,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 8,
  },
  filterButton: {
    padding: 8,
  },
}); 