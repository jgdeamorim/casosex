# ADR-0094 · Intent-Driven Dynamic Composer — Arquitetura de Composição Soberana JSON-First

- **Status**: Accepted
- **Data**: 2026-08-14
- **Autores**: Jeferson Amorim (Founder) & Antigravity (AI Pair)
- **Extends**: ADR-0036 (BLUE/GREEN), ADR-0054 (Intent-Driven Slots), ADR-0058 (Zero Hardcoded Slots), ADR-0060 (Warp Surface Modularization), ADR-0062 (BLAKE3 KV Cache), ADR-0077 (Semantic Motion Engine), ADR-0080 (Layout Technique Facets), ADR-0081 (dct-motion Zero-Dependency Runtime), ADR-0084 (Paridade BLUE/GREEN)
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

### 0.2 O Princípio Intent-Driven
A ADR-0094 ratifica a inversão soberana de modelo:
$$\text{Sinais do Cliente + LLM (BLUE)} \xrightarrow[\text{Sub-segundo}]{\text{VocabResolver 7D}} \text{RenderContext (JSON Intenção)} \xrightarrow[\text{Cego / < 2ms}]{\text{TechniqueRenderers (GREEN)}} \text{UI/UX Soberana}$$

---

## §1 · As 6 Doutrinas Fundamentais do Intent-Driven Composer

### 1.1 Doutrina I — O RenderContext como Única Fonte da Verdade
O `RenderContext` (JSON puro) é o contrato imutável e autossuficiente que descreve a totalidade da página. O renderizador não faz suposições nem consulta dados externos; se um dado não está no `RenderContext`, ele não é exibido.

### 1.2 Doutrina II — Cegueira Absoluta da Camada GREEN (Blind Renderer)
O motor de renderização GREEN (`composer-core.ts` e renderizadores folha):
- **Isolamento de Negócio**: Não lê variáveis de ambiente, não consulta o estado financeiro do tenant, não sabe o preço dos planos (R$197 vs R$497).
- **Isolamento de IO/Rede**: Zero chamadas HTTP (`fetch`), zero consultas Redis ou Postgres durante o passe de renderização.
- **Execução Pura e Síncrona**: Opera como uma função matemática pura: $f(\text{RenderContext}) \to \text{HTML/JSX}$.

### 1.3 Doutrina III — Desacoplamento Sagrado BLUE / GREEN (ADR-0036 & ADR-0084)
- **Camada BLUE (Inteligência & Estratégia)**:
  Responde pelo processamento pesado, invocação do DeepSeek (cost-capped), mineração de sinais GMB/Meta, cálculo do afeto computacional BOA e orquestração de slots. Produz o `RenderContext`.
- **Camada GREEN (Apresentação & Layout)**:
  Aplicação síncrona em TypeScript/React/Tailwind v4. Transforma o `RenderContext` em elementos visuais limpos e responsivos.

### 1.4 Doutrina IV — As 7 Dimensões de `VocabFacets` (ADR-0080)
A resolução semântica do slot é regida por 7 facetas multidimensionais calculadas no `vocab-resolver.ts`:
1. **`intentKind`**: Função de conversão do slot (`diagnostic_reveal`, `gap_exposure`, `value_proposition`, `social_proof`, `conversion_cta`).
2. **`archetype`**: Tom da persona narradora (`authority_analyst`, `direct_challenger`, `empathetic_guide`).
3. **`tone`**: Tonalidade emocional (`urgent`, `analytical`, `reassuring`, `exclusive`).
4. **`density`**: Densidade de informação visual (`minimal`, `compact`, `detailed`, `editorial`).
5. **`emotionValence`**: Carga de valência Afetiva BOA (`high_tension`, `problem_agitation`, `solution_relief`).
6. **`visualCognition`**: Padrão de escaneabilidade (`scannable_grid`, `hero_focal`, `contrast_card`).
7. **`layoutTechniqueFacets`** *(7ª Dimensão - ADR-0080)*: A técnica exata de renderização (`bento_grid`, `split_hero`, `feature_matrix`, `interactive_calculator`, `scroll_pin_sequence`).

