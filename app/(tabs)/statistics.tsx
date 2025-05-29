import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Flame, Dumbbell, Timer, TrendingUp } from 'lucide-react-native';
import { getWorkoutStats } from '../../services/workoutService'; // Ensure this path is correct
import StatCard from '../../components/stats/StatCard'; // Ensure this path is correct
import Colors from '../../constants/Colors'; // Ensure this path is correct
import Layout from '../../constants/Layout'; // Ensure this path is correct

// Mock data for the weekly stats chart
const weeklyData = [
  { day: 'Mon', calories: 320 },
  { day: 'Tue', calories: 450 },
  { day: 'Wed', calories: 280 },
  { day: 'Thu', calories: 390 },
  { day: 'Fri', calories: 530 },
  { day: 'Sat', calories: 200 },
  { day: 'Sun', calories: 0 }, // Example: Rest day
];

const maxCalories = Math.max(...weeklyData.map(item => item.calories), 1); // Added 1 to prevent division by zero if all calories are 0
const screenWidth = Dimensions.get('window').width;
const chartPadding = Layout.Spacing.l * 2; // Combined padding for the chart container
const chartContentWidth = screenWidth - (Layout.Spacing.m * 2) - chartPadding; // Usable width for bars
const barGap = 8; // Gap between bars
const barWidth = (chartContentWidth / weeklyData.length) - barGap;

export default function StatisticsScreen() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    workoutStreak: 0,
    averageWorkoutDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, ensure getWorkoutStats returns data in the expected format
        // const data = await getWorkoutStats(); 
        // For now, using mock to ensure component stability
        const mockApiStats = {
          totalWorkouts: 25,
          totalCaloriesBurned: 7500,
          workoutStreak: 7,
          averageWorkoutDuration: 45,
        };
        setStats(mockApiStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    setTimeout(fetchStats, 1000); // Simulate API delay
  }, []);
  
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const renderWeeklyChart = () => {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Activity</Text>
        <View style={styles.chart}>
          {weeklyData.map((item, index) => {
            const barHeight = item.calories > 0 ? (item.calories / maxCalories) * 150 : 5; // Min height 5 for visibility
            const isToday = item.day === 'Sun'; // Example: highlight Sunday

            return (
              <Animated.View 
                key={item.day}
                style={styles.barWrapper} // Ensure this matches your StyleSheet
                entering={FadeInUp.delay(index * 100).springify().damping(12)}
              >
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barValue}>
                    {item.calories > 0 ? item.calories : '-'}
                  </Text>
                </View>
                
                <View style={styles.barContainer}>
                  <Animated.View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: isToday 
                          ? Colors.accent.primary 
                          : (item.calories === 0 ? Colors.background.tertiary : Colors.accent.tertiary),
                        width: barWidth,
                      },
                    ]}
                  />
                </View>
                
                <Text style={[styles.barDay, isToday && styles.currentDay]}>
                  {item.day}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View 
        style={styles.container}
        entering={FadeIn.duration(300)}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Track your fitness progress</Text>
        </View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.statsGrid}>
            <StatCard
              title="Calories Burned"
              value={formatNumber(stats.totalCaloriesBurned)}
              icon={<Flame size={28} color={Colors.accent.primary} />}
              animateIn={!loading}
              gradientColors={['#252525', '#1A1A1A']}
            />
            <StatCard
              title="Workout Streak"
              value={stats.workoutStreak}
              unit="days"
              icon={<TrendingUp size={28} color={Colors.accent.primary} />}
              animateIn={!loading}
              gradientColors={['#252525', '#1A1A1A']}
            />
            <StatCard
              title="Total Workouts"
              value={stats.totalWorkouts}
              icon={<Dumbbell size={28} color={Colors.accent.primary} />}
              animateIn={!loading}
              gradientColors={['#252525', '#1A1A1A']}
            />
            <StatCard
              title="Avg. Workout"
              value={stats.averageWorkoutDuration}
              unit="min"
              icon={<Timer size={28} color={Colors.accent.primary} />}
              animateIn={!loading}
              gradientColors={['#252525', '#1A1A1A']}
            />
          </View>
          
          {renderWeeklyChart()}
          
        </ScrollView>
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
    paddingHorizontal: Layout.Spacing.m, // Use paddingHorizontal for left/right
  },
  header: {
    marginTop: Layout.Spacing.xl,
    marginBottom: Layout.Spacing.l,
    paddingHorizontal: Layout.Spacing.m, // Added for consistency if container has no padding
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
  scrollContent: {
    paddingBottom: Layout.Spacing.xl,
  },
  statsGrid: {
    marginBottom: Layout.Spacing.l,
    // If this is meant to be a grid, you might need flexDirection: 'row', flexWrap: 'wrap'
    // and styling on individual StatCard wrappers for proper grid layout.
    // For simplicity, they will stack vertically or as per StatCard's own layout.
  },
  chartContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: Layout.Radius.l,
    padding: Layout.Spacing.l,
    marginBottom: Layout.Spacing.xl,
  },
  chartTitle: {
    fontSize: Layout.FontSize.l,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.l,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Changed for better spacing with gaps
    alignItems: 'flex-end',
    height: 220, // Includes labels and days
  },
  barWrapper: { // Corrected name
    alignItems: 'center',
    justifyContent: 'flex-end',
    // flex: 1, // This might cause issues if barWidth is calculated, let barWidth control it
    marginHorizontal: barGap / 2, // Distribute gap
  },
  barLabelContainer: {
    height: 20, // Fixed height for the label above the bar
    marginBottom: Layout.Spacing.xs, // Space between label and bar
    justifyContent: 'center',
    alignItems: 'center',
  },
  barValue: {
    fontSize: Layout.FontSize.xs,
    color: Colors.text.tertiary,
  },
  barContainer: {
    height: 150, // Max height for a bar itself
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderRadius: Layout.Radius.m, // Use your Layout constant
    // width: barWidth, // Width is applied in the style array
  },
  barDay: {
    marginTop: Layout.Spacing.s,
    fontSize: Layout.FontSize.s,
    color: Colors.text.secondary,
    height: 20, // Ensure consistent height for day labels
  },
  currentDay: {
    color: Colors.accent.primary,
    fontWeight: '700',
  },
});