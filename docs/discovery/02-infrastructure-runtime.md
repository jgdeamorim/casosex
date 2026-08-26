# 02. Infraestrutura & Runtime (Discovery & Architecture)

- **Status:** CONSOLIDADO (Discovery Phase)
- **Data:** 2026-08-25
- **Versão:** 1.0.0
- **Escopo:** Especificação de Infraestrutura, Roteamento Cloudflare, Dual-Stack Topology e Air-Gapped WooCommerce Engine.

---

## 🏷️ 1. Marca, Nomenclatura e Separação de Papéis (`[FACT]`)

| Domínio | Identidade | Função no Ecossistema | Infraestrutura |
|---|---|---|---|
| **Loja Virtual B2C** | **Volúpia** (`usevolupia.com.br`) | Superfície de Vendas, Catálogo B2C, Carrinho e Checkout | WordPress + WooCommerce Container (`:8085`) |
| **Center-OS / Control Plane** | **`casosex-os`** | Central de Inteligência, Orquestração Agêntica MCP, Discovery B2B | EmDash CMS (`@emdash-cms`) na Cloudflare Edge |

---

## 🏗️ 2. Arquitetura Dual-Stack (`[DECISION CANDIDATE]`)

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                      1. CENTER-OS (casosex-os)                            │
│                 Business Control Plane na Cloudflare Edge                 │
├───────────────────────────────────────────────────────────────────────────┤
│  • Framework: Astro 5.x Server Mode (@astrojs/cloudflare)                  │
│  • Core CMS: EmDash CMS (@emdash-cms)                                     │
│  • Database: Cloudflare D1 (binding: DB)                                  │
│  • Storage: Cloudflare R2 (binding: MEDIA)                                │
│  • KV Cache: BLAKE3 Deterministic Cache                                   │
│  • MCP Server: Native MCP Endpoint (/_emdash/api/mcp)                     │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ Sincronia Bi-Direcional (REST/MCP)
┌─────────────────────────────────────┴─────────────────────────────────────┐
│                      2. LOJA VIRTUAL B2C (Volúpia)                        │
│                 Air-Gapped WordPress + WooCommerce Engine                 │
├───────────────────────────────────────────────────────────────────────────┤
│  • Runtime: Docker Container (http://localhost:8085/)                     │
│  • Engine: WordPress + WooCommerce                                        │
│  • Plugin Soberano: wp-adsentice-second-brain                             │
│  • MCP Endpoint: /wp-json/easy-mcp-ai/v1/mcp                              │
│  • Proteção: Air-Gapped / Sinistro Protegido (Zero /wp-admin público)      │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 3. Doutrina de Segurança & Air-Gapping (`[CONSTRAINT]`)

1. **Proteção do WordPress (`/wp-admin`)**:
   - O painel WordPress não fica diretamente exposto na internet pública.
   - Toda gestão de conteúdo e produtos pode ser orquestrada agenciadamente via protocolo MCP pelo `casosex-os` (Center-OS).

2. **Custo de Infraestrutura ($0/mês Target)**:
   - O Center-OS opera dentro das cotas do **Plano Gratuito Cloudflare**: 5M leituras/dia no D1, 5GB no R2 e execução de Workers sem custo fixo mensal.

---

## 🗺️ 4. Impacto em ADRs
- Promovido para o **ADR-0002**: *Dual-Stack Infrastructure Architecture (casosex-os EmDash Cloudflare & Volúpia WooCommerce Engine)*.
