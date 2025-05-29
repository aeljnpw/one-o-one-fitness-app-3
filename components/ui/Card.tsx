import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface CardProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  gradient?: boolean;
  gradientColors?: string[];
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  imageUrl,
  onPress,
  children,
  style,
  titleStyle,
  subtitleStyle,
  imageStyle,
  gradient = false,
  gradientColors,
  disabled = false,
}) => {
  // Animation value for press effect
  const scale = useSharedValue(1);

  // Define the animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 200 });
  };

  // Base card content
  const CardContent = () => (
    <>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.contentContainer}>
        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
        {children}
      </View>
    </>
  );

  // If the card uses a gradient background
  if (gradient) {
    const CardWithGradient = () => (
      <LinearGradient
        colors={gradientColors || [Colors.background.tertiary, Colors.background.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, style]}
      >
        <CardContent />
      </LinearGradient>
    );

    if (onPress) {
      return (
        <AnimatedTouchable
          onPress={onPress}
          disabled={disabled}
          style={animatedStyle}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <CardWithGradient />
        </AnimatedTouchable>
      );
    }

    return <CardWithGradient />;
  }

  // Regular card without gradient
  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        disabled={disabled}
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={[styles.container, style]}>
          <CardContent />
        </View>
      </AnimatedTouchable>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.Radius.l,
    backgroundColor: Colors.background.card,
    overflow: 'hidden',
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: Layout.Spacing.m,
  },
  image: {
    width: '100%',
    height: 160,
  },
  contentContainer: {
    padding: Layout.Spacing.m,
  },
  title: {
    fontSize: Layout.FontSize.l,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.xs,
  },
  subtitle: {
    fontSize: Layout.FontSize.s,
    color: Colors.text.secondary,
    marginBottom: Layout.Spacing.xs,
  },
});

export default Card;