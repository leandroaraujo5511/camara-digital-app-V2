# 🔐 Teste de Login - Vereador Voting App

## 📱 Como Testar

### 1. **Credenciais de Teste**
Use estas credenciais para testar:
```
Email: vereador1@camaradigital.cloud
Senha: admin123
```

### 2. **Logs Esperados**
Quando o login funcionar, você deve ver no console:

```
🔧 API Config: { baseURL: 'http://192.168.18.96:3000', timeout: 10000, environment: 'development' }
🔐 Iniciando login para: vereador1@camaradigital.cloud
✅ Login bem-sucedido para usuário: Vendedor 1
🔍 Tentando buscar vereador via /vereadores/me
✅ Dados do vereador obtidos via /vereadores/me: [Nome do Vereador]
```

### 3. **Possíveis Cenários**

#### ✅ **Cenário 1: Tudo Funciona**
- Login bem-sucedido
- Dados do vereador obtidos
- Redirecionamento para Home

#### ⚠️ **Cenário 2: Login OK, Vereador Falha**
- Login bem-sucedido
- Endpoint `/vereadores/me` falha
- Endpoint `/vereadores/:id` falha
- Usa dados básicos do vereador
- Redirecionamento para Home

#### ❌ **Cenário 3: Login Falha**
- Erro de credenciais
- Erro de rede
- Erro de servidor

## 🔍 Debug

### **Verificar no Console:**
1. Abra o console do dispositivo/emulador
2. Procure por logs começando com 🔐, ✅, ⚠️, ❌
3. Verifique se a API está respondendo

### **Verificar na API:**
1. Teste no navegador: `http://192.168.18.96:3000/auth/login`
2. Verifique se a API está rodando
3. Confirme se o endpoint `/vereadores/me` existe

## 🛠️ Soluções Comuns

### **Problema: Network Error**
- Verifique se o IP está correto
- Confirme se a API está rodando
- Verifique firewall/rede

### **Problema: 401 Unauthorized**
- Token expirado
- Endpoint não existe
- Permissões insuficientes

### **Problema: 404 Not Found**
- Endpoint não existe
- ID do usuário incorreto
- Rota mal configurada

## 📋 Endpoints Testados

1. **POST** `/auth/login` - Login do usuário
2. **GET** `/vereadores/me` - Dados do vereador logado
3. **GET** `/vereadores/:id` - Dados de um vereador específico

## 🎯 Próximos Passos

1. **Teste o login** com as credenciais fornecidas
2. **Verifique os logs** no console
3. **Identifique qual endpoint** está falhando
4. **Configure a API** conforme necessário




