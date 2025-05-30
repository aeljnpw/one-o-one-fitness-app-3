import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  showPasswordToggle = false,
  secureTextEntry,
  placeholder,
  value,
  onFocus,
  onBlur,
  disabled,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Animation values
  const focusAnim = useSharedValue(0);
  
  // Update animation value when focus changes
  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
    onFocus && onFocus(e);
  };
  
  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
    onBlur && onBlur(e);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Animated border color
  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [error ? Colors.input.border.error : Colors.input.border.default, Colors.input.border.focused]
    );
    
    return {
      borderColor,
    };
  });
  
  // Determine if we should show the password toggle
  const showToggle = showPasswordToggle && (secureTextEntry || isPasswordVisible);
  const effectiveSecureTextEntry = secureTextEntry && !isPasswordVisible;
  
  const inputStyle = {
    ...animatedBorderStyle,
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Animated.View
        style={[
          styles.inputContainer,
          inputStyle,
          error ? styles.inputError : {},
          disabled ? styles.inputDisabled : {},
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : false,
            (rightIcon || showToggle) ? styles.inputWithRightIcon : false,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.input.placeholder}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={effectiveSecureTextEntry}
          selectionColor={Colors.accent.primary}
          {...rest}
        />
        
        {showToggle ? (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={Colors.input.placeholder} />
            ) : (
              <Eye size={20} color={Colors.input.placeholder} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconRight}>{rightIcon}</View>
        ) : null}
      </Animated.View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.Spacing.m,
    width: '100%',
  },
  label: {
    fontSize: Layout.FontSize.s,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: Layout.Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.input.background,
    borderRadius: Layout.Radius.m,
    borderWidth: 1,
    borderColor: Colors.input.border.default,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 50,
    color: Colors.input.text,
    fontSize: Layout.FontSize.m,
    paddingHorizontal: Layout.Spacing.m,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  inputError: {
    borderColor: Colors.input.border.error,
  },
  inputDisabled: {
    // Add appropriate styles for disabled state
  },
  iconLeft: {
    paddingHorizontal: Layout.Spacing.m,
  },
  iconRight: {
    paddingHorizontal: Layout.Spacing.m,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: Layout.FontSize.xs,
    marginTop: Layout.Spacing.xs,
  },
});

export default Input;