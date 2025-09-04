const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  'react-native-web': require.resolve('react-native-web'),
  '@react-native-community/datetimepicker': require.resolve('./src/mocks/datetimepicker.js'),
};

module.exports = config;