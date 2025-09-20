import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { votingService } from '../services/voting.service';
import { Button } from '../components/Button/Button';
import { Votacao, Vote } from '../interfaces';
import { tokens } from '../styles/colors';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Voting: { votacaoId: string };
};

type VotingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Voting'>;
type VotingScreenRouteProp = RouteProp<RootStackParamList, 'Voting'>;

interface VotingScreenProps {
  route: VotingScreenRouteProp;
  navigation: VotingScreenNavigationProp;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({ route, navigation }) => {
  const { vereador } = useAuth();
  const { votacaoId } = route.params;

  console.log('Votacao ID:', votacaoId);
  
  const [votacao, setVotacao] = useState<Votacao | null>(null);
  const [currentVote, setCurrentVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE' | null>(null);
  console.log('currentVote', currentVote);
  useEffect(() => {
    loadVotacaoData();
  }, [votacaoId]);

  const loadVotacaoData = async () => {
    try {
      setLoading(true);
      
      // Aqui você precisaria implementar um serviço para buscar os detalhes da votação
      // Por enquanto, vamos simular os dados
      const mockVotacao: Votacao = {
        id: votacaoId,
        title: 'Aprovação do Orçamento Municipal 2024',
        description: 'Votação para aprovação do orçamento municipal para o exercício de 2024, incluindo todas as despesas e receitas previstas.',
        type: 'PAUTA',
        number: '001',
        year: '2024',
        startTime: new Date().toISOString(),
        endTime: '16:00',
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tenantId: 'default',
        pautaId: 'mock-pauta-id',
        pauta: {
          id: 'mock-pauta-id',
          title: 'Orçamento Municipal 2024',
          description: 'Orçamento municipal para o exercício de 2024',
          type: 'ORDINARY',
          priority: 'HIGH',
          commission: 'Finanças',
          proponent: 'Prefeitura',
          number: '001',
          year: '2024',
          sessionDate: new Date().toISOString(),
          status: 'READY_FOR_VOTING',
          tenantId: 'default',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tenant: {
            id: 'default',
            name: 'Câmara Municipal',
            subdomain: 'default',
            status: 'active',
            city: 'Cidade',
            state: 'Estado'
          }
        }
      };
      
      setVotacao(mockVotacao);
      
      // Verificar se o vereador já votou
      if (vereador) {
        const existingVote = await votingService.getVotoVereador(votacaoId, vereador.id);
        if (existingVote) {
          setCurrentVote(existingVote);
          setSelectedVote(existingVote.vote);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da votação:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da votação');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedVote || !vereador) return;

    try {
      setVoting(true);
      
      if (currentVote) {
        console.log('Atualizando voto existente:', currentVote, selectedVote);
        // Atualizar voto existente
        await votingService.atualizarVoto(currentVote.id, selectedVote);
        Alert.alert('Sucesso', 'Voto atualizado com sucesso!');
      } else {
        // Registrar novo voto
        const newVote = await votingService.registrarVoto(votacaoId, vereador.id, selectedVote);
        setCurrentVote(newVote);
        Alert.alert('Sucesso', 'Voto registrado com sucesso!');
      }
      
      // Voltar para a tela anterior
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao registrar voto:', error);
      Alert.alert('Erro', 'Não foi possível registrar o voto');
    } finally {
      setVoting(false);
    }
  };

  const getVoteButtonStyle = (vote: string) => {
    const isSelected = selectedVote === vote;
    const baseStyle = {
      backgroundColor: isSelected ? tokens.colors.vote[vote.toLowerCase() as keyof typeof tokens.colors.vote] : tokens.colors.background.primary,
      borderColor: tokens.colors.vote[vote.toLowerCase() as keyof typeof tokens.colors.vote],
    };
    
    return [styles.voteButton, baseStyle];
  };

  const getVoteTextStyle = (vote: string): TextStyle => {
    const isSelected = selectedVote === vote;
    return {
      color: isSelected ? tokens.colors.text.light : tokens.colors.vote[vote.toLowerCase() as keyof typeof tokens.colors.vote],
      fontWeight: isSelected ? '700' : '600',
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
          <Text style={styles.loadingText}>Carregando votação...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!votacao) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Votação não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{votacao.title}</Text>
          <Text style={styles.subtitle}>
            Votação {votacao.number}/{votacao.year}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.description}>{votacao.description}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo:</Text>
            <Text style={styles.infoValue}>{votacao.type}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data:</Text>
            <Text style={styles.infoValue}>
              {votacao.startTime ? format(new Date(votacao.startTime), 'dd/MM/yyyy', { locale: ptBR }) : 'Não definida'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Horário:</Text>
            <Text style={styles.infoValue}>
              {votacao.startTime} - {votacao.endTime}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, styles.statusText]}>
              {votacao.status === 'IN_PROGRESS' ? 'Em Andamento' : 'Aguardando'}
            </Text>
          </View>
        </View>

        <View style={styles.votingSection}>
          <Text style={styles.votingTitle}>Seu Voto</Text>
          
          {currentVote && (
            <View style={styles.currentVoteContainer}>
              <Text style={styles.currentVoteText}>
                Voto atual: <Text style={styles.currentVoteValue}>{currentVote.vote}</Text>
              </Text>
            </View>
          )}

          <View style={styles.voteButtons}>
            <TouchableOpacity
              style={getVoteButtonStyle('SIM')}
              onPress={() => setSelectedVote('SIM')}
            >
              <Text style={getVoteTextStyle('SIM')}>SIM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={getVoteButtonStyle('NAO')}
              onPress={() => setSelectedVote('NAO')}
            >
              <Text style={getVoteTextStyle('NAO')}>NÃO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={getVoteButtonStyle('ABSTENCAO')}
              onPress={() => setSelectedVote('ABSTENCAO')}
            >
              <Text style={getVoteTextStyle('ABSTENCAO')}>ABSTENÇÃO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={getVoteButtonStyle('AUSENTE')}
              onPress={() => setSelectedVote('AUSENTE')}
            >
              <Text style={getVoteTextStyle('AUSENTE')}>AUSENTE</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={currentVote ? 'Atualizar Voto' : 'Confirmar Voto'}
            onPress={handleVote}
            disabled={!selectedVote}
            loading={voting}
            style={styles.confirmButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.primary,
  },

  content: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
    marginTop: 16,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    fontSize: 16,
    color: tokens.colors.error,
  },

  header: {
    padding: 20,
    backgroundColor: tokens.colors.background.secondary,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 8,
    lineHeight: 32,
  },

  subtitle: {
    fontSize: 16,
    color: tokens.colors.primary,
    fontWeight: '600',
  },

  infoCard: {
    margin: 20,
    padding: 20,
    backgroundColor: tokens.colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.slate[200],
  },

  description: {
    fontSize: 16,
    color: tokens.colors.text.primary,
    lineHeight: 24,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.slate[100],
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },

  infoValue: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
  },

  statusText: {
    color: tokens.colors.primary,
    fontWeight: '600',
  },

  votingSection: {
    margin: 20,
    padding: 20,
    backgroundColor: tokens.colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.slate[200],
  },

  votingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },

  currentVoteContainer: {
    backgroundColor: tokens.colors.background.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },

  currentVoteText: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
  },

  currentVoteValue: {
    color: tokens.colors.primary,
    fontWeight: '700',
  },

  voteButtons: {
    gap: 12,
    marginBottom: 24,
  },

  voteButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButton: {
    marginTop: 8,
  },
});