### 1.5 Doutrina V — Estilização Estrita por Tokens (`deriveStylesheet`)
- Proibido o uso de cores hexadecimais hardcodadas (ex: `#FF0000`) em arquivos `.tsx` / `.ts`.
- O `deriveStylesheet(brandDNA)` injeta o mapa de variáveis CSS semânticas (`var(--color-primary)`, `var(--color-surface)`, `var(--radius-card)`) no container raiz da superfície.

### 1.6 Doutrina VI — Cache Determinístico BLAKE3 (ADR-0062)
Todo `RenderContext` gerado tem seu hash calculado via algoritmo **BLAKE3** combinando: `hash(tenantId + brandDnaHash + intentHash)`.
- O resultado compilado é indexado no Redis sob a chave `adsentice:kv:blake3:<hash>`.
- Requisições subsequentes para a mesma intenção ignoram a Camada BLUE e entregam a renderização GREEN em tempo inferior a 1ms.

---

## §2 · Especificação Completa dos Módulos da Arquitetura

### 2.1 Estrutura de Arquivos e Responsabilidades (Módulo a Módulo)

| Módulo | Caminho Canônico | Responsabilidade Principal | Camada |
| :--- | :--- | :--- | :--- |
| **`vocab-resolver.ts`** | `packages/warp/src/tokens/vocab-resolver.ts` | Resolve as 7 Dimensões de `VocabFacets` e mapeia intenções brutas em seleções de layout. | BLUE |
| **`tokens-unifier.ts`** | `packages/warp/src/tokens/tokens-unifier.ts` | Unifica tokens Materio, OpenDesign e paletas de clientes em tokens semânticos. | BLUE |
| **`derive-stylesheet.ts`** | `packages/warp/src/tokens/derive-stylesheet.ts` | Converte os tokens unificados no mapa de variáveis CSS da folha de estilo. | BLUE/GREEN |
| **`4-composer.ts`** | `packages/warp/src/4-composer.ts` | Executa o especialista da superfície (ex: `S10_SPECIALIST`) e emite o `RenderContext`. | BLUE |
| **`composer-core.ts`** | `packages/warp/src/composer-core.ts` | Motor GREEN. Contém a biblioteca de 12 `TechniqueRenderers` e renderiza os slots. | GREEN |
| **`s10-strategic.ts`** | `apps/web/src/lib/s10-strategic.ts` | Define a ordenação lógica e estratégica dos slots do S10 Raio-X Diagnóstico. | BLUE |
| **`warp-composer.ts`** | `apps/web/src/lib/warp-composer.ts` | Fachada de integração que conecta a requisição da rota ao pipeline BLUE ──► GREEN. | PIPELINE |

---

## §3 · Contratos de Interface & Schemas TypeScript

