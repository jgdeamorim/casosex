# Depreciação do Runtime Astro & EmDash (CASOSEX)

> **Data de Registro:** 25 de Agosto de 2026  
> **Status:** `DEPRECATED` / `ARCHIVED`  
> **Doutrina:** `medido=verdade`  

---

## 📌 Motivo da Depreciação

O ecossistema **Astro** e o monorepo **EmDash CMS** foram desativados do projeto principal `CASOSEX` para eliminar acoplamentos desnecessários e consumo excessivo de memória (OOM), consolidando a arquitetura do projeto.

---

## 🗄️ Localização dos Artefatos Arquivados

Todos os arquivos fonte e configurações anteriores foram isolados e preservados no seguinte diretório:

- `self-essentials/deprecated/emdash/` — Repositório monorepo do EmDash v0.35.0.
- `self-essentials/deprecated/astro.config.mjs` — Configuração antiga do servidor Astro.
- `self-essentials/deprecated/emdash-env.d.ts` — Definição de tipos TypeScript do EmDash.

---

## 🔧 Alterações no Projeto

1. **Monorepo `pnpm-workspace.yaml`:** A entrada `self-essentials/emdash/packages/*` foi removida.
2. **Scripts `package.json`:** Comandos vinculados ao Astro/EmDash foram removidos.
3. **Grafo de Dependências:** O grafo `pnpm` foi saneado via `pnpm install`.
