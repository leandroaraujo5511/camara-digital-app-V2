import api from '../lib/api';
import { Session } from '../interfaces';

export const sessionService = {
  // Buscar sessões por data (formato: YYYY-MM-DD)
  async getSessionsByDate(date: string): Promise<Session[]> {
    try {
      const response = await api.get(`/sessions/date/${date}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar sessões por data:', error);
      throw error;
    }
  },

  // Buscar sessão por ID
  async getSessionById(id: string): Promise<Session> {
    try {
      const response = await api.get(`/sessions/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      throw error;
    }
  },

  // Buscar sessões ativas
  async getActiveSessions(): Promise<Session[]> {
    try {
      const response = await api.get('/sessions/active');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar sessões ativas:', error);
      throw error;
    }
  },
};

