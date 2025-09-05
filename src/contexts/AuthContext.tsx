import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Vereador } from '../interfaces';
import { authService } from '../services/auth.service';
import { updateApiUrl } from '../lib/api';

interface AuthContextData {
  user: User | null;
  vereador: Vereador | null;
  isLoading: boolean;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vereador, setVereador] = useState<Vereador | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedUser, storedVereador, storedToken] = await Promise.all([
        AsyncStorage.getItem('@user_data'),
        AsyncStorage.getItem('@vereador_data'),
        AsyncStorage.getItem('@auth_token'),
      ]);

      if (storedUser && storedVereador && storedToken) {
        setUser(JSON.parse(storedUser));
        setVereador(JSON.parse(storedVereador));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Erro ao carregar dados armazenados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Primeiro, fazer login para obter o token
      const response = await authService.signIn(email, password);
      
      // Salvar o token imediatamente após o login
      await AsyncStorage.setItem('@auth_token', response.token);
      await AsyncStorage.setItem('@user_data', JSON.stringify(response.user));
      
      // Agora atualizar a URL da API (com o token já salvo)
      await updateApiUrl();
      
      // Buscar dados do vereador com o token já salvo
      const vereador = await authService.getVereadorData(response.user.id);
      await AsyncStorage.setItem('@vereador_data', JSON.stringify(vereador));
      
      setUser(response.user);
      setVereador(vereador);
      setToken(response.token);
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Se for erro de tenant não autorizado, limpar storage
      if (error.message === 'TENANT_UNAUTHORIZED') {
        console.log('🧹 Limpando storage devido a erro de autorização de tenant');
        await AsyncStorage.multiRemove([
          '@auth_token',
          '@user_data',
          '@vereador_data',
        ]);
        setUser(null);
        setVereador(null);
        setToken(null);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@auth_token',
        '@user_data',
        '@vereador_data',
      ]);
      
      setUser(null);
      setVereador(null);
      setToken(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        vereador,
        isLoading,
        token,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
