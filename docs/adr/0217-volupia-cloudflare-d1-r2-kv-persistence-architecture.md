# ADR-0217: Arquitetura de Persistência Cloudflare-Native (D1/R2/KV) para o Volúpia Content Engine (`usevolupia.com.br`)

**Status:** Accepted  
**Data:** 30 de Agosto de 2026  
**Decisores:** Jeferson Amorim (Founder) & Antigravity AI Architecture Board  
**Contexto:** Volúpia Content OS / CASOSEX (`apps/volupia-content-worker` `:7860`, `usevolupia.com.br`, Cloudflare Edge Isolates, Redis `:6396`, Qdrant `:6352`)  
**Tags Soberanas:** `volupia-content-engine` · `cloudflare-d1` · `cloudflare-r2` · `cloudflare-kv` · `usevolupia` · `medido=verdade`  

---

## 1. Contexto & Motivação

Com o amadurecimento e a institucionalização do **Volúpia Content Engine** (`usevolupia.com.br`), faz-se necessário migrar e estender a camada de persistência temporária/local para a infraestrutura soberana e serverless de alta performance da **Cloudflare**.

Para garantir disponibilidade global, resiliência enterprise e conformidade com o ecossistema CASOSEX ($0 egress fee, resposta sub-milissegunda na edge), a aplicação deve utilizar os produtos nativos da Cloudflare:
1. **Cloudflare D1 (`DB / volupia_db`)**: Banco de dados SQLite relacional na Edge para persistência de fluxos, projetos, pastas, variáveis, memórias e auditorias.
2. **Cloudflare R2 (`VAULT / volupia-media`)**: Object Storage S3-compatível com taxa zero de egresso para armazenamento de mídias geradas (Reels, imagens, Evidence Packs, snapshots de grafos).
3. **Cloudflare KV (`VOLUPIA_KV`)**: Key-Value Store de ultra-baixa latência para sessões de usuário, tokens de MCP e locks distribuídos.

---

## 2. Decisão Ratificada

Ratificamos as seguintes especificações de arquitetura para a camada de persistência Cloudflare do Volúpia:

### 2.1 Bindings no `wrangler.jsonc` (`apps/volupia-content-worker`)
O arquivo de configuração do Worker `apps/volupia-content-worker/wrangler.jsonc` inclui explicitamente os seguintes bindings soberanos:
```jsonc
{
  "$schema": "../../node_modules/wrangler/config-schema.json",
  "name": "volupia-content-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-14",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "volupia_db"
    }
  ],
  "r2_buckets": [
    {
      "binding": "VAULT",
      "bucket_name": "volupia-media"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "VOLUPIA_KV",
      "id": "volupia_kv_storage"
    }
  ]
}
```

### 2.2 Estrutura do Schema no Cloudflare D1 (`volupia_db`)
As seguintes tabelas SQLite normativas são mantidas e inicializadas automaticamente pelo Worker:

1. **`volupia_flows`**: Tabela de grafos e fluxos do Langflow Modificado:
   - `id TEXT PRIMARY KEY`, `folder_id TEXT`, `name TEXT`, `description TEXT`, `data TEXT (JSON)`, `created_at TEXT`, `updated_at TEXT`
2. **`volupia_projects`**: Tabela de projetos e estruturas de pastas do Cockpit:
   - `id TEXT PRIMARY KEY`, `name TEXT`, `description TEXT`, `parent_id TEXT`, `components TEXT (JSON)`, `created_at TEXT`, `updated_at TEXT`
3. **`volupia_variables`**: Tabela de variáveis de ambiente e segredos de nós:
   - `id TEXT PRIMARY KEY`, `name TEXT`, `value TEXT`, `type TEXT`, `created_at TEXT`
4. **`volupia_memories`**: Tabela de memórias e configurações de Knowledge Bases:
   - `id TEXT PRIMARY KEY`, `name TEXT`, `flow_id TEXT`, `user_id TEXT`, `threshold REAL`, `auto_capture INTEGER`, `created_at TEXT`
5. **`volupia_telemetry`**: Tabela de telemetria OODA / BOA Score:
   - `id TEXT PRIMARY KEY`, `stage TEXT`, `boa_score REAL`, `commit_count INTEGER`, `timestamp TEXT`

### 2.3 Arquitetura de Armazenamento Híbrido com Fallback Soft
Para garantir que a aplicação funcione em dois ambientes distintos sem quebrar:
- **Ambiente Cloudflare Workers (Produção - `usevolupia.com.br`)**: A aplicação utiliza os bindings de borda (`env.DB`, `env.VAULT`, `env.VOLUPIA_KV`).
- **Ambiente Node.js Standalone (Desenvolvimento Local - `:7860`)**: Ao detectar a ausência dos bindings em runtime, a aplicação chaveia automaticamente para o Redis `:6396` de forma transparente.

---

## 3. Consequências Medidas (`medido=verdade`)

1. **Persistência Soberana na Edge**: Fluxos criados ou editados no Cockpit React são salvos em milissegundos no D1/R2 da Cloudflare.
2. **Zero Custos de Egresso**: Mídias geradas salvas no R2 não geram tarifação de tráfego na exportação ou renderização no Cockpit.
3. **Resiliência Total**: O fallback inteligente garante que desenvolvedores possam rodar a stack localmente via Node/Redis enquanto o ambiente de produção utiliza 100% Cloudflare Native APIs.

---
*ADR-0217 formalizada, aprovada e selada em 30/08/2026.*
