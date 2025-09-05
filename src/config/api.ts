import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração da API
export const API_CONFIG = {
  // Para desenvolvimento local - IP da sua máquina na rede
  BASE_HOST: 'api.camaradigital.cloud',
  
  // Para produção (descomente quando for publicar)
  // BASE_HOST: 'api.camaradigital.com.br',
  
  TIMEOUT: 10000,
};

// Função para gerar URL da API baseada no tenant selecionado
export const generateApiUrl = async (): Promise<string> => {
  try {
    const selectedTenant = await AsyncStorage.getItem('@selected_tenant');
          if (selectedTenant) {
      const tenant = JSON.parse(selectedTenant);
      const url = `https://${API_CONFIG.BASE_HOST}`;
      console.log('🔗 API URL gerada:', url);
      return url;
    }
  } catch (error) {
    console.error('Erro ao gerar URL da API:', error);
  }
  
  // Fallback para URL base
  const fallbackUrl = `https://${API_CONFIG.BASE_HOST}`;
  console.log('⚠️ Usando URL fallback:', fallbackUrl);
  return fallbackUrl;
};

// Log da configuração para debug
console.log('🔧 API Config:', {
  baseHost: API_CONFIG.BASE_HOST,
  timeout: API_CONFIG.TIMEOUT,
  environment: __DEV__ ? 'development' : 'production'
});
