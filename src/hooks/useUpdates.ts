import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { Alert, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

interface UpdateInfo {
  isUpdateAvailable: boolean;
  isUpdatePending: boolean;
  isChecking: boolean;
  isDownloading: boolean;
  isInstalling: boolean;
  updateId?: string;
  createdAt?: string;
  message?: string;
}

export const useUpdates = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    isUpdateAvailable: false,
    isUpdatePending: false,
    isChecking: false,
    isDownloading: false,
    isInstalling: false,
  });

  // Verificar se há updates disponíveis
  const checkForUpdates = async () => {
    if (!Updates.isEnabled) {
      console.log('Updates não estão habilitados');
      return;
    }

    try {
      setUpdateInfo(prev => ({ ...prev, isChecking: true }));
      
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        setUpdateInfo(prev => ({
          ...prev,
          isUpdateAvailable: true,
          updateId: update.manifest?.id,
          createdAt: update.manifest?.createdAt,
          message: update.manifest?.message,
        }));

        // Mostrar notificação de update disponível
        Toast.show({
          type: 'info',
          text1: 'Atualização Disponível',
          text2: 'Uma nova versão do app está disponível',
          visibilityTime: 5000,
        });
      } else {
        setUpdateInfo(prev => ({
          ...prev,
          isUpdateAvailable: false,
        }));
      }
    } catch (error) {
      console.error('Erro ao verificar updates:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao Verificar Updates',
        text2: 'Não foi possível verificar atualizações',
      });
    } finally {
      setUpdateInfo(prev => ({ ...prev, isChecking: false }));
    }
  };

  // Baixar e instalar update
  const downloadAndInstallUpdate = async () => {
    if (!Updates.isEnabled) {
      console.log('Updates não estão habilitados');
      return;
    }

    try {
      setUpdateInfo(prev => ({ ...prev, isDownloading: true }));

      const update = await Updates.fetchUpdateAsync();
      
      if (update.isNew) {
        setUpdateInfo(prev => ({ ...prev, isUpdatePending: true }));
        
        // Mostrar confirmação para instalar
        Alert.alert(
          'Atualização Pronta',
          'A atualização foi baixada. Deseja instalar agora? O app será reiniciado.',
          [
            {
              text: 'Depois',
              style: 'cancel',
            },
            {
              text: 'Instalar Agora',
              onPress: async () => {
                try {
                  setUpdateInfo(prev => ({ ...prev, isInstalling: true }));
                  await Updates.reloadAsync();
                } catch (error) {
                  console.error('Erro ao instalar update:', error);
                  Toast.show({
                    type: 'error',
                    text1: 'Erro ao Instalar',
                    text2: 'Não foi possível instalar a atualização',
                  });
                  setUpdateInfo(prev => ({ ...prev, isInstalling: false }));
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao baixar update:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao Baixar Update',
        text2: 'Não foi possível baixar a atualização',
      });
    } finally {
      setUpdateInfo(prev => ({ ...prev, isDownloading: false }));
    }
  };

  // Instalar update pendente
  const installPendingUpdate = async () => {
    if (!Updates.isEnabled) {
      console.log('Updates não estão habilitados');
      return;
    }

    try {
      setUpdateInfo(prev => ({ ...prev, isInstalling: true }));
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Erro ao instalar update pendente:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao Instalar',
        text2: 'Não foi possível instalar a atualização',
      });
      setUpdateInfo(prev => ({ ...prev, isInstalling: false }));
    }
  };

  // Verificar se há update pendente na inicialização
  useEffect(() => {
    const checkPendingUpdate = async () => {
      if (!Updates.isEnabled) {
        return;
      }

      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setUpdateInfo(prev => ({
            ...prev,
            isUpdateAvailable: true,
            updateId: update.manifest?.id,
            createdAt: update.manifest?.createdAt,
            message: update.manifest?.message,
          }));
        }
      } catch (error) {
        console.error('Erro ao verificar update pendente:', error);
      }
    };

    checkPendingUpdate();
  }, []);

  return {
    ...updateInfo,
    checkForUpdates,
    downloadAndInstallUpdate,
    installPendingUpdate,
  };
};
