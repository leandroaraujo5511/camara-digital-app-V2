import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTenant } from '../contexts/TenantContext';
import { Tenant } from '../interfaces';
import { colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

export const TenantSelectionScreen: React.FC = () => {
  const { tenants, isLoading, selectTenant , loadTenants } = useTenant();
  const [selectingTenant, setSelectingTenant] = useState<string | null>(null);
  console.log ('tenants', tenants);

  const handleTenantSelection = async (tenant: Tenant) => {
    try {
      setSelectingTenant(tenant.id);
      await selectTenant(tenant);
      Alert.alert(
        'Tenant Selecionado',
        `Você está conectado à ${tenant.name}`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro',
        `Não foi possível conectar ao tenant: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setSelectingTenant(null);
    }
  };

  const renderTenantCard = (tenant: Tenant) => {
    const isSelecting = selectingTenant === tenant.id;
    
    return (
      <TouchableOpacity
        key={tenant.id}
        style={styles.tenantCard}
        onPress={() => handleTenantSelection(tenant)}
        disabled={isSelecting}
      >
        <View style={styles.tenantHeader}>
          <View style={styles.tenantIcon}>
            <Text style={styles.tenantIconText}>
              {tenant.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.tenantInfo}>
            <Text style={styles.tenantName}>{tenant.name}</Text>
            <Text style={styles.tenantLocation}>
              {tenant.city} - {tenant.state}
            </Text>
            <Text style={styles.tenantSubdomain}>
              {tenant.subdomain}.camaradigital.cloud
            </Text>
          </View>
        </View>

        <View style={styles.tenantStatus}>
          <View style={[styles.statusBadge, { backgroundColor: colors.green[500] }]}>
            <Text style={styles.statusText}>Ativo</Text>
          </View>
        </View>

        {isSelecting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={colors.slate[100]} />
            <Text style={styles.loadingText}>Conectando...</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue[500]} />
          <Text style={styles.loadingText}>Carregando câmaras disponíveis...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecione sua Câmara</Text>
          <Text style={styles.subtitle}>
            Escolha a câmara municipal para a qual você trabalha
          </Text>
        </View>

        <View style={styles.tenantsList}>
          {tenants?.length > 0 ? tenants?.map(renderTenantCard) : <View style={styles.noTenantsContainer}>
            <Text style={styles.noTenantsText}>Nenhuma câmara disponível</Text>
            <TouchableOpacity style={styles.noTenantsButton} onPress={loadTenants}>
              <Ionicons name="refresh" size={24} color={colors.slate[100]} />
            </TouchableOpacity>
          </View>}
        </View>

        <View style={styles.footer}>
          {tenants?.length > 0 ? <Text style={styles.footerText}>
            Esta seleção será salva no seu dispositivo e não será solicitada novamente
          </Text>
          : <View style={styles.noTenantsContainer}/>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[900],
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
    color: colors.slate[400],
    marginTop: 16,
  },

  header: {
    padding: 24,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.slate[100],
    marginBottom: 12,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: colors.slate[400],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },

  tenantsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  tenantCard: {
    backgroundColor: colors.slate[800],
    borderRadius: 16,
    padding: 20,
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
    position: 'relative',
  },

  tenantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  noTenantsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTenantsText: {
    fontSize: 16,
    color: colors.slate[400],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  noTenantsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.slate[600],
    marginTop: 16,
  },
  noTenantsButtonText: {
    fontSize: 16,
    color: colors.slate[100],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  tenantIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.blue[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  tenantIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.slate[100],
  },

  tenantInfo: {
    flex: 1,
  },

  tenantName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[100],
    marginBottom: 4,
  },

  tenantLocation: {
    fontSize: 14,
    color: colors.slate[400],
    marginBottom: 2,
  },

  tenantSubdomain: {
    fontSize: 12,
    color: colors.blue[500],
    fontWeight: '600',
  },

  tenantStatus: {
    alignItems: 'flex-end',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate[100],
    textTransform: 'uppercase',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },

  footer: {
    padding: 24,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: colors.slate[400],
    textAlign: 'center',
    lineHeight: 20,
  },
});

