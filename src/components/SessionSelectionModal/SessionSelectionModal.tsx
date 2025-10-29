import { Session } from '../../interfaces';
import { colors } from '../../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

interface SessionSelectionModalProps {
  visible: boolean;
  sessions: Session[];
  loading: boolean;
  onSelectSession: (session: Session) => void;
  onClose: () => void;
}

export const SessionSelectionModal: React.FC<SessionSelectionModalProps> = ({
  visible,
  sessions,
  loading,
  onSelectSession,
  onClose,
}) => {
  const getSessionTypeLabel = (type: Session['type']) => {
    const labels: Record<Session['type'], string> = {
      ORDINARY: 'Ordinária',
      EXTRAORDINARY: 'Extraordinária',
      SPECIAL: 'Especial',
      SOLEMN: 'Solene',
      PREPARATORY: 'Preparatória',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: Session['status']) => {
    const labels: Record<Session['status'], string> = {
      SCHEDULED: 'Agendada',
      IN_PROGRESS: 'Em Andamento',
      SUSPENDED: 'Suspensa',
      COMPLETED: 'Concluída',
      CANCELLED: 'Cancelada',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: Session['status']) => {
    const colorsMap: Record<Session['status'], string> = {
      SCHEDULED: colors.blue[500],
      IN_PROGRESS: colors.green[500],
      SUSPENDED: colors.orange[500],
      COMPLETED: colors.slate[500],
      CANCELLED: colors.red[500],
    };
    return colorsMap[status] || colors.slate[500];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="event" size={24} color={colors.blue[500]} />
            <Text style={styles.headerTitle}>Selecione uma Sessão</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={24} color={colors.slate[400]} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.blue[500]} />
              <Text style={styles.loadingText}>Carregando sessões...</Text>
            </View>
          ) : sessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={64} color={colors.slate[500]} />
              <Text style={styles.emptyText}>
                Nenhuma sessão encontrada para hoje
              </Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              {sessions.map((session) => (
                <TouchableOpacity
                  key={session.id}
                  style={styles.sessionCard}
                  onPress={() => onSelectSession(session)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(session.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusLabel(session.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sessionInfo}>
                    <View style={styles.sessionInfoRow}>
                      <MaterialIcons name="category" size={16} color={colors.slate[400]} />
                      <Text style={styles.sessionInfoText}>
                        Tipo: {getSessionTypeLabel(session.type)}
                      </Text>
                    </View>
                    <View style={styles.sessionInfoRow}>
                      <MaterialIcons name="format-list-numbered" size={16} color={colors.slate[400]} />
                      <Text style={styles.sessionInfoText}>
                        Sessão #{session.sessionNumber} - {session.legislature}
                      </Text>
                    </View>
                    <View style={styles.sessionInfoRow}>
                      <MaterialIcons name="access-time" size={16} color={colors.slate[400]} />
                      <Text style={styles.sessionInfoText}>
                        Horário: {session.startTime}
                        {session.endTime && ` - ${session.endTime}`}
                      </Text>
                    </View>
                    {session.location && (
                      <View style={styles.sessionInfoRow}>
                        <MaterialIcons name="place" size={16} color={colors.slate[400]} />
                        <Text style={styles.sessionInfoText}>
                          Local: {session.location}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.selectButton}>
                    <MaterialIcons name="check-circle" size={18} color={colors.blue[500]} />
                    <Text style={styles.selectButtonText}>Selecionar</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[900],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[800],
    backgroundColor: colors.slate[800],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.slate[100],
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.slate[700],
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.slate[400],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.slate[400],
    textAlign: 'center',
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: colors.slate[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.slate[700],
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.slate[100],
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate[100],
  },
  sessionInfo: {
    marginBottom: 12,
  },
  sessionInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionInfoText: {
    fontSize: 14,
    color: colors.slate[400],
    marginLeft: 8,
    flex: 1,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.slate[700],
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.blue[500],
    marginLeft: 6,
  },
});

