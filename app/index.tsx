import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Colors from '../constants/Colors';

export default function IndexPage() {
  const { isLoading, token } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Navigate based on authentication status
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, token]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.accent.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
});