import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const { width } = Dimensions.get('window');

interface CustomTabBarProps extends BottomTabBarProps {}

const TabBar: React.FC<CustomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  const insets = useSafeAreaInsets();
  const tabWidth = width / state.routes.length;
  
  // Shared values for tab indicator animation
  const indicatorPosition = useSharedValue(state.index * tabWidth);
  
  // Update indicator position when active tab changes
  React.useEffect(() => {
    indicatorPosition.value = withSpring(state.index * tabWidth, {
      damping: 20,
      stiffness: 300,
    });
  }, [state.index, tabWidth, indicatorPosition]);
  
  // Animated style for the tab indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View style={[
      styles.container, 
      { 
        paddingBottom: insets.bottom || Layout.Spacing.m 
      }
    ]}>
      <View style={styles.tabBarContent}>
        {/* Tab Indicator */}
        <Animated.View 
          style={[
            styles.indicator, 
            { width: tabWidth },
            indicatorStyle
          ]} 
        />
        
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          
          const icon = options.tabBarIcon ? 
            options.tabBarIcon({ 
              focused: isFocused, 
              color: isFocused ? Colors.tabBar.active : Colors.tabBar.inactive, 
              size: 24 
            }) : null;
          
          const animatedIconStyle = useAnimatedStyle(() => {
            const scale = withTiming(isFocused ? 1.2 : 1, { duration: 200 });
            const color = interpolateColor(
              isFocused ? 1 : 0,
              [0, 1],
              [Colors.tabBar.inactive, Colors.tabBar.active]
            );
            
            return {
              transform: [{ scale }],
              color,
            };
          });

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.8}
            >
              <Animated.View style={animatedIconStyle}>
                {icon}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.tabBar.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Layout.Spacing.s,
  },
  tabBarContent: {
    flexDirection: 'row',
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.Spacing.s,
  },
  indicator: {
    height: 4,
    backgroundColor: Colors.tabBar.active,
    position: 'absolute',
    top: -Layout.Spacing.s - 1, // Position at the top of the tab bar
    borderRadius: Layout.Radius.circular,
    marginHorizontal: '10%', // Narrower than the full tab width
    width: '80%', // 80% of tab width
  },
});

export default TabBar;