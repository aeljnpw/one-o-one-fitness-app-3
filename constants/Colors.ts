// constants/Colors.ts

export const Colors = {
  background: {
    primary: '#000000',
    secondary: '#121212',
    tertiary: '#1E1E1E',
    card: '#202020',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    tertiary: '#999999',
  },
  accent: {
    primary: '#FFE600', // Neon yellow
    secondary: '#FFEB3B', // Slightly softer yellow
    tertiary: '#FFC400', // Amber for variation
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  input: {
    background: '#2C2C2C',
    placeholder: '#777777',
    text: '#FFFFFF',
    border: {
      default: '#333333',
      focused: '#FFE600',
      error: '#F44336',
    },
  },
  button: {
    primary: {
      background: '#FFE600',
      text: '#000000',
    },
    secondary: {
      background: '#2C2C2C',
      text: '#FFFFFF',
    },
    disabled: {
      background: '#333333',
      text: '#777777',
    },
  },
  tabBar: {
    background: '#121212',
    active: '#FFE600',
    inactive: '#777777',
  },
  gradient: {
    yellow: ['#FFE600', '#FFC400'],
    dark: ['#000000', '#121212'],
  },
  // boxShadow: { // This was named boxShadow, if you intend to use Colors.shadow.color, it should be 'shadow'
  //   color: '#000000',
  //   opacity: 0.3,
  // },
  shadow: { // Correctly named and placed inside the Colors object
    color: '#000000',
    // opacity: 0.3 // You can keep opacity here or access it separately if needed
                  // If you access it as Colors.shadow.opacity later.
                  // The error was only about 'color', so ensuring 'color' is here is key.
  },
  overlay: 'rgba(0, 0, 0, 0.7)',
  divider: '#333333',
};

export default Colors;