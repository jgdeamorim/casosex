# CASOSEX · Coding SOP — TypeScript + Módulos Puros + UI

> ⚠️ **LEIA ANTES de editar qualquer componente (.tsx) OU módulo .ts.**
> Fontes: SOP v3.0 Canônico + SWC Rules + TypeScript ESLint Canonical Rules
> v3.0 · 2026-08-13 — Instanciação Soberana para o projeto CASOSEX

---

## I. Ciclo de Codificação (SOP v3.0)

```
1. DAG (casosex-dag) → 2. Coda com regras → 3. Validate (tsc) → 4. Commit
```

### 1. Pré-flight — DAG + Grounding
Antes de codar, executar grounding no Qdrant/Filesystem via skill `/casosex-dag`:
- Coleções: `casosex-self`, `casosex-conversation`, `casosex-memory` (tag=`casosex`)
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

*v3.0 · CASOSEX · Especificação de SOP Técnica Integrada*
