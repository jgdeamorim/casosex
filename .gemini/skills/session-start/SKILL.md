---
name: session-start
description: Inicialização Soberana de Sessão CASOSEX + Adsentice. Ativa o motor rsxt-router 2.0 (:9755), poda de AST OXC, governança extrema de tokens (ADR-0082/ADR-0226) e monitoramento do catálogo WooCommerce com Mercado Livre.
---

# Abertura de Sessão Soberana & Governança de Tokens

## 1. Ativação do rsxt-router 2.0 (:9755)
- Binário Pure Rust autônomo com redb embarcado.
- Poda sintática Tri-Layer via AST OXC (extração de funções em < 0.28ms).
- Cache BLAKE3 ativo para queries de produtos e hashes estruturais.

## 2. Protocolo de Redução Extrema de Tokens (ADR-0082)
- **Precision Read:** grep_search preliminar e leitura de 30-100 linhas max.
- **Poda Sintática:** Skeletons de código para LLM com corpos de funções colapsados.
- **Execução Fora do Prompt ($0):** Batch scripts, sync de catálogo WooCommerce e consultas MeLi rodam no ambiente local/Docker, mantendo a LLM puramente como árbitro tático.

## 3. Monitoramento de Catálogo (680 Produtos)
- Status do container WooCommerce (:8085) e rotas ACF REST.
- Cadência calibrada de 400ms para sync batch Mercado Livre.
