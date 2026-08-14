# ADR-0094 · Intent-Driven Dynamic Composer — Arquitetura de Composição Soberana JSON-First

- **Status**: Accepted
- **Data**: 2026-08-14
- **Autores**: Jeferson Amorim (Founder) & Antigravity (AI Pair)
- **Extends**: ADR-0016 (Hetzner CAX11 $5.39), ADR-0036 (BLUE/GREEN), ADR-0054 (Intent-Driven Slots), ADR-0058 (Zero Hardcoded Slots), ADR-0060 (Warp Surface Modularization), ADR-0062 (BLAKE3 KV Cache), ADR-0077 (Semantic Motion Engine), ADR-0080 (Layout Technique Facets), ADR-0081 (dct-motion Zero-Dependency Runtime), ADR-0084 (Paridade BLUE/GREEN)
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
$$\text{Intent Prompt / Briefing (BLUE)} \xrightarrow[\text{Sequência de Transmutação}]{\text{Pipeline 5 Etapas}} \text{RenderContext (JSON Universal)} \xrightarrow[\text{Cego / < 2ms}]{\text{TechniqueRenderers (GREEN)}} \text{UI/UX Soberana}$$

---

## §1 · Generalização Universal: Das 22 Superfícies Warp ao Conteúdo Dinâmico

> ⚠️ **Invariante de Arquitetura**: A superfície **S10 (Raio-X Diagnóstico)** é apenas a primeira implementação-piloto do Intent-Driven Composer. O motor especificado nesta ADR é **100% agnóstico e universal**, capaz de gerar **qualquer página, post de blog, landing page comercial, catálogo de produtos ou dashboard**.

### 1.1 Cobertura de Superfícies do Ecossistema (S0 a S21)

| Família de Superfícies | IDs | Exemplo de Aplicação Intent-Driven |
| :--- | :--- | :--- |
| **Superfícies de Conversão & Audit** | `S10`, `S11` | Raio-X Diagnóstico, Landing Pages Comerciais por Nicho (Sentinela R$197). |
| **Superfícies de Conteúdo & Blog** | `S7`, `S12` | Artigos de Blog dinâmicos, Central de Documentação, Guias Locais SEO. |
| **Superfícies de E-Commerce & Catalogs** | `S13` | Catálogo Dinâmico de Produtos/Serviços, Checkout Modal Sicredi Pix. |
| **Superfícies de Gestão & Cockpits** | `S0`..`S6`, `S8`, `S9` | Painel Administrativo, Cockpit CRM de Leads, Monitor Sentinela ao Vivo. |
| **Superfícies Operacionais Swarm** | `S14`..`S21` | Cockpits de Agentes Autônomos, Analytics Avançado de Conversão. |

---

## §2 · O Workflow de Autoria Soberano: Do Intent-Prompt às Sequências de JSON (`Authoring Intent Pipeline`)

Em vez de abrir um editor visual (Gutenberg/Elementor) e arrastar blocos manualmente, a criação de **qualquer novo item (página, post, produto ou landing page)** ocorre através de um **Prompt de Intenção (Intent Prompt)** que dispara uma sequência encadeada de 5 etapas determinísticas na Camada BLUE:

### 2.1 As 5 Etapas da Sequência de Geração de Conteúdo

1. **Etapa I: Captura do Intent Prompt (Briefing Inicial)**:
   - O criador (Founder, Editor ou Agente Autônomo) submete o prompt com o objetivo da página, o público e as diretrizes principais.
2. **Etapa II: Decomposição da Estrutura de Slots**:
   - O Especialista da Superfície analisa o prompt e determina a sequência ideal de blocos visuais necessários (ex: `hero` ──► `bento_grid` ──► `testimonials` ──► `cta`).
3. **Etapa III: Atribuição de Facetas Semânticas 7D (`VocabResolver`)**:
   - Para cada slot definido na Etapa II, o resolvedor calcula o tom (`tone`), o arquétipo (`archetype`), a densidade (`density`) e a técnica de layout visual (`layoutTechniqueFacets`).
4. **Etapa IV: Síntese de Conteúdo & Copywriting (DeepSeek / Qwen $0)**:
   - Gera os títulos, subtítulos, textos em Markdown e métricas específicos de cada slot em pt-BR limpo e persuasivo.
5. **Etapa V: Emissão & Validação do `RenderContext` JSON**:
   - Consolida todo o resultado no contrato `RenderContextSchema` e envia para a renderização GREEN em tempo sub-milissegundo (< 2ms).

---

## §3 · As 6 Doutrinas Fundamentais do Intent-Driven Composer

