import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import type { RootStackScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625; // 16:9 aspect ratio

export const ExerciseDetail = ({ route }: RootStackScreenProps<'ExerciseDetail'>) => {
  const { exercise } = route.params;
  const [activeSection, setActiveSection] = useState<string | null>('overview');

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

  const renderSection = (title: string, content: React.ReactNode) => (
    <TouchableOpacity
      style={[
        styles.sectionHeader,
        activeSection === title.toLowerCase() && styles.activeSectionHeader,
      ]}
      onPress={() => setActiveSection(activeSection === title.toLowerCase() ? null : title.toLowerCase())}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      {activeSection === title.toLowerCase() && (
        <View style={styles.sectionContent}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.videoContainer}>
        {exercise.video_url ? (
          <Video
            source={{ uri: exercise.video_url }}
            style={styles.video}
            resizeMode="cover"
            paused={true}
            repeat={true}
            controls={true}
            onError={(error) => console.log('Video Error:', error)}
          />
        ) : (
          <View style={[styles.video, styles.placeholderContainer]}>
            <Text style={styles.placeholderText}>Video coming soon</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{exercise.name}</Text>

        {renderSection('Overview', (
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Target Muscles</Text>
              <Text style={[styles.infoValue, { color: '#2196F3' }]}>{exercise.muscle_group}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Difficulty</Text>
              <Text style={[styles.infoValue, getDifficultyColor(exercise.difficulty)]}>
                {exercise.difficulty}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={[styles.infoValue, { color: '#FFC107' }]}>{exercise.type}</Text>
            </View>
          </View>
        ))}

        {renderSection('Instructions', (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionText}>
              {exercise.instructions || 
                "1. Start by positioning yourself correctly\n" +
                "2. Maintain proper form throughout the exercise\n" +
                "3. Control your breathing\n" +
                "4. Complete the recommended sets and reps"
              }
            </Text>
          </View>
        ))}

        {renderSection('Precautions', (
          <View style={styles.precautionsContainer}>
            <Text style={styles.precautionText}>
              {exercise.precautions ||
                "• Ensure proper warm-up before starting\n" +
                "• Don't rush through the movement\n" +
                "• Stop if you feel unusual pain\n" +
                "• Maintain proper posture throughout"
              }
            </Text>
          </View>
        ))}

        {renderSection('Tips', (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipText}>
              {exercise.tips ||
                "• Focus on mind-muscle connection\n" +
                "• Keep your core engaged\n" +
                "• Breathe steadily throughout\n" +
                "• Start with lighter weights to perfect form"
              }
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    width: width,
    height: VIDEO_HEIGHT,
    backgroundColor: '#1A1A1A',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activeSectionHeader: {
    backgroundColor: '#2A2A2A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionContent: {
    marginTop: 12,
  },
  infoContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
  },
  infoBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    padding: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  instructionsContainer: {
    padding: 8,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  precautionsContainer: {
    padding: 8,
  },
  precautionText: {
    color: '#FF5252',
    fontSize: 16,
    lineHeight: 24,
  },
  tipsContainer: {
    padding: 8,
  },
  tipText: {
    color: '#4CAF50',
    fontSize: 16,
    lineHeight: 24,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
}); 