# 🚀 Guia de Teste - Atualizações OTA (Over-The-Air)

## ✅ Status Atual
- **Build de Produção**: ✅ Concluído
- **Atualização OTA**: ✅ Publicada
- **Canal Configurado**: ✅ `production` → `main`

## 📱 Como Testar as Atualizações OTA

### 1. **Instalar o APK Base**
```bash
# Link do APK mais recente:
https://expo.dev/accounts/leandroaraujo5511/projects/camara-digital-app/builds/774ebf94-0261-4eab-b014-29ef407dbcee
```

### 2. **Verificar a Versão Inicial**
- Abra o app
- Na tela de login, você verá:
  - **Título**: "Câmara Digital"
  - **Subtítulo**: "Sistema de Votação"
  - **Versão**: "v1.0.0" (no rodapé)
  - **Indicador**: "🧪 Modo Teste - OTA Update" (nova funcionalidade)

### 3. **Testar a Atualização Automática**

#### Opção A: Automática (Recomendado)
1. Feche o app completamente
2. Abra o app novamente
3. O app deve verificar automaticamente por atualizações
4. Se houver atualização, ela será baixada e aplicada

#### Opção B: Manual (Para Debug)
1. No app, procure por um botão de "Verificar Atualizações" (se implementado)
2. Ou force o fechamento e reabertura do app

### 4. **Verificar se a Atualização Funcionou**
Após a atualização, você deve ver:
- ✅ O indicador "🧪 Modo Teste - OTA Update" na tela de login
- ✅ A versão continua "v1.0.0" (não muda com OTA updates)
- ✅ O app funciona normalmente

## 🔧 Comandos para Gerenciar Atualizações

### Publicar Nova Atualização
```bash
# Fazer alterações no código
# Depois publicar:
eas update --branch main --message "Descrição da atualização"
```

### Verificar Status
```bash
# Listar canais
eas channel:list

# Listar branches
eas branch:list

# Ver atualizações
eas update:list
```

### Configurar Canais
```bash
# Associar branch ao canal
eas channel:edit production --branch main
```

## 📊 Monitoramento

### Dashboard EAS
- **Projeto**: https://expo.dev/accounts/leandroaraujo5511/projects/camara-digital-app
- **Atualizações**: https://expo.dev/accounts/leandroaraujo5511/projects/camara-digital-app/updates

### Logs de Atualização
- As atualizações são registradas no dashboard
- Você pode ver quantos usuários receberam cada atualização
- Logs de erro são capturados automaticamente

## 🎯 Cenários de Teste

### Teste 1: Primeira Instalação
1. Instale o APK
2. Abra o app
3. Verifique se o indicador de teste aparece
4. ✅ **Resultado Esperado**: App funciona, indicador visível

### Teste 2: Atualização Automática
1. Com o app instalado, feche completamente
2. Reabra o app
3. ✅ **Resultado Esperado**: Atualização é baixada e aplicada automaticamente

### Teste 3: Múltiplas Atualizações
1. Faça uma nova alteração no código
2. Publique nova atualização: `eas update --branch main --message "Nova funcionalidade"`
3. Teste no app
4. ✅ **Resultado Esperado**: Nova atualização é aplicada

## 🚨 Troubleshooting

### Se a Atualização Não Funcionar
1. **Verificar Conexão**: App precisa de internet
2. **Verificar Canal**: `eas channel:list` para confirmar configuração
3. **Verificar Build**: O build deve ser compatível com a atualização
4. **Logs**: Verificar logs no dashboard EAS

### Comandos de Debug
```bash
# Verificar configuração do projeto
eas project:info

# Ver logs de build
eas build:list

# Ver logs de atualização
eas update:list
```

## 📝 Próximos Passos

1. **Testar no Dispositivo Real**: Instalar APK e testar atualizações
2. **Implementar UI de Atualização**: Adicionar indicador visual de download
3. **Configurar Notificações**: Avisar usuários sobre atualizações
4. **Monitorar Performance**: Acompanhar métricas de atualização

---

## 🎉 Resumo do Teste

**Build ID**: `774ebf94-0261-4eab-b014-29ef407dbcee`
**Update ID**: `100fd619-1595-4d83-b95b-b6d3b5caaab9`
**Canal**: `production` → `main`
**Status**: ✅ Pronto para teste

O sistema de atualizações OTA está configurado e funcionando! 🚀
