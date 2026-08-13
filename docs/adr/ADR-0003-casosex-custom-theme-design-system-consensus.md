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

### 2. Padrões Visuais Glassmorphism & Liquid Design
- **Ultra Thin Glass:** `bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/15`
- **Liquid Cards:** `bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl`
- **Sticky Control Bar:** `bg-neutral-950/80 backdrop-blur-2xl border-b border-neutral-800/80`

### 3. Matriz de Critérios Rígidos do Jury AA (`casosex-theme-aa-consensus.json`)
1. **AA-01 (Zero JS Bloatware):** Componentes estáticos em `.astro` puro; hidratação atômica no React apenas quando visíveis na viewport (`client:visible`).
2. **AA-02 (Liquid Glass & Layering):** Uso estruturado de desfoque de fundo e bordas semi-transparentes para profundidade tridimensional.
3. **AA-03 (Pin Motion & Scroll Pinning):** Animações vinculadas ao scroll para apresentar recursos e variações de produto sem poluição de layout.
4. **AA-04 (Micro-interações de Conversão):** Animação suave no botão de compra, transição de thumbnails sem recarregamento e feedback imediato.
5. **AA-05 (WCAG 2.1 AA Compliance):** Contraste de cor mínimo de 4.5:1, navegação 100% acessível via teclado e respeito à preferência `prefers-reduced-motion`.
6. **AA-06 (Conexão Kernel Direta):** Consumo de dados direto das coleções EmDash (`getEmDashCollection`) fortemente tipadas em TypeScript.

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

- Garantia de que a implementação do tema customizado seguirá regras imutáveis de consenso técnico e estético.
- Eliminação total de código sujo, prevenindo degradação de performance ao longo do tempo.
- Experiência de compra imersiva, moderna e visualmente impactante no mercado brasileiro.
