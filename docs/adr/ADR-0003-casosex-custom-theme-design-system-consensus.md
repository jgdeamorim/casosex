# ADR-0003: Padrões de Design System, Motion, Glassmorphism e Consenso Jury AA para o Tema Customizado CASOSEX (2026+)

- **Status:** Accepted
- **Data:** 2026-08-13
- **Autores:** Jeferson Amorim (Founder) & Antigravity (AI Architect)

---

## Contexto

Para o lançamento do tema customizado e autoral do **CASOSEX** sob a Base de Controle Geral (EmDash CMS + Astro 5.x + Cloudflare D1/R2), necessitamos de um padrão rígido de qualidade visual e técnica (Jury AA) que supere temas comerciais de mercado (ThemeForest/WooCommerce) e estabeleça um padrão de e-commerce 2026+ de altíssimo nível.

---

## Decisão

Formalizar o arquivo de consenso [`docs/spec/casosex-theme-aa-consensus.json`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/casosex-theme-aa-consensus.json) contendo os 6 pilares de qualidade Jury AA para o desenvolvimento do tema:

### 1. Stack Tecnológica de Alta Performance (2026+)
- **Core Engine:** Astro 5.x com **Islands Architecture** (zero JS por padrão).
- **UI Islands Interativas:** React 19 (`client:visible` e `client:idle`).
- **Estilização e Tokens:** Tailwind CSS v4 com variáveis CSS CSS-native e backdrop blur.
- **Animações e Scroll Storytelling:** Framer Motion / Motion v12 (`useScroll`, `useTransform`, `layoutId`).
- **Rolagem Fluida:** Lenis Smooth Scroll v1.x para física de rolagem premium.
- **Transição de Páginas:** Native ViewTransitions API do Astro para trocas de tela com morphing instantâneo sem peso de SPA.

### 2. Padrões Visuais Glassmorphism, Bento Grid & UX Mobile-First
- **Ultra Thin Glass:** `bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/15`
- **Liquid Cards:** `bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl`
- **Sticky Control Bar:** `bg-neutral-950/80 backdrop-blur-2xl border-b border-neutral-800/80`
- **Bento Grid System:** Grids assimétricos `col-span-1 md:col-span-2 lg:col-span-3` com cards hero de destaque e visualização em mosaico dinâmico.
- **UX Mobile-First (Native Feel):** Dock de navegação flutuante inferior no mobile (`fixed bottom-4 left-4 right-4 z-50`), gavetas deslizantes (Sheet Drawers), touch targets de 48px+ e carrosséis com `scroll-snap-x`.
- **Ritmo de Espaçamento & Tipografia Fluida:** Espaçamento vertical cadenciado (`py-12 md:py-20 lg:py-28`) e tamanhos de título escalados com CSS `clamp()`.

### 3. Neuromarketing Sensorial & Psicologia das Cores (`Erotic Luxury & Privacy-First`)
- **Obsidian Depth (`#09090B`):** Fundo escuro imersivo transmitindo sofisticação, mistério e ambiente privado reservado.
- **Crimson Accent (`#E11D48`):** Vermelho vibrante controlado para atração visual e botões de conversão sem vulgaridade.
- **Bordeaux Luxury (`#881337`):** Tom vinho profundo transmitindo elegância, intimidade e toque aveludado.
- **Warm Gold Trust (`#D97706`):** Selos de garantia, discrição e atestado de qualidade dos materiais.
- **Gatilho da Discrição Absoluta (Top Notification):** Barra fixa informando *"Embalagem 100% Discreta · Nome neutro na fatura · Entrega rápida"*.
- **Navegação por Intenção & Desejo:** Categorização por jornada do cliente (*"Para Casais"*, *"Autocuidado & Bem-Estar"*, *"Primeira Experiência"*, *"Intensifique o Prazer"*).

### 4. Técnicas de Engenharia PWA 3.0 & Mobile-First 2026+
- **Sub-50ms Speculation Rules API:** Pré-carregamento preditivo em memória da próxima página antes do clique, eliminando a percepção de carregamento.
- **Astro Native View Transitions:** Animação de morphing de tela direto no navegador (fade/slide nativo do sistema operacional) com 0 KB de JS extra.
- **Container Queries (`@container`):** Componentes auto-responsivos que ajustam seu layout com base no tamanho do seu próprio container pai (sidebar, Bento Grid 1/3 ou Hero), eliminando dependência rígida de `@media`.
- **Web Haptics API (`navigator.vibrate`):** Micro-vibração tátil suave no smartphone durante interações cruciais (Adicionar ao Carrinho, Copiar Chave Pix, Seleção de Variação).
- **Multi-Context Polymorphism:** Um único componente de catálogo adaptando sua interface de acordo com o papel do visitante (B2C Cliente, B2B Atacado ou Afiliado) via `RenderContext`.

