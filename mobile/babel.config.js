module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
          },
          // This is important for the plugin to work correctly with Expo's web platform
          // It ensures that the aliases are applied only when building for the web
          // and not for native platforms.
        },
      ],
    ],
  };
};