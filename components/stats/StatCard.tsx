import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  unit?: string;
  gradientColors?: string[];
  animateIn?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  unit,
  gradientColors = Colors.gradient.dark,
  animateIn = true,
}) => {
  // Animation values
  const opacity = useSharedValue(animateIn ? 0 : 1);
  const translateY = useSharedValue(animateIn ? 20 : 0);
  const iconScale = useSharedValue(1);
  
  // Start animations on mount
  React.useEffect(() => {
    if (animateIn) {
      opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
      translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });
    }
    
    // Subtle pulse animation for the icon
    iconScale.value = withRepeat(
      withDelay(
        1000,
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.sine) })
      ),
      -1,
      true
    );
  }, []);
  
  // Create animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });
  
  return (
    <Animated.View style={[styles.container, cardAnimatedStyle]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.contentContainer}>
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            {icon}
          </Animated.View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {value}
                {unit && <Text style={styles.unit}> {unit}</Text>}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.Radius.l,
    overflow: 'hidden',
    marginBottom: Layout.Spacing.m,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientBackground: {
    borderRadius: Layout.Radius.l,
  },
  contentContainer: {
    padding: Layout.Spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Layout.Radius.circular,
    backgroundColor: 'rgba(255, 230, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.Spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Layout.FontSize.s,
    color: Colors.text.secondary,
    marginBottom: Layout.Spacing.xs,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: Layout.FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  unit: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
  },
});

export default StatCard;