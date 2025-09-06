# 🚀 Rotas Públicas Necessárias no Backend

## 📋 Visão Geral

Para que o sistema de multi-tenancy funcione corretamente, o backend precisa expor algumas rotas **públicas** (sem autenticação) para permitir que o app descubra e valide tenants antes do login.

## 🔓 Rotas Públicas Obrigatórias

### **1. Rota Principal (Sem Subdomínio)**

#### **GET /public/tenants**
```http
GET http://192.168.18.96:3000/public/tenants
```

**Resposta Esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "veramendes",
      "subdomain": "veramendes",
      "name": "Câmara Municipal de Mendes",
      "city": "Mendes",
      "state": "RJ",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### **GET /public/health**
```http
GET http://192.168.18.96:3000/public/health
```

**Resposta Esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### **2. Rotas por Tenant (Com Subdomínio)**

#### **GET /public/health** (por tenant)
```http
GET http://veramendes.192.168.18.96:3000/public/health
GET http://verapetropolis.192.168.18.96:3000/public/health
GET http://veraniteroi.192.168.18.96:3000/public/health
```

**Resposta Esperada:**
```json
{
  "status": "ok",
  "tenant": "veramendes",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Rotas Protegidas (Com Autenticação)

### **Autenticação**
```http
POST http://veramendes.192.168.18.96:3000/auth/login
```

### **Dados do Vereador**
```http
GET http://veramendes.192.168.18.96:3000/vereadores/me
GET http://veramendes.192.168.18.96:3000/vereadores/:id
```

### **Pautas e Votações**
```http
GET http://veramendes.192.168.18.96:3000/pautas
GET http://veramendes.192.168.18.96:3000/votacoes
POST http://veramendes.192.168.18.96:3000/votes
PUT http://veramendes.192.168.18.96:3000/votes/:id
```

## 🏗️ Estrutura de URLs

### **Formato Geral**
```
http://[subdomain].[host]:[porta]/[endpoint]
```

### **Exemplos Práticos**
```
# Backend principal (sem subdomínio)
http://192.168.18.96:3000/public/tenants
http://192.168.18.96:3000/public/health

# Tenant específico
http://veramendes.192.168.18.96:3000/public/health
http://veramendes.192.168.18.96:3000/auth/login
http://veramendes.192.168.18.96:3000/vereadores/me
```

## ⚠️ Importante: Segurança

### **Rotas Públicas (Sem Autenticação)**
- ✅ `/public/tenants` - Lista de tenants disponíveis
- ✅ `/public/health` - Status de saúde do sistema

### **Rotas Protegidas (Com Autenticação)**
- 🔒 `/auth/*` - Autenticação e autorização
- 🔒 `/vereadores/*` - Dados dos vereadores
- 🔒 `/pautas/*` - Pautas e documentos
- 🔒 `/votacoes/*` - Votações
- 🔒 `/votes/*` - Votos registrados

## 🚀 Implementação no Backend

### **1. Middleware de Autenticação**
```javascript
// middleware/auth.js
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  // Validar token...
  next();
};
```

### **2. Rotas Públicas**
```javascript
// routes/public.js
router.get('/public/tenants', async (req, res) => {
  // Retornar lista de tenants ativos
});

router.get('/public/health', async (req, res) => {
  // Retornar status de saúde
});
```

### **3. Rotas Protegidas**
```javascript
// routes/auth.js
router.post('/auth/login', async (req, res) => {
  // Login sem autenticação
});

// routes/vereadores.js
router.get('/vereadores/me', requireAuth, async (req, res) => {
  // Dados do vereador logado
});
```

## 🔍 Teste das Rotas

### **1. Testar Backend Principal**
```bash
curl http://192.168.18.96:3000/public/health
curl http://192.168.18.96:3000/public/tenants
```

### **2. Testar Tenant Específico**
```bash
curl http://veramendes.192.168.18.96:3000/public/health
curl http://veramendes.192.168.18.96:3000/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"123"}'
```

## 📱 Como o App Usa Essas Rotas

### **1. Primeira Abertura**
```
App → GET /public/tenants → Lista de câmaras → Seleção do usuário
```

### **2. Validação do Tenant**
```
App → GET /public/health (tenant específico) → Verifica se está ativo
```

### **3. Login**
```
App → POST /auth/login (tenant específico) → Autenticação
```

### **4. Uso Normal**
```
App → Todas as outras rotas (com token de autenticação)
```

## 🎯 Resumo

**Para o sistema funcionar, você precisa implementar no backend:**

1. ✅ **`GET /public/tenants`** - Lista de tenants (sem auth)
2. ✅ **`GET /public/health`** - Health check (sem auth)
3. ✅ **`GET /public/health`** - Health check por tenant (sem auth)
4. ✅ **`POST /auth/login`** - Login (sem auth inicial)
5. ✅ **Todas as outras rotas** - Com autenticação obrigatória

**Sem essas rotas públicas, o app não conseguirá:**
- Descobrir quais câmaras estão disponíveis
- Verificar se um tenant está ativo
- Permitir login pela primeira vez

---

**🚀 Implemente essas rotas no backend e o sistema multi-tenancy funcionará perfeitamente!**




