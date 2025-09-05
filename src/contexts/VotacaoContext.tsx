import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Votacao, Vote, VotacaoStats } from '../interfaces';
import { votacaoService, VotoRequest } from '../services/votacao.service';
import { useAuth } from './AuthContext';
import { useTenant } from './TenantContext';
import websocketService, { VotoMessage, StatusMessage } from '../services/websocket.service';
import Toast from 'react-native-toast-message';

interface VotacaoContextData {
	votacoesAtivas: Votacao[];
	votacaoAtual: Votacao | null;
	votosAtuais: Vote[];
	estatisticas: VotacaoStats | null;
	isLoading: boolean;
	carregarVotacoesAtivas: () => Promise<void>;
	selecionarVotacao: (votacao: Votacao) => Promise<void>;
	registrarVoto: (votoRequest: VotoRequest) => Promise<boolean>;
	atualizarEstatisticas: () => Promise<void>;
	limparVotacaoAtual: () => void;
}

const VotacaoContext = createContext<VotacaoContextData>({} as VotacaoContextData);

export const useVotacao = () => {
	const context = useContext(VotacaoContext);
	if (!context) {
		throw new Error('useVotacao deve ser usado dentro de um VotacaoProvider');
	}
	return context;
};

interface VotacaoProviderProps {
	children: ReactNode;
}

