import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login, isLoading, error, clearError } = useAuth();
  
  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    clearError();
    setEmailError('');
    setPasswordError('');
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    if (validateForm()) {
      await login(email, password);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', '#000']}
        style={styles.gradient}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={styles.header}
          entering={FadeInUp.delay(200).duration(700)}
        >
          <Text style={styles.logoText}>GYM<Text style={styles.logoAccent}>FLOW</Text></Text>
          <Text style={styles.tagline}>Power your fitness journey</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.formContainer}
          entering={FadeInDown.delay(500).duration(700)}
        >
          <Text style={styles.formTitle}>Sign In</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputsContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={Colors.input.placeholder} />}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              error={emailError}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              showPasswordToggle
              leftIcon={<Lock size={20} color={Colors.input.placeholder} />}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              error={passwordError}
            />
            
            <Link href="./forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <Button
            title="Sign In"
            size="large"
            fullWidth
            isLoading={isLoading}
            onPress={handleLogin}
            gradientColors={Colors.gradient.yellow}
          />
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <Link href="/register" asChild>
              <TouchableOpacity style={styles.signupButton}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
                <ChevronRight size={16} color={Colors.accent.primary} />
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: Layout.Spacing.l,
    paddingTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.Spacing.xxl,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  logoAccent: {
    color: Colors.accent.primary,
  },
  tagline: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    marginTop: Layout.Spacing.xs,
  },
  formContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.Radius.l,
    padding: Layout.Spacing.l,
    shadowColor: Colors.boxShadow.color,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: Layout.FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.l,
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: Layout.Radius.m,
    padding: Layout.Spacing.m,
    marginBottom: Layout.Spacing.m,
  },
  errorMessage: {
    color: Colors.status.error,
    fontSize: Layout.FontSize.s,
  },
  inputsContainer: {
    marginBottom: Layout.Spacing.l,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Layout.Spacing.m,
  },
  forgotPasswordText: {
    color: Colors.accent.primary,
    fontSize: Layout.FontSize.s,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.Spacing.xl,
  },
  signupText: {
    color: Colors.text.secondary,
    fontSize: Layout.FontSize.s,
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Layout.Spacing.xs,
  },
  signupButtonText: {
    color: Colors.accent.primary,
    fontSize: Layout.FontSize.s,
    fontWeight: '600',
  },
});