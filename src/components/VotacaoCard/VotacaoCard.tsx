import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Votacao } from '../../interfaces';
import { colors } from '../../styles/colors';

interface VotacaoCardProps {
  votacao: Votacao;
  onPress: () => void;
  isTextClickable?: boolean;
}

export const VotacaoCard: React.FC<VotacaoCardProps> = ({
  votacao,
  onPress,
  isTextClickable = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return colors.green[500];
      case 'WAITING':
        return colors.orange[500];
      case 'COMPLETED':
        return colors.blue[500];
      case 'CANCELLED':
        return colors.red[500];
      default:
        return colors.slate[500];
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

  const formatStatus = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'EM ANDAMENTO';
      case 'WAITING':
        return 'AGUARDANDO';
      case 'COMPLETED':
        return 'CONCLUÍDA';
      case 'CANCELLED':
        return 'CANCELADA';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{votacao.number}/{votacao.year}</Text>
        </View>
        
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(votacao.status) }]}>
            <Text style={styles.badgeText}>{formatStatus(votacao.status)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getTypeColor(votacao.type) }]}>
            <Text style={styles.badgeText}>{votacao.type}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {votacao.title}
      </Text>

      <Text style={styles.description} numberOfLines={3}>
        {votacao.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>{votacao.type}</Text>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={styles.infoValue}>{formatStatus(votacao.status)}</Text>
        </View>
        
        {(() => {
          try {
            if (!votacao.startTime || 
                votacao.startTime === 'null' || 
                votacao.startTime === 'undefined' || 
                votacao.startTime === '') {
              return null;
            }
            
            const date = new Date(votacao.startTime);
            if (isNaN(date.getTime())) {
              return null;
            }
            
            return (
              <View style={styles.info}>
                <Text style={styles.infoLabel}>Início:</Text>
                <Text style={styles.infoValue}>
                  {format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </Text>
              </View>
            );
          } catch (error) {
            console.warn('⚠️ Erro ao formatar data no VotacaoCard:', error);
            return null;
          }
        })()}
      </View>

      {/* Indicador visual de que é clicável */}
      {isTextClickable && (
      <View style={styles.clickIndicator}>
          <Text style={styles.clickIndicatorText}>Toque para votar</Text>
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

  clickIndicator: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.slate[700],
    marginTop: 8,
  },

  clickIndicatorText: {
    fontSize: 12,
    color: colors.blue[500],
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
