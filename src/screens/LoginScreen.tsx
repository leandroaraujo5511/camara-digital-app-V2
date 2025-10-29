import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { colors } from '@/styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn } = useAuth();
  const { clearTenant } = useTenant();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      console.error(error);
      
      // Verificar se é erro de autorização de tenant
      if (error.message === 'TENANT_UNAUTHORIZED') {
        Alert.alert(
          'Acesso Negado',
          'Este usuário não está autorizado para acessar esta câmara municipal. Verifique se você está tentando acessar a câmara correta.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Limpar campos de login
                setEmail('');
                setPassword('');
                setErrors({});
              }
            }
          ]
        );
      } else {
        // Erro genérico de login
        Alert.alert(
          'Erro no Login',
          'Credenciais inválidas. Verifique seu e-mail e senha.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTenant = () => {
    Alert.alert(
      'Trocar de Câmara',
      'Deseja selecionar uma nova câmara municipal? Isso irá limpar seus dados de login.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Trocar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearTenant();
              // Limpar também os dados de autenticação
              setEmail('');
              setPassword('');
              setErrors({});
            } catch (error) {
              console.error('Erro ao trocar tenant:', error);
              Alert.alert('Erro', 'Não foi possível trocar de câmara. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Câmara Digital</Text>
            <Text style={styles.subtitle}>Sistema de Votação</Text>
            {/* <Text style={styles.description}>
              Acesse sua conta para participar das votações das pautas
            </Text> */}
          </View>

          {/* Botão discreto para trocar de tenant */}
          <View style={styles.tenantSwitchContainer}>
            <TouchableOpacity
              style={styles.discreteTenantButton}
              onPress={handleChangeTenant}
              activeOpacity={0.7}
            >
              <MaterialIcons name="swap-horiz" size={16} color={colors.slate[400]} />
              <Text style={styles.discreteTenantText}>Trocar Câmara</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Input
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Apenas vereadores autorizados podem acessar o sistema
            </Text>
            <Text style={styles.versionText}>
              v{Constants.expoConfig?.version || '1.0.2'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[900],
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.blue[500],
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.slate[400],

  },

  description: {
    fontSize: 16,
    color: colors.slate[400],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },

  form: {
    marginBottom: 32,
  },

  loginButton: {
    marginTop: 16,
  },

  footer: {
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: colors.slate[400],
    textAlign: 'center',
    lineHeight: 20,
  },

  // Estilos para botão discreto de troca de tenant
  tenantSwitchContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  discreteTenantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.slate[600],
  },

  discreteTenantText: {
    fontSize: 12,
    color: colors.slate[400],
    marginLeft: 4,
    fontWeight: '500',
  },

  versionText: {
    fontSize: 11,
    color: colors.slate[500],
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },

  testIndicator: {
    fontSize: 12,
    color: colors.orange[400],
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
});

