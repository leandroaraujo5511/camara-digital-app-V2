# 🏛️ Sistema Multi-Tenancy - Vereador Voting App

## 📋 Visão Geral

O app agora implementa um sistema completo de **multi-tenancy** que permite que vereadores de diferentes câmaras municipais usem o mesmo aplicativo, cada um conectado ao seu respectivo tenant.

## 🔄 Fluxo de Funcionamento

### **1. Primeira Abertura do App**
```
App Inicia → Verifica Tenant → NÃO ENCONTRADO → Tela de Seleção de Tenant
```

### **2. Seleção de Tenant**
```
Usuário Seleciona Câmara → Verifica Status → Salva no Storage → Redireciona para Login
```

### **3. Login e Uso**
```
Login → API usa URL do Tenant → Funcionalidades do App
```

## 🏗️ Arquitetura

### **Contextos**
- **TenantContext**: Gerencia seleção e configuração do tenant
- **AuthContext**: Gerencia autenticação do usuário

### **Serviços**
- **tenant.service.ts**: Busca lista de tenants e verifica status
- **auth.service.ts**: Autenticação e busca de dados do vereador
- **voting.service.ts**: Operações de votação

### **Configuração da API**
- **api.ts**: URL dinâmica baseada no tenant selecionado
- **config/api.ts**: Configurações e geração de URLs

## 📱 Telas

### **TenantSelectionScreen**
- Lista de câmaras disponíveis
- Seleção intuitiva com cards visuais
- Verificação de status do tenant
- Salvamento automático da escolha

### **LoginScreen**
- Autenticação específica do tenant
- Validação de credenciais
- Tratamento de erros

### **HomeScreen**
- Funcionalidades específicas do tenant
- Dados personalizados da câmara

## 🔧 Configuração

### **Desenvolvimento Local**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_HOST: '192.168.18.96:3000', // IP da sua máquina
  TIMEOUT: 10000,
};
```

### **Produção**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_HOST: 'api.camaradigital.com.br', // Domínio de produção
  TIMEOUT: 15000,
};
```

## 🌐 URLs da API

### **Formato das URLs**
```
http://[subdomain].[host]:[porta]

Exemplos:
- http://veramendes.192.168.18.96:3000
- http://verapetropolis.192.168.18.96:3000
- http://veraniteroi.192.168.18.96:3000
```

### **Endpoints Suportados**
- `POST /auth/login` - Login do vereador
- `GET /vereadores/me` - Dados do vereador logado
- `GET /pautas` - Lista de pautas
- `GET /votacoes` - Lista de votações
- `POST /votes` - Registrar voto

## 💾 Armazenamento Local

### **Chaves do AsyncStorage**
```typescript
'@selected_tenant'     // Dados do tenant selecionado
'@auth_token'          // Token de autenticação
'@user_data'           // Dados do usuário
'@vereador_data'       // Dados do vereador
```

### **Persistência**
- Tenant selecionado é salvo permanentemente
- Não é solicitado novamente até ser removido
- Funciona offline (dados salvos localmente)

## 🎯 Casos de Uso

### **Cenário 1: Primeira Vez**
1. App abre
2. Mostra lista de câmaras disponíveis
3. Usuário seleciona sua câmara
4. App salva a escolha
5. Redireciona para login

### **Cenário 2: Uso Normal**
1. App abre
2. Detecta tenant configurado
3. Redireciona para login (se não autenticado)
4. Funciona normalmente

### **Cenário 3: Troca de Tenant**
1. Usuário remove dados do storage
2. App volta para seleção de tenant
3. Novo tenant é configurado

## 🔍 Debug e Logs

### **Logs do Console**
```
🔧 API Config: { baseHost: '192.168.18.96:3000', ... }
🏛️ Tenant carregado do storage: Câmara Municipal de Mendes
📋 Tenants carregados: 3
✅ Tenant selecionado: Câmara Municipal de Mendes
🔗 URL da API: http://veramendes.192.168.18.96:3000
🔄 API URL atualizada
```

### **Verificação de Status**
- Cada tenant é verificado antes da seleção
- Endpoint `/health` é chamado para validação
- Fallback para dados mock em caso de falha

## 🚀 Implementação

### **1. Instalação**
```bash
npm install
```

### **2. Configuração**
- Ajuste o `BASE_HOST` em `src/config/api.ts`
- Configure os tenants em `src/services/tenant.service.ts`

### **3. Execução**
```bash
npm start
```

## 📊 Benefícios

### **Para Desenvolvedores**
- ✅ Código único para múltiplas câmaras
- ✅ Fácil manutenção e atualizações
- ✅ Sistema escalável

### **Para Usuários**
- ✅ App personalizado para sua câmara
- ✅ Dados isolados e seguros
- ✅ Experiência consistente

### **Para Câmaras**
- ✅ Implementação rápida
- ✅ Custos reduzidos
- ✅ Padrão unificado

## 🔮 Próximos Passos

### **Funcionalidades Futuras**
1. **Sincronização**: Dados offline/online
2. **Notificações**: Push para votações urgentes
3. **Relatórios**: Estatísticas de votação
4. **Integração**: APIs de terceiros

### **Melhorias Técnicas**
1. **Cache**: Otimização de performance
2. **Segurança**: Criptografia adicional
3. **Monitoramento**: Logs e métricas
4. **Testes**: Cobertura completa

---

**🎉 Sistema Multi-Tenancy Implementado com Sucesso!**

O app agora suporta múltiplas câmaras municipais de forma elegante e eficiente.




