// Configurações de ambiente
export const environment = {
  // Desenvolvimento local - IP da sua máquina na rede
  development: {
    apiUrl: 'http://192.168.18.96:3000',
    timeout: 10000,
  },
  
  // Produção (quando o app for publicado)
  production: {
    apiUrl: 'https://api.camaradigital.com.br',
    timeout: 15000,
  },
};

// Função para obter a configuração atual
export const getCurrentEnvironment = () => {
  // Em desenvolvimento, sempre usar development
  // Em produção, você pode usar __DEV__ ou variáveis de ambiente
  if (__DEV__) {
    return environment.development;
  }
  
  // Para produção, você pode usar uma variável de ambiente
  return environment.production;
};

// Configurações da API
export const apiConfig = {
  baseURL: getCurrentEnvironment().apiUrl,
  timeout: getCurrentEnvironment().timeout,
};

// Log da configuração atual para debug
console.log('🔧 API Config:', {
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  environment: __DEV__ ? 'development' : 'production'
});
