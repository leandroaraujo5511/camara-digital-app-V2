import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { votingService } from '../services/voting.service';
import { sessionService } from '../services/session.service';
import { presenceService } from '../services/presence.service';
import { PautaCard } from '../components/PautaCard/PautaCard';
import { VotacaoCard } from '../components/VotacaoCard';
import { VereadorAvatar } from '../components/VereadorAvatar/VereadorAvatar';
import { Button } from '../components/Button/Button';
import { SessionSelectionModal } from '../components/SessionSelectionModal/SessionSelectionModal';
import { Pauta, Votacao, Session } from '../interfaces';
import { colors } from '../styles/colors';
import { useNavigation } from '@react-navigation/native';

type TabType = 'pautas' | 'votacoes' | 'historico';

export const HomeScreen: React.FC = () => {
  const { vereador, signOut } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('pautas');
  const [pautas, setPautas] = useState<Pauta[]>([]);
  const [votacoes, setVotacoes] = useState<Votacao[]>([]);
  const [historico, setHistorico] = useState<Votacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [registeringPresence, setRegisteringPresence] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'pautas':
          const pautasData = await votingService.getPautas();
          setPautas(pautasData);
          break;
        case 'votacoes':
          const [votacoesAtivas, votacoesAguardando] = await Promise.all([
            votingService.getVotacoesAtivas(),
            votingService.getVotacoesAguardando(),
          ]);
          setVotacoes([...votacoesAtivas, ...votacoesAguardando]);
          break;
        case 'historico':
          const historicoData = await votingService.getHistoricoVotacoes();
          setHistorico(historicoData);
          break;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  const handleRegisterPresence = async () => {
    if (!vereador) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    try {
      setLoadingSessions(true);
      setShowSessionModal(true);

      // Buscar sessões do dia atual
      const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const sessionsData = await sessionService.getSessionsByDate(today);
      setSessions(sessionsData);

      if (sessionsData.length === 0) {
        Alert.alert(
          'Nenhuma sessão encontrada',
          'Não há sessões agendadas para hoje.'
        );
        setShowSessionModal(false);
      }
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
      Alert.alert('Erro', 'Não foi possível carregar as sessões. Tente novamente.');
      setShowSessionModal(false);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleSelectSession = async (session: Session) => {
    if (!vereador) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    // Verificar se já existe uma presença registrada
    try {
      const existingPresence = await presenceService.getPresenceBySessionAndVereador(
        session.id,
        vereador.id
      );

      if (existingPresence) {
        Alert.alert(
          'Presença já registrada',
          'Você já registrou sua presença para esta sessão. Não é possível editar.',
          [{ text: 'OK' }]
        );
        setShowSessionModal(false);
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar presença existente:', error);
    }

    // Confirmar registro
    Alert.alert(
      'Registrar Presença',
      `Deseja registrar sua presença na sessão "${session.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setRegisteringPresence(true);

              await presenceService.createPresence({
                sessionId: session.id,
                vereadorId: vereador.id,
                status: 'PRESENT',
                registeredBy: vereador.name,
                arrivalTime: new Date().toISOString(),
              });

              Alert.alert(
                'Sucesso',
                'Presença registrada com sucesso!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setShowSessionModal(false);
                    },
                  },
                ]
              );
            } catch (error: any) {
              console.error('Erro ao registrar presença:', error);
              const errorMessage =
                error.message || 'Não foi possível registrar a presença. Tente novamente.';
              Alert.alert('Erro', errorMessage);
            } finally {
              setRegisteringPresence(false);
            }
          },
        },
      ]
    );
  };

  const renderTabButton = (tab: TabType, label: string, count: number) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {label}
      </Text>
      <View style={[styles.tabBadge, activeTab === tab && styles.activeTabBadge]}>
        <Text style={styles.tabBadgeText}>{count}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'pautas':
        return pautas.length > 0 ? (
          pautas.map((pauta) => (
            <PautaCard
              key={pauta.id}
              pauta={pauta}
              onPress={() => {/* Navegar para detalhes da pauta */}}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma pauta disponível</Text>
          </View>
        );

      case 'votacoes':
        return votacoes.length > 0 ? (
          votacoes.map((votacao) => (
            <VotacaoCard
              key={votacao.id}
              votacao={votacao}
              onPress={() => navigation.navigate('Votacao' as never)}
              isTextClickable={true}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma votação ativa</Text>
          </View>
        );

      case 'historico':
        return historico.length > 0 ? (
          historico.map((votacao) => (
            <VotacaoCard
              key={votacao.id}
              votacao={votacao}
              onPress={() => {/* Histórico não é clicável */}}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum histórico disponível</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            {vereador && (
              <VereadorAvatar 
                vereador={vereador}
                size={100}
                style={styles.avatarContainer}
              />
            )}
            <View style={styles.userTextInfo}>
              <Text style={styles.welcomeText}>Bem-vindo,</Text>
              <Text style={styles.userName}>{vereador?.name}</Text>
              <Text style={styles.userParty}>{vereador?.party?.acronym}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerButtons}>
          <Button
            title="Registrar presença"
            onPress={handleRegisterPresence}
            variant="primary"
            size="small"
            style={styles.registerButton}
            disabled={registeringPresence}
            loading={registeringPresence}
          />
          <Button
            title="Sair"
            onPress={handleSignOut}
            variant="outline"
            size="small"
          />
        </View>
      </View>

      <SessionSelectionModal
        visible={showSessionModal}
        sessions={sessions}
        loading={loadingSessions}
        onSelectSession={handleSelectSession}
        onClose={() => setShowSessionModal(false)}
      />



      <View style={styles.tabs}>
        {renderTabButton('pautas', 'Pautas em discussão', pautas.length)}
        {renderTabButton('votacoes', 'Votações', votacoes.length)}
        {renderTabButton('historico', 'Histórico', historico.length)}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[900],
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    backgroundColor: colors.slate[900],
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[800],
  },

  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  registerButton: {
    marginRight: 12,
  },

  userInfo: {
    flex: 1,
  },

  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    marginRight: 12,
  },



  userTextInfo: {
    flex: 1,
  },

  welcomeText: {
    fontSize: 14,
    color: colors.slate[400],
    marginBottom: 4,
  },

  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.slate[100],
    marginBottom: 2,
  },

  userParty: {
    fontSize: 14,
    color: colors.blue[500],
    fontWeight: '600',
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.slate[800],
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },

  activeTabButton: {
    backgroundColor: colors.blue[500],
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate[400],
  },

  activeTabText: {
    color: colors.slate[100],
  },

  tabBadge: {
    backgroundColor: colors.slate[600],
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    minWidth: 20,
    alignItems: 'center',
  },

  activeTabBadge: {
    backgroundColor: colors.slate[100],
  },

  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate[900],
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    fontSize: 16,
    color: colors.slate[400],
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: colors.slate[400],
    textAlign: 'center',
  },
});

