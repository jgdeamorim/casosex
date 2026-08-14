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
$$\text{Intent Prompt / Briefing (BLUE)} \xrightarrow[\text{Especificação Consensus JSON}]{\text{Surface Consensus AA}} \text{RenderContext (JSON Universal)} \xrightarrow[\text{Cego / < 2ms}]{\text{TechniqueRenderers (GREEN)}} \text{UI/UX Soberana}$$

---

## §1 · Generalização Universal & O Padrão Canônico de Especificação de Superfície

> ⚠️ **Invariante de Arquitetura**: A matriz estabelecida na **ADR-0003** e no especificação **`casosex-theme-aa-consensus.json`** serve como o **Modelo Canônico Espetacular** para a especificação técnica de QUALQUER superfície ou item da Família Warp (S0 a S21).

### 1.1 Cobertura de Superfícies do Ecossistema (S0 a S21)

| Família de Superfícies | IDs | Exemplo de Aplicação Intent-Driven |
| :--- | :--- | :--- |
| **Superfícies de Conversão & Audit** | `S10`, `S11` | Raio-X Diagnóstico, Landing Pages Comerciais por Nicho (Sentinela R$197). |
| **Superfícies de Conteúdo & Blog** | `S7`, `S12` | Artigos de Blog dinâmicos, Central de Documentação, Guias Locais SEO. |
| **Superfícies de E-Commerce & Catalogs** | `S13` | Catálogo Dinâmico de Produtos/Serviços, Checkout Modal Sicredi Pix. |
| **Superfícies de Gestão & Cockpits** | `S0`..`S6`, `S8`, `S9` | Painel Administrativo, Cockpit CRM de Leads, Monitor Sentinela ao Vivo. |
| **Superfícies Operacionais Swarm** | `S14`..`S21` | Cockpits de Agentes Autônomos, Analytics Avançado de Conversão. |