### 3.1 Doutrina I — O RenderContext como Única Fonte da Verdade
O `RenderContext` (JSON puro) é o contrato imutável e autossuficiente emitido pela sequência de autoria que descreve a totalidade da página. O renderizador não faz suposições nem consulta dados externos; se um dado não está no `RenderContext`, ele não é exibido.

### 3.2 Doutrina II — Cegueira Absoluta da Camada GREEN (Blind Renderer)
O motor de renderização GREEN (`composer-core.ts` e renderizadores folha):
- **Isolamento de Negócio**: Não lê variáveis de ambiente, não consulta o estado financeiro do tenant, não sabe o preço dos planos (R$197 vs R$497).
- **Isolamento de IO/Rede**: Zero chamadas HTTP (`fetch`), zero consultas Redis ou Postgres durante o passe de renderização.
- **Execução Pura e Síncrona**: Opera como uma função matemática pura: $f(\text{RenderContext}) \to \text{HTML/JSX}$.

### 3.3 Doutrina III — Desacoplamento Sagrado BLUE / GREEN (ADR-0036 & ADR-0084)
- **Camada BLUE (Inteligência & Pipeline de Autoria)**:
  Responde pelo processamento pesado, transmutação do Intent Prompt nas 5 Etapas de JSONs, mineração de sinais e cálculo do BOA Score.
- **Camada GREEN (Apresentação & Layout)**:
  Aplicação síncrona em TypeScript/React/Tailwind v4. Transforma o `RenderContext` em elementos visuais limpos e responsivos.

### 3.4 Doutrina IV — As 7 Dimensões de `VocabFacets` (ADR-0080)
A resolução semântica do slot é regida por 7 facetas multidimensionais calculadas no `vocab-resolver.ts`:
1. **`intentKind`**: Função do slot (`diagnostic_reveal`, `gap_exposure`, `value_proposition`, `editorial_content`, `product_showcase`, `conversion_cta`).
2. **`archetype`**: Tom da persona narradora (`authority_analyst`, `direct_challenger`, `empathetic_guide`).
3. **`tone`**: Tonalidade emocional (`urgent`, `analytical`, `reassuring`, `exclusive`).
4. **`density`**: Densidade de informação visual (`minimal`, `compact`, `detailed`, `editorial`).
5. **`emotionValence`**: Carga de valência Afetiva BOA (`high_tension`, `problem_agitation`, `solution_relief`).
6. **`visualCognition`**: Padrão de escaneabilidade (`scannable_grid`, `hero_focal`, `contrast_card`).
7. **`layoutTechniqueFacets`** *(7ª Dimensão - ADR-0080)*: A técnica exata de renderização (`bento_grid`, `split_hero`, `feature_matrix`, `interactive_calculator`, `scroll_pin_sequence`, `article_stream`, `product_grid`).

### 3.5 Doutrina V — Estilização Estrita por Tokens (`deriveStylesheet`)
- Proibido o uso de cores hexadecimais hardcodadas (ex: `#FF0000`) em arquivos `.tsx` / `.ts`.
- O `deriveStylesheet(brandDNA)` injeta o mapa de variáveis CSS semânticas (`var(--color-primary)`, `var(--color-surface)`, `var(--radius-card)`) no container raiz da superfície.

### 3.6 Doutrina VI — Cache Determinístico BLAKE3 (ADR-0062)
Todo `RenderContext` gerado tem seu hash calculated via algoritmo **BLAKE3** combinando: `hash(tenantId + brandDnaHash + intentHash)`.
- O resultado compilado é indexado no Redis sob a chave `adsentice:kv:blake3:<hash>`.
- Requisições subsequentes para a mesma intenção ignoram a Camada BLUE e entregam a renderização GREEN em tempo inferior a 1ms.

---

## §4 · Especificação Completa dos Módulos da Arquitetura

### 4.1 Estrutura de Arquivos e Responsabilidades (Módulo a Módulo)

| Módulo | Caminho Canônico | Responsabilidade Principal | Camada |
| :--- | :--- | :--- | :--- |
| **`vocab-resolver.ts`** | `packages/warp/src/tokens/vocab-resolver.ts` | Resolve as 7 Dimensões de `VocabFacets` e mapeia instruções do Intent Prompt em seleções de layout. | BLUE |
| **`tokens-unifier.ts`** | `packages/warp/src/tokens/tokens-unifier.ts` | Unifica tokens Materio, OpenDesign e paletas de clientes em tokens semânticos. | BLUE |
| **`derive-stylesheet.ts`** | `packages/warp/src/tokens/derive-stylesheet.ts` | Converte os tokens unificados no mapa de variáveis CSS da folha de estilo. | BLUE/GREEN |
| **`4-composer.ts`** | `packages/warp/src/4-composer.ts` | Executa a sequência de 5 Etapas do Intent Prompt e emite o `RenderContext`. | BLUE |
| **`composer-core.ts`** | `packages/warp/src/composer-core.ts` | Motor GREEN Universal. Contém a biblioteca de `TechniqueRenderers` para qualquer página. | GREEN |
| **`warp-composer.ts`** | `apps/web/src/lib/warp-composer.ts` | Fachada de integração universal que conecta a requisição de qualquer rota ao pipeline BLUE ──► GREEN. | PIPELINE |

