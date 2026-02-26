# League of Legends Companion — Reactix Showcase

Aplicativo **League of Legends Companion** construído como **showcase** da biblioteca **[Reactix](https://www.reacticx.com/)** (React Native Component Library). O foco do projeto é demonstrar o uso real de múltiplos componentes inspirados/da Reactix em um app completo, com animações performáticas, composição de UI moderna e experiência premium.

---

## Objetivo do Projeto

- **Apresentar a lib Reactix** e seu ecossistema de componentes prontos para produção.
- Demonstrar **animações fluidas** com React Native Reanimated.
- Mostrar **composição de UI** moderna (headers animados, carrosséis, bottom sheets, dialogs).
- Integrar dados de campeões (mock local + referência ao Data Dragon da Riot).

**Público-alvo:** Desenvolvedores React Native que queiram conhecer ou adotar componentes Reactix em seus projetos.

---

## Sobre a Reactix

A **Reactix** é uma biblioteca moderna de componentes para React Native que oferece **60+ componentes** prontos para produção, com animações suaves e suporte a Expo. Os componentes são pensados para serem **copiados e colados** no seu projeto (copy & paste), sem necessidade de instalar um pacote npm da lib em si — você adiciona apenas as dependências que cada componente exige (Reanimated, Skia, etc.).

- **Site e documentação:** [reacticx.com](https://www.reacticx.com/)
- **Repositório:** [rit3zh/reacticx](https://github.com/rit3zh/reacticx)

### Como adicionar um componente Reactix ao seu projeto

Você pode adicionar componentes ao projeto usando o CLI oficial. Exemplo para adicionar o componente **Aurora**:

```bash
npx reacticx add aurora
```

Outras formas (conforme documentação):

```bash
bunx --bun reacticx add aurora
```

Ou, manualmente: instalar as dependências necessárias e copiar o código do componente a partir da [documentação](https://www.reacticx.com/docs) para o seu código.

**Exemplos de componentes que você pode adicionar:**

- `npx reacticx add aurora`
- `npx reacticx add dialog`
- `npx reacticx add shimmer`
- Entre outros listados em [reacticx.com/docs](https://www.reacticx.com/docs)

---

## Documentação Utilizada


| Recurso                                                             | Descrição                                                                                                                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **[Reactix — Documentação oficial](https://www.reacticx.com/docs)** | Catálogo de componentes, exemplos e requisitos de cada um.                                                                                                         |
| **[Reactix — Sobre](https://www.reacticx.com/docs/about)**          | Visão geral, requisitos (Expo, Reanimated, Skia, etc.) e boas práticas.                                                                                            |
| `**prompt.md`** (este repositório)                                  | Prompt completo do showcase: objetivo do app, estrutura de telas, componentes por tela, arquitetura sugerida e dados (mock/API). Usado como guia de implementação. |


---

## Bibliotecas Necessárias e Utilizadas

Para que o showcase funcione, o projeto utiliza as seguintes dependências (todas compatíveis com **Expo SDK 55**):

### Navegação e roteamento

- **expo-router** — Roteamento baseado em arquivos (tabs + stack).
- **@react-navigation/native** e **@react-navigation/bottom-tabs** — Navegação e integração da tab bar customizada.

### Animações e gráficos (essenciais para Reactix)

- **react-native-reanimated** — Animações 60fps (headers, carrosséis, transições).
- **@shopify/react-native-skia** — Gráficos e efeitos visuais (ex.: Aurora).
- **react-native-worklets** — Worklets para animações no thread nativo.
- **react-native-easing-gradient** — Gradientes com easing (usado em alguns componentes).

### UI e efeitos

- **expo-blur** — Blur no header e overlays.
- **expo-linear-gradient** — Gradientes no header e botões.
- **@react-native-masked-view/masked-view** — Máscaras para efeitos visuais.
- **react-native-svg** — Ícones e formas vetoriais.
- **react-native-gesture-handler** — Gestos (arraste, toque).

### Utilitários e experiência

- **react-native-safe-area-context** — Safe area para notch e barra de status.
- **react-native-screens** — Otimização de telas na navegação.
- **expo-haptics** — Feedback háptico (opcional).
- **@expo/vector-icons** / **expo-symbols** — Ícones (tab bar, botões).

### Dados e tipos

- Dados de campeões via **mock local** (`src/mock/champions.json`) e URLs do **Data Dragon** (CDN Riot) para splash arts e imagens.

Todas as versões estão definidas em `**package.json`**; para instalar:

```bash
npm install
```

---

## Telas Implementadas

### 1. Home (`/`)

- **Objetivo:** Showcase visual com scroll performático e animações.
- **Componentes usados:**
  - **Animated Header ScrollView** — Header com título “League Companion” que colapsa ao rolar.
  - **Aurora** — Efeito de aurora no topo (cores do tema/campeão).
  - **Scale Carousel** — Destaque da rotação gratuita de campeões; cards com splash art, nome (FadeText) e função; escala animada no centro.
  - **FadeText** — Nomes e frases dos campeões com aparição suave.
  - **Shimmer** — Estado de carregamento inicial.
- **Dados:** Campeões da rotação gratuita (mock) e splash arts via Data Dragon.

### 2. Champions (`/champions`)

- **Objetivo:** Lista/grid de campeões com filtros e interação real.
- **Componentes usados:**
  - **Animated Header ScrollView** — Header com título “Champions” e subtítulo animado (FadeText).
  - **Shimmer** — Enquanto carrega a lista.
  - **BottomSheet** (filtro) — Botão “Filter” abre sheet com **CheckBox** para roles (Top, Jungle, Mid, ADC, Support) e dificuldade; botão aplicar.
  - **Dialog** — Ao favoritar: “Add [Nome] to favorites?” com Cancel / Confirm.
  - **FadeText** — Microinterações e subtítulo.
- **Navegação:** Toque em um campeão leva à tela de detalhes (`/champions/[id]`).

### 3. Champion Details (`/champions/[id]`)

- **Objetivo:** Tela mais rica visualmente; detalhes do campeão.
- **Componentes usados:**
  - **Animated Header ScrollView** — Splash art em largura total, nome, título; header colapsa com gradiente/blur.
  - **FadeText** — Lore e textos que aparecem suavemente.
  - **Scale Carousel** — Skins do campeão; escala animada no centro.
  - **BottomSheet (Stats)** — Botão “View Stats” abre sheet com HP, Attack, Defense, Difficulty (barras animáveis).
- **Comportamento:** Tab bar pode ser ocultada na tela de detalhes; botão voltar e favoritar.

### 4. Favorites (`/favorites`)

- **Objetivo:** Lista de campeões favoritos com remoção.
- **Componentes usados:**
  - Grid animado com **ChampionCard**.
  - **FadeText** — Mensagens e nomes.
  - **Dialog** — Ao remover: “Remove [Nome] from favorites?” com Cancel / Remove.
  - **Shimmer** — Estado vazio ou carregando.
  - **FadeText** — Mensagem “You have no favorite champions yet.” quando não há favoritos.

### 5. Settings (`/settings`)

- **Objetivo:** Demonstrar scroll longo, progresso e termos.
- **Componentes usados:**
  - **Animated Scroll Progress** — Barra de progresso no topo que avança conforme o scroll; ao atingir ~100% libera o **CheckBox** “I agree”.
  - **CheckBox** — “I agree to the terms” habilitado apenas após scroll completo.
  - **Dialog** — Ao continuar: “Do you accept the terms?” com Confirm / Cancel.
  - **BottomSheet (About)** — Botão “About this app” abre sheet com tecnologias: Expo, Reanimated, Reactix, etc.
  - **FadeText** — Textos da tela.

---

## Componentes do Showcase (estilo Reactix)

Os componentes abaixo foram implementados ou adaptados no projeto para refletir o estilo e a filosofia da Reactix (animados, reutilizáveis, composáveis):


| Componente                     | Categoria       | Onde é usado                                                   |
| ------------------------------ | --------------- | -------------------------------------------------------------- |
| **Curved Bottom Tabs**         | Navegação       | Tab bar principal (Home, Champions, Favorites, Settings)       |
| **Aurora**                     | Shader / Efeito | Home (header)                                                  |
| **Scale Carousel**             | Carrossel       | Home (rotação gratuita), Champion Details (skins)              |
| **Animated Header ScrollView** | Layout          | Home, Champions, Champion Details                              |
| **FadeText**                   | Texto           | Todas as telas (nomes, lore, mensagens)                        |
| **Shimmer**                    | Loading         | Home, Champions, Favorites                                     |
| **BottomSheet**                | Overlay         | Champions (filtro), Champion Details (stats), Settings (about) |
| **Dialog**                     | Overlay         | Champions (favoritar), Favorites (remover), Settings (termos)  |
| **CheckBox**                   | Form            | Champions (filtros), Settings (I agree)                        |
| **Animated Scroll Progress**   | Microinteração  | Settings (termos)                                              |


---

## Estrutura do Projeto

```
src/
├── app/
│   ├── _layout.tsx              # Root layout (providers: Favorites, TabBarVisibility)
│   ├── index.tsx                # Redirect para /(tabs)
│   └── (tabs)/
│       ├── _layout.tsx          # Tabs + CurvedBottomTabs
│       ├── index.tsx            # Home
│       ├── champions/
│       │   ├── _layout.tsx      # Stack para lista + detalhes
│       │   ├── index.tsx        # Lista de campeões
│       │   └── [id].tsx         # Detalhes do campeão
│       ├── favorites/
│       │   └── index.tsx        # Favoritos
│       └── settings/
│           └── index.tsx        # Configurações e termos
├── components/
│   ├── base/
│   │   └── curved-bottom-tabs/  # Tab bar curva (Reactix-style)
│   ├── molecules/
│   │   ├── aurora/              # Efeito Aurora
│   │   ├── scale-carousel/      # Carrossel com escala
│   │   └── Shimmer/             # Shimmer loading
│   ├── organisms/
│   │   ├── animated-header-scrollview/
│   │   ├── fade-text/
│   │   ├── dialog/
│   │   └── check-box/
│   ├── templates/
│   │   └── bottom-sheet/
│   └── micro-interactions/
│       └── animated-scroll-progress/
├── contexts/
│   ├── favorites-context.tsx    # Estado global de favoritos
│   └── tabbar-visibility-context.tsx  # Ocultar tab bar (ex.: detalhes)
├── features/
│   └── champions/
│       └── components/          # ChampionCard, FiltersBottomSheet
├── services/
│   └── champions.ts            # API mock + URLs Data Dragon
├── mock/
│   └── champions.json          # Dados dos campeões
├── theme/
│   └── colors.ts
└── types/
    └── champion.ts
```

---

## Como Rodar

**Pré-requisitos:** Node.js, npm (ou yarn/pnpm) e, para dispositivo físico, Expo Go.

1. Clone o repositório e entre na pasta do projeto.
2. Instale as dependências:
  ```bash
   npm install
  ```
3. Inicie o projeto:
  ```bash
   npm start
  ```
   Ou, para plataforma específica:
4. Escaneie o QR code com o Expo Go (Android/iOS) ou use o emulador/simulador.

---

## Dados e API

- **Campeões:** Lista e detalhes vêm do **mock** `src/mock/champions.json` (compatível com o formato do Data Dragon).
- **Imagens:** Splash arts e ícones usam a CDN do **Data Dragon** (Riot Games), por exemplo:  
`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{id}_{skin}.jpg`

O uso de dados e assets é apenas para fins de demonstração; League of Legends e Riot Games são marcas de Riot Games, Inc.

---

## Resumo

Este projeto é um **showcase focado na biblioteca Reactix**: demonstra como combinar vários componentes (Aurora, Scale Carousel, Animated Header ScrollView, FadeText, Shimmer, Curved Bottom Tabs, BottomSheet, Dialog, CheckBox, Animated Scroll Progress) em um app completo e fluido. Para adicionar mais componentes Reactix ao seu próprio projeto, use comandos como:

```bash
npx reacticx add aurora
```

e consulte a documentação em **[reacticx.com](https://www.reacticx.com/docs)** e o `**prompt.md`** deste repositório para o desenho das telas e da arquitetura.