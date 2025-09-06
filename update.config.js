module.exports = {
  // Configurações para EAS Update
  update: {
    // Configurações de cache
    cache: {
      // Tempo de cache em segundos (24 horas)
      maxAge: 24 * 60 * 60,
    },
    
    // Configurações de fallback
    fallback: {
      // Se não conseguir baixar update, usar versão local
      enabled: true,
    },
    
    // Configurações de retry
    retry: {
      // Número máximo de tentativas
      maxAttempts: 3,
      // Intervalo entre tentativas em ms
      delay: 1000,
    },
  },
  
  // Configurações de build
  build: {
    // Configurações específicas para updates
    update: {
      // Incluir assets no update
      includeAssets: true,
      // Incluir código nativo (não recomendado para updates OTA)
      includeNative: false,
    },
  },
};
