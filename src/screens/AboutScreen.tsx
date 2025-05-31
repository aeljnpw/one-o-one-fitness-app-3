import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export function AboutScreen({navigation}: Props) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About OneOOne Fitness</Text>
      <Text style={styles.content}>
        OneOOne Fitness is your personal fitness companion designed to help you achieve
        your health and fitness goals. Whether you're just starting your fitness
        journey or you're an experienced athlete, we provide the tools and guidance
        you need to succeed.
      </Text>
      <Text style={styles.subtitle}>Features:</Text>
      <Text style={styles.content}>
        • Personalized workout plans{'\n'}
        • Progress tracking{'\n'}
        • Exercise library{'\n'}
        • Goal setting{'\n'}
        • Performance analytics
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
}); 