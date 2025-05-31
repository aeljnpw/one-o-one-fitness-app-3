import React from 'react';
import {View, Text, StyleSheet, Pressable, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '../types/navigation';

export function BottomTabBar({ navigation, state }: BottomTabBarProps) {
  const getTabIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'Home':
        return isFocused ? 'home' : 'home-outline';
      case 'Feed':
        return isFocused ? 'people' : 'people-outline';
      case 'Workouts':
        return isFocused ? 'barbell' : 'barbell-outline';
      case 'Nutrition':
        return isFocused ? 'nutrition' : 'nutrition-outline';
      case 'Profile':
        return isFocused ? 'person' : 'person-outline';
      default:
        return 'help-outline';
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon = getTabIcon(route.name, isFocused);

        return (
          <Pressable
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
            android_ripple={{color: '#333', borderless: true}}>
            <View style={styles.tabContent}>
              <Icon
                name={icon}
                size={24}
                color={isFocused ? '#4CAF50' : '#666'}
              />
              <Text style={[styles.tabText, isFocused && styles.activeText]}>
                {route.name}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
}); 