# ADR-0001: Sovereign Spec-Driven AI Engineering System (SS-AES v3.1) & Adaptive Experience Architecture (AXA)

- **Status:** ACEITO (Accepted & Frozen)
- **Versão:** 3.1.0 (Master Governance & Experience Specification)
- **Data:** 2026-08-25
- **Autor:** Jeferson Amorim & Antigravity Sovereign AI Architecture Board
- **Escopo:** Sistema Operacional de Engenharia Orientado a Especificação (SDD), Adaptive Experience Architecture (AXA), Governança de IA (Antigravity/Gemini + Context7 + 21s7 + 64 Skills) e Monorepo Enterprise
- **Repositório Target:** `CASOSEX` / `Adsentice` Monorepo

---

## 💎 TESE CENTRAL: O AXIOMA AXA

> **"Mobile is not a responsive breakpoint of Desktop. Mobile is an independent application experience sharing the same domain, state, contracts, design tokens and component primitives."**
> 
> *(Mobile não é um breakpoint responsivo do Desktop. Mobile é uma experiência de aplicação independente, compartilhando incondicionalmente o mesmo domínio, estado, contratos de API, tokens de design e primitivas de componentes.)*

---

## 🏛️ 1. Visão Geral da Arquitetura Fim a Fim

O sistema desacopla a lógica de negócio da composição visual de dispositivo. Não existe um único layout que é "encolhido" via CSS; existem **4 Experience Modes** ativados pelo **Adaptive Experience Architecture (AXA Engine)**:

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
                    ┌───────────────────────────────┐
                    │     SHARED DOMAIN & STATE     │
                    │ Zod / OpenAPI / TanStack Query│
                    └──────────────┬────────────────┘
                                   ↓
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
 ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
 │ Mobile App   │           │ Tablet       │           │ Desktop      │
 │ Experience   │           │ Hybrid       │           │ Workspace    │
 │ (AppShell)   │           │ (SplitView)  │           │ (Bento Grid) │
 └──────┬───────┘           └──────┬───────┘           └──────┬───────┘
        │                          │                          │
        └──────────────────────────┼──────────────────────────┘
                                   ▼
                    ┌───────────────────────────────┐
                    │      VERIFICATION GATE        │
                    │ Type / Lint / Test / A11y /   │
                    │ Security / AXA Compliance     │
                    └──────────────┬────────────────┘
                                   ↓
                    ┌───────────────────────────────┐
                    │      OBSERVABLE SYSTEM        │
                    │  Runtime + Evidence Reports   │
                    └───────────────────────────────┘
```

---

## 📱 2. Adaptive Experience Architecture (AXA) Engine

### 2.1 Os 4 Modos de Experiência (Experience Modes)

```text
                               AXA EXPERIENCE ENGINE
                                         │
       ┌───────────────────┬─────────────┴─────┬───────────────────┐
       ▼                   ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. Mobile   │    │  2. Tablet   │    │  3. Desktop  │    │ 4. Ultrawide │
│   App-First  │    │    Hybrid    │    │  Workspace   │    │  Tri-Column  │
│ (MobileShell)│    │ (Rail/Split) │    │ (Bento 12Col)│    │ (Command)    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

1. **Mobile App-First Mode (`MobileAppShell`):** Experiência nativa touch. Stack vertical de cards, Bottom Navigation Dock, Bottom Sheet Layer para filtros e ações contextuais, revelação progressiva, suporte a gestos (swipe, pull-to-refresh) e touch targets $\ge 44\text{px}$.
2. **Tablet Hybrid Mode (`TabletWorkspaceShell`):** Navegação via Navigation Rail lateral, layout adaptativo mestre/detalhe (Split View), Bento parcial e suporte híbrido Touch + Mouse.
3. **Desktop Workspace Mode (`DesktopWorkspaceShell`):** O **Bento Grid de 12 colunas** assume a composição principal. Navegação por Sidebar persistente, tooltips, atalhos de teclado avançados e alta densidade de informação.
4. **Ultra-Wide Command Mode (`UltraWideWorkspaceShell`):** Composição em 3 colunas independentes `[Sidebar | Primary Workspace Canvas | Context Analytics Panel]`, evitando esticamento e criando um cockpit de comando multitarefa.