export const VotacaoProvider: React.FC<VotacaoProviderProps> = ({ children }) => {
	const { vereador, token } = useAuth();
	const { selectedTenant } = useTenant();
	const [votacoesAtivas, setVotacoesAtivas] = useState<Votacao[]>([]);
	const [votacaoAtual, setVotacaoAtual] = useState<Votacao | null>(null);
	const [votosAtuais, setVotosAtuais] = useState<Vote[]>([]);
	const [estatisticas, setEstatisticas] = useState<VotacaoStats | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Configurar WebSocket para atualizações em tempo real
	useEffect(() => {
		if (vereador && selectedTenant) {
			console.log('🔌 Iniciando conexão WebSocket...');
			console.log('🔌 Tenant:', selectedTenant.subdomain);
			console.log('🔌 Vereador:', vereador.name);
			console.log('🔌 Token disponível:', !!token);
			console.log('🔌 Token completo:', token?.substring(0, 50) + '...');
			
			// Conectar ao WebSocket de forma assíncrona
			const connectWebSocket = async () => {
				try {
					console.log('🔌 Tentando conectar WebSocket...');
					await websocketService.connect(
						selectedTenant.subdomain,
						token || '',
						'https://api.camaradigital.cloud' // Usar API de produção
					);
					console.log('🔌 WebSocket conectado com sucesso!');
				} catch (error) {
					console.error('❌ Erro ao conectar WebSocket:', error);
				}
			};
			
			connectWebSocket();

			// Configurar callbacks para eventos
			websocketService.setOnVoteUpdate((voto: VotoMessage) => {
				console.log('🗳️ Voto recebido via WebSocket:', voto);
				
				// Se o voto é da votação atual, atualizar estatísticas
				if (votacaoAtual && voto.votacaoId === votacaoAtual.id) {
					// Atualizar lista de votos
					setVotosAtuais(prev => {
						const existingIndex = prev.findIndex(v => v.vereadorId === voto.vereadorId);
						if (existingIndex >= 0) {
							// Atualizar voto existente
							const updated = [...prev];
							updated[existingIndex] = {
								...updated[existingIndex],
								vote: voto.voto
							};
							console.log('🔄 Voto atualizado na lista:', updated[existingIndex]);
							return updated;
						} else {
							// Adicionar novo voto com estrutura completa
							const newVote: Vote = {
								id: voto.vereadorId,
								tenantId: selectedTenant.id,
								votacaoId: voto.votacaoId,
								vereadorId: voto.vereadorId,
								vote: voto.voto,
								createdAt: voto.timestamp,
								vereador: {
									id: voto.vereadorId,
									name: voto.vereador,
									email: '',
									phone: '',
									legislature: '',
									mandate: '',
									position: '',
									status: '',
									tenantId: selectedTenant.id,
									party: {
										id: '',
										acronym: voto.partido,
										name: voto.partido,
										color: '#000000'
									}
								},
								votacao: votacaoAtual
							};
							console.log('✅ Novo voto adicionado à lista:', newVote);
							return [...prev, newVote];
						}
					});

					// Atualizar estatísticas automaticamente
					atualizarEstatisticas();
					
					// Mostrar notificação de atualização
					Toast.show({
						type: 'info',
						text1: 'Votação Atualizada',
						text2: 'As estatísticas foram atualizadas em tempo real'
					});
				}
			});

			websocketService.setOnStatusUpdate((status: StatusMessage) => {
				console.log('📊 Status recebido via WebSocket:', status);
				
				if (status.status === 'aguardando_votos' && status.votacaoId) {
					// Uma nova votação foi iniciada
					console.log('🚀 Nova votação iniciada via WebSocket');
					carregarVotacoesAtivas();
					
					// Se a votação atual não for a nova, limpar dados
					if (votacaoAtual && votacaoAtual.id !== status.votacaoId) {
						console.log('🔄 Limpando dados da votação anterior');
						setVotacaoAtual(null);
						setVotosAtuais([]);
						setEstatisticas(null);
					}
				} else if (status.status === 'encerrada') {
					// Votação foi encerrada
					console.log('🏁 Votação encerrada via WebSocket');
					Toast.show({
						type: 'info',
						text1: 'Votação Encerrada',
						text2: 'A votação foi finalizada'
					});
					carregarVotacoesAtivas();
					
					// Limpar dados da votação encerrada
					if (votacaoAtual && votacaoAtual.id === status.votacaoId) {
						console.log('🔄 Limpando dados da votação encerrada');
						setVotacaoAtual(null);
						setVotosAtuais([]);
						setEstatisticas(null);
					}
				}
			});

			websocketService.setOnConnect(() => {
				console.log('✅ WebSocket conectado para atualizações em tempo real');
			});

			websocketService.setOnDisconnect(() => {
				console.log('❌ WebSocket desconectado');
			});
		}

		// Cleanup ao desmontar
		return () => {
			websocketService.disconnect();
		};
	}, [vereador, selectedTenant, votacaoAtual]);

	const carregarVotacoesAtivas = async () => {
		if (!vereador) return;
		
		try {
			setIsLoading(true);
			const votacoes = await votacaoService.getVotacoesAtivas();
			setVotacoesAtivas(votacoes);
			console.log('✅ Votações ativas carregadas:', votacoes.length);
		} catch (error) {
			console.error('❌ Erro ao carregar votações ativas:', error);
			Toast.show({
				type: 'error',
				text1: 'Erro ao carregar votações',
				text2: 'Tente novamente mais tarde'
			});
		} finally {
			setIsLoading(false);
		}
	};

	const selecionarVotacao = async (votacao: Votacao) => {
		try {
			console.log('🔄 Selecionando nova votação:', votacao.title);
			console.log('🔄 Votação anterior:', votacaoAtual?.title);
			
			// Limpar dados da votação anterior
			setVotosAtuais([]);
			setEstatisticas(null);
			
			// Definir nova votação atual
			setVotacaoAtual(votacao);
			
			// Carregar votos da nova votação
			const votos = await votacaoService.getVotosByVotacao(votacao.id);
			setVotosAtuais(votos);
			
			// Carregar estatísticas da nova votação
			await atualizarEstatisticas();
			
			console.log('✅ Votação selecionada:', votacao.title);
			console.log('✅ Votos carregados:', votos.length);
		} catch (error) {
			console.error('❌ Erro ao selecionar votação:', error);
			Toast.show({
				type: 'error',
				text1: 'Erro ao selecionar votação',
				text2: 'Tente novamente'
			});
		}
	};

	const registrarVoto = async (votoRequest: VotoRequest): Promise<boolean> => {
		if (!vereador) return false;
		
		try {
			// Verificar se é uma alteração ou novo voto
			const votoExistente = votosAtuais.find(v => v.vereadorId === vereador.id);
			const isAlteracao = !!votoExistente;
			
			const voto = await votacaoService.registrarVoto(votoRequest);
			
			// Atualizar lista de votos
			if (isAlteracao) {
				// Se for alteração, atualizar o voto existente
				setVotosAtuais(prev => 
					prev.map(v => 
						v.vereadorId === vereador.id 
							? { ...v, vote: voto.vote }
							: v
					)
				);
			} else {
				// Se for novo voto, adicionar à lista
				setVotosAtuais(prev => [...prev, voto]);
			}
			
			// Atualizar estatísticas
			await atualizarEstatisticas();
			
			Toast.show({
				type: 'success',
				text1: isAlteracao ? 'Voto alterado com sucesso!' : 'Voto registrado com sucesso!',
				text2: isAlteracao ? 'Seu voto foi atualizado' : 'Seu voto foi computado'
			});
			
			console.log(`✅ ${isAlteracao ? 'Voto alterado' : 'Voto registrado'}:`, voto);
			return true;
		} catch (error) {
			console.error('❌ Erro ao registrar voto:', error);
			Toast.show({
				type: 'error',
				text1: 'Erro ao registrar voto',
				text2: 'Tente novamente'
			});
			return false;
		}
	};

	const atualizarEstatisticas = async () => {
		if (!votacaoAtual) return;
		
		try {
			const stats = await votacaoService.getEstatisticasVotacao(votacaoAtual.id);
			setEstatisticas(stats);
			console.log('✅ Estatísticas atualizadas:', stats);
		} catch (error) {
			console.error('❌ Erro ao atualizar estatísticas:', error);
		}
	};

	const limparVotacaoAtual = () => {
		console.log('🧹 Limpando dados da votação atual');
		setVotacaoAtual(null);
		setVotosAtuais([]);
		setEstatisticas(null);
	};

	// Carregar votações ativas quando o vereador mudar
	useEffect(() => {
		if (vereador) {
			carregarVotacoesAtivas();
		}
	}, [vereador]);

	// Atualizar estatísticas quando a votação atual mudar
	useEffect(() => {
		if (votacaoAtual) {
			console.log('🔄 Votação atual mudou, atualizando estatísticas');
			atualizarEstatisticas();
		}
	}, [votacaoAtual]);

	// Limpar dados quando a votação atual for limpa
	useEffect(() => {
		if (!votacaoAtual) {
			console.log('🧹 Votação atual foi limpa, limpando dados relacionados');
			setVotosAtuais([]);
			setEstatisticas(null);
		}
	}, [votacaoAtual]);

	// Selecionar automaticamente a primeira votação se não houver uma selecionada
	useEffect(() => {
		if (votacoesAtivas.length > 0 && !votacaoAtual) {
			selecionarVotacao(votacoesAtivas[0]);
		}
	}, [votacoesAtivas, votacaoAtual]);

	const value: VotacaoContextData = {
		votacoesAtivas,
		votacaoAtual,
		votosAtuais,
		estatisticas,
		isLoading,
		carregarVotacoesAtivas,
		selecionarVotacao,
		registrarVoto,
		atualizarEstatisticas,
		limparVotacaoAtual
	};

	return (
		<VotacaoContext.Provider value={value}>
			{children}
		</VotacaoContext.Provider>
	);
};
