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

### 4. Matriz de Critérios Rígidos do Jury AA (`casosex-theme-aa-consensus.json`)
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
