import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateApiUrl, API_CONFIG } from '../config/api';

let apiInstance: AxiosInstance | null = null;

// Função para criar instância da API com URL atualizada
const createApiInstance = async (): Promise<AxiosInstance> => {
  const baseURL = await generateApiUrl();
  
  const instance = axios.create({
    baseURL,
    timeout: API_CONFIG.TIMEOUT,
  });

  // Interceptor para adicionar token de autenticação
  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔑 Token adicionado ao header:', `Bearer ${token.substring(0, 20)}...`);
        } else {
          console.log('⚠️ Nenhum token encontrado para requisição:', config.url);
        }
        
        // Adicionar header do tenant selecionado
        const selectedTenant = await AsyncStorage.getItem('@selected_tenant');
        if (selectedTenant) {
          const tenant = JSON.parse(selectedTenant);
          config.headers['X-Tenant-Subdomain'] = tenant.subdomain;
          console.log('🏛️ Tenant header adicionado:', tenant.subdomain);
        } else {
          console.log('⚠️ Nenhum tenant selecionado para requisição:', config.url);
        }
      } catch (error) {
        console.error('Erro ao obter token ou tenant:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para tratar erros de resposta
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token expirado, redirecionar para login
        await AsyncStorage.removeItem('@auth_token');
        await AsyncStorage.removeItem('@user_data');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Função para obter instância da API
const getApiInstance = async (): Promise<AxiosInstance> => {
  if (!apiInstance) {
    apiInstance = await createApiInstance();
  }
  return apiInstance;
};

// Função para atualizar a URL da API (útil quando o tenant muda)
export const updateApiUrl = async () => {
  console.log('🔄 Atualizando API URL...');
  const oldInstance = apiInstance;
  apiInstance = await createApiInstance();
  console.log('✅ API URL atualizada, nova instância criada');
  
  if (oldInstance) {
    console.log('🗑️ Instância anterior descartada');
  }
};

// Exportar funções para usar a API
export const api = {
  get: async (url: string, config?: any) => {
    const instance = await getApiInstance();
    return instance.get(url, config);
  },
  
  post: async (url: string, data?: any, config?: any) => {
    const instance = await getApiInstance();
    return instance.post(url, data, config);
  },
  
  put: async (url: string, data?: any, config?: any) => {
    const instance = await getApiInstance();
    return instance.put(url, data, config);
  },
  
  delete: async (url: string, config?: any) => {
    const instance = await getApiInstance();
    return instance.delete(url, config);
  },
  
  patch: async (url: string, data?: any, config?: any) => {
    const instance = await getApiInstance();
    return instance.patch(url, data, config);
  },
};

export default api;
