# VOLÚPIA · Coding SOP — TypeScript + Módulos Puros + UI

> ⚠️ **LEIA ANTES de editar qualquer componente (.tsx) OU módulo .ts.**
> Fontes: SOP v3.4 Canônico + Antigravity-Router MCP + SWC Rules + TypeScript ESLint Canonical Rules + `schema-responsive.json` v2.1.0
> v3.4 · 2026-08-28 — Padronização de Profiling de Hardware, Telemetria Multi-Dispositivo & Validação por Antigravity-Router (ADR-0213)

---

## I. Ciclo de Codificação (SOP v3.4)

```
1. DAG (volupia-dag / casosex-dag) → 2. Hardware/Schema Check (schema-responsive.json) → 3. Coda (Antigravity-Router oxc) → 4. Validate (App-Jury 6D) → 5. Commit
```

### 1. Pré-flight — DAG + Grounding + Schema Check
Antes de codar, executar grounding no Qdrant/Filesystem via skill `/volupia-dag` (ou `/casosex-dag`):
- Coleções: `volupia-self` / `casosex-self`, `volupia-conversation` / `casosex-conversation`, `volupia-memory` / `casosex-memory` (tag=`volupia` / `casosex`)
- Schema: Consultar `apps/cockpit/src/seeds/schema-responsive.json` para validar garantias de viewport e hardware tiers.
- Filesystem: Verificar `docs/spec/` e `docs/adr/`

### 2. Coda — Regras Canônicas
| Tipo de Arquivo | Regra Obrigatória |
|---|---|
| Módulos `.ts` | `catch (e: unknown) { void e }`, `unknown > any`, guard clauses lineares |
| Server Components (`.tsx`) | Props inline (evitar `interface`), Suspense + inner async, funções auxiliares FORA do componente |
| Client Components | Explicitar `'use client'` no topo, engate de telemetria `AppJuryBridgeProbe` para DevTools `:6661` |
| UI Responsiva (`.tsx`) | Seguir estritamente `schema-responsive.json`: Touch target $\ge 48\text{px}$ em Mobile, $\ge 32\text{px}$ em Desktop |
| Imports de Server | `import "server-only"` em módulos com Node.js APIs |

### 3. Check & Commit
```bash
python3 tools/probe_browser_capabilities.py # Telemetria multi-dispositivo
python3 tools/validate_spec_to_cockpit_quality.py
git add . && git commit -m "type: descrição"
```

---

## II. Regras Duras & Anti-Padrões Proibidos

1. **`catch {}` Vazio é PROIBIDO:** Use SEMPRE `catch (e: unknown) { void e; return null }`.
2. **Duplicação de Código:** Antes de criar função, buscar se já existe via `grep -rn`.
3. **`any` Implicíto ou Explícito:** Priorizar `unknown` para forçar type narrowing.
4. **Hardcoding de Breakpoints/Capabilities:** Proibido hardcodar premissas de GPU, blurs ou touch sem consultar o `schema-responsive.json`.
5. **Imports:** Barrel exports em `index.ts` usando `export type * from "./types"` em primeiro lugar.
6. **Fail-Soft com Medição:** Tratar exceções sem derrubar o fluxo e registrando estado quando necessário.

---

## III. Governança Normativa de UI/UX — Júri B2B (ADR-0198 Refinada)

> Fontes Normativas: IBM Carbon Design System (B2B Primary) · WAI-ARIA APG · Tailwind CSS v4

1. **Descoberta via Context7**: Todo julgamento de padrão deve ser recuperado via Context7 a partir de especificações normativas formais (`docs/spec/design-patterns/*.yaml`).
2. **Contrato de Alinhamento de Cabeçalhos (`UI-PATTERN-FORM-HEADER`)**:
   - Cabeçalhos desktop (`>= 640px`) DEVEM alinhar título e badges de ação horizontalmente (`flex-row items-center justify-between`).
3. **Contrato de Tabelas B2B High-Density (`UI-PATTERN-DATA-TABLE`)**:
   - Segue padrão IBM Carbon (5 densidades, células verticalmente centralizadas `items-center` / `align-middle`, destaque de linha `hover:bg-muted/20`).
4. **Contrato de Indicadores de Status (`UI-PATTERN-STATUS-INDICATOR`)**:
   - Badges de status DEVEM combinar indicador visual (dot de pulso `<span className="w-2 h-2 rounded-full animate-pulse" />`) com texto e `role="status"` WAI-ARIA.

---

## IV. Engate Automático do App-Jury em `worktree mode:mobile`

Quando o modo de viewport ou contexto for alterado para `mode:mobile`, a SOP v3.4 ativa automaticamente o **`App-Jury v1.0`**:

1. **Gate das 6 Dimensões (6D Critique Theater)**:
   - Visual Parity ($\ge 95\%$ SSIM / OKLCH)
   - Ergonomia Tátil (Touch Targets $\ge 48\text{px}$ em Mobile, Radius 24px)
   - Hydration Safety (`useSyncExternalStore` + `AXAResponsiveSwitch`)
   - Latência GPU Vulkan/Skia ($P50 \le 16.6\text{ms}$ / 60 FPS)
   - ViewModel Cleanliness (Zero regra de negócio em JSX)
   - Acessibilidade WCAG 2.2 AA (APCA Contrast $\ge 7:1$)

---

## V. Integração Soberana com Antigravity-Router (`adsentice-router-dev`)

O ciclo de desenvolvimento utiliza as ferramentas de aceleração compilada em Rust do `adsentice-router-dev` integradas ao `schema-responsive.json`:

1. **Fast-Path AST Validation (`adsentice_ast_validate`)**: Valida sintaxe TS/TSX via parser `oxc` em $< 0.8\text{ms}$ e audita violações de layout responsivo (ex: touch target menor que a norma do schema).
2. **Intent-Driven Patching (`adsentice_d_ips_apply`)**: LLM emite `IntentPatchSpec` em JSON compacto, aplicando edições cirúrgicas no código local (economia de $> 92\%$ em tokens).
3. **Substrato Tri-Layer (`adsentice_tri_layer_ingest` / `lookup`)**: Separação de Skeleton (interfaces/assinaturas) e Values (design tokens do schema).
4. **Validação Cryptográfica FCE (`adsentice_fce_validate`)**: Garantia de integridade do contrato e checksums BLAKE3.

---

## VI. Camada `schema-responsive.json` & Profiling de Hardware (v2.1.0)

Todo componente e refatoração DEVE respeitar a **Matriz de Tiers de Hardware** definida no schema:

1. **Tier 1 (High Performance Workstation / Flagship)**: CPU $\ge 8$ cores, RAM $\ge 8\text{GB}$, WebGL2/WebGPU. Habilita Glassmorphism Blur 16px, 60 FPS, marcadores até 5.000 e OPFS storage.
2. **Tier 2 (Mid-Range Mobile)**: CPU 4-6 cores, RAM 4-6GB, WebGL1, Touch $\ge 48\text{px}$. Habilita Glassmorphism Blur 8px, WASM SIMD e marcadores até 1.000.
3. **Tier 3 (Constrained / Save-Data)**: CPU $\le 2$ cores, RAM $\le 2\text{GB}$. Desativa blurs (fundo sólido), utiliza marcadores até 100 e tiles estáticos.

---

*v3.4 · VOLÚPIA / CASOSEX · SOP de Engenharia, Telemetria Multi-Dispositivo & Governança Antigravity-Router (ADR-0213)*
