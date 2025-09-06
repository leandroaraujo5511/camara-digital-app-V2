#!/bin/bash

# Script para gerenciar updates do EAS Update
# Uso: ./scripts/update.sh [environment] [message]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  EAS Update Manager${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar se EAS CLI está instalado
check_eas_cli() {
    if ! command -v eas &> /dev/null; then
        print_error "EAS CLI não está instalado. Instale com: npm install -g @expo/eas-cli"
        exit 1
    fi
}

# Verificar se está logado no EAS
check_eas_login() {
    if ! eas whoami &> /dev/null; then
        print_error "Você não está logado no EAS. Faça login com: eas login"
        exit 1
    fi
}

# Função para fazer update
do_update() {
    local environment=$1
    local message=$2
    
    print_message "Iniciando update para ambiente: $environment"
    print_message "Mensagem: $message"
    
    # Fazer o update
    if eas update --channel $environment --message "$message"; then
        print_message "Update enviado com sucesso para $environment!"
        print_message "Os usuários receberão a atualização automaticamente."
    else
        print_error "Falha ao enviar update para $environment"
        exit 1
    fi
}

# Função para listar updates
list_updates() {
    local environment=$1
    
    print_message "Listando updates para ambiente: $environment"
    eas update:list --channel $environment
}

# Função para verificar status
check_status() {
    print_message "Verificando status do projeto..."
    eas project:info
}

# Função principal
main() {
    print_header
    
    # Verificar dependências
    check_eas_cli
    check_eas_login
    
    # Verificar argumentos
    if [ $# -eq 0 ]; then
        echo "Uso: $0 [comando] [argumentos]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  update [environment] [message]  - Enviar update"
        echo "  list [environment]              - Listar updates"
        echo "  status                          - Verificar status"
        echo ""
        echo "Ambientes disponíveis:"
        echo "  development                     - Ambiente de desenvolvimento"
        echo "  preview                         - Ambiente de preview"
        echo "  production                      - Ambiente de produção"
        echo ""
        echo "Exemplos:"
        echo "  $0 update production \"Correção de bugs críticos\""
        echo "  $0 list production"
        echo "  $0 status"
        exit 1
    fi
    
    local command=$1
    
    case $command in
        "update")
            if [ $# -lt 3 ]; then
                print_error "Uso: $0 update [environment] [message]"
                exit 1
            fi
            do_update $2 "$3"
            ;;
        "list")
            if [ $# -lt 2 ]; then
                print_error "Uso: $0 list [environment]"
                exit 1
            fi
            list_updates $2
            ;;
        "status")
            check_status
            ;;
        *)
            print_error "Comando desconhecido: $command"
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"
