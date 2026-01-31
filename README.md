Link do vídeo demonstração: https://youtu.be/Lru0f3cfVp4


# Participa Fácil - GDF

Aplicação oficial de ouvidoria digital para o Governo do Distrito Federal, desenvolvida para o **1º Hackathon em Controle Social – Desafio Participa DF**.

## 🎯 Objetivo

Facilitar o registro de manifestações cidadãs através de uma interface simples, acessível e inclusiva, permitindo que qualquer cidadão possa se manifestar utilizando:

- ✍️ Texto escrito
- 🎤 Áudio gravado (MediaRecorder API)
- 📷 Imagens (JPG, PNG, WEBP - máx. 10 MB)
- 🎥 Vídeos (MP4, WEBM, OGG - máx. 20 MB e 2 min)

## 🚀 Tecnologias

- **React** 18.2
- **Vite** 5.0
- **TailwindCSS** 3.3
- **React Router** 6.20
- **PWA** (Progressive Web App)
- **MediaRecorder API** (gravação de áudio nativa)
- **File API** (upload de imagens e vídeos)

## 📁 Estrutura do Projeto

```
HackaGDF/
├── public/               # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Layout.jsx
│   │   ├── BottomNav.jsx
│   │   └── ProgressBar.jsx
│   ├── context/         # Context API para estado global
│   │   └── ManifestationDraftContext.jsx
│   ├── hooks/           # Hooks customizados
│   │   └── useAudioRecorder.js
│   ├── pages/           # Páginas da aplicação
│   │   ├── SplashPage.jsx
│   │   ├── WelcomePage.jsx
│   │   ├── FormTextPage.jsx
│   │   ├── FormAudioPage.jsx (gravação real)
│   │   ├── FormMediaPage.jsx
│   │   ├── FormLocationPage.jsx
│   │   ├── FormIdentificationPage.jsx
│   │   ├── ReviewPage.jsx
│   │   └── SuccessPage.jsx
│   ├── App.jsx          # Configuração de rotas
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Instalação e Execução

### Instalar dependências
```bash
npm install
```

### Executar em modo desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview do build
```bash
npm run preview
```

## ✨ Funcionalidades

### Gravação de Áudio (MediaRecorder API)

A aplicação implementa gravação de áudio nativa usando a **MediaRecorder API** do navegador, com:

- ✅ **Detecção automática de formato**: webm > mp4 > ogg (conforme suporte do navegador)
- ✅ **Timer visual**: Contador minutos:segundos em tempo real
- ✅ **Limite de 2 minutos**: Parada automática ao atingir 120 segundos
- ✅ **Player de preview**: `<audio controls>` nativo para ouvir gravação
- ✅ **Tratamento robusto de erros**:
  - Permissão de microfone negada
  - Ausência de microfone
  - Navegador sem suporte
- ✅ **Cleanup automático**: Liberação de tracks e object URLs ao desmontar componente
- ✅ **Acessibilidade WCAG 2.1 AA**:
  - `aria-label` em todos botões
  - `role="status"` para leitores de tela
  - Navegação por teclado (Tab/Enter/Space)
  - Contraste adequado

#### Compatibilidade

| Navegador | Status | Formato |
|-----------|--------|---------|
| Chrome/Edge (desktop) | ✅ Funciona | audio/webm;codecs=opus |
| Chrome (Android) | ✅ Funciona | audio/webm;codecs=opus |
| Firefox | ✅ Funciona | audio/webm ou audio/ogg |
| Safari (iOS/macOS) | ⚠️ Limitado | audio/mp4 (pode ter restrições) |

**Nota**: Em produção, o áudio seria enviado via `multipart/form-data`. Atualmente armazenado apenas em memória durante a sessão.

### Outras Funcionalidades

- 🔐 **Anonimato opcional** - Manifestações podem ser enviadas anonimamente
- 📱 **PWA** - Pode ser instalado como aplicativo
- ♿ **WCAG 2.1 AA** - Totalmente acessível
- 🌙 **Dark mode** - Suporte a tema escuro
- 📊 **Progresso visual** - Barra de progresso no formulário multi-etapas
- 🔒 **LGPD** - Conformidade com a Lei Geral de Proteção de Dados

## 🎨 Diretrizes de Design

- ✅ Layout limpo, funcional e institucional
- ✅ Linguagem simples e humana
- ✅ Alto contraste e cores sóbrias
- ❌ Sem jargões técnicos ou burocráticos
- ❌ Sem elementos decorativos supérfluos

## 🧪 Testes Manuais - Gravação de Áudio

Para testar a funcionalidade de gravação:

1. Navegar para `/form-audio`
2. Clicar em "Gravar"
3. Conceder permissão de microfone quando solicitado
4. Falar por alguns segundos (observar timer incrementando)
5. Clicar em "Parar"
6. Verificar player de áudio com duração correta
7. Reproduzir áudio para confirmar gravação
8. Clicar em "Gravar novamente" para testar reset
9. Verificar que timer voltou a 00:00

**Teste de erro**:
- Negar permissão → Deve exibir mensagem clara
- Desconectar microfone → Deve exibir erro amigável

## 🤖 Integração com IA IZA (Mock)

O sistema inclui classificação automática de manifestações usando a **IA IZA** (simulação para demonstração).

### O que é a IZA?

A IA IZA (Inteligência Artificial do GDF) é um sistema de classificação automática que analisa o conteúdo da manifestação e sugere:

- **Categoria** (Saúde, Transporte, Educação, Segurança Pública, etc.)
- **Órgão responsável** (Secretarias do GDF)
- **Prioridade** (BAIXA, MÉDIA ou ALTA)
- **Tags** indicadoras do conteúdo
- **Alertas de privacidade** (se detectar dados pessoais como CPF, e-mail, telefone)
- **Justificativa** da classificação

### Como Funciona (Mock)

**IMPORTANTE**: Esta é uma **simulação realista** para demonstração. Em produção, seria integrada com a IA IZA real do GDF.

A heurística de classificação analisa:

1. **Palavras-chave**: Dicionário com +60 termos por categoria
2. **Urgência**: Detecta termos como "risco", "perigo", "emergência"
3. **Privacidade**: Regex para CPF, e-mail, telefone, RG, endereços
4. **Confidence Score**: Baseado na quantidade e peso dos matches

#### Exemplo de Classificação

**Entrada**:
```
"Preciso de atendimento urgente na UPA de Ceilândia"
```

**Saída**:
```json
{
  "category": "Saúde",
  "suggestedAgency": "Secretaria de Saúde do DF",
  "priority": "ALTA",
  "tags": ["UPA", "Atendimento", "Urgente"],
  "privacyAlert": false,
  "confidence": 0.85,
  "rationale": "Classificado como 'Saúde' com base em 3 indicador(es) identificado(s). Prioridade ALTA devido a indícios de urgência."
}
```

### Categorias Disponíveis

| Categoria | Órgão Sugerido | Palavras-chave (exemplos) |
|-----------|----------------|----------------------------|
| **Saúde** | Secretaria de Saúde do DF | hospital, upa, médico, consulta, vacina |
| **Transporte** | Secretaria de Transporte e Mobilidade do DF | ônibus, metrô, dftrans, parada, bilhete |
| **Educação** | Secretaria de Educação do DF | escola, professor, creche, matrícula |
| **Segurança Pública** | Secretaria de Segurança Pública do DF | assalto, polícia, violência, ameaça |
| **Serviços Urbanos** | SLU / NOVACAP / CAESB | lixo, buraco, iluminação, água, esgoto |
| **Fiscalização** | DF Legal | som alto, barulho, perturbação |
| **Geral** | Ouvidoria-Geral do DF | (fallback) |

### Detecção de Privacidade

O sistema detecta automaticamente:
- ✅ CPF (11 dígitos)
- ✅ E-mail (regex completo)
- ✅ Telefone BR (com DDD)
- ✅ RG (padrões comuns)
- ✅ Endereços (Rua/Av. + número)

Quando detectado, exibe **alerta de privacidade** sugerindo tratamento não público.

### Arquitetura da Integração

```
┌─────────────────────────────────────────┐
│  ManifestationDraftContext              │
│  (Estado Global)                        │
└─────────────────────────────────────────┘
                  │
                  │ submit()
                  ▼
