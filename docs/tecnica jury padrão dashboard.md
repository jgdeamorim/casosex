# ADR-0001: Sovereign Spec-Driven AI Engineering System (SS-AES v3.0) & Enterprise Dashboard Standard

- **Status:** ACEITO (Accepted & Frozen)
- **Versão:** 3.0.0 (Master Governance Specification)
- **Data:** 2026-08-25
- **Autor:** Jeferson Amorim & Antigravity Sovereign AI Architecture Board
- **Escopo:** Sistema Operacional de Engenharia Orientado a Especificação (SDD), Orquestração de Agentes IA (Antigravity/Gemini + Context7 + 21s7 + 64 Skills), Governança Fim a Fim e Padrão de Plataforma Dashboard Enterprise
- **Repositório Target:** `CASOSEX` / `Adsentice` Monorepo

---

## 🏛️ 1. O Novo Paradigma: Spec-Driven + AI-Driven Engineering

Este documento consolida o **Sovereign Spec-Driven AI Engineering System (SS-AES v3.0)**. O Dashboard de Elite não é apenas um produto construído; ele é o resultado determinístico e verificável de uma **fábrica de software governada por especificações (SDD)** onde o ecossistema de Inteligência Artificial (Antigravity, Context7, 21s7 e 64 Skills) opera sob contratos estritos de engenharia.

```text
                    ┌───────────────────────────────┐
                    │        PRODUCT INTENT         │
                    │ Requirements / UX / Business  │
                    └──────────────┬────────────────┘
                                   ↓
                    ┌───────────────────────────────┐
                    │      SPECIFICATION LAYER      │
                    │ SDD / Specs / ADR / Contracts │
                    └──────────────┬────────────────┘
                                   ↓
              ┌────────────────────┴────────────────────┐
              ↓                                         ↓
     ┌────────────────────┐                    ┌────────────────────┐
     │ Context7           │                    │ 21s7 / Skills      │
     │ Documentation      │                    │ Capability Layer   │
     │ Grounding          │                    │ Specialized Agents │
     └──────────┬─────────┘                    └──────────┬─────────┘
                └────────────────┬────────────────────────┘
                                 ↓
                    ┌───────────────────────────────┐
                    │       AI CODING CONTROL       │
                    │ Plan → Implement → Verify     │
                    │ → Test → Audit → Refine       │
                    └──────────────┬────────────────┘
                                   ↓
                    ┌───────────────────────────────┐
                    │          SOURCE CODE          │
                    │ React 19 / Hono / DB / Tokens │
                    └──────────────┬────────────────┘
                                   ↓
                    ┌───────────────────────────────┐
                    │       VERIFICATION GATE       │
                    │ Type / Lint / Test / A11y     │
                    │ Security / Perf / Contract    │
                    └──────────────┬────────────────┘
                                   ↓
                    ┌───────────────────────────────┐
                    │       EVIDENCE & SYSTEM       │
                    │ Runtime + Evidence + Metrics  │
                    └───────────────────────────────┘
```

---

## 👑 2. Hierarquia de Autoridade & Protocolo de Conflito

Em caso de divergência ou ambiguidade durante a execução agentica, o agente **JAMAIS** decide de forma silenciosa ou arbitrária. A seguinte pirâmide de autoridade é incondicional:

```text
                    PRIORIDADE DE AUTORIDADE (SOVEREIGN PYRAMID)
                       ↓
1. Security & Safety Constraints (OWASP ASVS 5.0 Level 2/3)
2. Product Requirements & Acceptance Criteria
3. Architecture Decision Records (ADRs Aceitos)
4. API & Domain Contracts (OpenAPI 3.1 / Schemas Zod)
5. Design System Tokens (OKLCH / Spacing / Motion)
6. Project Specifications (/specs/ Hierarchy)
7. Official Documentation Grounding (Context7 MCP)
8. Specialized Agent Skills (64 Active Skills)
9. Existing Codebase Patterns
10. Agent Preference / Internal Heuristics
```

### 2.1 Protocolo de Conflito Detectado (Conflict Resolution Protocol)
Havendo contradição entre níveis (ex: Código antigo vs Nova SPEC ou Context7 vs Preferência da LLM), o agente interrompe a escrita e emite o relatório estruturado:

```text
================================================================
⚠ CONFLICT DETECTED - HUMAN/SPEC RESOLUTION REQUIRED
================================================================
Spec Target: /specs/05-api/dashboard-kpi.md
Source A (Spec): Exige contrato OpenAPI 3.1 com resposta Discriminated Union.
Source B (Existing Code): Retorna envelope legado com atributo opcional error.
Source C (Context7 Docs): Confirma padrão Zod 3.24+ discriminated union.

Resolution Action: O agente seguirá a Prioridade Nível 4 (Contract) e refatorará o código existente para alinhar à SPEC.
================================================================
```

---

## 📁 3. Hierarquia das Especificações (`/specs` Tree)

A especificação da plataforma é descentralizada em diretórios semânticos versão-controlados:

