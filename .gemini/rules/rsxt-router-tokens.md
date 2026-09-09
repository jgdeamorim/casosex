# Regras de Sessão & Governança Cognitiva (CASOSEX + Adsentice OS)
## rsxt-router 2.0 & Economia Extrema de Tokens (ADR-0082 / ADR-0185 / ADR-0226)

### 1. Motor Soberano `rsxt-router 2.0` (Porta `:9755`)
- **Arquitetura Zero-Dependency:** O `rsxt-router v2.0` roda nativamente em Pure Rust com storage embutido `redb` e Mmap Tri-Layer. Não depende de Redis ou Qdrant para operar suas funções vitais de roteamento, AST e cache.
- **Isolamento de Erros:** O router nunca propaga falhas de conexão de infraestrutura externa para o terminal pai, prevenindo quebras de pipe (`EPIPE`) e falsos alarmes no motor de inferência.

### 2. Poda de Contexto e Redução de Tokens (Até 98.50% de Economia)
- **Precision Read Obrigatório:** NUNCA carregar arquivos inteiros de mais de 100 linhas no prompt sem necessidade. Usar sempre `grep_search` para localizar símbolos e `view_file` focado no intervalo de linhas exato (30-100 linhas).
- **Tri-Layer AST Function Body Pruning:** Para arquivos TypeScript, PHP ou Rust volumosos, realizar poda sintática prévia, extraindo apenas assinaturas, interfaces e o trecho da função a ser alterado, substituindo blocos estáticos por `{ /* stripped */ }`.
- **Cache Determinístico BLAKE3:** Consultas repetidas de produtos WooCommerce, endpoints do Mercado Livre e metadados ACF devem ser validados via hash BLAKE3 para evitar reprocessamento idêntico na LLM.

### 3. Diretriz de Execução e Estabilidade
- **LLM como Árbitro, Nunca Extrator:** Operações de batch, parsing JSON e cálculos de markup rodam em código puro no host/container (`$0` custo), nunca dentro do prompt da LLM.
- **Doutrina `medido=verdade`:** Toda resposta sobre status de catálogo, matching de preços e métricas de sistema deve citar o endpoint, arquivo ou log auditado.
