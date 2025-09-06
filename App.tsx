import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { TenantProvider, useTenant } from './src/contexts/TenantContext';
import { VotacaoProvider } from './src/contexts/VotacaoContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { VotingScreen } from './src/screens/VotingScreen';
import VotacaoScreen from './src/screens/VotacaoScreen';
import { TenantSelectionScreen } from './src/screens/TenantSelectionScreen';
import { UpdateManager } from './src/components/UpdateManager';

type RootStackParamList = {
  TenantSelection: undefined;
  Login: undefined;
  Home: undefined;
  Voting: { votacaoId: string };
  Votacao: { votacaoId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isTenantConfigured, isLoading: tenantLoading } = useTenant();

  // Mostrar loading enquanto carrega as configurações
  if (authLoading || tenantLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isTenantConfigured ? (
        // Primeira vez: seleção de tenant
        <Stack.Screen name="TenantSelection" component={TenantSelectionScreen} />
      ) : !isAuthenticated ? (
        // Tenant configurado mas não autenticado
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Autenticado e com tenant configurado
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Voting" component={VotingScreen} />
          <Stack.Screen name="Votacao" component={VotacaoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <VotacaoProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
            <UpdateManager autoCheck={true} showNotification={true} />
          </NavigationContainer>
        </VotacaoProvider>
      </AuthProvider>
    </TenantProvider>
  );
}