### 5. Padrões de Alta Conversão do E-Commerce Brasileiro (UX & Micro-Interações)
- **Gatilho de Desconto no Pix (`Pix OFF`):** Badges visuais de destaque ("5% ou 10% OFF no Pix") ao lado do preço principal nos cards e na visualização rápida.
- **Vendas pelo WhatsApp (`1-Click Conversion`):** Botão nativo de "Comprar pelo WhatsApp" com mensagem pré-formatada direta para o produto desejado.
- **Efeitos de Mouseover em Cards de Produto:**
  - **Image Flip:** Transição suave (300ms) para a imagem secundária (ângulo interno, embalagem ou em uso) ao passar o mouse.
  - **Scale Zoom:** Expansão sutil da foto (`scale-105`) com contêiner recortado.
  - **Quick Add Slide-Up:** Botão "Adicionar ao Carrinho" deslizando com efeito glassmorphism no hover.
- **Top Announcement Bar:** Carrossel rotativo no topo informando Frete Grátis, Parcelamento e Embalagem Discreta.

### 6. Arquitetura de 10 Slots Inteligentes & Matriz Curva ABC
- **Curva A (80% Faturamento):** Vibradores de alta tecnologia, sugadores de ar e lubrificantes premium posicionados no Bento Hero (Slot 2), Vitrine de Giro Rápido (Slot 4) e Cronômetro de Ofertas (Slot 6).
- **Curva B (15% Faturamento / Cross-Sell):** Lingeries de luxo, algemas/kits BDSM suaves e géis sensoriais dispostos na Matriz por Intenção (Slot 3), Quiz de Desejo (Slot 5) e Vitrine Sensual (Slot 8).
- **Curva C (5% Faturamento / Add-On):** Higienizadores de toys, preservativos e acessórios de nicho recomendados via checkout de 1-clique.
- **Desarmamento da Vergonha (Shame Reduction):** Anestesia moral e de privacidade assegurada nos Slots 1 (Top Stealth Bar), Slot 9 (Reviews Anônimos Verificados) e Slot 10 (Footer FAQ de Privacidade).

### 7. Engine de Telemetria de Intenção & Widget de Chat Nativo (Troca de Valor por WhatsApp)
- **Behavioral Telemetry (Beacon Async):** Leitura de `scroll_depth`, `time_on_page`, `hover_category` e `exit_intent` sem impactar o PageSpeed (<2KB JS via `navigator.sendBeacon`).
- **Score de Intenção & Hesitação (0-100):** Cálculo em tempo real no cliente para distinguir entre *Hesitação Financeira* (Preço/Pix) e *Hesitação de Privacidade* (Embalagem/Nome no Cartão).
- **Widget de Chat Nativo (In-Page Glassmorphism):** Interface de atendimento discreto embutida na própria loja (sem abrir o WhatsApp de imediato).
- **Troca de Valor de Cupom por Lead WhatsApp:** O Widget identifica hesitação e aborda o cliente oferecendo um **Cupom Secreto de 5% OFF**. Ao preencher o número do WhatsApp no Widget, o cupom é liberado na tela instantaneamente e enviado por mensagem automatizada para o WhatsApp do cliente.

### 8. Arquitetura de Conteúdo Soberano (Blog SSG) vs. Isenção de Feeds Externos
- **Portal de Autocuidado & SEO Orgânico (Blog SSG):** Renderização 100% estática via Astro Content Collections (`src/content/blog/`) para posicionamento orgânico no Google em buscas de alta intenção ("guia do primeiro toy", "como usar vibrador de sucção").
- **Proibição de Feeds Dinâmicos de Redes Sociais (Anti-Leak & Performance):** Feeds externos (Instagram Widgets/iFrames) são proibidos na home para evitar fuga de tráfego, rastreadores pesados do Meta e quebra visual em caso de shadowban. Substituído por cards estáticos de prova social e link discreto para a rede oficial.

