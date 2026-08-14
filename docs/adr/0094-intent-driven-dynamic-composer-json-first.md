# ADR-0094 · Intent-Driven Dynamic Composer — Arquitetura de Composição Soberana JSON-First

- **Status**: Accepted (Selado v1.1.0)
- **Data**: 2026-08-14
- **Autores**: Jeferson Amorim (Founder) & Antigravity (AI Pair)
- **Extends**: ADR-0016 (Hetzner CAX11 $5.39), ADR-0036 (BLUE/GREEN), ADR-0054 (Intent-Driven Slots), ADR-0058 (Zero Hardcoded Slots), ADR-0060 (Warp Surface Modularization), ADR-0062 (BLAKE3 KV Cache), ADR-0074 (Anti-Jargão SMB), ADR-0077 (Semantic Motion Engine), ADR-0080 (Layout Technique Facets), ADR-0081 (dct-motion Zero-Dependency Runtime), ADR-0084 (Paridade BLUE/GREEN), ADR-0086 (BLUE/GREEN React 19 + shadcn/ui)
- **Domínio**: `apps/web/src/lib/`, `packages/warp/src/`, `docs/spec/`, `docs/adr/`

---

## §0 · Diagnóstico & Fundamentação Teórica (`medido=verdade`)

### 0.1 Inadequação dos Construtores Visuais & CMSs Acoplados
Sistemas tradicionais de CMS (WordPress, Gutenberg, Elementor, EmDash acoplado com Admin UI) operam na cadeia imperativa:
$$\text{Interface Visual (Drag \& Drop / Admin GUI)} \xrightarrow[\text{Atrito Manual}]{\text{Hardcode / State}} \text{JSON / AST Interno} \xrightarrow[\text{Lento / Overhead}]{\text{PHP / React Dynamic}} \text{HTML / DOM}$$

Esta arquitetura apresenta falhas estruturais críticas no ecossistema Adsentice (SMB Brasil):
1. **Incompatibilidade com Agentes de IA Autônomos (2026+)**: Agentes de IA (Qwen 2.5 local $0 e DeepSeek cost-capped $0.0005/call) operam emitindo contratos de dados determinísticos; eles são incapazes de realizar ações por cliques manuais em interfaces visuais.
2. **Fragilidade de Código & Quebra de Bundles**: Alterar o código-fonte de renderizadores de admin (ex: TanStack Router, vite-bundles) força recompilações complexas via `tsdown`, gerando erros de importação ESM e travamentos de interface no cliente.
3. **Inconsistência de Brand DNA**: Permitir edição visual direta introduz estilos ad-hoc (hexadecimais arbitrários, fontes desconexas), violando a identidade estritamente regulada pelo Materio/OpenDesign.
4. **Degradação de Performance**: Motores visuais injetam CSS redundante e executam queries ao banco de dados no momento da renderização, elevando a latência do primeiro byte (TTFB > 800ms).

### 0.2 O Princípio Intent-Driven Universal
A ADR-0094 ratifica a inversão soberana e **universal** de modelo para **qualquer superfície ou tipo de conteúdo**:
$$\text{Intent Prompt + Telemetria Mautic (BLUE)} \xrightarrow[\text{OODA-BOA + 55 Skills}]{\text{Schwartz 5 Levels}} \text{RenderContext (JSON Universal)} \xrightarrow[\text{Cego / < 2ms}]{\text{TechniqueRenderers (GREEN)}} \text{UI/UX Soberana}$$

### 0.3 O Papel Host do Astro 5.x & O EmDash/DashCommerce Headless
- **Astro 5.x como Roteador e Compilador HTTP de Borda**: O Astro atua exclusivamente como o servidor HTTP minimalista (Zero JS Client por padrão), recebendo requisições e delegando a compilação do HTML ao `warp-composer.ts`.
- **EmDash + DashCommerce como Módulos Headless de Coleções**: O EmDash e o DashCommerce deixam de rodar interfaces administrativas visuais acopladas e funcionam estritamente como conectores e provedores de coleções de dados (`getEmDashCollection`), entregando JSON puro para o Intent-Driven Composer.

---

## §1 · Generalização Universal, Matrizes por Variante & O Padrão Canônico de Especificação

