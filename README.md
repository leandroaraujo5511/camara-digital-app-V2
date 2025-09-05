# Vereador Voting App

Aplicativo React Native para vereadores votarem nas pautas da Câmara Municipal.

## 🚀 Funcionalidades

- **Autenticação**: Login seguro para vereadores
- **Visualização de Pautas**: Lista todas as pautas disponíveis para votação
- **Sistema de Votação**: Interface intuitiva para registrar votos (SIM, NÃO, ABSTENÇÃO, AUSENTE)
- **Histórico**: Acompanhamento de votações realizadas
- **Interface Responsiva**: Design moderno e otimizado para dispositivos móveis

## 🛠️ Tecnologias

- **React Native** com Expo
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **Axios** para requisições HTTP
- **AsyncStorage** para persistência local
- **date-fns** para manipulação de datas

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button/         # Botão customizável
│   ├── Input/          # Campo de entrada
│   └── PautaCard/      # Card de pauta
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── interfaces/         # Interfaces TypeScript
│   └── index.ts        # Definições de tipos
├── screens/            # Telas do aplicativo
│   ├── LoginScreen.tsx # Tela de login
│   ├── HomeScreen.tsx  # Tela principal
│   └── VotingScreen.tsx # Tela de votação
├── services/           # Serviços de API
│   ├── auth.service.ts # Serviço de autenticação
│   └── voting.service.ts # Serviço de votação
├── styles/             # Estilos e temas
│   └── colors.ts       # Sistema de cores
└── lib/                # Configurações
    └── api.ts          # Configuração do Axios
```

## 🔧 Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd vereadorVotingApp
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API:
   - Edite o arquivo `src/lib/api.ts`
   - Altere a `baseURL` para sua API

4. Execute o projeto:
```bash
# Para desenvolvimento
npm start

# Para Android
npm run android

# Para iOS
npm run ios
```

## 📋 Configuração da API

O aplicativo espera uma API REST com os seguintes endpoints:

### Autenticação
- `POST /auth/login` - Login do vereador
- `GET /auth/me` - Dados do usuário atual

### Vereadores
- `GET /vereadores/:id` - Dados de um vereador específico
- `GET /vereadores/me` - Dados do vereador logado

### Pautas
- `GET /pautas?status=UNDER_REVIEW` - Pautas disponíveis para votação

### Votações
- `GET /votacoes?status=IN_PROGRESS` - Votações ativas
- `GET /votacoes?status=WAITING` - Votações aguardando
- `GET /votacoes?status=COMPLETED` - Histórico de votações

### Votos
- `POST /votes` - Registrar novo voto
- `PUT /votes/:id` - Atualizar voto existente
- `GET /votes?votacaoId=:id&vereadorId=:id` - Buscar voto específico

## 🎨 Sistema de Design

O aplicativo utiliza um sistema de design consistente com:

- **Cores semânticas**: Primary, Secondary, Success, Error, Warning
- **Tipografia hierárquica**: Títulos, subtítulos, corpo de texto
- **Espaçamento consistente**: Sistema de margens e padding padronizado
- **Componentes reutilizáveis**: Botões, inputs e cards padronizados

## 📱 Telas

### Login
- Formulário de autenticação
- Validação de campos
- Tratamento de erros

### Home
- Header com informações do vereador
- Abas para navegar entre seções
- Lista de pautas, votações e histórico
- Pull-to-refresh para atualizar dados

### Votação
- Detalhes da pauta
- Interface de votação intuitiva
- Botões para cada opção de voto
- Confirmação e atualização de votos

## 🔒 Segurança

- Autenticação via JWT
- Interceptadores para adicionar token automaticamente
- Tratamento de tokens expirados
- Validação de formulários

## 📊 Performance

- Lazy loading de componentes
- Otimização de re-renders
- Cache de dados em memória
- Pull-to-refresh para atualizações

## 🧪 Testes

Para executar os testes:
```bash
npm test
```

## 📦 Build

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para a Câmara Digital**