---

## §5 · Contratos de Interface Universal & Schemas TypeScript

```typescript
/**
 * @file RenderContextSchema.ts
 * Contrato Universal da Arquitetura Intent-Driven (ADR-0094)
 */

export type IntentKind =
  | "hero_impact"
  | "diagnostic_reveal"
  | "gap_exposure"
  | "solution_matrix"
  | "editorial_content"
  | "product_showcase"
  | "social_proof"
  | "conversion_cta"
  | "faq_accordion";

export type LayoutTechniqueFacet =
  | "split_hero"
  | "bento_grid"
  | "metric_cards_row"
  | "comparison_table"
  | "article_stream"
  | "product_grid"
  | "stack_list"
  | "interactive_calculator"
  | "timeline_steps"
  | "scroll_pin_sequence"
  | "sticky_conversion_bar";

export interface VocabFacets7D {
  intentKind: IntentKind;
  archetype: "authority_analyst" | "direct_challenger" | "empathetic_guide";
  tone: "urgent" | "analytical" | "reassuring" | "exclusive";
  density: "minimal" | "compact" | "detailed" | "editorial";
  emotionValence: "high_tension" | "problem_agitation" | "solution_relief";
  visualCognition: "scannable_grid" | "hero_focal" | "contrast_card";
  layoutTechniqueFacets: LayoutTechniqueFacet;
}

export interface RenderSlotIntent {
  slotId: string;
  order: number;
  facets: VocabFacets7D;
  motionAttributes?: {
    type: "pin-sequence" | "count-up" | "fade-slide" | "morph-target";
    stage?: string;
    stepCount?: number;
  };
  payload: {
    title: string;
    subtitle?: string;
    description?: string;
    bodyContentMd?: string;
    badgeText?: string;
    highlights?: string[];
    metrics?: Array<{
      label: string;
      value: string;
      unit?: string;
      impact: "negative" | "neutral" | "positive";
    }>;
    primaryCta?: {
      label: string;
      href: string;
      variant: "solid" | "outline" | "glow";
    };
  };
}

export interface RenderContext {
  surfaceId: string; // Ex: "S0", "S7", "S10", "S11", "S12", "CUSTOM"
  tenantId: string;
  brandDnaHash: string;
  intentHash: string;
  stylesheet: Record<string, string>;
  slots: RenderSlotIntent[];
  meta: {
    generatedAt: string;
    composerVersion: string;
    boaScore?: number;
    llmCostUsd?: number;
  };
}
```

---

## §6 · Pipeline de Execução Executável em 4 Fases

```
[ FASE 1: AUTHORING INTENT PIPELINE (BLUE) ]
   ├── Captura do Intent Prompt (Ideia/Briefing do Criador)
   ├── Sequência em 5 Etapas (Decomposição ──► Vocab 7D ──► Copywriting)
   └── Retorna: RenderContext (JSON Universal)
            │
            ▼
[ FASE 2: SCHEMA VALIDATION ]
   ├── Valida JSON contra RenderContextSchema
   ├── Executa Guard Clauses de Segurança
   └── Se Inválido ──► Fallback Determinístico
            │
            ▼
[ FASE 3: BLIND RENDERER (GREEN) ]
   ├── Injeta Stylesheet (var(--color-*))
   ├── Mapeia slots para TechniqueRenderers
   └── Retorna: HTML / JSX Síncrono (< 2ms)
            │
            ▼
[ FASE 4: BLAKE3 KV PERSISTENCE ]
   ├── Hash(tenant + brand + intent)
   └── SET Redis adsentice:kv:blake3:<hash>
```

---

## §7 · Realimentação Afetiva OODA-BOA (`BOA Computational Affect Loop`)

O composer integra o estado vivo do ciclo de afeto computacional **BOA (`adsentice:boa:score`)**:
1. O BLUE lê o score BOA do tenant no Redis (porta `:6396`).
2. Se o estado BOA indicar alta criticidade operática, o BLUE injeta automaticamente `emotionValence: "high_tension"` e ajusta o tom no `RenderContext`.
3. O GREEN (Renderizador Cego) consome essa diretriz sem saber o motivo de fundo, aplicando variações visuais de destaque.

---

## §8 · Fallback Glass-Box & Tolerância a Falhas Zero-500

