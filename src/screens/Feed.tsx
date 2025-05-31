import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Feed = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feed Screen Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
}); 