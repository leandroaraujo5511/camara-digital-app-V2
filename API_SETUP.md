# 🔧 Configuração da API

## 📱 Para Dispositivos Físicos

### 1. Descobrir o IP da sua máquina:
```bash
# No macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# No Windows
ipconfig | findstr "IPv4"
```

### 2. Atualizar o arquivo `src/config/api.ts`:
```typescript
export const API_CONFIG = {
  // Substitua pelo IP da sua máquina na rede local
  BASE_URL: 'http://SEU_IP_AQUI:3000',
  TIMEOUT: 10000,
};
```

### 3. Verificar se a API está rodando:
- Certifique-se de que sua API está rodando na porta 3000
- Verifique se o firewall permite conexões na porta 3000
- Teste se consegue acessar `http://SEU_IP:3000` no navegador

## 🌐 Para Produção

Quando for publicar o app, altere para:
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://api.camaradigital.com.br',
  TIMEOUT: 15000,
};
```

## 🔍 Debug

O app mostra no console a configuração atual:
```
🔧 API Config: { baseURL: 'http://192.168.18.96:3000', timeout: 10000, environment: 'development' }
```

## ❗ Problemas Comuns

1. **Network Error**: Verifique se o IP está correto e a API está rodando
2. **Timeout**: Aumente o TIMEOUT se necessário
3. **Firewall**: Verifique se a porta 3000 está liberada
4. **Rede**: Certifique-se de que o dispositivo e a máquina estão na mesma rede




