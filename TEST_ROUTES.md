# 🧪 Teste das Rotas do Backend

## 📋 Como Testar

### **1. Testar Backend Principal (Sem Subdomínio)**

```bash
# Testar health check
curl http://192.168.18.96:3000/public/health

# Testar lista de tenants
curl http://192.168.18.96:3000/public/tenants
```

**Resposta Esperada para Health:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

**Resposta Esperada para Tenants:**
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
      "status": "active"
    }
  ]
}
```

### **2. Testar Tenants Específicos**

```bash
# Testar health do tenant veramendes
curl http://veramendes.192.168.18.96:3000/public/health

# Testar health do tenant verapetropolis
curl http://verapetropolis.192.168.18.96:3000/public/health

# Testar health do tenant veraniteroi
curl http://veraniteroi.192.168.18.96:3000/public/health
```

**Resposta Esperada:**
```json
{
  "status": "ok",
  "tenant": "veramendes",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **3. Testar Login (Sem Autenticação)**

```bash
# Testar login no tenant veramendes
curl -X POST http://veramendes.192.168.18.96:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vereador@mendes.com",
    "password": "123456"
  }'
```

**Resposta Esperada (Sucesso):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "name": "João Silva",
      "email": "vereador@mendes.com",
      "role": "Vereador",
      "tenantId": "veramendes"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

## 🚨 Problemas Comuns

### **1. Rota /tenants Exige Autenticação**
**Sintoma:** `401 Unauthorized` ao chamar `/tenants`
**Solução:** Mover para `/public/tenants` (sem middleware de auth)

### **2. Rota /health Exige Autenticação**
**Sintoma:** `401 Unauthorized` ao chamar `/health`
**Solução:** Mover para `/public/health` (sem middleware de auth)

### **3. Subdomínios Não Resolvem**
**Sintoma:** `ERR_NAME_NOT_RESOLVED` ou `Network Error`
**Solução:** Configurar DNS local ou usar IPs diretos

### **4. CORS Bloqueando**
**Sintoma:** `CORS error` no console
**Solução:** Configurar CORS no backend para permitir o app

## 🔧 Configuração no Backend

### **1. Rotas Públicas (Sem Middleware de Auth)**
```javascript
// routes/public.js
router.get('/public/tenants', async (req, res) => {
  // Sem middleware de autenticação
});

router.get('/public/health', async (req, res) => {
  // Sem middleware de autenticação
});
```

### **2. Rotas Protegidas (Com Middleware de Auth)**
```javascript
// routes/auth.js
router.post('/auth/login', async (req, res) => {
  // Login sem autenticação
});

// routes/vereadores.js
router.get('/vereadores/me', requireAuth, async (req, res) => {
  // Com middleware de autenticação
});
```

### **3. Middleware de Autenticação**
```javascript
// middleware/auth.js
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    // Validar JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

## 📱 Teste no App

### **1. Primeira Abertura**
- App deve mostrar tela de seleção de tenant
- Deve carregar lista de câmaras disponíveis
- Logs devem mostrar busca em `/public/tenants`

### **2. Seleção de Tenant**
- Usuário seleciona uma câmara
- App verifica status via `/public/health`
- Tenant é salvo no storage
- Redireciona para login

### **3. Login**
- App usa URL específica do tenant
- Faz login via `/auth/login`
- Obtém token de autenticação
- Redireciona para home

## 🔍 Logs Esperados

### **Console do App:**
```
🔧 API Config: { baseHost: '192.168.18.96:3000', ... }
🔍 Buscando tenants da API...
✅ Tenants obtidos da API: 4
🏛️ Tenant carregado do storage: Câmara Municipal de Mendes
🔍 Selecionando tenant: Câmara Municipal de Mendes
🔍 Verificando status do tenant: veramendes
🔗 URL de health: http://veramendes.192.168.18.96:3000/public/health
✅ Tenant veramendes está ativo
✅ Tenant selecionado: Câmara Municipal de Mendes
🔗 URL da API: http://veramendes.192.168.18.96:3000
🔄 API URL atualizada
```

## ✅ Checklist de Implementação

- [ ] **Rota `/public/tenants`** implementada (sem auth)
- [ ] **Rota `/public/health`** implementada (sem auth)
- [ ] **Rota `/public/health`** por tenant implementada (sem auth)
- [ ] **Rota `/auth/login`** implementada (sem auth)
- [ ] **Todas as outras rotas** com autenticação obrigatória
- [ ] **CORS** configurado para permitir o app
- [ ] **Subdomínios** configurados no DNS/servidor

---

**🚀 Implemente essas rotas no backend e teste com os comandos acima!**




