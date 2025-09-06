# Guia de Distribuição Direta de APK com EAS Update

Este guia explica como distribuir o app diretamente via APK e usar EAS Update para atualizações OTA.

## 🎯 Por que Distribuição Direta?

### Vantagens:
- ✅ **Controle total** sobre distribuição
- ✅ **Updates instantâneos** sem aprovação de lojas
- ✅ **Sem taxas** de lojas (Google Play, App Store)
- ✅ **Deploy rápido** de correções críticas
- ✅ **Versões específicas** para diferentes grupos
- ✅ **Sem restrições** de conteúdo das lojas

### Desvantagens:
- ❌ **Instalação manual** necessária
- ❌ **Configuração de segurança** (origem desconhecida)
- ❌ **Sem descoberta** nas lojas
- ❌ **Gerenciamento manual** de distribuição

## 🚀 Fluxo de Distribuição

### 1. Build do APK

```bash
# Build para produção
npm run build:apk:prod

# Build para staging (testes)
npm run build:apk:staging

# Build para preview (validação)
npm run build:apk:preview
```

### 2. Distribuição do APK

#### Opção A: Download Direto
1. **Fazer build** do APK
2. **Baixar APK** do EAS
3. **Distribuir** via:
   - Email
   - Link direto
   - Servidor interno
   - QR Code

#### Opção B: Servidor de Distribuição
1. **Configurar servidor** para hospedar APKs
2. **Gerar links** de download
3. **Distribuir links** para usuários

### 3. Instalação pelos Usuários

#### Android:
1. **Baixar APK**
2. **Permitir instalação** de fontes desconhecidas
3. **Instalar APK**
4. **Abrir app**

#### iOS (se aplicável):
- iOS não permite instalação direta de APK
- Necessário usar TestFlight ou distribuição empresarial

## 📱 Configuração para Instalação

### Android - Permitir Fontes Desconhecidas

Os usuários precisam permitir instalação de fontes desconhecidas:

1. **Configurações** → **Segurança**
2. **Fontes desconhecidas** → **Ativar**
3. **Ou por app específico** → **Ativar para navegador/gerenciador de arquivos**

### Instruções para Usuários

Criar um guia simples para os usuários:

```markdown
# Como Instalar o App

## Android

1. Baixe o arquivo APK
2. Vá em Configurações → Segurança
3. Ative "Fontes desconhecidas"
4. Abra o arquivo APK baixado
5. Toque em "Instalar"
6. Abra o app

## Atualizações Automáticas

O app se atualiza automaticamente quando há novas versões disponíveis.
```

## 🔄 Fluxo de Updates

### 1. Desenvolvimento

```bash
# Fazer mudanças no código
# Testar localmente
npm start

# Enviar update para desenvolvimento
npm run update:dev "Nova funcionalidade em desenvolvimento"
```

### 2. Staging/Teste

```bash
# Build para staging
npm run build:apk:staging

# Distribuir APK para testes
# Enviar update para staging
npm run update:staging "Versão para teste"
```

### 3. Produção

```bash
# Build para produção
npm run build:apk:prod

# Distribuir APK para usuários
# Enviar update para produção
npm run update:prod "Versão estável"
```

## 📊 Canais de Distribuição

### Development
- **Uso**: Desenvolvimento interno
- **Distribuição**: Equipe de desenvolvimento
- **Updates**: Frequentes, para testes

### Staging
- **Uso**: Testes com usuários selecionados
- **Distribuição**: Beta testers
- **Updates**: Estáveis, para validação

### Preview
- **Uso**: Validação final
- **Distribuição**: Stakeholders
- **Updates**: Versão candidata

### Production
- **Uso**: Usuários finais
- **Distribuição**: Todos os usuários
- **Updates**: Versões estáveis

## 🛠️ Scripts de Automação

### Script de Build e Distribuição