```text
/specs
├── 00-governance/           # Princípios de Engenharia, AI Agent Rules, Quality Gates
├── 01-product/              # Visão de Produto, Personas, Histórias & Acceptance Criteria
├── 02-architecture/         # Limites do Sistema, Topologia, ADRs (/adr)
├── 03-design/               # Tokens de Design System, Interação Trimodal, A11y (WCAG AA)
├── 04-domain/               # Entidades de Negócio, RBAC/ABAC Multi-Tenancy, Workflows
├── 05-api/                  # OpenAPI 3.1 Spec, Schemas Zod, Envelopes HTTP
├── 06-features/             # Cockpit Dashboard, Analytics, Feeds, Configurações
├── 07-quality/              # Performance Budgets, ASVS Security, Test Strategy
└── 08-operations/           # OpenTelemetry Config, Service Worker Offline, Deployment
```

---

## 📜 4. O Contrato do Agente de IA (Agent Contract)

A IA não opera como um simples "gerador de código", mas como um **Engineering Agent Governafo**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                             AGENT CONTRACT                             │
├────────────────────────────────────────────────────────────────────────┤
│ INPUT                                                                  │
│ • Target SPEC Section & Acceptance Criteria                            │
│ • Current Repository Context & Git Diff                                │
│ • Relevant Capability Skills (Routed dynamically)                      │
│ • Official Documentation Grounding (via Context7 MCP)                  │
│ • Operational & Security Constraints                                  │
├────────────────────────────────────────────────────────────────────────┤
│ PROCESS (OODA Execution Loop)                                          │
│ 1. Inspect: Analisar código, specs e dependências                     │
│ 2. Reason: Calcular Change Impact Analysis & Skill Routing             │
│ 3. Plan: Gerar Implementation Plan & Task DAG                          │
│ 4. Implement: Modificar código aderente às regras SOP/SWC              │
│ 5. Verify: Executar Quality Verification Gates automatizados          │
│ 6. Report: Gerar Artefato de Evidência e provar conformidade           │
├────────────────────────────────────────────────────────────────────────┤
│ OUTPUT                                                                 │
│ • Modified Source Code & Tests                                         │
│ • Automated Verification Evidence (JSON Reports)                       │
│ • Spec Compliance Matrix                                               │
├────────────────────────────────────────────────────────────────────────┤
│ STRICT INVARIANTS (REGRAS INVIOLÁVEIS)                                 │
│ ❌ NUNCA inventar APIs ou métodos de bibliotecas de terceiros.         │
│ ❌ NUNCA modificar limites arquiteturais sem criar/citar um ADR.       │
│ ❌ NUNCA marcar tarefa como DONE sem relatório de evidência gerado.    │
│ ❌ NUNCA ignorar falhas de compilação TypeScript ou testes quebrados.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 5. Camada de Documentação Oficial (Context7 Grounding)

O MCP `context7` atua como **Documental Grounding Layer** obrigatório para erradicar alucinações de biblioteca:

```text
                      Necessidade de utilizar biblioteca/SDK?
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                 Comportamento 100%               Dúvida em versão,
                 conhecido e testado?             Sintaxe ou Breaking Change?
                         │                               │
                         ▼                               ▼
                     Implementar                 Consultar Context7 MCP
                                                 (/org/project)
                                                         │
                                                         ▼
                                                 Verificar Docs Oficiais
                                                         │
                                                         ▼
                                                    Implementar
```

- **Regra de Ouro:** Biblioteca Crítica + Comportamento Incerto = Consulta Obrigatória ao `context7` antes da escrita de qualquer linha de código.

---

## 🗺️ 6. Skill Router Determinístico & Roteamento de Capacidades

Para gerenciar as 64 Skills ativas sem dispersão de contexto ou colisões, o sistema utiliza um **Skill Manifest Schema** com roteamento determinístico:

### 6.1 Exemplo de Manifest de Skill (`frontend-a11y`)
```yaml
name: frontend-a11y
domain: accessibility
priority: high
triggers:
  - accessibility
  - wcag
  - aria
  - keyboard
  - screen-reader
dependencies:
  - frontend-design
documentation:
  required: true
  source: context7
verification:
  - axe-core
  - keyboard-navigation
```

### 6.2 Matriz de Roteamento por Tarefa (Exemplo: Dashboard KPI Widget)
```text
Task: Implementar Widget de KPI Acessível e Performático no Bento Grid
  ├── PRIMARY SKILL:     dashboard-builder
  ├── SUPPORTING SKILLS: frontend-design, frontend-a11y, react-performance, web-perf
  ├── GOVERNANCE SKILL:  spec-kit / adsentice-dag
  └── GROUNDING MCP:     context7 (/tanstack/query, /samchungy/zod-openapi)
```

---

## 🕸️ 7. Task DAG (Grafo de Dependência Não-Linear)

A execução do desenvolvimento por IA segue um Grafo Direcionado Acíclico (DAG) de dependências técnicas:

```text
                                PRODUCT SPEC
                                     │
             ┌───────────────────────┴───────────────────────┐
             ▼                                               ▼
     Design System Tokens                             API Contract (Zod)
     (packages/tokens)                                (packages/contracts)
             │                                               │
      ┌──────┴──────┐                                        ▼
      ▼             ▼                                 Backend Implementation
   Layout      Components                             (apps/api + Hono)
  (Bento)      (Primitives)                                  │
      │             │                                        │
      └──────┬──────┘                                        │
             ▼                                               │
     Dashboard Widgets ◄─────────────────────────────────────┘
             │
             ▼
    Full System Integration
             │
      ┌──────┼──────┐
      ▼      ▼      ▼
    A11y   Perf   Security Verification
      │      │      │
      └──────┼──────┘
             ▼
      Quality Gate & Evidence Generation
             ▼
        RELEASE / DONE
```

---

## 📊 8. Evidence-Driven Development (EDD) & Verification Gates

O desenvolvimento não é concluído com afirmações informais. Cada tarefa gera uma **Pasta de Evidências Auditável**:

```text
/task-artifacts/REQ-DASH-014/
├── 01-specification.md      # Recorte da SPEC e Acceptance Criteria
├── 02-implementation-diff.patch # Mudanças de código aplicadas
├── 03-test-results.json     # Saída do Vitest / Playwright
├── 04-a11y-axe-report.json  # Relatório do axe-core (0 erros severos)
├── 05-perf-lighthouse.json  # Relatório de Web Vitals (P75 RUM compliance)
└── 06-evidence-summary.md   # Matriz Final de Conformidade assinada pela IA
```

---

## 🔄 9. Análise de Impacto de Mudança (Change Impact Engine)

Antes de editar qualquer arquivo, a IA calcula a árvore de impacto colateral:

```text
Arquivo Alvo: apps/web/src/components/widgets/KpiWidget.tsx
  ├── Impacto Direto:   KpiWidget.tsx, KpiWidget.test.tsx
  ├── Impacto Indireto: DashboardGrid.tsx, WidgetRegistry.ts
  ├── Contrato Afetado: packages/contracts/src/dashboard-kpi.ts
  └── Re-Validação Obrigatória:
      • Executar testes unitários de KpiWidget e DashboardGrid
      • Validar schema OpenAPI do contrato dashboard-kpi
      • Executar auditoria axe-core no layout do Dashboard
```

---

## 🕵️ 10. Detecção de Desvio Arquitetural (Architecture Drift Detection)

A cada ciclo de build ou commit, verificações estáticas auditam o código contra as especificações para evitar degradação do sistema:

- **Anti-Duplicação:** Alerta imediato ao recriar componentes visuais ou utilitários já existentes no `packages/ui`.
- **Anti-Bypass de Tokens:** Bloqueio de cores HEX/RGB hardcoded fora do sistema OKLCH.
- **Isolamento de Camadas:** Proibição de imports diretos de banco de dados no frontend ou de utilitários DOM no backend.
- **Escalação para ADR Automático:** Quando uma mudança altera fronteiras do sistema, a IA interrompe o código e emite um rascunho de **ADR** para aprovação do Founder.

---

## 🚀 11. Executable Definition of Done (DoD Gatekeeper)

Uma tarefa só atinge o estado **DONE** quando a verificação estrita automatizada retornar **PASS** em todos os critérios:

```text
[   CHECKLIST EXECUTÁVEL DE DEFINITION OF DONE (DoD)   ]

 [x] TypeScript Compilation (npx tsc --noEmit) sem avisos
 [x] Linter & SOP Compliance (Oxlint / SWC rules ok)
 [x] Testes Unitários e de Integração Aprovados (Vitest 100%)
 [x] Validação do Contrato OpenAPI 3.1 & Schema Zod em Sincronia
 [x] Auditoria de Acessibilidade Aprovada (axe-core 0 severos/críticos)
 [x] Navegação por Teclado e Foco Visível Verificados
 [x] Viewports Mobile (dvh, safe-area, 44px targets) Validados
 [x] Budget de Performance RUM Respeitado (LCP <= 2.5s, INP <= 200ms, CLS <= 0.1)
 [x] OWASP ASVS 5.0 Security Checks Aprovados
 [x] Artefato de Evidência Auditável Gerado em /task-artifacts
 [x] Carga da SPEC Cumprida sem Nenhuma Violação Arquitetural
```

---

## 🏆 Conclusão & Status do Sistema Operacional

Com a promulgação do **ADR-0001 (v3.0)**, o repositório passa a operar sob um **Sistema Operacional de Engenharia IA Orientado por Especificação (SS-AES)** de classe mundial.

### Matriz de Execução Pronta:
1. Especificações estruturadas na árvore `/specs`.
2. Governança de Agentes via Contratos, Routing de Skills e Context7 MCP.
3. Ciclo de desenvolvimento rastreável baseado em Evidências Automatizadas (EDD).
4. Plataforma de Dashboard 360° construída como produto verificado deste ecossistema.