---

## 📊 3. Matriz de Capacidades da Experiência (AXA Experience Matrix)

Esta matriz orienta o agente de IA e a engenharia sobre o comportamento de cada elemento:

| Capacidade | Mobile App-First | Tablet Hybrid | Desktop Workspace | Ultra-Wide Command |
| :--- | :--- | :--- | :--- | :--- |
| **Navegação** | Bottom Dock + Drawer | Navigation Rail | Sidebar Persistente | Sidebar + Context Panel |
| **Layout Base** | App Stack Vertical | Adaptive Split-View | Bento Grid (12 Cols) | Tri-Column Workspace |
| **Input Primário** | Touch (Tap/Swipe/LongPress) | Touch + Mouse | Mouse + Teclado | Mouse + Teclado |
| **Filtros** | Bottom Sheet Layer | Modal / Drawer | Toolbar Persistente | Persistent Context Panel |
| **Tabelas** | Cards / Compact Rows | Compact Table | Full Data Table | Full Table + Side Detail |
| **Gráficos** | Focus Mode + Bottom Sheet | Adaptive Widget | Bento Chart Widget | Expanded Canvas |
| **Ações** | Bottom Bar Contextual | Header / Mixed | Action Bar Persistente | Command Workspace |
| **Densidade** | Baixa / Foco Único | Média | Alta | Muito Alta (Multi-task) |
| **Gestos** | Nativo (First-class) | Suportado | Opcional | Opcional |
| **Profundidade** | Rala (Shallow Flow) | Média | Profunda | Profunda / Simultânea |

---

## 🛠️ 4. Arquitetura React de Desacoplamento (Composition Roots)

Separamos o modelo de apresentação da lógica de aplicação, reutilizando 100% dos hooks, estado e contratos:

```tsx
// React Composition Root
export function DashboardExperience() {
  const { data, isLoading } = useDashboardData(); // Shared State & Domain

  return (
    <AXAResponsiveSwitch>
      <AXAOption mode="mobile">
        <MobileAppShell data={data} isLoading={isLoading} />
      </AXAOption>

      <AXAOption mode="tablet">
        <TabletWorkspaceShell data={data} isLoading={isLoading} />
      </AXAOption>

      <AXAOption mode="desktop">
        <DesktopWorkspaceShell data={data} isLoading={isLoading} />
      </AXAOption>

      <AXAOption mode="ultrawide">
        <UltraWideWorkspaceShell data={data} isLoading={isLoading} />
      </AXAOption>
    </AXAResponsiveSwitch>
  );
}
```

### 4.1 Função das Media Queries vs Container Queries no AXA
- **Media Queries (`@media`):** Selecionam qual **Experience Mode (AXA Target)** deve ser renderizado (`MobileAppShell` vs `DesktopWorkspaceShell`).
- **Container Queries (`@container`):** Adaptam a **primitiva de componente** ao tamanho da caixa onde ele foi encaixado dentro daquela experiência específica.

---

## 🤖 5. Parâmetros AXA para o AI-Driven Agent

A IA recebe o destino de experiência explicitado no manifesto da tarefa, eliminando deduções incorretas:

```yaml
EXPERIENCE_TARGET:
  mobile:
    mode: app-first
    shell: MobileAppShell
    navigation: bottom-dock
    interaction: touch-first
    composition: vertical-stack
    filters: bottom-sheet
    tables: card-transformation
    gestures: enabled
  desktop:
    mode: workspace
    shell: DesktopWorkspaceShell
    navigation: sidebar
    composition: bento-12
```

---

## 👑 6. Hierarquia de Autoridade & Protocolo de Conflito

Em caso de divergência ou ambiguidade durante a execução agentica, a pirâmide de autoridade é incondicional:

```text
                    PRIORIDADE DE AUTORIDADE (SOVEREIGN PYRAMID)
                       ↓
1. Security & Safety Constraints (OWASP ASVS 5.0 Level 2/3)
2. Product Requirements & AXA Experience Targets
3. Architecture Decision Records (ADRs Aceitos)
4. API & Domain Contracts (OpenAPI 3.1 / Schemas Zod)
5. Design System Tokens (OKLCH / Spacing / Motion)
6. Project Specifications (/specs/ Hierarchy)
7. Official Documentation Grounding (Context7 MCP)
8. Specialized Agent Skills (64 Active Skills)
9. Existing Codebase Patterns
10. Agent Preference / Internal Heuristics
```

