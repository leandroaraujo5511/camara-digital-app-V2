#!/bin/bash

# Script para executar o app Android sem Expo, resolvendo problemas comuns

set -e

# Garantir que estamos no diretório raiz do projeto
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_DIR"

echo "🚀 Preparando execução do app Android..."

# Definir NODE_ENV
export NODE_ENV=development

# Tentar desinstalar app antigo (pode falhar se não estiver instalado, isso é OK)
echo "📱 Verificando app antigo..."
adb uninstall com.camaradigital.camaradigitalapp 2>/dev/null || echo "App não encontrado ou já removido"

# Listar todos os usuários e tentar desinstalar de cada um
# Extrair IDs de usuários de forma compatível com macOS e Linux
USER_IDS=$(adb shell pm list users 2>/dev/null | sed -n 's/.*UserInfo{\([0-9]*\).*/\1/p' || echo "")
if [ -n "$USER_IDS" ]; then
  for userId in $USER_IDS; do
    echo "Tentando desinstalar do usuário $userId..."
    adb shell pm uninstall --user $userId com.camaradigital.camaradigitalapp 2>/dev/null || true
  done
fi

echo "🧹 Limpando build antigo..."
cd android
./gradlew clean
cd ..

echo "📦 Executando app..."
echo "⚠️  NOTA: O Metro bundler deve estar rodando em outro terminal com 'npm start'"
echo "    Ou use 'expo run:android' que inicia o Metro automaticamente"
expo run:android

