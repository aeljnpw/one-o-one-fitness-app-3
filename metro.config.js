const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('readable-stream'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  crypto: require.resolve('crypto-browserify'),
  vm: require.resolve('vm-browserify'),
  // Explicitly point 'url' to react-native-url-polyfill if Metro tries to resolve 'url' directly.
  // Note: react-native-url-polyfill is usually imported via 'react-native-url-polyfill/auto'
  // url: require.resolve('react-native-url-polyfill'), // This line is speculative
};

// If you have an issue with 'asn1.js' (often a dependency of crypto-browserify):
// config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config; 