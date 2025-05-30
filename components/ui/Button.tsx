import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradientColors?: readonly [string, string, ...string[]];
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
  gradientColors,
  disabled,
  onPress,
  ...rest
}) => {
  // Animation value for press effect
  const pressed = useSharedValue(0);

  // Define the animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressed.value,
      [0, 1],
      [1, 0.98]
    );
    
    return {
      transform: [{ scale: withSpring(scale, { damping: 20, stiffness: 200 }) }],
    };
  });

  // Handle press animations
  const handlePressIn = () => {
    pressed.value = 1;
  };

  const handlePressOut = () => {
    pressed.value = 0;
  };

  const getButtonStyles = () => {
    let buttonStyles: ViewStyle[] = [styles.button];

    // Add size styles
    switch (size) {
      case 'small':
        buttonStyles.push(styles.buttonSmall);
        break;
      case 'large':
        buttonStyles.push(styles.buttonLarge);
        break;
      default:
        buttonStyles.push(styles.buttonMedium);
    }

    // Add variant styles
    switch (variant) {
      case 'secondary':
        buttonStyles.push(styles.buttonSecondary);
        break;
      case 'outline':
        buttonStyles.push(styles.buttonOutline);
        break;
      case 'text':
        buttonStyles.push(styles.buttonText);
        break;
      default:
        buttonStyles.push(styles.buttonPrimary);
    }

    // Add full width style if needed
    if (fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }

    // Add disabled style if needed
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
    }

    return buttonStyles;
  };

  const getTextStyles = () => {
    let textStyles: TextStyle[] = [styles.text];

    // Add size styles
    switch (size) {
      case 'small':
        textStyles.push(styles.textSmall);
        break;
      case 'large':
        textStyles.push(styles.textLarge);
        break;
      default:
        textStyles.push(styles.textMedium);
    }

    // Add variant styles
    switch (variant) {
      case 'primary':
        textStyles.push(styles.textPrimary);
        break;
      case 'secondary':
        textStyles.push(styles.textSecondary);
        break;
      case 'outline':
        textStyles.push(styles.textOutline);
        break;
      case 'text':
        textStyles.push(styles.textButtonText);
        break;
    }

    // Add disabled style if needed
    if (disabled) {
      textStyles.push(styles.textDisabled);
    }

    return textStyles;
  };

  // If using a gradient background
  if (variant === 'primary' && gradientColors) {
    return (
      <AnimatedGradient
        style={[...getButtonStyles(), animatedStyle, style]}
        colors={gradientColors || Colors.gradient.yellow}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.button.primary.text} size="small" />
        ) : (
          <>
            {icon && icon}
            <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
          </>
        )}
      </AnimatedGradient>
    );
  }

  return (
    <AnimatedTouchable
      style={[...getButtonStyles(), animatedStyle, style]}
      disabled={disabled || isLoading}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.button.primary.text : Colors.button.secondary.text} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.Radius.m,
    paddingHorizontal: Layout.Spacing.l,
  },
  buttonSmall: {
    height: 36,
    paddingHorizontal: Layout.Spacing.m,
  },
  buttonMedium: {
    height: 48,
  },
  buttonLarge: {
    height: 56,
  },
  buttonPrimary: {
    backgroundColor: Colors.button.primary.background,
  },
  buttonSecondary: {
    backgroundColor: Colors.button.secondary.background,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.accent.primary,
  },
  buttonText: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  buttonDisabled: {
    backgroundColor: Colors.button.disabled.background,
    borderColor: Colors.button.disabled.background,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    marginLeft: Layout.Spacing.xs,
  },
  textSmall: {
    fontSize: Layout.FontSize.s,
  },
  textMedium: {
    fontSize: Layout.FontSize.m,
  },
  textLarge: {
    fontSize: Layout.FontSize.l,
  },
  textPrimary: {
    color: Colors.button.primary.text,
  },
  textSecondary: {
    color: Colors.button.secondary.text,
  },
  textOutline: {
    color: Colors.accent.primary,
  },
  textButtonText: {
    color: Colors.accent.primary,
  },
  textDisabled: {
    color: Colors.button.disabled.text,
  },
});

export default Button;