Para garantir disponibilidade soberana sem exceções não tratadas:
1. **Fallback por Timeout LLM**: Se a chamada ao DeepSeek exceder 2500ms, o BLUE encerra a requisição externa e aciona o gerador local de regras determinísticas em TypeScript ($0).
2. **Garantia de Não-Interrupção (Zero 500)**: O `warp-composer.ts` envolve a execução BLUE em um bloco de proteção. Se o JSON do `RenderContext` falhar na validação, o sistema injeta um `RenderContext` mínimo estático pré-compilado.
3. **Invariante de Renderização**: A camada GREEN **nunca gera erro 500**; ela renderiza o payload fornecido ou o fallback determinístico em `< 2ms`.

---

## §9 · Isolamento de Corpora & Proteção de PII (Corpus A vs B vs C)

Em conformidade com a arquitetura de corpora do Adsentice:
- **Corpus A (Self / Adsentice Core)**: Código-fonte, ADRs, componentes e tokens de design.
- **Corpus B (Tenant / Cliente)**: Dados sensíveis e identificáveis do negócio local (PII, faturamento, contatos).
- **Corpus C (Tooling)**: MCPs, parsers e scrapers.

---

## §10 · Compilação SWC (Rust) & Deploy Cloudflare Edge Workers/Pages

### 10.1 Compilação SWC (Rust) para V8 Isolates
- O compilador **SWC (Rust)** transpila a Camada GREEN (`composer-core.ts` + `TechniqueRenderers`) em um bundle Web-Standard de **`< 50 KB`**.

### 10.2 Economia Extrema de Infraestrutura & Cloudflare Free Tier ($0/mês)
- **Workers Free Tier** (100k req/dia), **Pages Free Tier** (deploys ilimitados), **R2 Vault** (10GB) e **KV Edge** (100k leituras) garantem **R$ 0,00 de custo marginal por página ou post**.

---

## §11 · Consequências, Garantias & Métricas de Sucesso

| Métrica / Critério | Padrão Anterior (Acoplado/Visual) | Padrão Soberano ADR-0094 (Intent-Driven) |
| :--- | :--- | :--- |
| **Workflow de Autoria** | ❌ Arrasto manual de blocos (Gutenberg/Elementor) | **✅ Intent Prompt Pipeline em 5 Etapas** (Prompt ──► JSONs) |
| **Arquitetura de Briefing** | ❌ Edição manual em GUI | **✅ Briefing em 4 Camadas** (`open-design` ──► `RenderContext`) |
| **Especialistas por Superfície** | ❌ Inexistente (Código monolítico) | **✅ Sim** (`S10_SPECIALIST`, `S11_SPECIALIST`, etc.) |
| **Escopo de Páginas / Conteúdo** | ❌ Limitado a temas/templates fixos | **✅ Universal** (Qualquer superfície S0..S21 ou post) |
| **Tempo de Renderização (GREEN)** | ~180ms - 800ms | **< 2ms** (Sub-milissegundo) |
| **Custo de Infraestrutura Edge** | ❌ Elevado (Instâncias dedicadas) | **R$ 0,00** (Maximização Cloudflare Free Tier) |
| **Deploy na Cloudflare Edge** | ❌ Incompatível (Dep. Node/Admin) | **✅ 100% Nativo** (SWC Bundle < 50 KB) |
| **Garantia de Zero Hardcode** | ❌ Não (slots fixos em código) | **✅ Sim** (100% via `RenderContext`) |
| **Animações (Motion Overhead)** | ❌ 35+ KB (Framer Motion React) | **✅ 0 KB npm** (`dct-motion` data-attributes) |
| **Tolerância a Falhas (Zero 500)** | ❌ Média (Risco de quebra de bundle/API) | **✅ 100%** (Fallback Glass-Box síncrono) |
| **Proteção de PII & Corpora** | ❌ Fraca (Dados misturados em DB) | **✅ Estrita** (Sanitização A/B/C no payload) |
| **Compatibilidade com Agentes de IA** | ❌ Não (Exigia cliques no admin) | **✅ Sim** (Emissão nativa de JSON) |
| **Consistência de Brand DNA** | ❌ Média (Risco de estilos ad-hoc) | **✅ Total** (Regido por `deriveStylesheet`) |

---

## §12 · Ratificação de Governança (`SOP v3.0`)

1. **Testabilidade**: Todo `TechniqueRenderer` em `composer-core.ts` deve possuir teste unitário validando renderização cega com `RenderContext` mockado.
2. **Commit Automático (Doutrina #3)**: Alterações nesta arquitetura exigem `git add` + `git commit` imediato por feature.
3. **Auditoria de Custo (Doutrina #4)**: LLMs atuam apenas na Fase 1 (BLUE) com spend-cap de $0.0005/chamada. A Fase 3 (GREEN) custa $0.00.
