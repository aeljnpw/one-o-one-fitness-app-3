import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// 8px spacing system
export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  circular: 9999,
};

export const FontSize = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const FontWeight = {
  regular: '400',
  medium: '500',
  bold: '700',
};

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
};