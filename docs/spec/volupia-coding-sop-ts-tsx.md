# VOLÚPIA · Coding SOP — TypeScript + Módulos Puros + UI

> ⚠️ **LEIA ANTES de editar qualquer componente (.tsx) OU módulo .ts.**
> Fontes: SOP v3.3 Canônico + Antigravity-Router MCP + SWC Rules + TypeScript ESLint Canonical Rules
> v3.3 · 2026-08-28 — Instanciação Soberana com App-Jury & Antigravity-Router (ADR-0210)

---

## I. Ciclo de Codificação (SOP v3.3)

```
1. DAG (volupia-dag / casosex-dag) → 2. Coda (Antigravity-Router oxc) → 3. Validate (App-Jury 6D) → 4. Commit
```

### 1. Pré-flight — DAG + Grounding
Antes de codar, executar grounding no Qdrant/Filesystem via skill `/volupia-dag` (ou `/casosex-dag`):
- Coleções: `volupia-self` / `casosex-self`, `volupia-conversation` / `casosex-conversation`, `volupia-memory` / `casosex-memory` (tag=`volupia` / `casosex`)
- Filesystem: Verificar `docs/spec/` e `docs/adr/`

### 2. Coda — Regras Canônicas
| Tipo de Arquivo | Regra Obrigatória |
|---|---|
| Módulos `.ts` | `catch (e: unknown) { void e }`, `unknown > any`, guard clauses lineares |
| Server Components (`.tsx`) | Props inline (evitar `interface`), Suspense + inner async, funções auxiliares FORA do componente |
| Client Components | Explicitar `'use client'` no topo |
| Imports de Server | `import "server-only"` em módulos com Node.js APIs |

### 3. Check & Commit
```bash
python3 tools/validate_spec_to_cockpit_quality.py
git add . && git commit -m "type: descrição"
```

---

## II. Regras Duras & Anti-Padrões Proibidos

1. **`catch {}` Vazio é PROIBIDO:** Use SEMPRE `catch (e: unknown) { void e; return null }`.
2. **Duplicação de Código:** Antes de criar função, buscar se já existe via `grep -rn`.
3. **`any` Implicíto ou Explícito:** Priorizar `unknown` para forçar type narrowing.
4. **Imports:** Barrel exports em `index.ts` usando `export type * from "./types"` em primeiro lugar.
5. **Fail-Soft com Medição:** Tratar exceções sem derrubar o fluxo e registrando estado quando necessário.

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

Quando o modo de viewport ou contexto for alterado para `mode:mobile`, a SOP v3.3 ativa automaticamente o **`App-Jury v1.0`**:

1. **Gate das 6 Dimensões (6D Critique Theater)**:
   - Visual Parity ($\ge 95\%$ SSIM / OKLCH)
   - Ergonomia Tátil (Touch Targets $\ge 44\text{px}$, Radius 24px)
   - Hydration Safety (`useSyncExternalStore` + `AXAResponsiveSwitch`)
   - Latência GPU Vulkan/Skia ($P50 \le 16.6\text{ms}$ / 60 FPS)
   - ViewModel Cleanliness (Zero regra de negócio em JSX)
   - Acessibilidade WCAG 2.2 AA (APCA Contrast $\ge 7:1$)

---

## V. Integração Soberana com Antigravity-Router (`adsentice-router-dev`)

O ciclo de desenvolvimento utiliza as ferramentas de aceleração compilada em Rust do `adsentice-router-dev`:

1. **Fast-Path AST Validation (`adsentice_ast_validate`)**: Valida sintaxe TS/TSX via parser `oxc` em $< 0.8\text{ms}$ antes de registrar alterações.
2. **Intent-Driven Patching (`adsentice_d_ips_apply`)**: LLM emite `IntentPatchSpec` em JSON compacto, aplicando edições cirúrgicas no código local (economia de $> 92\%$ em tokens).
3. **Substrato Tri-Layer (`adsentice_tri_layer_ingest` / `lookup`)**: Separação de Skeleton (interfaces/assinaturas) e Values (design tokens).
4. **Validação Cryptográfica FCE (`adsentice_fce_validate`)**: Garantia de integridade do contrato e checksums BLAKE3.

---

*v3.3 · VOLÚPIA / CASOSEX · SOP de Engenharia & Governança Antigravity-Router (ADR-0210)*
