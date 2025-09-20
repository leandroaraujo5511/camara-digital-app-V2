import api from '../lib/api';
import { Votacao, Vote, Pauta } from '../interfaces';

export interface VotoRequest {
	votacaoId: string;
	vereadorId: string;
	vote: 'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE';
	voteId?: string; // Opcional, usado para atualizações
}

export interface VotacaoStats {
	total: number;
	sim: number;
	nao: number;
	abstencao: number;
	ausente: number;
	percentualSim: number;
	percentualNao: number;
}

export const votacaoService = {
	async getVotacoesAtivas(): Promise<Votacao[]> {
		try {
			const response = await api.get('/votacoes?status=IN_PROGRESS');
			return response.data.data;
		} catch (error) {
			console.error('Erro ao buscar votações ativas:', error);
			throw error;
		}
	},

	async getVotacaoById(id: string): Promise<Votacao> {
		try {
			const response = await api.get(`/votacoes/${id}`);
			return response.data.data;
		} catch (error) {
			console.error('Erro ao buscar votação por ID:', error);
			throw error;
		}
	},

	async getVotacoesByPauta(pautaId: string): Promise<Votacao[]> {
		try {
			const response = await api.get(`/votacoes?pautaId=${pautaId}`);
			return response.data.data;
		} catch (error) {
			console.error('Erro ao buscar votações por pauta:', error);
			throw error;
		}
	},

	async registrarVoto(votoRequest: VotoRequest): Promise<Vote> {
		console.log('votoRequest', votoRequest);
		try {
			// Se um voteId foi fornecido, atualizar o voto existente
			if (votoRequest.voteId) {
				console.log('🔄 Atualizando voto existente com ID:', votoRequest.voteId);
				return await this.atualizarVoto(votoRequest.voteId, votoRequest.vote);
			}
			
			// Primeiro, verificar se o vereador já votou
			const votoExistente = await this.getVotoByVereador(votoRequest.votacaoId, votoRequest.vereadorId);
			console.log('votoExistente', votoExistente);
			
			if (votoExistente) {
				// Se já votou, atualizar o voto existente
				console.log('votoExistente', votoExistente);
				console.log('🔄 Vereador já votou, atualizando voto existente...');
				return await this.atualizarVoto(votoExistente.id, votoRequest.vote);
			} else {
				// Se não votou, registrar novo voto
				console.log('✅ Registrando novo voto...');
				const response = await api.post('/votes', votoRequest);
				return response.data.data;
			}
		} catch (error) {
			console.error('Erro ao registrar/atualizar voto:', error);
			throw error;
		}
	},

	async getVotosByVotacao(votacaoId: string): Promise<Vote[]> {
		try {
			// Usar a rota que existe: /votes?votacaoId={id}
			console.log('🔍 getVotosByVotacao: Buscando votos para votação:', votacaoId);
			const response = await api.get(`/votes?votacaoId=${votacaoId}`);
			console.log('🔍 getVotosByVotacao: Resposta da API:', response.data);
			console.log('✅ getVotosByVotacao: Votos encontrados:', response.data.data.length);
			console.log('✅ getVotosByVotacao: Votos retornados:', response.data.data);
			return response.data.data;
		} catch (error) {
			console.error('❌ getVotosByVotacao: Erro ao buscar votos por votação:', error);
			// Retornar array vazio em caso de erro
			return [];
		}
	},

	async getVotoByVereador(votacaoId: string, vereadorId: string): Promise<Vote | null> {
		try {
			// Usar a rota que existe: /votes?votacaoId={id}&vereadorId={id}
			const response = await api.get(`/votes?votacaoId=${votacaoId}&vereadorId=${vereadorId}`);
			const votos = response.data.data;
			// Retornar o primeiro voto encontrado (deve ser único)
			return votos.length > 0 ? votos[0] : null;
		} catch (error) {
			console.error('Erro ao buscar voto por vereador:', error);
			return null;
		}
	},

	async getHistoricoVotos(vereadorId: string): Promise<Vote[]> {
		try {
			const response = await api.get(`/vereadores/${vereadorId}/votes`);
			return response.data.data;
		} catch (error) {
			console.error('Erro ao buscar histórico de votos:', error);
			throw error;
		}
	},

	async getEstatisticasVotacao(votacaoId: string, votos?: Vote[]): Promise<VotacaoStats> {
		try {
			console.log('📊 getEstatisticasVotacao: Iniciando para votação:', votacaoId);
			
			let votosParaCalcular: Vote[];
			
			if (votos) {
				// Usar votos fornecidos como parâmetro
				console.log('📊 getEstatisticasVotacao: Usando votos fornecidos:', votos.length, votos);
				votosParaCalcular = votos;
			} else {
				// Buscar votos da API (fallback)
				console.log('📊 getEstatisticasVotacao: Buscando votos da API...');
				votosParaCalcular = await this.getVotosByVotacao(votacaoId);
				console.log('📊 getEstatisticasVotacao: Votos recebidos da API:', votosParaCalcular.length, votosParaCalcular);
			}
			
			// Calcular estatísticas localmente
			const total = votosParaCalcular.length;
			const sim = votosParaCalcular.filter(voto => voto.vote === 'SIM').length;
			const nao = votosParaCalcular.filter(voto => voto.vote === 'NAO').length;
			const abstencao = votosParaCalcular.filter(voto => voto.vote === 'ABSTENCAO').length;
			const ausente = votosParaCalcular.filter(voto => voto.vote === 'AUSENTE').length;
			
			const percentualSim = total > 0 ? Math.round((sim / total) * 100) : 0;
			const percentualNao = total > 0 ? Math.round((nao / total) * 100) : 0;
			
			const estatisticas: VotacaoStats = {
				total,
				sim,
				nao,
				abstencao,
				ausente,
				percentualSim,
				percentualNao
			};
			
			console.log('📊 getEstatisticasVotacao: Estatísticas calculadas localmente:', estatisticas);
			return estatisticas;
		} catch (error) {
			console.error('❌ getEstatisticasVotacao: Erro ao calcular estatísticas da votação:', error);
			// Retornar estatísticas vazias em caso de erro
			return {
				total: 0,
				sim: 0,
				nao: 0,
				abstencao: 0,
				ausente: 0,
				percentualSim: 0,
				percentualNao: 0
			};
		}
	},

	async getPautasProntasParaVotacao(): Promise<Pauta[]> {
		try {
			const response = await api.get('/pautas?status=READY_FOR_VOTING');
			return response.data.data;
		} catch (error) {
			console.error('Erro ao buscar pautas prontas para votação:', error);
			throw error;
		}
	},

	async atualizarVoto(voteId: string, novoVoto: 'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE'): Promise<Vote> {
		try {
			console.log('🔄 Atualizando voto:', voteId, 'para:', novoVoto);
			const response = await api.put(`/votes/${voteId}`, {
				vote: novoVoto
			});
			console.log('✅ Voto atualizado com sucesso');
			return response.data.data;
		} catch (error) {
			console.error('❌ Erro ao atualizar voto:', error);
			throw error;
		}
	},

	async vereadorJaVotou(votacaoId: string, vereadorId: string): Promise<boolean> {
		try {
			const voto = await this.getVotoByVereador(votacaoId, vereadorId);
			return !!voto;
		} catch (error) {
			console.error('Erro ao verificar se vereador já votou:', error);
			return false;
		}
	}
};
