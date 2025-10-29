import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tenant } from '../interfaces';
import { tenantService } from '../services/tenant.service';

interface TenantContextData {
  selectedTenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  selectTenant: (tenant: Tenant) => Promise<void>;
  clearTenant: () => Promise<void>;
  loadTenants: () => Promise<void>;
  isTenantConfigured: boolean;
  backendStatus: 'checking' | 'online' | 'offline';
}

const TenantContext = createContext<TenantContextData>({} as TenantContextData);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    loadStoredTenant();
    checkBackendAndLoadTenants();
  }, []);

  const loadStoredTenant = async () => {
    try {
      const storedTenant = await AsyncStorage.getItem('@selected_tenant');
      if (storedTenant) {
        const tenant = JSON.parse(storedTenant);
        setSelectedTenant(tenant);
        console.log('🏛️ Tenant carregado do storage:', tenant.name);
      }
    } catch (error) {
      console.error('Erro ao carregar tenant do storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkBackendAndLoadTenants = async () => {
    try {
      setBackendStatus('checking');
      
      // Verificar se o backend principal está online
      const isBackendOnline = await tenantService.checkBackendStatus();
      
      if (isBackendOnline) {
        console.log('✅ Backend principal está online');
        setBackendStatus('online');
        
        // Carregar tenants da API
        await loadTenants();
      } else {
        console.log('⚠️ Backend principal está offline, usando dados padrão');
        setBackendStatus('offline');
        
        // Carregar tenants padrão
        await loadTenants();
      }
    } catch (error) {
      console.error('Erro ao verificar backend:', error);
      setBackendStatus('offline');
      await loadTenants();
    }
  };

  const loadTenants = async () => {
    try {
      const tenantsList = await tenantService.getTenants();
      console.log('📋 Tenants carregados:', tenantsList);
      setTenants(tenantsList);
      console.log('📋 Tenants carregados:', tenantsList.length);
    } catch (error) {
      console.error('Erro ao carregar lista de tenants:', error);
    }
  };

  const selectTenant = async (tenant: Tenant) => {
    try {
      console.log(`🔍 Selecionando tenant: ${tenant.name}`);
      
      // Verificar se o tenant está ativo
      const isActive = await tenantService.checkTenantStatus(tenant.subdomain);
      
      if (!isActive) {
        throw new Error(`Tenant ${tenant.name} não está ativo ou acessível`);
      }

      // Salvar no storage
      await AsyncStorage.setItem('@selected_tenant', JSON.stringify(tenant));
      setSelectedTenant(tenant);
      
      console.log('✅ Tenant selecionado:', tenant.name);
      console.log('🔗 URL da API:', tenantService.generateApiUrl(tenant.subdomain));
      
    } catch (error: any) {
      console.error('Erro ao selecionar tenant:', error);
      throw error;
    }
  };

  const clearTenant = async () => {
    try {
      await AsyncStorage.removeItem('@selected_tenant');
      setSelectedTenant(null);
      console.log('🗑️ Tenant removido');
    } catch (error) {
      console.error('Erro ao remover tenant:', error);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        selectedTenant,
        tenants,
        isLoading,
        selectTenant,
        clearTenant,
        loadTenants,
        isTenantConfigured: !!selectedTenant,
        backendStatus,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextData => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider');
  }
  return context;
};