> ⚠️ **Invariante de Arquitetura**: A matriz estabelecida na **ADR-0003** e no `casosex-theme-aa-consensus.json` é a especificação canônica para a variante **Home de E-Commerce (S13)**. Para outras páginas, tais como **Landing Pages Comerciais por Nicho** (ex: `variante=delivery`, `variante=odonto`, `variante=saas`), a matriz de slots dinâmicos e sessões se adapta polimorficamente à chamada específica.

### 1.1 Cobertura de Superfícies do Ecossistema (S0 a S21)

| Família de Superfícies | IDs | Exemplo de Aplicação Intent-Driven |
| :--- | :--- | :--- |
| **Superfícies de Conversão & Audit** | `S10`, `S11` | Raio-X Diagnóstico, Landing Pages Comerciais por Nicho (`variante=delivery`, `variante=odonto`). |
| **Superfícies de Conteúdo & Blog** | `S7`, `S12` | Artigos de Blog dinâmicos, Central de Documentação, Guias Locais SEO. |
| **Superfícies de E-Commerce & Catalogs** | `S13` | Catálogo Dinâmico, Home de E-Commerce (Matriz 10 Slots Curva ABC). |
| **Superfícies de Gestão & Cockpits** | `S0`..`S6`, `S8`, `S9` | Painel Administrativo, Cockpit CRM de Leads, Monitor Sentinela ao Vivo. |
| **Superfícies Operacionais Swarm** | `S14`..`S21` | Cockpits de Agentes Autônomos, Analytics Avançado de Conversão. |

### 1.2 Resolução Polimórfica de Slots por Variante (`Polymorphic Slot Matrix per Variant`)
Quando o sistema recebe uma chamada para uma superfície, o **Especialista da Camada BLUE** resolve a matriz de slots dinâmicos conforme a variante solicitada:

#### Exemplo A: Variante Home E-Commerce (`S13` / `variante=ecommerce_home`)
- **Slot 1**: Top Stealth Bar (Anestesia da Vergonha & Discrição).
- **Slot 2**: Bento Hero (Produtos Curva A - 80% Faturamento).
- **Slot 3**: Matriz por Intenção & Desejo (Curva B).
- **Slot 4**: Vitrine de Giro Rápido (Pix 10% OFF).
- **Slot 10**: Footer Privacy FAQ & Garantias.

#### Exemplo B: Variante Landing Page Delivery (`S11` / `variante=delivery`)
- **Slot 1**: Hero Impact com Destaque para Tempo de Entrega e Retenção de Pedidos Pix.
- **Slot 2**: Calculadora Interativa de Perda de Faturamento por Pedidos Atrasados.
- **Slot 3**: Matriz de Evidências Locais (GMB / Meta Ads no Nicho de Gastronomia).
- **Slot 4**: Tabela Comparativa de Planos (Sentinela R$197 vs Escala R$997).
- **Slot 5**: CTA de Ativação Instantânea com Modal Pix.

---

## §2 · O Workflow de Autoria Soberano: Do Intent-Prompt às Sequências de JSON (`Authoring Intent Pipeline`)

Em vez de abrir um editor visual (Gutenberg/Elementor) e arrastar blocos manualmente, a criação de **qualquer novo item (página, post, produto ou landing page)** ocorre através de um **Prompt de Intenção (Intent Prompt)** que dispara uma sequência encadeada de 5 etapas determinísticas na Camada BLUE:

### 2.1 As 5 Etapas da Sequência de Geração de Conteúdo

1. **Etapa I: Captura do Intent Prompt & Parâmetro de Variante**:
   - O criador submete o prompt informando o objetivo e a variante.
2. **Etapa II: Seleção da Matriz Polimórfica de Slots**:
   - O Especialista da Superfície lê a variante e seleciona a sequência exata de slots dinâmicos.
3. **Etapa III: Atribuição de Facetas Semânticas 7D (`VocabResolver`)**:
   - Calcula o tom (`tone`), o arquétipo (`archetype`), a densidade (`density`) e a técnica de layout visual (`layoutTechniqueFacets`).
4. **Etapa IV: Síntese de Conteúdo & Copywriting (DeepSeek / Qwen $0)**:
   - Aplica os 5 Níveis de Consciência de Eugene Schwartz e os 55 Marketing Skills auditados.
5. **Etapa V: Validação Jury AA & Emissão do `RenderContext` JSON**:
   - Submete o JSON ao portão de qualidade Jury AA (score >= 0.85 contra as regras `AA-01`..`AA-18`) e envia para o Renderizador Cego GREEN (< 2ms).

---

