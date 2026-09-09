---
name: session-start
description: Inicialização Soberana de Sessão CASOSEX + Adsentice OS (/session-start). Ativa o motor rsxt-router 2.0 (:9755), arquitetura 90/10 (Teacher OxiBonsai 27B Local $0 + 10% Gemini Humanização), Mmap Tri-Layer (<10ns), cache BLAKE3 e monitoramento do catálogo WooCommerce (680 produtos) e Mercado Livre.
---

# Abertura de Sessão Soberana & Governança de Tokens (CASOSEX + Adsentice OS)

## 1. Arquitetura 90/10 & Governança Cognitiva (ADR-0248 / SPEC-0171 / SPEC-0172)
- **90% Local (Custo $0 Tokens):** Todo o esforço pesado de raciocínio lógico-estrutural, matriz matemática de tensores, validações AST e dados densos do catálogo são resolvidos localmente pelo ecossistema soberano:
  - **Teacher OxiBonsai 27B (`tag=oxibonsai-27b`):** 842 vetores mestre no Qdrant `:6352` (equivalente a 118k tokens de raciocínio pré-computados a custo zero de nuvem).
  - **Embed Server Local (`:8081`):** Processo Pure Rust mpnet 768d respondendo em microssegundos.
  - **Mmap Tri-Layer Zero-Copy (`ast_ringbuffer.ipc`):** Resposta estrutural em `< 10 nanossegundos`.
  - **OXC AST Gate (< 0.28ms):** Poda e validação sintática via Rust eliminando até 98.50% de tokens desnecessários de corpos de funções (`{ /* stripped */ }`).
- **10% Nuvem (Gemini 3.8 / Antigravity):** A cota de tokens da nuvem é alocada **estritamente para a camada de síntese, humanização de respostas (Afeto Doce) e canal de comunicação pedagógico com o founder**.

## 2. Motor Soberano `rsxt-router 2.0` (Porta `:9755`)
- Operação em Pure Rust com storage embutido `redb` e Mmap Tri-Layer.
- Desacoplado de containers externos para funções vitais de roteamento.
- Isolamento total de erros para prevenir quebras de pipe (`write EPIPE`) e suprimir falsos alarmes no terminal.

## 3. Protocolo de Leitura e Edição Cirúrgica
- **Precision Read:** Leitura restrita a intervalos de 30 a 100 linhas (`grep_search` preliminar). Proibido ler arquivos de 500+ linhas na íntegra sem necessidade de refatoração global.
- **Cache Determinístico BLAKE3:** Verificação por hash para consultas idempotentes de produtos, endpoints MeLi e schemas ACF.

## 4. Monitoramento de Catálogo (680 Produtos) & Mercado Livre
- Status do container `casosex-wordpress` (:8085) e rotas ACF REST (`/wp-json/wp/v2/product/<id>`).
- Sincronização em lote com cadência anti rate-limit calibrada para **400ms**.
- Doutrina #3: Concluiu tarefa/fase $\rightarrow$ `git add` + `git commit` automático imediato.
