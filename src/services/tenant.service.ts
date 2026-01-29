import axios from 'axios';
import { Tenant } from '../interfaces';

// API base para buscar tenants (sem subdomínio e sem autenticação - produção)
const BASE_API_URL = 'https://api.camaradigital.cloud';

// API base para buscar tenants (sem subdomínio e sem autenticação - desenvolvimento)
// const BASE_API_URL = 'https://192.168.18.185:3000';
const apiTenant = axios.create({
  baseURL: BASE_API_URL,
});
export const tenantService = {
  // Buscar lista de tenants disponíveis (rota aberta)
  async getTenants(): Promise<Tenant[]> {
    try {
      console.log('🔍 Buscando tenants da API...');
      
      // Usar a rota pública que acabamos de implementar
      const response = await apiTenant.get(`/public/tenants`);
      console.log('🔍 Response:', response);
      if (response.status === 200) {
        return response.data.data as Tenant[];
      } else {
        console.warn('⚠️ API retornou status:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao buscar tenants da API:', error);
      console.log('🔄 Usando lista de tenants padrão...');
      
      // Fallback para dados padrão em caso de erro
      return [] as unknown as Tenant[];
    }
  },

  // Verificar se um tenant está ativo (sem autenticação)
  async checkTenantStatus(subdomain: string): Promise<boolean> {
    try {
      console.log(`🔍 Verificando status do tenant: ${subdomain}`);
      
      // Usar a rota pública de health check por tenant
      const healthUrl = `${BASE_API_URL}/public/health/${subdomain}`;
      console.log('🔗 URL de health:', healthUrl);
      
      const response = await fetch(healthUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Tenant ${subdomain} está ativo:`, data.tenantName);
        return true;
      } else {
        console.warn(`⚠️ Tenant ${subdomain} não está ativo - Status:`, response.status);
        return false;
      }
      
    } catch (error) {
      console.error(`❌ Erro ao verificar status do tenant ${subdomain}:`, error);
      return false;
    }
  },

  // Gerar URL da API para um tenant específico
  generateApiUrl(subdomain: string): string {
    const url = `https://api.camaradigital.cloud`;
    console.log(`🔗 URL da API gerada para ${subdomain}:`, url);
    return url;
  },

  // Verificar se o backend principal está acessível
  async checkBackendStatus(): Promise<boolean> {
    try {
      console.log('🔍 Verificando status do backend principal...');
      const response = await fetch(`${BASE_API_URL}/public/health`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend principal está online:', data.message);
        return true;
      } else {
        console.warn('⚠️ Backend principal retornou status:', response.status);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Backend principal não está acessível:', error);
      return false;
    }
  },
};
