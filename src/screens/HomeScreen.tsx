import React from 'react';
import {View, StyleSheet, ScrollView, StatusBar} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {SearchBar} from '../components/SearchBar';
import {WorkoutCategories} from '../components/WorkoutCategories';
import {FeaturedWorkouts} from '../components/FeaturedWorkouts';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView style={styles.scrollView}>
        <SearchBar />
        <WorkoutCategories />
        <FeaturedWorkouts />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
}); 