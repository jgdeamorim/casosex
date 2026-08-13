# ADR-0001: Arquitetura de Corpora & Auto-Ingestão Soberana do CASOSEX

- **Status:** Accepted
- **Data:** 2026-08-13
- **Autores:** Jeferson Amorim (Founder) & Antigravity (AI Architect)

---

## Contexto

Para garantir grounding contínuo (`medido=verdade`), rastreabilidade de decisões e isolamento de contexto sem contaminação entre projetos, o **CASOSEX** necessita de uma divisão clara de coleções de conhecimento no vetor DB (Qdrant `:6352`) e histórico de conversas no Antigravity.

---

## Decisão

Fica estabelecida a estrutura soberana de **3 Corpora** + **1 Pipeline de Conversas**:

### 1. Corpora de Conhecimento

- **Corpus A — Produto CASOSEX (`casosex-self`)**
  - **Conteúdo:** Código-fonte (.ts/.tsx), especificações (`docs/spec/`), registros de arquitetura (`docs/adr/`), handoffs.
  - **Finalidade:** Grounding estrito sobre como o produto funciona e está implementado.

- **Corpus B — Devs & Arquitetos (`casosex-memory` · tag=`casosex`)**
  - **Conteúdo:** Decisões de engenharia, visão de negócios, diretrizes do Founder e alinhamentos de arquitetura do par Founder + Antigravity.
  - **Finalidade:** Preservar a visão estratégica e padrões tomados pelos arquitetos.

- **Corpus C — Tooling & Referências (`casosex-tooling`)**
  - **Conteúdo:** Padrões de bibliotecas externas, SDKs, integração MCP context7.
  - **Finalidade:** Suporte de tooling sem poluição no domínio do produto.

### 2. Histórico de Conversas Antigravity (`casosex-conversation` · tag=`casosex`)

- Todo o histórico de diálogos, análises e sessões entre o Founder e o Antigravity na workspace CASOSEX será ingerido via `adsentice_conversation_remember` com `tag=casosex`.

---

## Consequências

- Isolamento 100% garantido no Qdrant `:6352`.
- Grounding via DAG `/casosex-dag` pesquisando em paralelo nas coleções `casosex-self`, `casosex-memory` e `casosex-conversation`.
