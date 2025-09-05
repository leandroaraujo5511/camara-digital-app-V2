import api from '../lib/api';
import { Pauta, Votacao, Vote } from '../interfaces';

export const votingService = {
  // Buscar pautas disponíveis para votação
  async getPautas(): Promise<Pauta[]> {
    try {
      const response = await api.get('/pautas?status=UNDER_REVIEW');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar pautas:', error);
      throw error;
    }
  },

  // Buscar votações ativas
  async getVotacoesAtivas(): Promise<Votacao[]> {
    try {
      const response = await api.get('/votacoes?status=IN_PROGRESS');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar votações:', error);
      throw error;
    }
  },

  // Buscar votações aguardando
  async getVotacoesAguardando(): Promise<Votacao[]> {
    try {
      const response = await api.get('/votacoes?status=WAITING');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar votações aguardando:', error);
      throw error;
    }
  },

  // Buscar histórico de votações
  async getHistoricoVotacoes(): Promise<Votacao[]> {
    try {
      const response = await api.get('/votacoes?status=COMPLETED');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  },

  // Registrar voto
  async registrarVoto(votacaoId: string, vereadorId: string, voto: 'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE'): Promise<Vote> {
    try {
      const response = await api.post('/votes', {
        votacaoId,
        vereadorId,
        vote: voto,
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao registrar voto:', error);
      throw error;
    }
  },

  // Buscar voto específico de um vereador
  async getVotoVereador(votacaoId: string, vereadorId: string): Promise<Vote | null> {
    try {
      const response = await api.get(`/votes?votacaoId=${votacaoId}&vereadorId=${vereadorId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Vereador ainda não votou
      }
      console.error('Erro ao buscar voto:', error);
      throw error;
    }
  },

  // Atualizar voto
  async atualizarVoto(voteId: string, voto: 'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE'): Promise<Vote> {
    try {
      const response = await api.put(`/votes/${voteId}`, {
        vote: voto,
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar voto:', error);
      throw error;
    }
  },
};
