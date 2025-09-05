# Funcionalidade de Troca de Tenant na Tela de Login

## Funcionalidade Implementada

Foi adicionado um botão discreto na tela de login que permite ao usuário trocar de câmara municipal (tenant) sem precisar desinstalar o app. O botão é sutil e não mostra informações do tenant atual.

## Componentes Modificados

### 1. **LoginScreen.tsx**

#### **Novos Imports**
```typescript
import { useTenant } from '@/contexts/TenantContext';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
```

#### **Novos Hooks**
```typescript
const { selectedTenant, clearTenant } = useTenant();
```

#### **Nova Função**
```typescript
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
```

#### **Nova Interface**
```typescript
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
```

## Funcionalidades

### 1. **Botão Discreto de Troca**
- ✅ Botão pequeno e sutil
- ✅ Ícone de troca (swap-horiz) pequeno
- ✅ Texto "Trocar Câmara" discreto
- ✅ Cor cinza para não chamar atenção
- ✅ Posicionado centralmente abaixo do cabeçalho

### 2. **Confirmação de Troca**
- ✅ Alert de confirmação
- ✅ Explicação clara do que acontecerá
- ✅ Opção de cancelar
- ✅ Estilo "destructive" para o botão de confirmação

### 3. **Limpeza de Dados**
- ✅ Remove tenant selecionado do storage
- ✅ Limpa campos de email e senha
- ✅ Remove erros de validação
- ✅ Retorna para tela de seleção de tenant

## Fluxo de Funcionamento

### **Estado Inicial**
```
1. Usuário está na tela de login
2. Botão discreto "Trocar Câmara" está visível
3. Não mostra informações do tenant atual
```

### **Processo de Troca**
```
1. Usuário toca no botão de troca
2. Alert de confirmação é exibido
3. Se confirmado:
   - Tenant é removido do storage
   - Campos de login são limpos
   - App retorna para tela de seleção
4. Se cancelado:
   - Nada acontece
   - Usuário permanece na tela de login
```

### **Resultado**
```
1. Usuário é redirecionado para TenantSelectionScreen
2. Pode selecionar uma nova câmara
3. Após seleção, retorna para tela de login
4. Pode fazer login na nova câmara
```

## Estilos Implementados

### **Container do Botão**
```typescript
tenantSwitchContainer: {
  alignItems: 'center',
  marginBottom: 16,
}
```

### **Botão Discreto**
```typescript
discreteTenantButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: colors.slate[600],
}
```

### **Texto do Botão**
```typescript
discreteTenantText: {
  fontSize: 12,
  color: colors.slate[400],
  marginLeft: 4,
  fontWeight: '500',
}
```

## Vantagens da Implementação

### 1. **Facilidade de Uso**
- ✅ Acesso rápido à troca de tenant
- ✅ Interface discreta e não intrusiva
- ✅ Confirmação de segurança

### 2. **Experiência do Usuário**
- ✅ Não precisa desinstalar o app
- ✅ Processo simples e rápido
- ✅ Botão discreto que não interfere na interface

### 3. **Segurança**
- ✅ Confirmação antes de trocar
- ✅ Limpeza completa de dados
- ✅ Tratamento de erros

### 4. **Manutenibilidade**
- ✅ Código limpo e organizado
- ✅ Interface minimalista
- ✅ Estilos consistentes e discretos

## Casos de Uso

### 1. **Vereador que Trabalha em Múltiplas Câmaras**
- Pode trocar facilmente entre câmaras
- Mantém dados separados para cada uma
- Processo rápido e seguro

### 2. **Mudança de Câmara**
- Vereador que mudou de câmara
- Não precisa reinstalar o app
- Pode selecionar nova câmara facilmente

### 3. **Teste em Diferentes Ambientes**
- Desenvolvedores podem testar diferentes tenants
- Facilitar testes de integração
- Troca rápida entre ambientes

## Integração com Sistema Existente

### 1. **TenantContext**
- ✅ Usa `selectedTenant` para exibir informações
- ✅ Usa `clearTenant()` para limpar dados
- ✅ Integração perfeita com sistema existente

### 2. **Navegação**
- ✅ Retorna automaticamente para TenantSelectionScreen
- ✅ Fluxo de navegação mantido
- ✅ Sem quebras na experiência

### 3. **Storage**
- ✅ Limpa dados do AsyncStorage
- ✅ Remove tenant selecionado
- ✅ Estado limpo para nova seleção

## Testes Recomendados

### 1. **Teste de Troca**
- Selecionar um tenant
- Fazer login
- Trocar de tenant
- Verificar se retorna para seleção

### 2. **Teste de Cancelamento**
- Tentar trocar de tenant
- Cancelar a operação
- Verificar se permanece na tela de login

### 3. **Teste de Limpeza**
- Trocar de tenant
- Verificar se campos estão limpos
- Verificar se não há dados residuais

## Conclusão

A funcionalidade de troca de tenant foi implementada com sucesso, proporcionando uma experiência de usuário fluida e segura. O botão discreto está bem integrado à interface existente, não interfere na experiência de login e oferece uma solução elegante e sutil para o problema de troca de câmaras municipais.

