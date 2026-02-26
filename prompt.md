📌 PROMPT COMPLETO — League of Legends Companion (Reactix Showcase)
🎯 Objetivo do App

Criar um League of Legends Companion UI Showcase usando Reactix para demonstrar:

Animações performáticas com Reanimated

Composição de UI moderna

Experiência premium

Uso real de múltiplos componentes Reactix

Integração com API pública (Data Dragon) ou dados mockados

Público-alvo: Desenvolvedores React Native

Stack base:

Expo (latest)

Reanimated

Skia (se necessário)

React Navigation

Reactix components

🏗 Estrutura do App
📱 Navegação Principal

Usar:

✅ Curved Bottom Tabs (Reactix)

Tabs:

Home

Champions

Favorites

Settings

A Curved Bottom Tabs deve:

Ter animação suave ao trocar de aba

Ícones animados

Elevação suave no tab ativo

🏠 Tela 1 — Home (Showcase Visual)
Componentes usados:

Aurora (no header usando as cores do campeão selecionado)
Scale Carousel
Animated Header ScrollView
FadeText
Shimmer

Layout:

🔹 Animated Header ScrollView

Header com imagem splash dinâmica
Texto "League Companion"
Header colapsa ao scroll

🔹 Scale Carousel

Destaque de campeões free rotation

Cada card:

Splash art
Nome (FadeText)
Função

Animação de escala centralizada

🔹 Shimmer

Enquanto carrega campeões

🔹 FadeText

Frases icônicas dos campeões aparecendo suavemente

Objetivo dessa tela:
Mostrar animação fluida + scroll performático.

🧙 Tela 2 — Champions

Lista/grid de campeões com filtros.

Componentes usados:

BottomSheet
Shimmer
Dialog
CheckBox
FadeText
Animated Header ScrollView

🔹 Header Animado

Animated Header ScrollView com:
Imagem temática
Título: "Champions"
Subtítulo animado com FadeText

🔹 Grid de Campeões

2 colunas

Cards animados ao aparecer
Shimmer enquanto carrega

Ao clicar em campeão → navegar para Details

🔹 BottomSheet (Filtro)

Botão "Filter"
BottomSheet contém:
CheckBox para roles:
Top
Jungle
Mid
ADC
Support

CheckBox para dificuldade

Botão aplicar

Objetivo:
Demonstrar interação real + composição.

🔹 Dialog

Ao favoritar campeão:

Dialog:
"Add Ahri to favorites?"
Botões:

Cancel

Confirm

🔍 Tela 3 — Champion Details

Essa é a tela mais forte visualmente.

Componentes usados:

Animated Header ScrollView

Scale Carousel

FadeText

Dialog

BottomSheet

🔹 Animated Header

Splash art full width

Nome do campeão

Função

Header colapsa com blur ou efeito overlay

🔹 Seção Lore

Texto usando:

FadeText

Aparece suavemente

🔹 Scale Carousel (Skins)

Lista de skins do campeão.
Escala animada no centro.

🔹 BottomSheet (Stats)

Botão "View Stats"

BottomSheet abre com:

HP

Attack

Defense

Difficulty

Pode animar barras com Reanimated.

⭐ Tela 4 — Favorites

Lista simples:

Grid animado

FadeText

Dialog para remover favorito

Shimmer se vazio/carregando

Se não houver favoritos:
FadeText com mensagem:
"You have no favorite champions yet."

⚙️ Tela 5 — Settings

Tela feita para demonstrar:

Componentes usados:

Animated Scroll Progress

CheckBox

Dialog

BottomSheet

FadeText

🔹 Scroll Terms Screen

Simular:

"Terms and Conditions"

Texto longo

Animated Scroll Progress no topo

Barra progride conforme scroll

Quando chegar a 100%:
Ativar CheckBox "I agree"

🔹 Dialog Final

Ao clicar em continuar:

Dialog:
"Do you accept the terms?"
Confirm / Cancel

🔹 BottomSheet (About Reactix)

Botão:
"About this app"

BottomSheet mostra:

Tecnologias usadas

Expo

Reanimated

Reactix

🧠 Arquitetura Sugerida
/src
  /components
  /features
    /champions
    /favorites
    /settings
  /navigation
  /services
    datadragon.ts
  /mock

Separar:

UI

Lógica

Dados

🌐 API

Pode usar:

Data Dragon:
https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json

Ou usar o mock local ja criado:

champions.json
skins.json
stats.json

Para demo, mock é até melhor (mais controlado). Porém, so tenho o champions.json. Crie todos os outros que formos usar. Fundamental que tenha todos os champions.

🎯 Objetivo Técnico da Demo

Demonstrar:

Uso real de Scale Carousel

Scroll performático com Animated Header

BottomSheet contextual

Dialog controlado por estado

CheckBox integrado a lógica

Scroll Progress sincronizado

Shimmer para loading state

FadeText para microinterações

🚀 Extra (Se quiser impressionar mais)

Dark mode toggle

Micro animações ao favoritar

Hero transition entre lista e detalhes

Haptic feedback

🏆 Resultado Esperado

Um app:

Extremamente fluido

Visualmente moderno

Demonstra domínio da stack

Mostra Reactix como biblioteca production-ready

Impressiona devs experientes