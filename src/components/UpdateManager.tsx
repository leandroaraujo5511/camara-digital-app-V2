import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useUpdates } from '../hooks/useUpdates';
import Toast from 'react-native-toast-message';

interface UpdateManagerProps {
  autoCheck?: boolean;
  showNotification?: boolean;
}

export const UpdateManager: React.FC<UpdateManagerProps> = ({
  autoCheck = true,
  showNotification = true,
}) => {
  const {
    isUpdateAvailable,
    isUpdatePending,
    isChecking,
    isDownloading,
    isInstalling,
    updateId,
    message,
    checkForUpdates,
    downloadAndInstallUpdate,
    installPendingUpdate,
  } = useUpdates();

  // Verificar updates automaticamente na inicialização
  useEffect(() => {
    if (autoCheck) {
      // Aguardar um pouco para não interferir na inicialização
      const timer = setTimeout(() => {
        checkForUpdates();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [autoCheck, checkForUpdates]);

  // Mostrar notificação quando update estiver disponível
  useEffect(() => {
    if (showNotification && isUpdateAvailable && !isUpdatePending) {
      Toast.show({
        type: 'info',
        text1: 'Atualização Disponível',
        text2: 'Toque para baixar a nova versão',
        onPress: downloadAndInstallUpdate,
        visibilityTime: 8000,
      });
    }
  }, [isUpdateAvailable, isUpdatePending, showNotification, downloadAndInstallUpdate]);

  // Se não há updates, não renderizar nada
  if (!isUpdateAvailable && !isUpdatePending) {
    return null;
  }

  return (
    <View style={styles.container}>
      {isUpdateAvailable && !isUpdatePending && (
        <View style={styles.updateAvailable}>
          <Text style={styles.updateText}>Atualização Disponível</Text>
          {message && <Text style={styles.updateMessage}>{message}</Text>}
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadAndInstallUpdate}
            disabled={isDownloading || isChecking}
          >
            {isDownloading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Baixar Atualização</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {isUpdatePending && (
        <View style={styles.updatePending}>
          <Text style={styles.updateText}>Atualização Pronta</Text>
          <Text style={styles.updateMessage}>A atualização foi baixada e está pronta para instalação</Text>
          <TouchableOpacity
            style={styles.installButton}
            onPress={installPendingUpdate}
            disabled={isInstalling}
          >
            {isInstalling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Instalar Agora</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  updateAvailable: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  updatePending: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  updateMessage: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.9,
  },
  downloadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  installButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});






