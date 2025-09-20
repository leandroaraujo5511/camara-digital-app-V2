import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	StyleSheet,
	Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVotacao } from '../contexts/VotacaoContext';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { VotoRequest } from '../services/votacao.service';
import websocketService from '../services/websocket.service';
import Toast from 'react-native-toast-message';
import { PautaSideSheet } from '../components/PautaSideSheet';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function VotacaoScreen() {
	const navigation = useNavigation();
	const { vereador } = useAuth();
	const {
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
	} = useVotacao();

	const [votoSelecionado, setVotoSelecionado] = useState<'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE' | null>(null);
	const [jaVotou, setJaVotou] = useState(false);
	const [websocketStatus, setWebsocketStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
	const [pautaSideSheetVisible, setPautaSideSheetVisible] = useState(false);

	// Verificar status do WebSocket periodicamente
	useEffect(() => {
		const interval = setInterval(() => {
			const status = websocketService.getConnectionStatus();
			setWebsocketStatus(status.isConnected ? 'connected' : 'disconnected');
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	// Verificar se o vereador já votou na votação atual
	useEffect(() => {
		if (votacaoAtual && vereador) {
			const votoExistente = votosAtuais.find(v => v.vereadorId === vereador.id);
			setJaVotou(!!votoExistente);
			
			// Se já votou, definir o voto selecionado como o voto atual
			if (votoExistente) {
				setVotoSelecionado(votoExistente.vote);
			}
		}
	}, [votacaoAtual, vereador, votosAtuais]);

	// Carregar votações ativas ao montar a tela
	useEffect(() => {
		carregarVotacoesAtivas();
	}, []);

	// Limpar votação ao desmontar
	useEffect(() => {
		return () => {
			limparVotacaoAtual();
		};
	}, []);

	const handleSelecionarVotacao = async (votacao: any) => {
		console.log('🎯 Selecionando votação:', votacao.title);
		await selecionarVotacao(votacao);
		setVotoSelecionado(null);
	};

	const handleVotar = async () => {
		if (!votacaoAtual || !votoSelecionado || !vereador) {
			Alert.alert('Erro', 'Selecione uma opção de voto');
			return;
		}

		// Buscar voto existente se houver
		const votoExistente = votosAtuais.find(v => v.vereadorId === vereador.id);
		const acao = votoExistente ? 'alterar' : 'confirmar';
		const mensagem = votoExistente 
			? `Tem certeza que deseja alterar seu voto de "${votoExistente.vote}" para "${votoSelecionado}"?`
			: `Tem certeza que deseja votar "${votoSelecionado}"?`;

		Alert.alert(
			`${acao === 'alterar' ? 'Alterar' : 'Confirmar'} Voto`,
			mensagem,
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: acao === 'alterar' ? 'Alterar' : 'Confirmar',
				onPress: async () => {
					// WORKAROUND: Se o ID do voto for igual ao ID do vereador, não passar voteId
					// Isso força o sistema a usar a lógica de busca automática
					const voteIdParaUsar = (votoExistente?.id && votoExistente.id !== vereador.id) 
						? votoExistente.id 
						: undefined;
					
					const votoRequest: VotoRequest = {
						votacaoId: votacaoAtual.id,
						vereadorId: vereador.id,
						vote: votoSelecionado,
						voteId: voteIdParaUsar // Usar ID apenas se for diferente do vereadorId
					};

						const sucesso = await registrarVoto(votoRequest);
						if (sucesso) {
							setVotoSelecionado(null);
							setJaVotou(true);
							// Recarregar estatísticas após alteração
							atualizarEstatisticas();
						}
					}
				}
			]
		);
	};

	const renderVotacaoAtual = () => {
		if (!votacaoAtual) {
			console.log('🎯 Votação atual não encontrada', votacaoAtual);
			return (
				<View style={styles.emptyState}>
					<MaterialIcons name="how-to-vote" size={64} color={colors.slate[400]} />
					<Text style={styles.emptyStateTitle}>Carregando Votação...</Text>
					<Text style={styles.emptyStateText}>
						Aguarde enquanto carregamos as votações disponíveis
					</Text>
				</View>
			);
		}

		return (
			<View style={styles.votacaoContainer}>
				<View style={styles.votacaoHeader}>
					<MaterialIcons name="gavel" size={24} color={colors.blue[500]} />
					<Text style={styles.votacaoTitle}>Votação Selecionada</Text>
				</View>

				<View style={styles.votacaoContent}>
					<Text style={styles.votacaoTitleText}>{votacaoAtual.title}</Text>
					<Text style={styles.votacaoDescription}>{votacaoAtual.description}</Text>
					
					<View style={styles.votacaoInfo}>
						<Text style={styles.votacaoInfoText}>
							<Text style={styles.label}>Tipo:</Text> {votacaoAtual.type}
						</Text>
						<Text style={styles.votacaoInfoText}>
							<Text style={styles.label}>Número:</Text> {votacaoAtual.number}/{votacaoAtual.year}
						</Text>
					</View>

					{/* Botão Ver Pauta */}
					<TouchableOpacity
						style={[
							styles.verPautaButton,
							!votacaoAtual?.pauta?.pdfUrl && styles.verPautaButtonDisabled
						]}
						onPress={() => setPautaSideSheetVisible(true)}
						activeOpacity={0.7}
						disabled={!votacaoAtual?.pauta?.pdfUrl}
					>
						<MaterialIcons 
							name="description" 
							size={20} 
							color={votacaoAtual?.pauta?.pdfUrl ? colors.blue[500] : colors.slate[500]} 
						/>
						<Text style={[
							styles.verPautaButtonText,
							!votacaoAtual?.pauta?.pdfUrl && styles.verPautaButtonTextDisabled
						]}>
							{votacaoAtual?.pauta?.pdfUrl ? 'Ver Pauta' : 'Pauta não disponível'}
						</Text>
						{votacaoAtual?.pauta?.pdfUrl && (
							<MaterialIcons name="chevron-right" size={20} color={colors.blue[500]} />
						)}
					</TouchableOpacity>

					{/* Estatísticas */}
					{estatisticas && (
						<View style={styles.statsContainer}>
							<Text style={styles.statsTitle}>Resultado Parcial</Text>
							<View style={styles.statsGrid}>
								<View style={styles.statItem}>
									<Text style={styles.statNumber}>{estatisticas.sim}</Text>
									<Text style={styles.statLabel}>Sim</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={styles.statNumber}>{estatisticas.nao}</Text>
									<Text style={styles.statLabel}>Não</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={styles.statNumber}>{estatisticas.abstencao}</Text>
									<Text style={styles.statLabel}>Abstenção</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={styles.statNumber}>{estatisticas.ausente}</Text>
									<Text style={styles.statLabel}>Ausente</Text>
								</View>
							</View>
							<Text style={styles.totalVotos}>
								Total: {estatisticas.total} votos
							</Text>
						</View>
					)}

					{/* Opções de Voto */}
					{!jaVotou ? (
						<View style={styles.votoOptions}>
							<Text style={styles.votoOptionsTitle}>Selecione seu voto:</Text>
							
							<View style={styles.votoButtons}>
								<TouchableOpacity
									style={[
										styles.votoButton,
										votoSelecionado === 'SIM' && styles.votoButtonSelected,
										{ backgroundColor: votoSelecionado === 'SIM' ? colors.green[500] : colors.slate[700] }
									]}
									onPress={() => setVotoSelecionado('SIM')}
									activeOpacity={0.7}
								>
									<MaterialIcons 
										name="thumb-up" 
										size={24} 
										color={votoSelecionado === 'SIM' ? colors.slate[100] : colors.green[500]} 
									/>
									<Text style={[
										styles.votoButtonText,
										{ color: votoSelecionado === 'SIM' ? colors.slate[100] : colors.green[500] }
									]}>
										SIM
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.votoButton,
										votoSelecionado === 'NAO' && styles.votoButtonSelected,
										{ backgroundColor: votoSelecionado === 'NAO' ? colors.red[500] : colors.slate[700] }
									]}
									onPress={() => setVotoSelecionado('NAO')}
									activeOpacity={0.7}
								>
									<MaterialIcons 
										name="thumb-down" 
										size={24} 
										color={votoSelecionado === 'NAO' ? colors.slate[100] : colors.red[500]} 
									/>
									<Text style={[
										styles.votoButtonText,
										{ color: votoSelecionado === 'NAO' ? colors.slate[100] : colors.red[500] }
									]}>
										NÃO
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.votoButton,
										votoSelecionado === 'ABSTENCAO' && styles.votoButtonSelected,
										{ backgroundColor: votoSelecionado === 'ABSTENCAO' ? colors.orange[500] : colors.slate[700] }
									]}
									onPress={() => setVotoSelecionado('ABSTENCAO')}
									activeOpacity={0.7}
								>
									<MaterialIcons 
										name="remove" 
										size={24} 
										color={votoSelecionado === 'ABSTENCAO' ? colors.slate[100] : colors.orange[500]} 
									/>
									<Text style={[
										styles.votoButtonText,
										{ color: votoSelecionado === 'ABSTENCAO' ? colors.slate[100] : colors.orange[500] }
									]}>
										ABSTENÇÃO
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.votoButton,
										votoSelecionado === 'AUSENTE' && styles.votoButtonSelected,
										{ backgroundColor: votoSelecionado === 'AUSENTE' ? colors.slate[500] : colors.slate[700] }
									]}
									onPress={() => setVotoSelecionado('AUSENTE')}
									activeOpacity={0.7}
								>
									<MaterialIcons 
										name="person-off" 
										size={24} 
										color={votoSelecionado === 'AUSENTE' ? colors.slate[100] : colors.slate[500]} 
									/>
									<Text style={[
										styles.votoButtonText,
										{ color: votoSelecionado === 'AUSENTE' ? colors.slate[100] : colors.slate[500] }
									]}>
										AUSENTE
									</Text>
								</TouchableOpacity>
							</View>

							<TouchableOpacity
								style={[
									styles.confirmarButton,
									!votoSelecionado && styles.confirmarButtonDisabled
								]}
								onPress={handleVotar}
								disabled={!votoSelecionado}
								activeOpacity={0.7}
							>
								<Text style={styles.confirmarButtonText}>
									{jaVotou ? 'Alterar Voto' : 'Confirmar Voto'}
								</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View style={styles.votoRegistrado}>
							<MaterialIcons name="check-circle" size={48} color={colors.green[500]} />
							<Text style={styles.votoRegistradoTitle}>Voto Registrado!</Text>
							
							{/* Mostrar o voto atual */}
							{(() => {
								const votoAtual = votosAtuais.find(v => v.vereadorId === vereador?.id);
								if (votoAtual) {
									return (
										<View style={styles.votoAtualContainer}>
											<Text style={styles.votoAtualLabel}>Seu voto atual:</Text>
											<View style={styles.votoAtualBadge}>
												<Text style={styles.votoAtualText}>{votoAtual.vote}</Text>
											</View>
										</View>
									);
								}
								return null;
							})()}
							
							<Text style={styles.votoRegistradoText}>
								Seu voto foi computado com sucesso
							</Text>
							
							{/* Botão para alterar voto */}
							<TouchableOpacity
								style={styles.alterarVotoButton}
								onPress={() => {
									setVotoSelecionado(null);
									setJaVotou(false);
								}}
								activeOpacity={0.7}
							>
								<MaterialIcons name="edit" size={20} color={colors.blue[500]} />
								<Text style={styles.alterarVotoButtonText}>Alterar Voto</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		);
	};

	const renderVotacoesAtivas = () => {
		if (votacoesAtivas.length === 0) {
			return (
				<View style={styles.emptyState}>
					<MaterialIcons name="event-busy" size={64} color={colors.slate[400]} />
					<Text style={styles.emptyStateTitle}>Nenhuma Votação Ativa</Text>
					<Text style={styles.emptyStateText}>
						Aguarde uma votação ser iniciada
					</Text>
				</View>
			);
		}

		return (
			<View style={styles.votacoesList}>
				<Text style={styles.sectionTitle}>Outras Votações Disponíveis</Text>
				{votacoesAtivas.map((votacao) => (
					<TouchableOpacity
						key={votacao.id}
						style={[
							styles.votacaoCard,
							votacaoAtual?.id === votacao.id && styles.votacaoCardSelected
						]}
						onPress={() => handleSelecionarVotacao(votacao)}
						activeOpacity={0.7}
						pressRetentionOffset={{ top: 20, left: 20, bottom: 20, right: 20 }}
					>
						<View style={styles.votacaoCardHeader}>
							<MaterialIcons name="gavel" size={20} color={colors.blue[500]} />
							<Text style={styles.votacaoCardTitle}>{votacao.title}</Text>
							<MaterialIcons 
								name="chevron-right" 
								size={20} 
								color={colors.slate[400]} 
								style={styles.votacaoCardArrow}
							/>
						</View>
						<Text style={styles.votacaoCardDescription} numberOfLines={2}>
							{votacao.description}
						</Text>
						<View style={styles.votacaoCardFooter}>
							<Text style={styles.votacaoCardType}>{votacao.type}</Text>
							<Text style={styles.votacaoCardNumber}>
								#{votacao.number}/{votacao.year}
							</Text>
						</View>
						{/* Indicador visual de que é clicável */}
						<View style={styles.votacaoCardIndicator}>
							<Text style={styles.votacaoCardIndicatorText}>
								Toque para trocar de votação
							</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		);
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.blue[500]} />
					<Text style={styles.loadingText}>Carregando votações...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<MaterialIcons name="arrow-back" size={28} color={colors.blue[500]} onPress={() => navigation.navigate('Home' as never)}/>
				<Text style={styles.headerTitle}>Sistema de Votação</Text>
				<View style={styles.websocketStatus}>
					<View style={[
						styles.statusDot,
						{ backgroundColor: websocketStatus === 'connected' ? colors.green[500] : colors.red[500] }
					]} />
					<Text style={styles.statusText}>
						{websocketStatus === 'connected' ? 'Conectado' : 'Desconectado'}
					</Text>
					{websocketStatus === 'disconnected' && (
						<TouchableOpacity
							style={styles.reconnectButton}
							onPress={() => websocketService.manualReconnect()}
						>
							<MaterialIcons name="refresh" size={16} color={colors.blue[400]} />
						</TouchableOpacity>
					)}
				</View>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{renderVotacaoAtual()}
				{renderVotacoesAtivas()}
			</ScrollView>

			{/* Side Sheet para exibir PDF da pauta */}
			{votacaoAtual?.pauta?.pdfUrl && (
				<PautaSideSheet
					visible={pautaSideSheetVisible}
					onClose={() => setPautaSideSheetVisible(false)}
					pautaUrl={votacaoAtual.pauta.pdfUrl}
					pautaTitle={`Pauta - ${votacaoAtual.title || 'Votação'}`}
				/>
			)}

			<Toast />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.slate[900],
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: colors.slate[800],
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.slate[100],
		marginLeft: 12,
	},
	content: {
		flex: 1,
		padding: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 16,
		color: colors.slate[400],
		marginTop: 16,
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 40,
	},
	emptyStateTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.slate[300],
		marginTop: 16,
		marginBottom: 8,
	},
	emptyStateText: {
		fontSize: 16,
		color: colors.slate[400],
		textAlign: 'center',
	},
	votacaoContainer: {
		backgroundColor: colors.slate[800],
		borderRadius: 16,
		padding: 20,
		marginBottom: 24,
	},
	votacaoHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	votacaoTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: colors.slate[100],
		marginLeft: 8,
	},
	votacaoContent: {
		// Conteúdo da votação
	},
	votacaoTitleText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.slate[100],
		marginBottom: 8,
	},
	votacaoDescription: {
		fontSize: 16,
		color: colors.slate[300],
		marginBottom: 16,
		lineHeight: 24,
	},
	votacaoInfo: {
		marginBottom: 20,
	},
	votacaoInfoText: {
		fontSize: 14,
		color: colors.slate[400],
		marginBottom: 4,
	},
	label: {
		fontWeight: 'bold',
		color: colors.slate[300],
	},
	statsContainer: {
		backgroundColor: colors.slate[700],
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
	},
	statsTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.slate[200],
		marginBottom: 12,
		textAlign: 'center',
	},
	statsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 12,
	},
	statItem: {
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.slate[100],
	},
	statLabel: {
		fontSize: 12,
		color: colors.slate[400],
		marginTop: 4,
	},
	totalVotos: {
		fontSize: 14,
		color: colors.slate[400],
		textAlign: 'center',
		fontWeight: '500',
	},
	votoOptions: {
		// Opções de voto
	},
	votoOptionsTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.slate[200],
		marginBottom: 16,
		textAlign: 'center',
	},
	votoButtons: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	votoButton: {
		width: (width - 80) / 2 - 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	votoButtonSelected: {
		// Estilo quando selecionado
	},
	votoButtonText: {
		fontSize: 14,
		fontWeight: 'bold',
		marginLeft: 8,
	},
	confirmarButton: {
		backgroundColor: colors.blue[500],
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 12,
		alignItems: 'center',
	},
	confirmarButtonDisabled: {
		backgroundColor: colors.slate[600],
	},
	confirmarButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.slate[100],
	},
	votoRegistrado: {
		alignItems: 'center',
		paddingVertical: 20,
	},
	votoRegistradoTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.green[500],
		marginTop: 16,
		marginBottom: 8,
	},
	votoRegistradoText: {
		fontSize: 16,
		color: colors.slate[400],
		textAlign: 'center',
		marginBottom: 20,
	},
	alterarVotoButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.blue[900],
		borderWidth: 1,
		borderColor: colors.blue[500],
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginTop: 8,
	},
	alterarVotoButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.blue[400],
		marginLeft: 8,
	},
	votoAtualContainer: {
		alignItems: 'center',
		marginBottom: 16,
	},
	votoAtualLabel: {
		fontSize: 14,
		color: colors.slate[300],
		marginBottom: 8,
	},
	votoAtualBadge: {
		backgroundColor: colors.blue[900],
		borderWidth: 1,
		borderColor: colors.blue[500],
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	votoAtualText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.blue[400],
	},
	votacoesList: {
		// Lista de votações
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.slate[100],
		marginBottom: 16,
	},
	votacaoCard: {
		backgroundColor: colors.slate[800],
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 2,
		borderColor: 'transparent',
		// Melhorias para feedback visual
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	votacaoCardSelected: {
		borderColor: colors.blue[500],
		backgroundColor: colors.slate[700],
		elevation: 5,
	},
	votacaoCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	votacaoCardTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.slate[100],
		marginLeft: 8,
		flex: 1,
	},
	votacaoCardArrow: {
		marginLeft: 8,
	},
	votacaoCardDescription: {
		fontSize: 14,
		color: colors.slate[300],
		marginBottom: 12,
		lineHeight: 20,
	},
	votacaoCardFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	votacaoCardType: {
		fontSize: 12,
		color: colors.blue[400],
		backgroundColor: colors.blue[900],
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	votacaoCardNumber: {
		fontSize: 12,
		color: colors.slate[400],
		fontWeight: '500',
	},
	votacaoCardIndicator: {
		alignItems: 'center',
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: colors.slate[700],
	},
	votacaoCardIndicatorText: {
		fontSize: 12,
		color: colors.blue[400],
		fontStyle: 'italic',
	},
	websocketStatus: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 6,
	},
	statusText: {
		fontSize: 12,
		color: colors.slate[400],
		fontWeight: '500',
	},
	reconnectButton: {
		marginLeft: 8,
		padding: 4,
		borderRadius: 4,
		backgroundColor: colors.blue[900],
		borderWidth: 1,
		borderColor: colors.blue[500],
	},
	verPautaButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: colors.blue[900],
		borderWidth: 1,
		borderColor: colors.blue[500],
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 20,
	},
	verPautaButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.blue[400],
		flex: 1,
		marginLeft: 12,
	},
	verPautaButtonDisabled: {
		backgroundColor: colors.slate[800],
		borderColor: colors.slate[600],
		opacity: 0.6,
	},
	verPautaButtonTextDisabled: {
		color: colors.slate[500],
	},
});
