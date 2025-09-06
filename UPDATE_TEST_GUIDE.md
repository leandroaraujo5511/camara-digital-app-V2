# Guia de Teste - EAS Update

Este guia explica como testar o sistema de EAS Update.

## 🧪 Teste Passo a Passo

### 1. Preparação

```bash
# 1. Instalar dependências
npm install

# 2. Instalar EAS CLI (se não tiver)
npm install -g @expo/eas-cli

# 3. Fazer login no EAS
eas login

# 4. Verificar projeto
eas project:info
```

### 2. Build Inicial

```bash
# Fazer build de desenvolvimento
npm run build:apk:dev

# Ou usar EAS diretamente
eas build --platform android --profile development
```

### 3. Instalar o App

1. Baixar o APK gerado
2. Instalar no dispositivo Android
3. Abrir o app e verificar se funciona normalmente

### 4. Fazer Mudança para Teste

Vamos fazer uma mudança simples para testar o update:

#### Opção 1: Mudar Texto

Editar `src/screens/HomeScreen.tsx` e mudar algum texto:

```typescript
// Antes
<Text>Bem-vindo ao Sistema de Votação</Text>

// Depois
<Text>Bem-vindo ao Sistema de Votação - VERSÃO ATUALIZADA!</Text>
```

#### Opção 2: Mudar Cor

Editar algum estilo para mudar a cor:

```typescript
// Antes
backgroundColor: '#2196F3'

// Depois
backgroundColor: '#FF5722'
```

### 5. Enviar Update

```bash
# Enviar update para desenvolvimento
npm run update:dev "Teste de update OTA - mudança visual"

# Ou usar script personalizado
./scripts/update.sh update development "Teste de update OTA"
```

### 6. Testar no App

1. **Abrir o app** no dispositivo
2. **Aguardar 3 segundos** (tempo configurado para verificação automática)
3. **Verificar notificação** de update disponível
4. **Tocar na notificação** ou no botão "Baixar Atualização"
5. **Aguardar download**
6. **Confirmar instalação** quando solicitado
7. **Verificar mudança** após reinicialização

### 7. Verificar Logs

No console do app, você deve ver logs como:

```
📊 getEstatisticasVotacao: Iniciando para votação: ...
🔍 getVotosByVotacao: Buscando votos para votação: ...
✅ getVotosByVotacao: Votos encontrados: 3
```

E logs de update:

```
[INFO] Verificando updates...
[INFO] Update disponível encontrado
[INFO] Baixando update...
[INFO] Update baixado com sucesso
[INFO] Instalando update...
[INFO] App reiniciado com nova versão
```

## 🔍 Verificações

### ✅ Checklist de Teste

- [ ] App inicia normalmente
- [ ] Verificação automática de updates funciona
- [ ] Notificação de update aparece
- [ ] Download de update funciona
- [ ] Instalação de update funciona
- [ ] App reinicia após update
- [ ] Mudanças são visíveis após update
- [ ] Logs mostram processo correto

### ❌ Problemas Comuns

1. **Update não aparece**:
   - Verificar se o build foi feito com o canal correto
   - Verificar se o update foi enviado para o canal correto
   - Verificar logs do app

2. **Erro ao baixar**:
   - Verificar conexão com internet
   - Verificar se EAS está funcionando
   - Verificar logs de erro

3. **App não reinicia**:
   - Verificar permissões do app
   - Verificar logs de instalação
   - Tentar reinstalar o app

## 📊 Monitoramento

### Verificar Updates Enviados

```bash
# Listar updates do canal development
eas update:list --branch development

# Ver detalhes de um update específico
eas update:view [UPDATE_ID]
```

### Verificar Estatísticas

```bash
# Ver informações do projeto
eas project:info

# Ver estatísticas de um update
eas update:view [UPDATE_ID]
```

## 🚀 Cenários de Teste

### Teste 1: Update Simples

1. Mudar texto em uma tela
2. Enviar update
3. Verificar se mudança aparece

### Teste 2: Update de Estilo

1. Mudar cores ou estilos
2. Enviar update
3. Verificar se mudanças visuais aparecem

### Teste 3: Update de Funcionalidade

1. Adicionar nova funcionalidade simples
2. Enviar update
3. Verificar se funcionalidade funciona

### Teste 4: Update Múltiplo

1. Fazer primeiro update
2. Fazer segundo update
3. Verificar se ambos funcionam

## 📱 Teste em Diferentes Dispositivos

### Android

- Testar em diferentes versões do Android
- Testar em diferentes tamanhos de tela
- Testar com diferentes conexões (WiFi, 4G, 5G)

### iOS (se aplicável)

- Testar em diferentes versões do iOS
- Testar em diferentes dispositivos
- Testar com diferentes conexões

## 🔧 Debug

### Logs do App

```bash
# Android
adb logcat | grep -i "expo\|update"

# iOS
# Usar Xcode Console
```

### Logs do EAS

```bash
# Ver logs de um update específico
eas update:view [UPDATE_ID]

# Ver logs do projeto
eas project:info
```

## 📈 Métricas de Sucesso

### Taxa de Sucesso

- ✅ Update baixado com sucesso: > 95%
- ✅ Update instalado com sucesso: > 90%
- ✅ App reinicia corretamente: > 95%

### Tempo de Update

- ⏱️ Verificação de update: < 5 segundos
- ⏱️ Download de update: < 30 segundos
- ⏱️ Instalação de update: < 10 segundos

## 🎯 Próximos Passos

Após testar com sucesso:

1. **Configurar ambiente de produção**
2. **Implementar monitoramento**
3. **Configurar notificações automáticas**
4. **Treinar equipe no uso**
5. **Documentar processos**

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs do app
2. Verificar logs do EAS
3. Consultar documentação oficial
4. Contatar suporte se necessário