### 1.2 O Schema Canônico de Especificação de Superfície (`Surface Consensus Specification JSON`)
Cada item/superfície da Família Warp possui um arquivo de especificação e consenso de qualidade padronizado (baseado no `casosex-theme-aa-consensus.json`), contendo 4 blocos obrigatórios:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Warp Surface Consensus Specification Schema (2026+)",
  "surface_id": "S13",
  "version": "1.8.0",
  "target_performance": {
    "google_pagespeed_mobile_min": 98,
    "ttfb_edge_max_ms": 200,
    "cls_max": 0.01
  },
  "brand_dna_and_tokens": {
    "brand_positioning": "Erotic Luxury / Enterprise SMB",
    "tailwind_v4_theme_tokens": { "obsidian": "#09090B", "accent": "#E11D48" }
  },
  "strategic_dynamic_slots_matrix": [
    { "slot_id": "slot_1", "name": "Top Stealth Bar & Discretion", "priority": "high" },
    { "slot_id": "slot_2", "name": "Bento Hero & Curva A Products", "priority": "high" },
    { "slot_id": "slot_10", "name": "Footer Privacy FAQ & Guarantees", "priority": "medium" }
  ],
  "jury_aa_criteria": [
    { "id": "AA-01", "name": "Zero JS Bloatware & Strict Hydration", "mandatory": true },
    { "id": "AA-02", "name": "Liquid Glass & Depth Layering", "mandatory": true },
    { "id": "AA-03", "name": "Pin Motion & Scroll Storytelling", "mandatory": true }
  ]
}
```

---

## §2 · O Workflow de Autoria Soberano: Do Intent-Prompt às Sequências de JSON (`Authoring Intent Pipeline`)

Em vez de abrir um editor visual (Gutenberg/Elementor) e arrastar blocos manualmente, a criação de **qualquer novo item (página, post, produto ou landing page)** ocorre através de um **Prompt de Intenção (Intent Prompt)** que dispara uma sequência encadeada de 5 etapas determinísticas na Camada BLUE:

### 2.1 As 5 Etapas da Sequência de Geração de Conteúdo

1. **Etapa I: Captura do Intent Prompt (Briefing Inicial)**:
   - O criador (Founder, Editor ou Agente Autônomo) submete o prompt com o objetivo da página e diretrizes.
2. **Etapa II: Decomposição na Matriz de Slots Estratégicos**:
   - O Especialista da Superfície lê o `Surface Consensus Specification JSON` e seleciona os slots dinâmicos apropriados (ex: `Curva A`, `Pain Exposure`, `Privacy Bar`).
3. **Etapa III: Atribuição de Facetas Semânticas 7D (`VocabResolver`)**:
   - Para cada slot definido na Etapa II, o resolvedor calcula o tom (`tone`), o arquétipo (`archetype`), a densidade (`density`) e a técnica de layout visual (`layoutTechniqueFacets`).
4. **Etapa IV: Síntese de Conteúdo & Copywriting (DeepSeek / Qwen $0)**:
   - Gera os títulos, subtítulos, textos em Markdown e métricas específicos de cada slot em pt-BR limpo.
5. **Etapa V: Validação Jury AA & Emissão do `RenderContext` JSON**:
   - Submete o JSON ao portão de qualidade Jury AA (checando se atinge score >= 0.85 contra as regras `AA-01`..`AA-18`) e envia para o Renderizador Cego GREEN (< 2ms).

---

## §3 · As 6 Doutrinas Fundamentais do Intent-Driven Composer

### 3.1 Doutrina I — O RenderContext como Única Fonte da Verdade
O `RenderContext` (JSON puro) é o contrato imutável e autossuficiente emitido pela sequência de autoria que descreve a totalidade da página. O renderizador não faz suposições nem consulta dados externos.

### 3.2 Doutrina II — Cegueira Absoluta da Camada GREEN (Blind Renderer)
O motor de renderização GREEN (`composer-core.ts` e renderizadores folha) opera como uma função matemática pura: $f(\text{RenderContext}) \to \text{HTML/JSX}$ em menos de 2ms.

### 3.3 Doutrina III — Desacoplamento Sagrado BLUE / GREEN (ADR-0036 & ADR-0084)
- **Camada BLUE**: Executa a inteligência de autoria, validação Jury AA e consulta o `Surface Consensus Specification JSON`.
- **Camada GREEN**: Renderiza o HTML puro com CSS nativo e zero hydration bloat.

---

## §4 · Especificação Completa dos Módulos da Arquitetura

| Módulo | Caminho Canônico | Responsabilidade Principal | Camada |
| :--- | :--- | :--- | :--- |
| **`vocab-resolver.ts`** | `packages/warp/src/tokens/vocab-resolver.ts` | Resolve as 7 Dimensões de `VocabFacets` e mapeia instruções em slots estratégicos. | BLUE |
| **`tokens-unifier.ts`** | `packages/warp/src/tokens/tokens-unifier.ts` | Unifica tokens do `Surface Consensus Specification JSON` em tokens CSS. | BLUE |
| **`4-composer.ts`** | `packages/warp/src/4-composer.ts` | Executa o Especialista da Superfície e valida o JSON no Jury AA. | BLUE |
| **`composer-core.ts`** | `packages/warp/src/composer-core.ts` | Motor GREEN Universal. Contém a biblioteca de `TechniqueRenderers` para qualquer página. | GREEN |

---

## §5 · Compilação SWC (Rust) & Deploy Cloudflare Edge Workers/Pages

- O compilador **SWC (Rust)** transpila o motor GREEN em um bundle Web-Standard de **`< 50 KB`**.
- Operação em **Cold Start < 1ms** no Cloudflare Edge com custo **R$ 0,00 por página** (Free Tier).

---

## §6 · Consequências, Garantias & Métricas de Sucesso

| Métrica / Critério | Padrão Anterior (Acoplado/Visual) | Padrão Soberano ADR-0094 (Intent-Driven) |
| :--- | :--- | :--- |
| **Base de Especificação** | ❌ Sem especificações formais por superfície | **✅ Modelo Canônico `Consensus JSON`** (`ADR-0003`) |
| **Matriz de Slots Estratégicos** | ❌ Hardcoded em arquivos `.astro` | **✅ Dinâmica & Regida por Curva A/B/C e Neuromarketing** |
| **Validação de Qualidade** | ❌ Manual e sem métrica auditada | **✅ Portão Automático Jury AA** (Critérios `AA-01`..`AA-18`) |
| **Tempo de Renderização (GREEN)** | ~180ms - 800ms | **< 2ms** (Sub-milissegundo) |
| **Custo Edge** | ❌ Elevado | **R$ 0,00** (Cloudflare Free Tier) |

---

## §7 · Ratificação de Governança (`SOP v3.0`)

1. **Testabilidade**: Todo `TechniqueRenderer` em `composer-core.ts` deve possuir teste unitário.
2. **Commit Automático (Doutrina #3)**: Alterações nesta arquitetura exigem `git add` + `git commit` imediato por feature.
3. **Auditoria de Custo (Doutrina #4)**: LLMs atuam apenas na Fase 1 (BLUE) com spend-cap de $0.0005/chamada. A Fase 3 (GREEN) custa $0.00.