---

## 📜 7. O Contrato do Agente de IA (Agent Contract)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                             AGENT CONTRACT                             │
├────────────────────────────────────────────────────────────────────────┤
│ INPUT                                                                  │
│ • Target SPEC Section, AXA Target & Acceptance Criteria                │
│ • Current Repository Context & Git Diff                                │
│ • Relevant Capability Skills (Routed dynamically)                      │
│ • Official Documentation Grounding (via Context7 MCP)                  │
│ • Operational & Security Constraints                                  │
├────────────────────────────────────────────────────────────────────────┤
│ PROCESS (OODA Execution Loop)                                          │
│ 1. Inspect: Analisar código, specs e dependências AXA                  │
│ 2. Reason: Calcular Change Impact Analysis & Skill Routing             │
│ 3. Plan: Gerar Implementation Plan & Task DAG                          │
│ 4. Implement: Modificar código aderente às regras SOP/SWC e AXA        │
│ 5. Verify: Executar Quality Verification Gates automatizados          │
│ 6. Report: Gerar Artefato de Evidência e provar conformidade           │
├────────────────────────────────────────────────────────────────────────┤
│ OUTPUT & STRICT INVARIANTS                                             │
│ ❌ NUNCA tratar Mobile apenas como breakpoint CSS comprimido do Bento. │
│ ❌ NUNCA inventar APIs ou métodos de bibliotecas sem Context7.         │
│ ❌ NUNCA marcar tarefa como DONE sem pasta /task-artifacts/ com provada│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 8. Hierarquia das Especificações (`/specs` Tree)

```text
/specs
├── 00-governance/           # Princípios de Engenharia, AI Agent Rules, Quality Gates
├── 01-product/              # Visão de Produto, Personas, Histórias & Acceptance Criteria
├── 02-architecture/         # Limites do Sistema, AXA Engine, ADRs (/adr)
├── 03-design/               # Tokens OKLCH, Interação Trimodal, AXA Experience Matrix
├── 04-domain/               # Entidades de Negócio, RBAC/ABAC Multi-Tenancy, Workflows
├── 05-api/                  # OpenAPI 3.1 Spec, Schemas Zod, Envelopes HTTP
├── 06-features/             # Cockpit Dashboard, Analytics, Feeds, Configurações
├── 07-quality/              # Performance Budgets, ASVS Security, Test Strategy
└── 08-operations/           # OpenTelemetry Config, Service Worker Offline, Deployment
```

---

## 📊 9. Evidence-Driven Development (EDD) & Executable DoD

Toda tarefa finalizada gera obrigatoriamente a pasta auditável em `/task-artifacts/REQ-XXX/`:

```text
/task-artifacts/REQ-DASH-014/
├── 01-specification.md      # SPEC Recorte e AXA Target
├── 02-implementation-diff.patch # Mudanças aplicadas
├── 03-test-results.json     # Saída do Vitest / Playwright
├── 04-a11y-axe-report.json  # Relatório axe-core (0 erros)
├── 05-perf-lighthouse.json  # RUM Web Vitals P75 compliance
└── 06-evidence-summary.md   # Matriz de Conformidade Assinada
```

### Executable Definition of Done (DoD)
- [x] Compilação TypeScript sem avisos (`npx tsc --noEmit`).
- [x] Linter & SOP compliance (SWC rules ok).
- [x] Testes unitários/integração Vitest 100% verde.
- [x] OpenAPI 3.1 & Zod em sincronia estrita.
- [x] axe-core sem erros Críticos/Severos.
- [x] Telas Mobile validadas no `MobileAppShell` (touch targets $\ge 44\text{px}$, bottom dock ok).
- [x] Relatório em `/task-artifacts` gerado com provada de execução.

---

## 🏆 Conclusão & Promulgação

Com este aceite, o repositório **CASOSEX / Adsentice** passa a ser regido oficialmente pelo **ADR-0001 v3.1 (AXA + SS-AES)**, estabelecendo o mais avançado padrão de engenharia orientada por especificações e IA do mercado.