import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pauta } from '@/interfaces';
import { colors } from '@/styles/colors';

interface PautaCardProps {
  pauta: Pauta;
  onPress: () => void;
  showVoteStatus?: boolean;
  voteStatus?: 'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE' | null;
}

export const PautaCard: React.FC<PautaCardProps> = ({
  pauta,
  onPress,
  showVoteStatus = false,
  voteStatus = null,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return colors.red[500];
      case 'HIGH':
        return colors.orange[500];
      case 'MEDIUM':
        return colors.blue[500];
      case 'LOW':
        return colors.slate[500];
      default:
        return colors.slate[500];
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'CRÍTICA';
      case 'HIGH':
        return 'ALTA';
      case 'MEDIUM':
        return 'MÉDIA';
      case 'LOW':
        return 'BAIXA';
      default:
        return priority;
    }
  };

  const getTypeText = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'URGENTE';
      case 'EXTRAORDINARY':
        return 'EXTRAORDINÁRIA';
      case 'SPECIAL':
        return 'ESPECIAL';
      case 'ORDINARY':
        return 'ORDINÁRIA';
      default:
        return priority;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'URGENT':
        return colors.red[500];
      case 'EXTRAORDINARY':
        return colors.orange[500];
      case 'SPECIAL':
        return colors.purple[500];
      case 'ORDINARY':
        return colors.blue[500];
      default:
        return colors.slate[500];
    }
  };

  const getVoteStatusColor = (status: string) => {
    switch (status) {
      case 'SIM':
        return colors.green[500];
      case 'NAO':
        return colors.red[500];
      case 'ABSTENCAO':
        return colors.orange[500];
      case 'AUSENTE':
        return colors.slate[500];
      default:
        return colors.slate[500];
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{pauta.number}/{pauta.year}</Text>
        </View>
        
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: getPriorityColor(pauta.priority) }]}>
            <Text style={styles.badgeText}>{getPriorityText(pauta.priority)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getTypeColor(pauta.type) }]}>
            <Text style={styles.badgeText}>{getTypeText(pauta.type)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {pauta.title}
      </Text>

      <Text style={styles.description} numberOfLines={3}>
        {pauta.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.infoLabel}>Comissão:</Text>
          <Text style={styles.infoValue}>{pauta.commission}</Text>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.infoLabel}>Proponente:</Text>
          <Text style={styles.infoValue}>{pauta.proponent}</Text>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.infoLabel}>Sessão:</Text>
          <Text style={styles.infoValue}>
            {(() => {
              try {
                if (!pauta.sessionDate || 
                    pauta.sessionDate === 'null' || 
                    pauta.sessionDate === 'undefined' || 
                    pauta.sessionDate === '') {
                  return 'Data não definida';
                }
                
                const date = new Date(pauta.sessionDate);
                if (isNaN(date.getTime())) {
                  return 'Data inválida';
                }
                
                return format(date, 'dd/MM/yyyy', { locale: ptBR });
              } catch (error) {
                console.warn('⚠️ Erro ao formatar data no PautaCard:', error);
                return 'Data inválida';
              }
            })()}
          </Text>
        </View>
      </View>

      {showVoteStatus && voteStatus && (
        <View style={[styles.voteStatus, { backgroundColor: getVoteStatusColor(voteStatus) }]}>
          <Text style={styles.voteStatusText}>Votou: {voteStatus}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.slate[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.slate[700],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  numberContainer: {
    backgroundColor: colors.blue[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  number: {
    color: colors.slate[100],
    fontSize: 14,
    fontWeight: '700',
  },

  badges: {
    flexDirection: 'row',
    gap: 8,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: colors.slate[100],
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[100],
    marginBottom: 8,
    lineHeight: 24,
  },

  description: {
    fontSize: 14,
    color: colors.slate[300],
    marginBottom: 16,
    lineHeight: 20,
  },

  footer: {
    gap: 8,
  },

  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate[200],
    marginRight: 8,
    minWidth: 80,
  },

  infoValue: {
    fontSize: 14,
    color: colors.slate[400],
    flex: 1,
  },

  voteStatus: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  voteStatusText: {
    color: colors.slate[100],
    fontSize: 12,
    fontWeight: '600',
  },
});

