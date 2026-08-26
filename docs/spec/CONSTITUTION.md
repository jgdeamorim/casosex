# VOLÚPIA · Constituição do Projeto & Doutrinas Duras

> **Versão:** 1.1.0  
> **Status:** Ativa  
> **Metodologia:** Spec-Driven Development (GitHub Spec Kit)

---

## 🏛️ Artigo I — A Regra-Mãe

`medido=verdade` — Toda e qualquer afirmação sobre o sistema deve obrigatoriamente citar a sua fonte (arquivo, linha, commit, teste ou MCP tool). Sem fonte declarada, a afirmação é classificada como `⚠ não-verificado`.

---

## 🛡️ Artigo II — Doutrinas Duras Invariantes

1. **DAG-First, SEMPRE:** Antes de qualquer codificação ou resposta sobre o sistema, a busca semântica cross-KG e checagem de arquivos (`/volupia-dag` ou `/casosex-dag`) é obrigatória.
2. **Autorização Explícita:** Se o Founder solicitar uma análise, realize apenas a análise. Zero edições de código sem autorização explícita prévia.
3. **Commit Automático:** Concluiu uma feature ou tarefa → `git commit` IMEDIATO. 1 feature = 1 commit.
4. **Isolamento de Namespace:** O projeto VOLÚPIA opera exclusivamente com o prefixo `volupia:*` ou `casosex:*` no Redis `:6396` e coleções no Qdrant `:6352`.
5. **Spec Kit Primeiro:** Toda nova funcionalidade deve seguir o fluxo de 6 estágios (`Constitution → Specify → Clarify → Plan → Tasks → Implement`).

---

## ⚖️ Artigo III — Padrões de Qualidade de Código (SOP v3.0)

- **Handling de Exceções:** `catch (e: unknown) { void e; return null }` é o único padrão fail-soft aceito. Bloco `catch {}` vazio é estritamente proibido.
- **Tipagem:** `unknown > any`. Forçar type narrowing explícito.
- **Imports:** `import "server-only"` em módulos com dependências de runtime Node.js/Redis raw.
