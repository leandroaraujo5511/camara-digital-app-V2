const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adicionar suporte para aliases
config.resolver.alias = {
  '@': __dirname + '/src',
};

module.exports = config;



