# ADR-0224 (Addendum): Potencialização e Refinamento de Eficiência da Réplica Omie

- **Status:** Approved / Enriched
- **Data:** 2026-09-01
- **Referências Ancoradas (`medido=verdade`):**
  - `/media/jeffer/.../EVO-API/self-essentials/firecrawl-main`
  - `/media/jeffer/.../EVO-API/self-essentials/ECC/skills/api-connector-builder/`
  - `/media/jeffer/.../EVO-API/self-essentials/ECC/skills/data-scraper-agent/`

---

## 🚀 Como Esse Acervo Eleva a Qualidade e Eficiência da ADR-0224

O acervo localizado em `EVO-API/self-essentials` nos fornece **motores prontos de alta engenharia** para acelerar a execução da ADR-0224 de 35% para 100% com velocidade militar:

### 1. Recomposição Automática de UI/UX via Engine Firecrawl (`firecrawl-main`)
- **Problema Anterior (35% UI):** Dependíamos de injeções manuais no console para mapear o React SPA do Omie.
- **Melhoria de Eficiência:** Utilizaremos o motor do Firecrawl (diretório `firecrawl-main` e `firecrawl-cli`) com os métodos de **`Scrape + Extract`**.
- **Resultado:** O Firecrawl executa a varredura do Portal Omie em ambiente de navegador headless, converte o DOM renderizado diretamente em **TypeScript / React 19 JSX** e extrai os componentes e estilos CSS automaticamente com zero esforço manual!

---

### 2. Arquitetura Canônica de Conectores (`api-connector-builder`)
- **Padrão Adoptado:** A skill `api-connector-builder` estabelece a diretriz **"House Style"**:
  - Config Schema (`zod` / `pydantic`)
  - Client Transport (Retry exponencial em 429/500)
  - Data Mapper (Conversão bidirecional Omie JSON-RPC <-> WooCommerce REST API)
  - Typescript Plugin Layer (`index.ts`, `client.ts`, `types.ts`)
- **Impacto no Servidor Bridge (`:6661`):** Padroniza o servidor bridge em formato **Modular API Connector**, permitindo que ele rode como um serviço independente e resiliente.

---

### 3. Pipeline de Enriquecimento de Dados por Batch (`data-scraper-agent`)
- **Eficiência de Batch:** Evita chamadas unitárias pesadas ao Omie e ao LLM, agrupando lotes de 5 a 10 produtos/pedidos por ciclo (`Batch Execution`).
- **Resiliência Fallback:** Aplica a cadeia de fallback automático de modelos em caso de esgotamento de quota ou rate-limit.

---

## 📊 Arquitetura Final da Réplica Soberana Omie

```
┌─────────────────────────────────────────────────────────────┐
│                 FIRECRAWL ENGINE (UI MAPPING)               │
│  - Deep DOM Scrape & Extract                                │
│  - Auto-generate Tailwind v4 / React 19 Components (.tsx)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             OMIE MILITARY BRIDGE SERVER (:6661)             │
│  - Built with API Connector Builder (ECC Standards)         │
│  - OpenAPI 3.1 Spec Generator                               │
│  - TypeScript Interface Exporter                            │
│  - Automatic Model Retry & Rate Limit Handling              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             CASOSEX WOOCOMMERCE / REVENDA B2B               │
│  - Dropshipping Varejo & Atacado Estocado Sincronizados     │
└─────────────────────────────────────────────────────────────┘
```
