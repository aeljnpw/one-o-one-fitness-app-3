// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('readable-stream'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  crypto: require.resolve('crypto-browserify'),
  vm: require.resolve('vm-browserify'),
  net: require.resolve('react-native-tcp-socket'), // Or your chosen 'net' polyfill/shim
  tls: require.resolve('node-libs-browser/mock/tls'), // Or your chosen 'tls' shim
  zlib: require.resolve('browserify-zlib') // <--- ADD THIS LINE
};

module.exports = config;