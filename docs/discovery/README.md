# Discovery & Brainstorming Framework (SS-AES v3.2)

- **Status:** ACEITO (Discovery Phase Standard)
- **Data:** 2026-08-25
- **Versão:** 1.0.0
- **Escopo:** Protocolo de Transição de Brainstorm Técnico para Decisões Arquiteturais (ADRs) e Especificações SDD (Spec-Kit)

---

## 🏛️ 1. O Fluxo de Engenharia End-to-End

O desenvolvimento de software no ecossistema CASOSEX / Adsentice é impulsionado por um pipeline unidirecional rigoroso:

```text
CONSTITUTION (ADR-0001 v3.2)
     ↓
PROJECT DISCOVERY / BRAINSTORM (Classificação de Conhecimento)
     ↓
ADR / ARCHITECTURE DECISIONS (Formalização Arquitetural em docs/adr/)
     ↓
SPECIFY (/specify → specs/[feature]/spec.md)
     ↓
CLARIFY (/clarify → Resolução de ambiguidades [NEEDS CLARIFICATION])
     ↓
PLAN (/plan → plan.md + data-model.md + contracts/)
     ↓
TASKS (/tasks → tasks.md com paralelismo [P])
     ↓
IMPLEMENT (/implement → SOP v3.0 + Zero-Copy SWC/TSC Rules)
     ↓
VERIFY (Executable DoD + axe-core + Vitest + TSC)
     ↓
EVIDENCE (Suíte EDD de 8 Artefatos em /task-artifacts/REQ-XXX/)
```

---

## 🏷️ 2. Taxonomia de Classificação de Descoberta (Discovery Taxonomy)

Durante as sessões de Brainstorm e Briefing Técnico, toda afirmação produzida pelo agente ou pelo Founder DEVE ser categorizada explicitamente para evitar a transformação prematura de hipóteses em "requisitos oficiais":

| Tag | Definição | Destino Arquitetural |
| :--- | :--- | :--- |
| `[FACT]` | Verdade empírica comprovada (`medido=verdade`) | Documentação / Specs |
| `[INFERENCE]` | Dedução lógica baseada em evidências do sistema | Raciocínio de Discovery |
| `[OPTION]` | Candidato técnico sob avaliação comparativa | Matriz de Decisão no PLAN |
| `[TRADE-OFF]` | Análise de prós e contras (Custo vs Complexidade vs Perf) | Avaliação em ADRs |
| `[QUESTION]` | Dúvida pendente que exige direcionamento do Founder | Prompt do Discovery |
| `[ASSUMPTION]` | Hipótese temporária aguardando validação empírica | Marcador no `spec.md` |
| `[DECISION CANDIDATE]` | Proposta estruturada aguardando promoção a ADR | Minuta em `docs/adr/` |

---

## 📁 3. Estrutura dos Artefatos de Descoberta (`docs/discovery/`)

A fase de Brainstorming Técnico é documentada nos seguintes módulos canônicos:

```text
docs/discovery/
├── README.md                           # Este guia de governança
├── 01-product-vision-domains.md        # Visão de Produto, Personas & Domínios de Negócio
├── 02-infrastructure-runtime.md        # Infraestrutura, Hosting, Cloudflare & Edge Runtimes
├── 03-database-caching-storage.md      # Postgres, Redis :6396, Qdrant :6352, R2 Vault
├── 04-api-auth-realtime.md             # REST, OpenAPI 3.1, Supabase Auth, SSE/WebSockets
├── 05-agent-sovereignty-skills.md      # Context7 Grounding, Skill Routing & MCP Servers
└── 06-security-observability.md        # OWASP ASVS 5.0, OpenTelemetry & RUM Telemetry
```

---

## 🗺️ 4. Roadmap de ADRs Derivados do Discovery

As propostas `[DECISION CANDIDATE]` validadas são promovidas a **Architecture Decision Records (ADRs)** antes da criação de qualquer especificação de funcionalidade:

- `ADR-0001`: SS-AES v3.2 Master Specification, AXA Engine & Operating Protocols (Promulgado)
- `ADR-0002`: Edge Infrastructure & Cloudflare Routing Strategy
- `ADR-0003`: Polyglot Persistence Architecture (Postgres + Redis + Qdrant)
- `ADR-0004`: Security, Auth & Multi-Tenant RBAC/ABAC Standard (OWASP ASVS 5.0)
- `ADR-0005`: Cloudflare R2 Vault & Blob Storage Retention Protocol
- `ADR-0006`: Real-Time Messaging & Event Engine (SSE / WebSockets)
- `ADR-0007`: Sovereign Observability, OpenTelemetry & RUM Telemetry
