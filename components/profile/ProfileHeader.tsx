import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Flame, Trophy, Calendar } from 'lucide-react-native';
import { User } from '../../types/User';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  // Animation values
  const profileOpacity = useSharedValue(0);
  const streakScale = useSharedValue(1);
  
  // Start animations on mount
  React.useEffect(() => {
    profileOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
    
    // Pulse animation for streak counter
    const pulseAnimation = () => {
      streakScale.value = withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.quad) })
      );
    };
    
    // Start pulse animation after a delay
    const animationTimeout = setTimeout(() => {
      pulseAnimation();
      // Repeat every 5 seconds
      const interval = setInterval(pulseAnimation, 5000);
      return () => clearInterval(interval);
    }, 2000);
    
    return () => clearTimeout(animationTimeout);
  }, []);
  
  // Create animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: profileOpacity.value,
    };
  });
  
  const streakAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: streakScale.value }],
    };
  });
  
  // Format join date
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString(undefined, options);
  };
  
  return (
    <Animated.View style={[styles.container, headerAnimatedStyle]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
        style={styles.gradientOverlay}
      />
      
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: user.profileImage || 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.profileImage} 
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.name}</Text>
          
          <View style={styles.joinContainer}>
            <Calendar size={14} color={Colors.text.tertiary} />
            <Text style={styles.joinDate}>
              Joined {formatJoinDate(user.joinDate)}
            </Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Trophy size={16} color={Colors.accent.primary} />
              <Text style={styles.statValue}>{user.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            
            <View style={styles.divider} />
            
            <Animated.View style={[styles.statItem, streakAnimatedStyle]}>
              <Flame size={16} color={Colors.status.error} />
              <Text style={styles.statValue}>{user.workoutStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </Animated.View>
            
            <View style={styles.divider} />
            
            <View style={styles.statItem}>
              <Text style={styles.calorieValue}>{user.totalCaloriesBurned}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: Layout.Radius.l,
    borderBottomRightRadius: Layout.Radius.l,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  profileContainer: {
    padding: Layout.Spacing.l,
    paddingTop: Layout.Spacing.xxl,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.accent.primary,
    marginBottom: Layout.Spacing.m,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: Layout.FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.xs,
  },
  joinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.Spacing.m,
  },
  joinDate: {
    fontSize: Layout.FontSize.s,
    color: Colors.text.tertiary,
    marginLeft: Layout.Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Colors.background.card,
    borderRadius: Layout.Radius.l,
    padding: Layout.Spacing.m,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Layout.FontSize.l,
    fontWeight: '700',
    color: Colors.text.primary,
    marginVertical: Layout.Spacing.xs,
  },
  calorieValue: {
    fontSize: Layout.FontSize.l,
    fontWeight: '700',
    color: Colors.accent.primary,
    marginVertical: Layout.Spacing.xs,
  },
  statLabel: {
    fontSize: Layout.FontSize.xs,
    color: Colors.text.tertiary,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.divider,
  },
});

export default ProfileHeader;