import { Tenant } from '../interfaces';

// API base para buscar tenants (sem subdomínio e sem autenticação)
const BASE_API_URL = 'https://api.camaradigital.cloud';

export const tenantService = {
  // Buscar lista de tenants disponíveis (rota aberta)
  async getTenants(): Promise<Tenant[]> {
    try {
      console.log('🔍 Buscando tenants da API...');
      
      // Usar a rota pública que acabamos de implementar
      const response = await fetch(`${BASE_API_URL}/public/tenants`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Tenants obtidos da API:', data.data?.length || 0);
        
        // Mapear dados para o formato esperado pelo app
        const mappedTenants = data.data.map((tenant: any) => ({
          id: tenant.id,
          subdomain: tenant.subdomain,
          name: tenant.name,
          city: tenant.city,
          state: tenant.state,
          status: tenant.status,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
        }));
        
        return mappedTenants;
      } else {
        console.warn('⚠️ API retornou status:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao buscar tenants da API:', error);
      console.log('🔄 Usando lista de tenants padrão...');
      
      // Fallback para dados padrão em caso de erro
      return [
        {
          id: 'veramendes',
          subdomain: 'veramendes',
          name: 'Câmara Municipal de Vera Mendes',
          city: 'Vera Mendes',
          state: 'PI',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'domexpeditolopes',
          subdomain: 'domexpeditolopes',
          name: 'Câmara Municipal de Dom Expedito Lopes',
          city: 'Dom Expedito Lopes',
          state: 'PI',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
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
