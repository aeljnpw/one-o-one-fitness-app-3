import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { resetPassword } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setError(null);

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    }

    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
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
          <Text style={styles.tagline}>Reset your password</Text>
        </Animated.View>

        <Animated.View
          style={styles.formContainer}
          entering={FadeInDown.delay(500).duration(700)}
        >
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successText}>
                We've sent password reset instructions to {email}
              </Text>
              <Button
                title="Back to Login"
                onPress={() => router.replace('/login')}
                style={styles.backToLoginButton}
              />
            </View>
          ) : (
            <>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorMessage}>{error}</Text>
                </View>
              )}

              <Text style={styles.description}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>

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
              </View>

              <Button
                title="Send Reset Instructions"
                size="large"
                fullWidth
                isLoading={isLoading}
                onPress={handleResetPassword}
                gradientColors={Colors.gradient.yellow}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Remember your password?</Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => router.replace('/login')}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  description: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    marginBottom: Layout.Spacing.l,
    textAlign: 'center',
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
  successContainer: {
    alignItems: 'center',
    padding: Layout.Spacing.l,
  },
  successTitle: {
    fontSize: Layout.FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.m,
  },
  successText: {
    fontSize: Layout.FontSize.m,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.Spacing.xl,
  },
  backToLoginButton: {
    marginTop: Layout.Spacing.l,
  },
});