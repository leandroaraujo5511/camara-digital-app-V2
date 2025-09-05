# Funcionalidade "Ver Pauta" - Visualização de PDF

## Descrição
Foi implementada uma nova funcionalidade no app de votação que permite aos vereadores visualizar o PDF da pauta diretamente na tela de votação através de um side sheet (painel lateral).

## Funcionalidades Implementadas

### 1. Botão "Ver Pauta"
- Adicionado na tela de votação (`VotacaoScreen.tsx`)
- Localizado na seção de informações da votação
- Design consistente com o tema do app
- Ícone de documento e seta indicativa
- **Desabilitado automaticamente** quando não há URL da pauta
- **Texto dinâmico**: "Ver Pauta" ou "Pauta não disponível"

### 2. Componente PautaSideSheet
- Modal em **tela cheia** com animação slide
- Header compacto com título da pauta e botão de fechar
- Visualizador de PDF integrado ocupando **máximo espaço**
- Controles de navegação e zoom
- Tratamento de erros e estados de carregamento
- **Apenas URLs reais** - não mostra PDFs de exemplo

### 3. Integração com WebView
- Biblioteca instalada: `react-native-webview` (compatível com Expo)
- Visualização via Google Docs Viewer
- Fallback para PDF.js viewer
- Navegação por páginas
- Zoom in/out
- Suporte a JavaScript habilitado

## Como Usar

### Para Desenvolvedores

1. **URL do PDF**: A URL do PDF deve ser fornecida através da propriedade `pauta.pdfUrl` na interface `Pauta`
2. **Validação**: Se não houver URL, o botão fica desabilitado e o componente não é renderizado
3. **Estados**: O componente gerencia automaticamente os estados de carregamento e erro
4. **Tela cheia**: O PDF ocupa o máximo espaço disponível na tela

### Para Usuários

1. Na tela de votação, localize o botão "Ver Pauta"
   - Se o botão estiver desabilitado, significa que não há PDF disponível
2. Toque no botão para abrir o side sheet em **tela cheia**
3. O PDF será carregado automaticamente ocupando toda a tela
4. Use gestos para navegar e fazer zoom:
   - Deslizar para cima/baixo: navegar entre páginas
   - Pinch: zoom in/out
   - Toque duplo: zoom automático
5. Toque no "X" no canto superior direito para fechar

## Estrutura de Arquivos

```
src/
├── components/
│   ├── PautaSideSheet.tsx     # Componente principal do side sheet
│   └── index.ts               # Exportações atualizadas
├── interfaces/
│   └── index.ts               # Interface Pauta atualizada com pdfUrl
└── screens/
    └── VotacaoScreen.tsx      # Tela de votação com botão integrado
```

## Dependências Adicionadas

```json
{
  "react-native-webview": "^13.x.x"
}
```

## Configuração Necessária

### Backend
Para que a funcionalidade funcione completamente, o backend deve:

1. **Armazenar URLs de PDF**: Incluir o campo `pdfUrl` na entidade Pauta
2. **Servir PDFs**: Configurar endpoint para servir arquivos PDF
3. **Upload de PDFs**: Implementar funcionalidade de upload de PDFs para pautas

### Exemplo de Estrutura de Dados

```typescript
interface Pauta {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string; // URL do PDF da pauta
  // ... outros campos
}
```

## Tratamento de Erros

O componente inclui tratamento robusto de erros:

- **Erro de carregamento**: Exibe mensagem de erro com botão para tentar novamente
- **PDF não encontrado**: Mostra estado de erro com instruções
- **Problemas de rede**: Permite retry automático
- **Fallback**: Usa PDF de exemplo se não houver URL válida

## Estilos e Temas

O componente segue o design system do app:

- **Cores**: Usa a paleta de cores definida em `colors.ts`
- **Tipografia**: Consistente com o resto do app
- **Espaçamentos**: Segue o padrão de 8px/16px/20px
- **Dark Mode**: Suporte completo ao tema escuro

## Testes

Para testar a funcionalidade:

1. Execute o app: `npm start`
2. Navegue até a tela de votação
3. Selecione uma votação ativa
4. Toque no botão "Ver Pauta"
5. Verifique se o side sheet abre corretamente
6. Teste a navegação e zoom no PDF

## Próximos Passos

1. **Integração com Backend**: Conectar com API real para URLs de PDF
2. **Cache Local**: Implementar cache offline de PDFs
3. **Compartilhamento**: Adicionar funcionalidade de compartilhar PDF
4. **Anotações**: Permitir anotações no PDF
5. **Busca**: Implementar busca no conteúdo do PDF

## Troubleshooting

### Erro "Cannot read property 'getConstants' of null"
**Problema**: Este erro ocorre quando bibliotecas nativas não são compatíveis com Expo.
**Solução**: Substituímos `react-native-pdf` por `react-native-webview` que é totalmente compatível com Expo.

### PDF não carrega
- Verifique se a URL está acessível
- Confirme se o arquivo é um PDF válido
- Teste a conectividade de rede
- O Google Docs Viewer pode ter limitações com alguns PDFs

### Erro de compilação
- Execute `npm install` para instalar dependências
- Verifique se `react-native-webview` está instalado
- Execute `npm run type-check` para verificar tipos
- Para projetos Expo, use `npx expo install react-native-webview`

### Performance
- PDFs grandes podem demorar para carregar
- Considere implementar paginação no backend
- Use cache para melhorar performance
