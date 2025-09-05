import api from '../lib/api';
import { LoginRequest, LoginResponse, Vereador } from '../interfaces';

export const authService = {
  async signIn(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('🔐 Iniciando login para:', email);
      
      // Fazer login
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const loginData = response.data.data;
      console.log('✅ Login bem-sucedido para usuário:', loginData.user.name);
      
      return loginData;
      
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Credenciais inválidas');
      } else if (error.response?.status === 404) {
        throw new Error('Usuário não encontrado');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error('Erro interno do servidor');
      }
    }
  },

  async getVereadorData(userId: string): Promise<Vereador> {
    try {
      // Primeiro, tentar o endpoint /vereadores/me
      console.log('🔍 Tentando buscar vereador via /vereadores/me');
      const vereadorResponse = await api.get('/vereadores/me');
      const vereador = vereadorResponse.data.data;
      if (vereador) {
        console.log('✅ Dados do vereador obtidos via /vereadores/me:', vereador.name);
        return vereador;
      }
    } catch (error1: any) {
      console.warn('⚠️ Endpoint /vereadores/me falhou:', error1.response?.status);
      
      // Verificar se é erro 403 (usuário não autorizado para este tenant)
      if (error1.response?.status === 403) {
        console.error('❌ Usuário não autorizado para este tenant');
        throw new Error('TENANT_UNAUTHORIZED');
      }
      
      try {
        // Se falhar, tentar buscar pelo ID do usuário
        console.log('🔍 Tentando buscar vereador via /vereadores/:id');
        const vereadorResponse = await api.get(`/vereadores/${userId}`);
        const vereador = vereadorResponse.data.data;
        if (vereador) {
          console.log('✅ Dados do vereador obtidos via /vereadores/:id:', vereador.name);
          return vereador;
        }
      } catch (error2: any) {
        console.warn('⚠️ Endpoint /vereadores/:id também falhou:', error2.response?.status);
        
        // Verificar se é erro 403 (usuário não autorizado para este tenant)
        if (error2.response?.status === 403) {
          console.error('❌ Usuário não autorizado para este tenant');
          throw new Error('TENANT_UNAUTHORIZED');
        }
      }
    }
    
    // Se ambos falharem, criar um objeto básico
    const vereadorBasico: Vereador = {
      id: userId,
      name: 'Nome não informado',
      email: 'email@naoinformado.com',
      phone: '',
      legislature: '2024-2028',
      mandate: 'Atual',
      position: 'Vereador',
      status: 'active',
      tenantId: 'default',
      party: {
        id: 'default',
        acronym: 'N/A',
        name: 'Partido não informado',
        color: '#6B7280',
      },
    };
    
    console.log('🔄 Usando dados básicos do vereador');
    return vereadorBasico;
  },

  async getCurrentUser(): Promise<{ user: any; vereador: Vereador }> {
    try {
      const [userResponse, vereadorResponse] = await Promise.all([
        api.get('/auth/me'),
        api.get('/vereadores/me'),
      ]);

      return {
        user: userResponse.data.data,
        vereador: vereadorResponse.data.data,
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw error;
    }
  },
};