```bash
#!/bin/bash
# scripts/build-and-distribute.sh

ENVIRONMENT=$1
MESSAGE=$2

if [ -z "$ENVIRONMENT" ]; then
    echo "Uso: $0 [environment] [message]"
    echo "Ambientes: development, staging, preview, production"
    exit 1
fi

echo "🏗️ Fazendo build para $ENVIRONMENT..."
npm run build:apk:$ENVIRONMENT

echo "📤 Enviando update para $ENVIRONMENT..."
npm run update:$ENVIRONMENT "$MESSAGE"

echo "✅ Build e update concluídos para $ENVIRONMENT!"
```

### Script de Distribuição

```bash
#!/bin/bash
# scripts/distribute.sh

ENVIRONMENT=$1
DISTRIBUTION_METHOD=$2

case $DISTRIBUTION_METHOD in
    "email")
        echo "📧 Enviando APK por email..."
        # Implementar envio por email
        ;;
    "server")
        echo "🌐 Fazendo upload para servidor..."
        # Implementar upload para servidor
        ;;
    "qr")
        echo "📱 Gerando QR Code..."
        # Implementar geração de QR Code
        ;;
    *)
        echo "Método de distribuição: email, server, qr"
        ;;
esac
```

## 📈 Monitoramento

### Verificar Adoção de Updates

```bash
# Ver estatísticas de um canal
eas update:list --branch production

# Ver detalhes de um update
eas update:view [UPDATE_ID]
```

### Métricas Importantes

- **Taxa de instalação** do APK inicial
- **Taxa de adoção** de updates
- **Tempo médio** para instalação de updates
- **Erros** durante instalação/update

## 🔒 Segurança

### Assinatura Digital

O EAS automaticamente assina os APKs com certificado digital:

```bash
# Verificar assinatura
keytool -printcert -jarfile app.apk
```

### Verificação de Integridade

```bash
# Verificar hash do APK
sha256sum app.apk
```

## 📱 Experiência do Usuário

### Primeira Instalação

1. **Download** do APK
2. **Permitir** fontes desconhecidas
3. **Instalar** APK
4. **Abrir** app
5. **Configurar** app

### Updates Automáticos

1. **App verifica** updates automaticamente
2. **Notificação** de update disponível
3. **Download** automático
4. **Instalação** com confirmação
5. **Reinicialização** automática

## 🚨 Troubleshooting

### Problemas Comuns

#### APK não instala
- Verificar se fontes desconhecidas estão ativadas
- Verificar se há espaço suficiente
- Verificar se o APK não está corrompido

#### Update não aparece
- Verificar se o app foi buildado com o canal correto
- Verificar se o update foi enviado para o canal correto
- Verificar logs do app

#### App não reinicia após update
- Verificar permissões do app
- Verificar logs de instalação
- Tentar reinstalar o app

### Logs de Debug

```bash
# Android
adb logcat | grep -i "expo\|update"

# Verificar logs do EAS
eas update:view [UPDATE_ID]
```

## 📋 Checklist de Distribuição

### Antes do Build
- [ ] Código testado e validado
- [ ] Configurações de ambiente corretas
- [ ] Chaves de API configuradas
- [ ] Assets atualizados

### Build
- [ ] Build executado com sucesso
- [ ] APK baixado e verificado
- [ ] Assinatura digital válida
- [ ] Tamanho do APK aceitável

### Distribuição
- [ ] APK distribuído para usuários
- [ ] Instruções de instalação fornecidas
- [ ] Suporte configurado para problemas

### Update
- [ ] Update enviado para o canal correto
- [ ] Mensagem de update clara
- [ ] Monitoramento configurado
- [ ] Rollback planejado (se necessário)

## 🎯 Próximos Passos

1. **Configurar servidor** de distribuição (opcional)
2. **Criar portal** para download de APKs
3. **Implementar analytics** de instalação
4. **Configurar notificações** de updates
5. **Treinar equipe** no processo

## 📞 Suporte

Para problemas com distribuição direta:
1. Verificar logs do app
2. Verificar logs do EAS
3. Consultar documentação oficial
4. Contatar suporte se necessário
