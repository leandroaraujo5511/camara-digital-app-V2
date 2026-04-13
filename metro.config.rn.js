/**
 * Metro configuration for React Native CLI (without Expo)
 * Use this when running with react-native start
 * Note: This is a minimal config - for best results, use 'expo start' instead
 */
const path = require('path');

module.exports = {
  projectRoot: __dirname,
  watchFolders: [__dirname],
  resolver: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'mjs'],
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'woff', 'woff2', 'ttf', 'otf'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

