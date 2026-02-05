import api from '../lib/api';
import { Presence } from '../interfaces';

export interface CreatePresenceData {
  sessionId: string;
  vereadorId: string;
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED' | 'LATE';
  arrivalTime?: string; // Formato HH:MM (ex: "18:36")
  registeredBy?: string;
  departureTime?: string; // Formato HH:MM (ex: "20:15")
  justification?: string;
  observations?: string;
}

export const presenceService = {
  // Registrar presença em uma sessão
  async createPresence(data: CreatePresenceData): Promise<Presence> {
    if (__DEV__) {
      console.log('Registrando presença:', data);
    }
    try {
      const response = await api.post('/presences', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao registrar presença:', error);
      
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        
        // Mensagem de duplicata
        if (errorData?.message?.includes('Já existe')) {
          throw new Error('Já existe um registro de presença para este vereador nesta sessão');
        }
        
        // Mensagens de validação do Zod
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors
            .map((err: any) => err.message || `${err.path.join('.')}: ${err.message}`)
            .join('\n');
          throw new Error(`Dados inválidos:\n${validationErrors}`);
        }
        
        // Mensagem genérica do backend
        if (errorData?.message) {
          throw new Error(errorData.message);
        }
      }
      
      throw error;
    }
  },

  // Buscar presença por sessão e vereador
  async getPresenceBySessionAndVereador(sessionId: string, vereadorId: string): Promise<Presence | null> {
    try {
      const response = await api.get(`/presences?sessionId=${sessionId}&vereadorId=${vereadorId}`);
      const presences = response.data.data || [];
      return presences.length > 0 ? presences[0] : null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Erro ao buscar presença:', error);
      throw error;
    }
  },

  // Buscar todas as presenças de uma sessão
  async getPresencesBySession(sessionId: string): Promise<Presence[]> {
    try {
      const response = await api.get(`/presences/session/${sessionId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar presenças da sessão:', error);
      throw error;
    }
  },

  // Buscar presenças de um vereador
  async getPresencesByVereador(vereadorId: string): Promise<Presence[]> {
    try {
      const response = await api.get(`/presences/vereador/${vereadorId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar presenças do vereador:', error);
      throw error;
    }
  },
};

