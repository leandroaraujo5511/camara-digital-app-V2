import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { colors } from '../styles/colors';

const { width, height } = Dimensions.get('window');

interface PautaSideSheetProps {
  visible: boolean;
  onClose: () => void;
  pautaUrl?: string;
  pautaTitle?: string;
}

export const PautaSideSheet: React.FC<PautaSideSheetProps> = ({
  visible,
  onClose,
  pautaUrl,
  pautaTitle = 'Pauta da Sessão'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleWebViewLoad = () => {
    console.log('PDF carregado via WebView');
    setLoading(false);
    setError(false);
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('Erro ao carregar PDF:', nativeEvent);
    setLoading(false);
    setError(true);
    Alert.alert('Erro', 'Não foi possível carregar o PDF da pauta');
  };

  const handleClose = () => {
    setLoading(true);
    setError(false);
    onClose();
  };

  // Usar apenas URL real da pauta - não mostrar PDF de exemplo
  const pdfUrl = pautaUrl;
  
  // Se não houver URL, não renderizar o componente
  if (!pdfUrl) {
    return null;
  }
  
  // Criar URL do Google Docs Viewer para visualizar PDF
  // Alternativa: usar PDF.js viewer se o Google Docs não funcionar
  const googleDocsViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
  const pdfJsViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
  
  // Usar Google Docs como primeira opção, PDF.js como fallback
  const viewerUrl = googleDocsViewerUrl;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="description" size={24} color={colors.blue[500]} />
            <Text style={styles.headerTitle}>{pautaTitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={24} color={colors.slate[400]} />
          </TouchableOpacity>
        </View>

        {/* PDF Content */}
        <View style={styles.pdfContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.blue[500]} />
              <Text style={styles.loadingText}>Carregando pauta...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={64} color={colors.red[500]} />
              <Text style={styles.errorTitle}>Erro ao carregar PDF</Text>
              <Text style={styles.errorText}>
                Não foi possível carregar o PDF da pauta. Verifique sua conexão e tente novamente.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setLoading(true);
                  setError(false);
                }}
                activeOpacity={0.7}
              >
                <MaterialIcons name="refresh" size={20} color={colors.blue[500]} />
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          )}

          {!error && (
            <WebView
              source={{ uri: viewerUrl }}
              onLoad={handleWebViewLoad}
              onError={handleWebViewError}
              style={styles.pdf}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.blue[500]} />
                  <Text style={styles.loadingText}>Carregando pauta...</Text>
                </View>
              )}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
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
  pdfContainer: {
    flex: 1,
    backgroundColor: colors.slate[100],
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: height -60, // Apenas header mínimo
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.slate[100],
  },
  loadingText: {
    fontSize: 16,
    color: colors.slate[600],
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.slate[100],
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.slate[800],
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.slate[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blue[50],
    borderWidth: 1,
    borderColor: colors.blue[500],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.blue[500],
    marginLeft: 8,
  },
});
