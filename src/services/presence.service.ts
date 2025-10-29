import api from '../lib/api';
import { Presence } from '../interfaces';

export interface CreatePresenceData {
  sessionId: string;
  vereadorId: string;
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED' | 'LATE';
  arrivalTime?: string;
  registeredBy?: string;
  departureTime?: string;
  justification?: string;
  observations?: string;
}

export const presenceService = {
  // Registrar presença em uma sessão
  async createPresence(data: CreatePresenceData): Promise<Presence> {
    try {
      const response = await api.post('/presences', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao registrar presença:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Já existe')) {
        throw new Error('Já existe um registro de presença para este vereador nesta sessão');
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

