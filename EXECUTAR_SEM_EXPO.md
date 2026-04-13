# Como Executar o App sem o Expo

Este guia mostra como executar o `vereadorVotingApp` sem usar o Expo Go (aplicativo Expo para testar).

## ⚠️ Importante: Expo CLI vs Expo Go

**Usar `expo start` ou `expo run:android` NÃO significa usar o Expo Go!**

- **Expo CLI** (`expo start`, `expo run:android`): Ferramentas de linha de comando que funcionam perfeitamente com builds nativos. **NÃO abre o Expo Go.**
- **Expo Go**: O aplicativo para testar projetos sem build nativo.

Este projeto já tem builds nativos (`android/` e `ios/`), então você pode usar `expo run:android` que roda o app nativo no seu dispositivo, **sem precisar do Expo Go**.

Os comandos padrão agora usam Expo CLI porque são mais compatíveis e resolvem problemas com o Metro bundler. Se você realmente quiser usar React Native CLI puro, use os scripts `:rn`.

## ✅ Configuração Já Realizada

O projeto já foi configurado para funcionar com React Native CLI:

1. **Eject do Expo**: Executado `npx expo prebuild` para gerar as pastas nativas `android/` e `ios/`
2. **Arquivo index.js**: Criado para o React Native CLI
3. **Package.json**: Atualizado com scripts do React Native CLI
4. **React Native CLI**: Instalado como dependência de desenvolvimento

## 📱 Pré-requisitos

### Para Android:
- Android Studio instalado
- Android SDK configurado
- Emulador Android ou dispositivo físico conectado
- Variáveis de ambiente `ANDROID_HOME` e `JAVA_HOME` configuradas

### Para iOS (apenas macOS):
- Xcode instalado
- CocoaPods instalado (`sudo gem install cocoapods`)
- Simulador iOS ou dispositivo físico

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
cd vereadorVotingApp
npm install
```

### 2. Para Android

#### Solução para erro de assinatura incompatível:
Se você receber o erro `INSTALL_FAILED_UPDATE_INCOMPATIBLE`, siga estes passos:

**Opção 1: Script automático (recomendado)**
```bash
# Usa script que desinstala + limpa + instala
npm run android
```

**Opção 2: Desinstalar manualmente pelo dispositivo**
1. No dispositivo Android, vá em Configurações > Apps
2. Encontre "Camara Digital App" ou "camaradigitalapp"
3. Toque em Desinstalar
4. Depois execute: `npm run android`

**Opção 3: Via ADB (se dispositivo conectado)**
```bash
# Desinstalar do dispositivo conectado
adb uninstall com.camaradigital.camaradigitalapp

# Se falhar, tentar forçar desinstalação de todos os usuários
for userId in $(adb shell pm list users | grep -oP 'UserInfo\{\K[0-9]+'); do
  adb shell pm uninstall --user $userId com.camaradigital.camaradigitalapp 2>/dev/null || true
done

# Depois executar normalmente
npm run android
```

#### Execução normal (recomendado):
```bash
# Opção 1: Usando Expo CLI (recomendado - funciona sem Expo Go)
# O comando abaixo inicia o Metro e executa o app automaticamente
npm run android

# Opção 2: Separadamente (se quiser mais controle)
# Terminal 1: Iniciar Metro bundler
npm start

# Terminal 2: Executar no Android
npm run android
```

**IMPORTANTE:** O comando `npm start` agora usa `expo start --no-dev-client`, que funciona perfeitamente com builds nativos e **NÃO** abre o Expo Go. Você pode usar isso mesmo sem querer usar o Expo!

### 3. Para iOS
```bash
# Instalar dependências iOS (apenas na primeira vez)
cd ios && pod install && cd ..

# Iniciar o Metro bundler
npm start

# Em outro terminal, executar no iOS
npm run ios
```

## 📋 Scripts Disponíveis

### React Native CLI (sem Expo):
- `npm start` - Inicia o Metro bundler
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS

### Expo (ainda disponível):
- `npm run expo:start` - Inicia com Expo
- `npm run expo:android` - Executa Android com Expo
- `npm run expo:ios` - Executa iOS com Expo

## 🔧 Solução de Problemas

### Erro: INSTALL_FAILED_UPDATE_INCOMPATIBLE
Este erro ocorre quando já existe uma versão do app instalada com assinatura diferente (geralmente de builds Expo/EAS).

**Solução:**
```bash
# Opção 1: Desinstalar manualmente
adb uninstall com.camaradigital.camaradigitalapp

# Opção 2: Usar script npm (recomendado)
npm run android:uninstall

# Opção 3: Desinstalar + Limpar + Instalar tudo de uma vez
npm run android:fresh
```

### Erro: Cannot read properties of undefined (reading 'handle')
Este erro ocorre quando você tenta usar `react-native start` diretamente em um projeto Expo.

**Solução:**

**Opção 1: Usar Expo CLI (recomendado)**
```bash
# Expo CLI funciona perfeitamente com builds nativos e NÃO abre Expo Go
npm start              # Usa 'expo start --no-dev-client'
npm run android        # Usa 'expo run:android'
```

**Opção 2: Usar React Native CLI com config alternativa**
```bash
# Usar configuração alternativa do Metro sem Expo
npm run start:rn       # Usa 'react-native start --config metro.config.rn.js'
npm run android:rn     # Script que tenta desinstalar app antigo
```

**Por que isso acontece?**
Projetos Expo usam `expo/metro-config` que tem dependências específicas. O React Native CLI puro não entende essas dependências, causando o erro no middleware `connect`.

### Erro: NODE_ENV não definido
Se aparecer o aviso sobre NODE_ENV, o script já está configurado para definir automaticamente. Se ainda assim ocorrer erro:

```bash
# No macOS/Linux, definir manualmente antes de executar
export NODE_ENV=development
npm run android

# No Windows (PowerShell)
$env:NODE_ENV="development"
npm run android
```

### Erro de Metro Bundler
```bash
# Limpar cache do Metro
npx react-native start --reset-cache
```

### Erro de Build Android
```bash
# Limpar build do Android
cd android
./gradlew clean
cd ..
```

### Erro de Build iOS
```bash
# Limpar build do iOS
cd ios
rm -rf build
pod install
cd ..
```

### Erro de Dependências
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📁 Estrutura do Projeto

Após o eject, o projeto agora possui:
- `android/` - Código nativo Android
- `ios/` - Código nativo iOS
- `index.js` - Ponto de entrada para React Native CLI
- `App.tsx` - Componente principal da aplicação

## ⚠️ Importante

- O projeto ainda mantém compatibilidade com Expo através dos scripts `expo:*`
- As funcionalidades de update automático (EAS Updates) só funcionam com Expo
- Para desenvolvimento local, use os scripts do React Native CLI
- Para produção e updates, continue usando o Expo/EAS

## 🎯 Próximos Passos

1. Teste a execução em ambos os dispositivos
2. Configure o ambiente de desenvolvimento conforme necessário
3. Use o React Native CLI para desenvolvimento local
4. Use o Expo/EAS para builds de produção e distribuição