```typescript
/**
 * @file RenderContextSchema.ts
 * Contrato Soberano da Arquitetura Intent-Driven (ADR-0094)
 */

export type IntentKind =
  | "hero_impact"
  | "diagnostic_reveal"
  | "gap_exposure"
  | "solution_matrix"
  | "social_proof"
  | "conversion_cta"
  | "faq_accordion";

export type LayoutTechniqueFacet =
  | "split_hero"
  | "bento_grid"
  | "metric_cards_row"
  | "comparison_table"
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
  surfaceId: "S10" | "S11" | "S12";
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

## §4 · Integração de Motion Declarativo (`dct-motion v1.4` & Pin Motion no S10)

Para garantir uma experiência de ponta, imersiva e moderna na Superfície **S10 Raio-X Diagnóstico**, a renderização de animações é regida pelo motor soberano **`dct-motion` (ADR-0081)**:

### 4.1 Princípio de Animação por Atributos (`data-motion`)
Zero dependências de pacotes React pesados (ex: Framer Motion de >35 KB). O `dct-motion.js` opera fora da árvore do React via `requestAnimationFrame` e `IntersectionObserver`, utilizando atributos HTML declarativos emitidos pelo `composer-core.ts`:

1. **`data-motion="pin-sequence"` (Scroll Pin Motion)**:
   - Trava o palco da viewport (`position: sticky`) enquanto o usuário faz o scroll.
   - Revela sequencialmente as 4 etapas da varredura do Raio-X (GMB ──► Meta ──► SEO ──► Conversão Pix) sem quebrar o fluxo de navegação nem gerar *Cumulative Layout Shift* (CLS).
2. **`data-motion="count-up"`**:
   - Anima os contadores numéricos (ex: Score de Saúde Digital de 0 a 87/100 e Perda de Faturamento Est.) com interpolação física fluida.
3. **`data-motion="morph-target"` (`morphSlot(el, newHTML)`)**:
   - Executa a transição limpa entre a revelação das vulnerabilidades do cliente e a apresentação da solução do plano **Sentinela (R$197/mês)**.

---

## §5 · Componentes de Ponta que Formam a Superfície S10

O `S10-GREEN` monta a página utilizando 4 componentes estruturais de alta conversão:

### 5.1 Componente I: `S10HeroPinStage` (Pin Motion Viewport)
- **Técnica**: `scroll_pin_sequence`.
- **Comportamento**: Palco principal fixo onde o cabeçalho permanece imóvel enquanto os cartões de diagnóstico deslizam com efeito de profundidade e *blur* vítreo (*Glassmorphism*).

### 5.2 Componente II: `S10ScoreRadar` (Dashboard de Saúde Digital)
- **Técnica**: `metric_cards_row`.
- **Comportamento**: Exibe o radar visual com os 3 maiores gargalos do negócio local, destacando em vermelho as receitas perdidas e ativando os contadores animados `data-motion="count-up"`.

### 5.3 Componente III: `S10GapMatrixBento` (Grid Bento Responsivo)
- **Técnica**: `bento_grid`.
- **Comportamento**: Grid assimétrico estilo Apple que agrupa as evidências auditadas (avaliações sem resposta, falta de menu digital Pix, site lento).

### 5.4 Componente IV: `S10MorphingOfferCard` (Card de Ação Urgente)
- **Técnica**: `sticky_conversion_bar`.
- **Comportamento**: Card de conversão com temporizador sutil e botão de disparo direto para ativação do **Sentinela (R$197/mês)**.

---

## §6 · Pipeline de Execução Executável em 4 Fases

```
[ FASE 1: STRATEGIST (BLUE) ]
   ├── Scrape & Audit Sinais GMB/Meta
   ├── Invocação LLM DeepSeek ($0.0005)
   ├── VocabResolver (Gera Facetas 7D)
   └── Retorna: RenderContext (JSON com data-motion)
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
   ├── Mapeia slots para TechniqueRenderers (Bento/Pin)
   └── Retorna: HTML / JSX Síncrono (< 2ms)
            │
            ▼
[ FASE 4: BLAKE3 KV PERSISTENCE ]
   ├── Hash(tenant + brand + intent)
   └── SET Redis adsentice:kv:blake3:<hash>
```

---

## §7 · Consequências, Garantias & Métricas de Sucesso

| Métrica / Critério | Padrão Anterior (Acoplado/Visual) | Padrão Soberano ADR-0094 (Intent-Driven) |
| :--- | :--- | :--- |
| **Tempo de Renderização (GREEN)** | ~180ms - 800ms | **< 2ms** (Sub-milissegundo) |
| **Garantia de Zero Hardcode** | ❌ Não (slots fixos em código) | **✅ Sim** (100% via `RenderContext`) |
| **Animações (Motion Overhead)** | ❌ 35+ KB (Framer Motion React) | **✅ 0 KB npm** (`dct-motion` data-attributes) |
| **Compatibilidade com Agentes de IA** | ❌ Não (Exigia cliques no admin) | **✅ Sim** (Emissão nativa de JSON) |
| **Acoplamento de Dependências** | ❌ Alto (Conflitos ESM/Vite/Admin) | **✅ Nulo** (Renderizador Cego isolado) |
| **Consistência de Brand DNA** | ❌ Média (Risco de estilos ad-hoc) | **✅ Total** (Regido por `deriveStylesheet`) |

---

## §8 · Ratificação de Governança (`SOP v3.0`)

1. **Testabilidade**: Todo `TechniqueRenderer` em `composer-core.ts` deve possuir teste unitário validando renderização cega com `RenderContext` mockado.
2. **Commit Automático (Doutrina #3)**: Alterações nesta arquitetura exigem `git add` + `git commit` imediato por feature.
3. **Auditoria de Custo (Doutrina #4)**: LLMs atuam apenas na Fase 1 (BLUE) com spend-cap de $0.0005/chamada. A Fase 3 (GREEN) custa $0.00.
