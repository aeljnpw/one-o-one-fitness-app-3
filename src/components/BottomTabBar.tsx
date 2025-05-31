import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export function BottomTabBar({navigation, state}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Home')}>
        <Icon
          name={state.index === 0 ? 'home' : 'home-outline'}
          size={24}
          color={state.index === 0 ? '#4CAF50' : '#666'}
        />
        <Text style={[styles.tabText, state.index === 0 && styles.activeText]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Feed')}>
        <Icon
          name={state.index === 1 ? 'people' : 'people-outline'}
          size={24}
          color={state.index === 1 ? '#4CAF50' : '#666'}
        />
        <Text style={[styles.tabText, state.index === 1 && styles.activeText]}>
          Feed
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Train')}>
        <Icon
          name={state.index === 2 ? 'fitness' : 'fitness-outline'}
          size={24}
          color={state.index === 2 ? '#4CAF50' : '#666'}
        />
        <Text style={[styles.tabText, state.index === 2 && styles.activeText]}>
          Train
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Nutrition')}>
        <Icon
          name={state.index === 3 ? 'restaurant' : 'restaurant-outline'}
          size={24}
          color={state.index === 3 ? '#4CAF50' : '#666'}
        />
        <Text style={[styles.tabText, state.index === 3 && styles.activeText]}>
          Nutrition
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Profile')}>
        <Icon
          name={state.index === 4 ? 'person' : 'person-outline'}
          size={24}
          color={state.index === 4 ? '#4CAF50' : '#666'}
        />
        <Text style={[styles.tabText, state.index === 4 && styles.activeText]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeText: {
    color: '#4CAF50',
  },
}); 