┌─────────────────────────────────────────┐
│  mockApi.submitManifestation()          │
│  (Envio da manifestação)                │
└─────────────────────────────────────────┘
                  │
                  │ Sucesso
                  ▼
┌─────────────────────────────────────────┐
│  izaService.classifyWithIZA()           │
│  - Normalização de texto                │
│  - Matching de keywords                 │
│  - Detecção de privacidade              │
│  - Cálculo de confidence                │
└─────────────────────────────────────────┘
                  │
                  │ IZAResult
                  ▼
┌─────────────────────────────────────────┐
│  SuccessPage                            │
│  └─ IZAClassificationCard               │
│     (Exibição visual da classificação)  │
└─────────────────────────────────────────┘
```

### Testes

Executar testes do serviço IZA:

```bash
npm test src/services/__tests__/izaService.test.js
```

Cobertura de testes:
- ✅ Classificação por categoria (Saúde, Transporte, etc.)
- ✅ Detecção de dados pessoais (CPF, e-mail, telefone)
- ✅ Priorização (BAIXA/MÉDIA/ALTA)
- ✅ Fallback para Ouvidoria-Geral
- ✅ Extração de tags
- ✅ Confidence score (0 a 1, duas casas decimais)

### Conexão com IZA Real (Produção)

Em produção, a integração seria feita via:

**Endpoint (hipotético)**:
```
POST https://api.iza.df.gov.br/v1/classify
```

**Request**:
```json
{
  "text": "conteúdo da manifestação",
  "channel": "text",
  "attachments": [...]
}
```

**Response**:
```json
{
  "category": "Saúde",
  "agency_id": "SES-DF",
  "priority": "ALTA",
  "confidence": 0.85
}
```

O mock atual implementa a mesma interface, facilitando a substituição futura.

## 📄 Licença

Aplicação oficial do Governo do Distrito Federal
