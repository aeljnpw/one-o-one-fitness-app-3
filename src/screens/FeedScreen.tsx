import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feed Screen Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
}); 