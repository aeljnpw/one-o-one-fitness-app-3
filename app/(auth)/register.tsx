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
import { Link, router } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, ChevronLeft, User, Calendar } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [ageError, setAgeError] = useState('');
  
  const { register, isLoading, error, clearError } = useAuth();
  
  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    clearError();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setAgeError('');
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    
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
    
    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    // Validate age
    if (age.trim()) {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
        setAgeError('Please enter a valid age (16-100)');
        isValid = false;
      }
    }
    
    return isValid;
  };
  
  const handleRegister = async () => {
    if (validateForm()) {
      await register({
        name,
        email,
        password,
        age: age ? parseInt(age, 10) : undefined,
      });
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
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      
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
          <Text style={styles.tagline}>Create your account</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.formContainer}
          entering={FadeInDown.delay(500).duration(700)}
        >
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputsContainer}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              leftIcon={<User size={20} color={Colors.input.placeholder} />}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
              }}
              error={nameError}
            />
            
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
              label="Age"
              placeholder="Enter your age"
              keyboardType="number-pad"
              leftIcon={<Calendar size={20} color={Colors.input.placeholder} />}
              value={age}
              onChangeText={(text) => {
                setAge(text);
                if (ageError) setAgeError('');
              }}
              error={ageError}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
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
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              showPasswordToggle
              leftIcon={<Lock size={20} color={Colors.input.placeholder} />}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              error={confirmPasswordError}
            />
          </View>
          
          <Button
            title="Create Account"
            size="large"
            fullWidth
            isLoading={isLoading}
            onPress={handleRegister}
            gradientColors={Colors.gradient.yellow}
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Sign In</Text>
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
    height: '40%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: Layout.Spacing.l,
    paddingTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.Spacing.xl,
  },
  logoText: {
    fontSize: 36,
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.Spacing.l,
  },
  loginText: {
    color: Colors.text.secondary,
    fontSize: Layout.FontSize.s,
  },
  loginButton: {
    marginLeft: Layout.Spacing.xs,
  },
  loginButtonText: {
    color: Colors.accent.primary,
    fontSize: Layout.FontSize.s,
    fontWeight: '600',
  },
});