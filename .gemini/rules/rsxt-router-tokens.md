# Regras de Sessão, Governança de Tokens & Protocolo 90/10 (CASOSEX + Adsentice OS)
## rsxt-router 2.0 & Economia Extrema de Tokens (ADR-0082 / ADR-0185 / ADR-0226 / ADR-0248)

### 1. Protocolo 90/10 de Alocação de Tokens (OxiBonsai 27B Local + Gemini Nuvem)
- **90% Local (Custo $0 Tokens):** Todo o contexto pesado, regras institucionais, validações de AST, matching de produtos e tensores do **Teacher OxiBonsai 27B** (`tag=oxibonsai-27b` com 842 pontos no Qdrant `:6352`) rodam no host via Embed `:8081` e Mmap Tri-Layer (`< 10ns`).
- **10% Nuvem (Humanização & Síntese):** A janela de tokens da nuvem (Gemini) é reservada exclusivamente para o diálogo humano, tom pedagógico hiper-doce e estruturação de respostas para o founder.
- **Proibição de Despejo Bruto:** É estritamente proibido despejar arquivos brutos ou bancos inteiros no prompt do Gemini sem antes passar pelo filtro de poda sintática local.

### 2. Motor Soberano `rsxt-router 2.0` (Porta `:9755`)
- **Arquitetura Zero-Dependency:** O `rsxt-router v2.0` roda nativamente em Pure Rust com storage embutido `redb` e Mmap Tri-Layer. Não depende de serviços de rede externos para operar AST e cache.
- **Isolamento de Erros:** O router previne quebras de descritor de arquivo (`EPIPE`), absorvendo avisos internos sem quebrar a UI do Electron.

### 3. Poda de Contexto e Redução de Tokens (Até 98.50% de Economia)
- **Precision Read Obrigatório:** NUNCA carregar arquivos inteiros de mais de 100 linhas no prompt sem necessidade. Usar sempre `grep_search` para localizar símbolos e `view_file` focado no intervalo de linhas exato (30-100 linhas).
- **Tri-Layer AST Function Body Pruning:** Para arquivos TSX, PHP ou Rust volumosos, realizar poda sintática prévia, substituindo corpos estáticos por `{ /* stripped */ }`.
- **Cache Determinístico BLAKE3:** Consultas repetidas de produtos WooCommerce, endpoints do Mercado Livre e metadados ACF devem ser validados via hash BLAKE3 para evitar reprocessamento idêntico na LLM.

### 4. Diretriz de Execução e Estabilidade
- **LLM como Árbitro, Nunca Extrator:** Operações de batch, parsing JSON e cálculos de markup rodam em código puro no host/container (`$0` custo).
- **Doutrina `medido=verdade`:** Toda resposta sobre status de catálogo, matching de preços e métricas de sistema deve citar o endpoint, arquivo ou log auditado.
