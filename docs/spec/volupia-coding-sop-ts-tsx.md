# VOLÚPIA · Coding SOP — TypeScript + Módulos Puros + UI

> ⚠️ **LEIA ANTES de editar qualquer componente (.tsx) OU módulo .ts.**
> Fontes: SOP v3.0 Canônico + SWC Rules + TypeScript ESLint Canonical Rules
> v3.0 · 2026-08-13 — Instanciação Soberana para o projeto VOLÚPIA

---

## I. Ciclo de Codificação (SOP v3.0)

```
1. DAG (volupia-dag / casosex-dag) → 2. Coda com regras → 3. Validate (tsc) → 4. Commit
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
npx tsc --noEmit
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
   - Cabeçalhos desktop (`>= 640px`) DEVEM alinhar título e badges de ação horizontalmente (`flex-row items-center justify-between`). É proibido empilhar badges com `flex-col items-end` em cabeçalhos principais desktop.
3. **Contrato de Tabelas B2B High-Density (`UI-PATTERN-DATA-TABLE`)**:
   - Segue padrão IBM Carbon (5 densidades, células verticalmente centralizadas `items-center` / `align-middle`, destaque de linha `hover:bg-muted/20`, acessibilidade `role="table"` e suporte a navegação por teclado).
4. **Contrato de Indicadores de Status (`UI-PATTERN-STATUS-INDICATOR`)**:
   - Badges de status DEVEM combinar indicador visual (dot de pulso `<span className="w-2 h-2 rounded-full animate-pulse" />`) com texto e `role="status"` WAI-ARIA.
5. **Multi-Jury Enforcement**:
   - **AST Jury** (sub-milissegundo no dev-loop) $\rightarrow$ **DOM/ARIA Jury** (pre-push/PR) $\rightarrow$ **Visual Jury** (PR/CI com Playwright).

---

*v3.2 · VOLÚPIA · Especificação de SOP Técnica & Governança Normativa B2B*

