# 📱 Guia de Build para APK - Vereador Voting App

## 🚀 **Configuração Concluída**

O projeto está configurado para gerar APKs usando o EAS Build (Expo Application Services).

## 📋 **Pré-requisitos**

### **1. Conta Expo**
- ✅ Conta Expo criada: `leandroaraujo5511`
- ✅ EAS CLI instalado: `eas-cli/16.3.1`

### **2. Configurações do Projeto**
- ✅ `eas.json` configurado para builds APK
- ✅ `package.json` com scripts de build
- ✅ Configuração de ambiente para produção

## 🔧 **Scripts Disponíveis**

### **Build de Desenvolvimento (APK de Teste)**
```bash
npm run build:apk:dev
# ou
eas build --platform android --profile development
```

### **Build de Preview (APK Interno)**
```bash
npm run build:apk:preview
# ou
eas build --platform android --profile preview
```

### **Build de Produção (APK Final)**
```bash
npm run build:apk:prod
# ou
eas build --platform android --profile production
```

## 📱 **Tipos de Build**

### **1. Development Build**
- **Uso**: Testes internos
- **Características**: 
  - Inclui ferramentas de desenvolvimento
  - Permite hot reload
  - Não assinado (não pode ser instalado em dispositivos não autorizados)

### **2. Preview Build**
- **Uso**: Testes com usuários finais
- **Características**:
  - APK assinado
  - Pode ser instalado em qualquer dispositivo Android
  - Não inclui ferramentas de desenvolvimento

### **3. Production Build**
- **Uso**: Distribuição final
- **Características**:
  - APK otimizado para produção
  - Assinado com certificado de produção
  - Pronto para publicação na Play Store

## 🎯 **Como Gerar o APK**

### **Opção 1: APK de Preview (Recomendado para Testes)**
```bash
# Navegar para o diretório do projeto
cd vereadorVotingApp

# Gerar APK de preview
npm run build:apk:preview
```

### **Opção 2: APK de Produção**
```bash
# Gerar APK de produção
npm run build:apk:prod
```

## 📊 **Processo de Build**

### **1. Iniciar o Build**
```bash
npm run build:apk:preview
```

### **2. Acompanhar o Progresso**
- O EAS CLI mostrará o progresso do build
- Você receberá um link para acompanhar online
- O build será executado nos servidores da Expo

### **3. Download do APK**
- Após o build concluir, você receberá um link para download
- O APK estará disponível por 30 dias
- Você pode baixar diretamente no dispositivo Android

## 🔐 **Configuração de Assinatura**

### **Para APKs de Preview e Production:**
- ✅ Assinatura automática configurada
- ✅ Certificado gerenciado pelo EAS
- ✅ APK pode ser instalado em qualquer dispositivo

### **Para Publicação na Play Store:**
- 🔄 Configuração adicional necessária
- 🔄 Upload de certificado de produção
- 🔄 Configuração de keystore

## 📱 **Instalação do APK**

### **1. Download**
- Baixe o APK do link fornecido após o build
- Salve no dispositivo Android

### **2. Instalação**
- Vá em Configurações > Segurança
- Ative "Fontes desconhecidas" ou "Instalar apps desconhecidos"
- Abra o arquivo APK baixado
- Siga as instruções de instalação

## 🎯 **Configurações de Ambiente**

### **Desenvolvimento**
- API URL: `http://192.168.18.96:3000`
- Timeout: 10 segundos
- Logs de debug ativados

### **Produção**
- API URL: `https://api.camaradigital.com.br`
- Timeout: 15 segundos
- Logs de debug desativados

## 📋 **Checklist de Build**

### **Antes do Build:**
- [ ] Verificar se está logado no Expo (`eas whoami`)
- [ ] Verificar configurações de ambiente
- [ ] Testar o app em desenvolvimento
- [ ] Verificar se todas as dependências estão instaladas

### **Durante o Build:**
- [ ] Acompanhar o progresso online
- [ ] Verificar se não há erros
- [ ] Aguardar conclusão

### **Após o Build:**
- [ ] Baixar o APK
- [ ] Testar em dispositivo Android
- [ ] Verificar funcionalidades principais
- [ ] Verificar conectividade com API

## 🚨 **Solução de Problemas**

### **Erro de Login:**
```bash
# Fazer login no Expo
npx eas login
```

### **Erro de Configuração:**
```bash
# Verificar configuração
npx eas build:configure
```

### **Erro de Dependências:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📊 **Informações do Projeto**

### **Configurações Atuais:**
- **Nome**: Camara Digital App
- **Slug**: camara-digital-app
- **Versão**: 1.0.0
- **Package**: com.camaradigital.camaradigitalapp
- **Orientação**: Landscape

### **Assets:**
- ✅ Ícone: `./assets/icon.png`
- ✅ Splash: `./assets/splash.png`
- ✅ Adaptive Icon: `./assets/adaptive-icon.png`

## 🎯 **Próximos Passos**

### **1. Gerar APK de Preview:**
```bash
npm run build:apk:preview
```

### **2. Testar o APK:**
- Instalar em dispositivo Android
- Testar funcionalidades principais
- Verificar conectividade com API

### **3. Gerar APK de Produção:**
```bash
npm run build:apk:prod
```

### **4. Distribuir:**
- Enviar APK para usuários finais
- Configurar atualizações automáticas
- Considerar publicação na Play Store

---

**🎯 PROJETO PRONTO PARA BUILD DE APK**

Execute `npm run build:apk:preview` para gerar seu primeiro APK! 🚀
