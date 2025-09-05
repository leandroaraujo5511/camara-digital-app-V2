# Validação de Autorização de Tenant

## Problema Identificado

Usuários conseguiam fazer login com credenciais válidas, mas quando a API `/me` retornava erro 403 (usuário não autorizado para o tenant), o app mostrava um alerta genérico "Não é possível carregar os dados".

### Cenário do Problema
- **Usuário**: `vereador1@camaradigital.tech`
- **Tenant Original**: `veramendes`
- **Tenant Incorreto**: `domexpeditolopes`
- **Resultado**: Login bem-sucedido, mas erro 403 na API `/me`

## Solução Implementada

### 1. **Detecção de Erro 403 no Serviço de Autenticação**

#### **auth.service.ts**
```typescript
async getVereadorData(userId: string): Promise<Vereador> {
  try {
    // Tentar endpoint /vereadores/me
    const vereadorResponse = await api.get('/vereadores/me');
    // ... código de sucesso
  } catch (error1: any) {
    // Verificar se é erro 403 (usuário não autorizado para este tenant)
    if (error1.response?.status === 403) {
      console.error('❌ Usuário não autorizado para este tenant');
      throw new Error('TENANT_UNAUTHORIZED');
    }
    
    try {
      // Tentar endpoint alternativo /vereadores/:id
      const vereadorResponse = await api.get(`/vereadores/${userId}`);
      // ... código de sucesso
    } catch (error2: any) {
      // Verificar se é erro 403 (usuário não autorizado para este tenant)
      if (error2.response?.status === 403) {
        console.error('❌ Usuário não autorizado para este tenant');
        throw new Error('TENANT_UNAUTHORIZED');
      }
    }
  }
}
```

### 2. **Limpeza Automática do Storage**

#### **AuthContext.tsx**
```typescript
const signIn = async (email: string, password: string) => {
  try {
    // ... processo de login
    const vereador = await authService.getVereadorData(response.user.id);
    // ... salvar dados
  } catch (error: any) {
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
  }
};
```

### 3. **Feedback Específico para o Usuário**

#### **LoginScreen.tsx**
```typescript
const handleLogin = async () => {
  try {
    await signIn(email, password);
  } catch (error: any) {
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
  }
};
```

## Funcionalidades Implementadas

### 1. **Detecção Inteligente de Erro 403**
- ✅ **Verificação Dupla**: Testa ambos os endpoints `/vereadores/me` e `/vereadores/:id`
- ✅ **Identificação Específica**: Detecta erro 403 e lança `TENANT_UNAUTHORIZED`
- ✅ **Logs Detalhados**: Console logs para debugging

### 2. **Limpeza Automática de Dados**
- ✅ **Storage Limpo**: Remove token, dados do usuário e vereador
- ✅ **Estado Resetado**: Limpa estado do contexto de autenticação
- ✅ **Prevenção de Conflitos**: Evita dados inconsistentes

### 3. **Feedback Claro para o Usuário**
- ✅ **Mensagem Específica**: "Acesso Negado" em vez de erro genérico
- ✅ **Explicação Clara**: Informa que o usuário não está autorizado para a câmara
- ✅ **Orientação**: Sugere verificar se está na câmara correta
- ✅ **Limpeza de Campos**: Remove dados do formulário após confirmação

### 4. **Experiência do Usuário Melhorada**
- ✅ **Feedback Imediato**: Erro detectado e tratado no momento do login
- ✅ **Interface Limpa**: Campos são limpos automaticamente
- ✅ **Orientação Clara**: Usuário sabe exatamente o que fazer

## Fluxo de Funcionamento

### **Cenário de Erro 403**
```
1. Usuário faz login com credenciais válidas
2. Login é bem-sucedido (token obtido)
3. Sistema tenta buscar dados do vereador via /vereadores/me
4. API retorna 403 (usuário não autorizado para este tenant)
5. Sistema detecta erro 403 e lança TENANT_UNAUTHORIZED
6. AuthContext limpa automaticamente o storage
7. LoginScreen exibe alerta específico "Acesso Negado"
8. Usuário clica "OK" e campos são limpos
9. Usuário pode tentar com outro tenant ou credenciais
```

### **Cenário de Sucesso**
```
1. Usuário faz login com credenciais válidas
2. Login é bem-sucedido (token obtido)
3. Sistema busca dados do vereador via /vereadores/me
4. API retorna dados do vereador
5. Usuário é redirecionado para a tela principal
```

## Vantagens da Implementação

### 1. **Segurança**
- ✅ **Detecção Precoce**: Erro detectado antes de acessar funcionalidades
- ✅ **Limpeza Automática**: Dados sensíveis são removidos automaticamente
- ✅ **Prevenção de Acesso**: Usuário não consegue acessar dados de outro tenant

### 2. **Experiência do Usuário**
- ✅ **Feedback Claro**: Usuário entende exatamente o problema
- ✅ **Orientação Útil**: Sabe que deve verificar a câmara selecionada
- ✅ **Interface Limpa**: Campos são limpos automaticamente

### 3. **Manutenibilidade**
- ✅ **Código Limpo**: Tratamento específico para cada tipo de erro
- ✅ **Logs Detalhados**: Facilita debugging e monitoramento
- ✅ **Reutilização**: Lógica pode ser aplicada em outros contextos

## Casos de Uso

### 1. **Vereador em Câmara Errada**
- Usuário seleciona câmara incorreta
- Faz login com credenciais válidas
- Recebe feedback claro sobre o problema
- Pode trocar de câmara facilmente

### 2. **Mudança de Câmara**
- Vereador mudou de câmara
- Tenta acessar câmara antiga
- Recebe orientação para verificar câmara correta
- Pode selecionar nova câmara

### 3. **Teste de Segurança**
- Desenvolvedor testa com usuário de outro tenant
- Sistema detecta e bloqueia acesso
- Dados são limpos automaticamente
- Segurança é mantida

## Testes Recomendados

### 1. **Teste de Erro 403**
- Fazer login com usuário de tenant A
- Selecionar tenant B
- Verificar se erro é detectado
- Confirmar limpeza de dados

### 2. **Teste de Feedback**
- Verificar se alerta específico é exibido
- Confirmar limpeza de campos após "OK"
- Testar se usuário pode tentar novamente

### 3. **Teste de Limpeza**
- Verificar se storage é limpo
- Confirmar se estado é resetado
- Testar se não há dados residuais

## Conclusão

A validação de autorização de tenant foi implementada com sucesso, proporcionando:

- ✅ **Detecção Precoce** de erros de autorização
- ✅ **Feedback Claro** para o usuário
- ✅ **Limpeza Automática** de dados sensíveis
- ✅ **Experiência Melhorada** com orientações úteis
- ✅ **Segurança Mantida** com prevenção de acessos indevidos

O sistema agora trata adequadamente o cenário onde um usuário válido tenta acessar um tenant para o qual não tem autorização, fornecendo feedback claro e mantendo a segurança dos dados.