## §3 · As 6 Doutrinas Fundamentais do Intent-Driven Composer

### 3.1 Doutrina I — O RenderContext como Única Fonte da Verdade
O `RenderContext` (JSON puro) é o contrato imutável e autossuficiente emitido pela sequência de autoria que descreve a totalidade da página. O renderizador não faz suposições nem consulta dados externos.

### 3.2 Doutrina II — Cegueira Absoluta da Camada GREEN (Blind Renderer)
O motor de renderização GREEN (`composer-core.ts` e renderizadores folha) opera como uma função matemática pura: $f(\text{RenderContext}) \to \text{HTML/JSX}$ em menos de 2ms.

### 3.3 Doutrina III — Desacoplamento Sagrado BLUE / GREEN (ADR-0036 & ADR-0084)
- **Camada BLUE**: Executa a inteligência de autoria, resolve a variante polimórfica de slots e valida o JSON no Jury AA.
- **Camada GREEN**: Renderiza o HTML puro com CSS nativo e zero hydration bloat.

---

## §4 · Integração da Telemetria Mautic, Psicologia de Persuasão & Loop OODA-BOA

### 4.1 Behavioral Telemetry Estilo Mautic (<2KB Async Beacon)
- O cliente interage com a página enquanto um tracker ultra-leve (<2KB) envia sinais de comportamento via `navigator.sendBeacon`.
- Mede em tempo real: `scroll_depth`, `dwell_time`, `hover_hesitation` (diferenciando hesitação financeira de hesitação por vergonha/privacidade) e `exit_intent`.

### 4.2 Cérebro de Persuasão (55 Marketing Skills & Níveis de Schwartz)
- O Especialista BLUE alinha o payload de cada slot com o nível exato de consciência do visitante (*Unaware* ──► *Most Aware*).
- Injeta atratores psicológicos (*Authority Bias*, *Cognitive Fluency*, *Progress Bias*) calibrados pelo estado Afetivo BOA (`adsentice:boa:score`).

---

## §5 · Compilação SWC (Rust) & Deploy Cloudflare Edge Workers/Pages

- O compilador **SWC (Rust)** transpila o motor GREEN em um bundle Web-Standard de **`< 50 KB`**.
- Operação em **Cold Start < 1ms** no Cloudflare Edge com custo **R$ 0,00 por página** (Free Tier).

---

## §6 · Consequências, Garantias & Métricas de Sucesso

| Métrica / Critério | Padrão Anterior (Acoplado/Visual) | Padrão Soberano ADR-0094 (Intent-Driven) |
| :--- | :--- | :--- |
| **Workflow de Autoria** | ❌ Arrasto manual de blocos (Gutenberg/Elementor) | **✅ Intent Prompt Pipeline em 5 Etapas** (Prompt ──► JSONs) |
| **Suporte a Variantes de Nicho** | ❌ Templates rígidos idênticos | **✅ Resolução Polimórfica Dinâmica por Nicho (`variante=delivery`, etc.)** |
| **Arquitetura de Borda (Host)** | ❌ Monólito acoplado em banco | **✅ Astro 5.x como Compilador HTTP + EmDash Headless** |
| **Telemetria Comportamental** | ❌ Inexistente ou iFrames pesados | **✅ Telemetria Mautic <2KB + OODA-BOA Score no Redis** |
| **Persuasão & Psicologia** | ❌ Textos genéricos hardcodados | **✅ 55 Marketing Skills + 5 Níveis de Schwartz** |
| **Validação de Qualidade** | ❌ Manual e sem métrica auditada | **✅ Portão Automático Jury AA** (Critérios `AA-01`..`AA-18`) |
| **Tempo de Renderização (GREEN)** | ~180ms - 800ms | **< 2ms** (Sub-milissegundo) |
| **Custo Edge** | ❌ Elevado | **R$ 0,00** (Cloudflare Free Tier) |

---

## §7 · Ratificação de Governança (`SOP v3.0`)

1. **Testabilidade**: Todo `TechniqueRenderer` em `composer-core.ts` deve possuir teste unitário.
2. **Commit Automático (Doutrina #3)**: Alterações nesta arquitetura exigem `git add` + `git commit` imediato por feature.
3. **Auditoria de Custo (Doutrina #4)**: LLMs atuam apenas na Fase 1 (BLUE) com spend-cap de $0.0005/chamada. A Fase 3 (GREEN) custa $0.00.
