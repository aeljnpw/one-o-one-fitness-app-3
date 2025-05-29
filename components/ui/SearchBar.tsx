import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface SearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
  initialValue?: string;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search',
  initialValue = '',
  style,
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const isFocused = useSharedValue(0);
  const hasText = useSharedValue(initialValue ? 1 : 0);
  
  const handleChangeText = (text: string) => {
    setSearchText(text);
    onSearch(text);
    hasText.value = withTiming(text.length > 0 ? 1 : 0, { duration: 150 });
  };
  
  const handleClear = () => {
    setSearchText('');
    onSearch('');
    hasText.value = withTiming(0, { duration: 150 });
  };
  
  const handleFocus = () => {
    isFocused.value = withSpring(1);
  };
  
  const handleBlur = () => {
    isFocused.value = withSpring(0);
  };
  
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        isFocused.value,
        [0, 1],
        [Colors.input.border.default, Colors.input.border.focused]
      ),
      backgroundColor: interpolateColor(
        isFocused.value,
        [0, 1],
        [Colors.input.background, Colors.background.tertiary]
      ),
    };
  });
  
  const clearButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: hasText.value,
      transform: [{ scale: hasText.value }],
    };
  });
  
  return (
    <Animated.View style={[styles.container, animatedContainerStyle, style]}>
      <Search size={20} color={Colors.input.placeholder} style={styles.searchIcon} />
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.input.placeholder}
        value={searchText}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        clearButtonMode="never"
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor={Colors.accent.primary}
      />
      
      <Animated.View style={clearButtonStyle}>
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <X size={16} color={Colors.input.placeholder} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Helper function for color interpolation
function interpolateColor(
  value: number,
  inputRange: number[],
  outputRange: string[]
) {
  'worklet';
  const color1 = outputRange[0];
  const color2 = outputRange[1];
  return value === 0 ? color1 : color2;
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Layout.Radius.l,
    paddingHorizontal: Layout.Spacing.m,
    marginBottom: Layout.Spacing.m,
  },
  searchIcon: {
    marginRight: Layout.Spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.input.text,
    fontSize: Layout.FontSize.m,
  },
  clearButton: {
    padding: Layout.Spacing.xs,
  },
});

export default SearchBar;