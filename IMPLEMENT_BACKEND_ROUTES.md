# 🚀 Implementação das Rotas no Backend

## 📋 Situação Atual

O backend está retornando:
```json
{
  "error": "Rota não encontrada",
  "message": "A rota GET /public/tenants não foi encontrada"
}
```

## 🎯 Rotas que Precisam ser Implementadas

### **1. Rota Principal (Sem Subdomínio)**

#### **GET /tenants** (ou /public/tenants)
```javascript
// routes/tenants.js ou routes/public.js
router.get('/tenants', async (req, res) => {
  try {
    // Retornar lista de tenants/câmaras disponíveis
    const tenants = [
      {
        id: 'veramendes',
        subdomain: 'veramendes',
        name: 'Câmara Municipal de Mendes',
        city: 'Mendes',
        state: 'RJ',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'verapetropolis',
        subdomain: 'verapetropolis',
        name: 'Câmara Municipal de Petrópolis',
        city: 'Petrópolis',
        state: 'RJ',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'veraniteroi',
        subdomain: 'veraniteroi',
        name: 'Câmara Municipal de Niterói',
        city: 'Niterói',
        state: 'RJ',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    res.json({
      success: true,
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});
```

#### **GET /health** (ou /public/health)
```javascript
// routes/health.js ou routes/public.js
router.get('/health', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      message: 'Backend funcionando normalmente'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Erro interno do servidor'
    });
  }
});
```

### **2. Rotas por Tenant (Com Subdomínio)**

#### **GET /health** (por tenant)
```javascript
// routes/health.js (por tenant)
router.get('/health', async (req, res) => {
  try {
    // req.subdomain contém o subdomínio (veramendes, verapetropolis, etc.)
    const tenant = req.subdomain || 'unknown';
    
    res.json({
      status: 'ok',
      tenant: tenant,
      timestamp: new Date().toISOString(),
      message: `Tenant ${tenant} funcionando normalmente`
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      tenant: req.subdomain,
      error: 'Erro interno do servidor'
    });
  }
});
```

## 🏗️ Estrutura de Arquivos Recomendada

### **Opção 1: Rotas Separadas**
```
routes/
├── public.js      // Rotas públicas (/tenants, /health)
├── auth.js        // Autenticação (/auth/login)
├── vereadores.js  // Vereadores (/vereadores/me)
├── pautas.js      // Pautas (/pautas)
├── votacoes.js    // Votações (/votacoes)
└── votes.js       // Votos (/votes)
```

### **Opção 2: Rotas por Módulo**
```
routes/
├── tenants.js     // Tudo relacionado a tenants
├── auth.js        // Autenticação
├── vereadores.js  // Vereadores
├── pautas.js      // Pautas
├── votacoes.js    // Votações
└── votes.js       // Votos
```

## 🔧 Implementação Passo a Passo

### **Passo 1: Criar Rota de Tenants**
```javascript
// routes/tenants.js
const express = require('express');
const router = express.Router();

// GET /tenants - Lista de tenants disponíveis
router.get('/', async (req, res) => {
  try {
    // Aqui você pode buscar do banco de dados
    const tenants = await Tenant.find({ status: 'active' });
    
    res.json({
      success: true,
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tenants'
    });
  }
});

module.exports = router;
```

### **Passo 2: Criar Rota de Health**
```javascript
// routes/health.js
const express = require('express');
const router = express.Router();

// GET /health - Status de saúde
router.get('/', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Erro interno'
    });
  }
});

module.exports = router;
```

### **Passo 3: Registrar Rotas no App Principal**
```javascript
// app.js ou server.js
const tenantsRouter = require('./routes/tenants');
const healthRouter = require('./routes/health');

// Rotas públicas (sem autenticação)
app.use('/tenants', tenantsRouter);
app.use('/health', healthRouter);

// Rotas protegidas (com autenticação)
app.use('/auth', authRouter);
app.use('/vereadores', requireAuth, vereadoresRouter);
app.use('/pautas', requireAuth, pautasRouter);
app.use('/votacoes', requireAuth, votacoesRouter);
app.use('/votes', requireAuth, votesRouter);
```

## 🧪 Teste das Rotas

### **1. Testar Rota de Tenants**
```bash
curl http://192.168.18.96:3000/tenants
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
      "status": "active"
    }
  ]
}
```

### **2. Testar Rota de Health**
```bash
curl http://192.168.18.96:3000/health
```

**Resposta Esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## 🚨 Problemas Comuns e Soluções

### **1. Rota Não Encontrada**
**Problema:** `GET /tenants` retorna 404
**Solução:** Verificar se a rota está registrada corretamente no app principal

### **2. CORS Error**
**Problema:** App não consegue fazer requisições
**Solução:** Configurar CORS no backend
```javascript
const cors = require('cors');
app.use(cors());
```

### **3. Middleware de Autenticação Bloqueando**
**Problema:** Rota retorna 401 mesmo sendo pública
**Solução:** Verificar se o middleware de auth não está sendo aplicado globalmente

## 📱 Como o App Usa Essas Rotas

### **1. Primeira Abertura**
```
App → GET /tenants → Lista de câmaras → Seleção do usuário
```

### **2. Validação do Tenant**
```
App → GET /health (tenant específico) → Verifica se está ativo
```

### **3. Login**
```
App → POST /auth/login (tenant específico) → Autenticação
```

## ✅ Checklist de Implementação

- [ ] **Criar rota `GET /tenants`** (sem autenticação)
- [ ] **Criar rota `GET /health`** (sem autenticação)
- [ ] **Registrar rotas no app principal**
- [ ] **Configurar CORS** se necessário
- [ ] **Testar com curl** antes de usar no app
- [ ] **Verificar logs** do backend

## 🎯 Resumo

**Para resolver o problema atual, você precisa implementar no backend:**

1. **`GET /tenants`** - Retornar lista de câmaras disponíveis
2. **`GET /health`** - Retornar status de saúde do sistema

**Essas rotas devem:**
- ✅ **NÃO exigir autenticação**
- ✅ **Retornar dados no formato esperado**
- ✅ **Estar registradas no app principal**

---

**🚀 Implemente essas rotas e o app funcionará perfeitamente!**



