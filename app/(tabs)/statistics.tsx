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
import { getWorkoutStats } from '../../services/workoutService';
import StatCard from '../../components/stats/StatCard';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

// Mock data for the weekly stats chart - would be fetched from API in real app
const weeklyData = [
  { day: 'Mon', calories: 320 },
  { day: 'Tue', calories: 450 },
  { day: 'Wed', calories: 280 },
  { day: 'Thu', calories: 390 },
  { day: 'Fri', calories: 530 },
  { day: 'Sat', calories: 200 },
  { day: 'Sun', calories: 0 },
];

// Find the highest value to normalize chart bars
const maxCalories = Math.max(...weeklyData.map(item => item.calories));
const chartWidth = Dimensions.get('window').width - (Layout.Spacing.m * 2) - (Layout.Spacing.l * 2);
const barWidth = (chartWidth / weeklyData.length) - 10; // Subtract gap between bars

export default function StatisticsScreen() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    workoutStreak: 0,
    averageWorkoutDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Fetch workout stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWorkoutStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Simulate API fetch for now
    setTimeout(fetchStats, 1000);
  }, []);
  
  // Format calorie numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Render weekly activity chart
  const renderWeeklyChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Weekly Activity</Text>
      
      <View style={styles.chart}>
        {weeklyData.map((item, index) => {
          const barHeight = item.calories ? (item.calories / maxCalories) * 150 : 10;
          const isToday = item.day === 'Sun'; // Just for demonstration
          
          return (
            <Animated.View 
              key={item.day}
              style={styles.barWrapper}
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
                      backgroundColor: isToday ? Colors.accent.primary : 
                        (item.calories === 0 ? Colors.background.tertiary : Colors.accent.tertiary),
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
          
          {/* Additional charts or stats could be added here */}
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
  scrollContent: {
    paddingBottom: Layout.Spacing.xl,
  },
  statsGrid: {
    marginBottom: Layout.Spacing.l,
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 220,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  barLabelContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barValue: {
    fontSize: Layout.FontSize.xs,
    color: Colors.text.tertiary,
  },
  barContainer: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderRadius: Layout.Radius.m,
    width: 30,
  },
  barDay: {
    marginTop: Layout.Spacing.s,
    fontSize: Layout.FontSize.s,
    color: Colors.text.secondary,
  },
  currentDay: {
    color: Colors.accent.primary,
    fontWeight: '700',
  },
});