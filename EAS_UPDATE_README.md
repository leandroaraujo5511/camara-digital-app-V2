# EAS Update - OTA Updates

Este documento explica como configurar e usar o EAS Update para atualizações over-the-air (OTA) no app.

## 🎯 Distribuição Direta de APK

Este app é distribuído **diretamente via APK**, sem passar pelas lojas de app. O EAS Update funciona perfeitamente com essa abordagem, permitindo:

- ✅ **Controle total** sobre distribuição
- ✅ **Updates instantâneos** sem aprovação de lojas
- ✅ **Sem taxas** de lojas
- ✅ **Deploy rápido** de correções críticas

> 📖 **Guia Completo**: Consulte `APK_DISTRIBUTION_GUIDE.md` para detalhes sobre distribuição direta.

## 📋 Pré-requisitos

1. **EAS CLI instalado**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login no EAS**:
   ```bash
   eas login
   ```

3. **Projeto configurado**:
   - O projeto já está configurado com `projectId` no `app.json`
   - O `eas.json` está configurado com canais de update

## 🚀 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Canais de Update

O app está configurado com 4 canais:
- **development**: Para desenvolvimento
- **preview**: Para validação
- **staging**: Para testes com usuários selecionados
- **production**: Para produção

### 3. Build Inicial

Antes de usar updates, você precisa fazer um build inicial:

```bash
# Para desenvolvimento
npm run build:apk:dev

# Para preview
npm run build:apk:preview

# Para staging
npm run build:apk:staging

# Para produção
npm run build:apk:prod
```

## 📱 Como Funciona

### No App

1. **Verificação Automática**: O app verifica updates automaticamente na inicialização
2. **Notificação**: Quando há update disponível, uma notificação é exibida
3. **Download**: O usuário pode baixar o update
4. **Instalação**: Após download, o usuário pode instalar o update
5. **Reinicialização**: O app reinicia automaticamente após instalação

### Componentes

- **`useUpdates`**: Hook para gerenciar updates
- **`UpdateManager`**: Componente para interface de updates
- **Integração no App**: UpdateManager está integrado no App.tsx

## 🔧 Comandos Disponíveis

### Scripts NPM

```bash
# Enviar update para desenvolvimento
npm run update:dev "Mensagem do update"

# Enviar update para preview
npm run update:preview "Mensagem do update"

# Enviar update para staging
npm run update:staging "Mensagem do update"

# Enviar update para produção
npm run update:prod "Mensagem do update"

# Update automático (detecta ambiente)
npm run update:auto
```

### Script Personalizado

```bash
# Usar o script personalizado
./scripts/update.sh update production "Correção de bugs críticos"
./scripts/update.sh list production
./scripts/update.sh status
```

### Comandos EAS Diretos

```bash
# Enviar update
eas update --channel production --message "Nova funcionalidade"

# Listar updates
eas update:list --channel production

# Verificar status
eas project:info
```

## 📊 Monitoramento

### Verificar Updates Enviados

```bash
# Listar todos os updates de um canal
eas update:list --channel production

# Ver detalhes de um update específico
eas update:view [UPDATE_ID]
```

### Logs do App

O app gera logs detalhados sobre updates:
- Verificação de updates
- Download de updates
- Instalação de updates
- Erros de update

## 🎯 Fluxo de Trabalho

### 1. Desenvolvimento

```bash
# 1. Fazer mudanças no código
# 2. Testar localmente
npm start

# 3. Enviar update para desenvolvimento
npm run update:dev "Nova funcionalidade em desenvolvimento"
```

### 2. Preview/Teste

```bash
# 1. Enviar update para preview
npm run update:preview "Versão para teste"

# 2. Testar em dispositivos
# 3. Verificar logs e feedback
```

### 3. Produção

```bash
# 1. Enviar update para produção
npm run update:prod "Versão estável com correções"

# 2. Monitorar rollout
# 3. Verificar métricas de adoção
```

## ⚠️ Limitações

### O que PODE ser atualizado via OTA:
- ✅ Código JavaScript/TypeScript
- ✅ Assets (imagens, fontes, etc.)
- ✅ Configurações do app
- ✅ Estilos e layouts

### O que NÃO PODE ser atualizado via OTA:
- ❌ Código nativo (Java/Kotlin para Android, Swift/Objective-C para iOS)
- ❌ Dependências nativas
- ❌ Permissões do app
- ❌ Configurações de build nativas

## 🔍 Troubleshooting

### Update não aparece

1. **Verificar canal**: Certifique-se de que o app está usando o canal correto
2. **Verificar build**: O app precisa ter sido buildado com o canal correto
3. **Verificar logs**: Verifique os logs do app para erros

### Erro ao baixar update

1. **Verificar conexão**: Certifique-se de que há conexão com internet
2. **Verificar EAS**: Verifique se o EAS está funcionando
3. **Verificar logs**: Verifique os logs para erros específicos

### App não reinicia após update

1. **Verificar permissões**: Certifique-se de que o app tem permissões necessárias
2. **Verificar logs**: Verifique os logs para erros de instalação
3. **Reinstalar app**: Em casos extremos, reinstale o app

## 📈 Métricas e Analytics

### Verificar Adoção de Updates

```bash
# Ver estatísticas de um update
eas update:view [UPDATE_ID]

# Ver estatísticas do projeto
eas project:info
```

### Logs do App

O app gera logs detalhados que podem ser monitorados:
- Taxa de sucesso de downloads
- Tempo de instalação
- Erros comuns
- Adoção de updates

## 🚀 Exemplos Práticos

### Correção de Bug Crítico

```bash
# 1. Corrigir o bug no código
# 2. Testar localmente
# 3. Enviar update para produção
npm run update:prod "Correção crítica: bug na votação"

# 4. Monitorar adoção
eas update:list --branch production
```

### Nova Funcionalidade

```bash
# 1. Desenvolver funcionalidade
npm run update:dev "Nova funcionalidade em desenvolvimento"

# 2. Testar em preview
npm run update:preview "Versão para teste da nova funcionalidade"

# 3. Deploy para produção
npm run update:prod "Nova funcionalidade: relatórios de votação"
```

### Atualização de Assets

```bash
# 1. Atualizar imagens/ícones
# 2. Enviar update
npm run update:prod "Atualização de assets: novos ícones e imagens"
```

## 📞 Suporte

Para problemas com EAS Update:
1. Verificar [documentação oficial](https://docs.expo.dev/eas-update/introduction/)
2. Verificar logs do app
3. Verificar status do EAS: `eas project:info`
4. Contatar suporte do Expo se necessário