### 9. Matriz de Critérios Rígidos do Jury AA (`casosex-theme-aa-consensus.json`)
1. **AA-01 (Zero JS Bloatware):** Componentes estáticos em `.astro` puro; hidratação atômica no React apenas quando visíveis na viewport (`client:visible`).
2. **AA-02 (Liquid Glass & Depth Layering):** Uso estruturado de desfoque de fundo e bordas semi-transparentes para profundidade tridimensional.
3. **AA-03 (Pin Motion & Scroll Pinning):** Animações vinculadas ao scroll para apresentar recursos e variações de produto sem poluição de layout.
4. **AA-04 (Micro-interações de Conversão):** Animação suave no botão de compra, transição de thumbnails sem recarregamento e feedback imediato.
5. **AA-05 (WCAG 2.1 AA Compliance):** Contraste de cor mínimo de 4.5:1, navegação 100% acessível via teclado e respeito à preferência `prefers-reduced-motion`.
6. **AA-06 (Conexão Kernel Direta):** Consumo de dados direto das coleções EmDash (`getEmDashCollection`) fortemente tipadas em TypeScript.
7. **AA-07 (Bento Grid Architecture 2026+):** Exibição em mosaicos assimétricos responsivos para destaques e lançamentos.
8. **AA-08 (Ritmo de Espaçamento & Fluid Typography):** Cadência vertical padronizada e títulos com escala fluida via `clamp()`.
9. **AA-09 (UX Mobile-First Diferenciada):** Experiência estilo App nativo com dock inferior flutuante, gavetas de carrinho/filtro e alvos de toque de 48px+.
10. **AA-10 (Neuromarketing Sensorial & Privacy-First UX):** Paleta Erotic Luxury, curadoria orientada a intenção/desejo e selos visuais de transparência e discrição absoluta.
11. **AA-11 (Sub-50ms Speculation Rules & View Transitions):** Prefetching preditivo em memória e transições de tela nativas sem peso de SPA.
12. **AA-12 (Container Queries & Multi-Context Polymorphism):** Componentes auto-responsivos via @container e adaptação polimórfica para B2C, B2B e Afiliados.
13. **AA-13 (Web Haptics API & Touch Physics):** Resposta de micro-vibração tátil no smartphone em ações de conversão e física de rolagem Lenis.
14. **AA-14 (Padrões de Alta Conversão do E-Commerce Brasileiro):** Destaque ostensivo de Pix com desconto, botão de Comprar pelo WhatsApp com 1-clique e Image Flip no mouseover dos produtos.
15. **AA-15 (Arquitetura de 10 Slots Inteligentes & Curva ABC):** Distribuição dinâmica de inventário por curva de receita (A/B/C) combinada com eliminadores de objeção moral (Anestesia da Vergonha).
16. **AA-16 (Telemetria de Intenção & Widget de Chat Nativo por Cupom WhatsApp):** Mapeamento comportamental acionando o Widget discreto In-Page, que concede Cupom Secreto de 5% OFF em troca da captação do número do WhatsApp do cliente.
17. **AA-17 (Blog SSG de Autocuidado vs Isenção de Feeds Externos de Redes Sociais):** Presença de Blog SSG para dominância orgânica no Google (SEO) e proibição de widgets/iFrames externos de redes sociais para preservar performance e retenção de tráfego.

---

## Métricas de Validação (Target 2026+)

| Métrica | Target Exigido |
|---|---|
| **Google PageSpeed Mobile** | **≥ 98** |
| **Google PageSpeed Desktop** | **100** |
| **Time to First Byte (TTFB)** | **< 200 ms** (Cloudflare Edge) |
| **Cumulative Layout Shift (CLS)** | **< 0.01** |
| **Interaction to Next Paint (INP)** | **< 50 ms** |

---

## Consequências

- Garantia de que a implementação do tema customizado seguirá regras imutáveis de consenso técnico, estético, ergonômico e neuromarketing.
- Experiência fluida e estilo aplicativo nativo no smartphone sem precisar empacotar um app nativo separado.
- Experiência de compra elegante, discreta e altamente persuasiva no segmento de e-commerce de luxo/bem-estar íntimo.
- Eliminação total de código sujo, prevenindo degradação de performance ao longo do tempo.
