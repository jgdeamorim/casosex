# ADR-0001: Sovereign Spec-Driven AI Engineering System (SS-AES v3.2) & Executable Operating Protocols

- **Status:** ACEITO (Accepted & Frozen)
- **Versão:** 3.2.0 (Master Governance & Executable Operating Protocols)
- **Data:** 2026-08-25
- **Autor:** Jeferson Amorim & Antigravity Sovereign AI Architecture Board
- **Escopo:** Sistema Operacional de Engenharia Orientado a Especificação (SDD), Adaptive Experience Architecture (AXA), Governança de IA (Antigravity/Gemini + Context7 + 21s7 + 64 Skills), Monorepo Enterprise e 7 Protocolos Operacionais Executáveis.
- **Repositório Target:** `CASOSEX` / `Adsentice` Monorepo

---

## 💎 TESE CENTRAL: O AXIOMA AXA (PRECISÃO CONCEITUAL)

> **"Mobile não é um breakpoint responsivo do Desktop. Mobile é uma experiência de aplicação independente, compartilhando incondicionalmente design tokens, acessibilidade de base, recursos de domínio/aplicação e contratos de API, mas NÃO necessariamente os mesmos componentes compostos ou padrões de interação."**
>
> *(Enquanto primitivas atomizadas como Button, Input, Icon e OKLCH Tokens são compartilhadas, componentes compostos como `MobileBottomSheet` vs `DesktopDialog` ou `MobileDataCard` vs `DesktopDataGrid` são estritamente dedicados ao seu respectivo Modo de Experiência).*

---

## 🏛️ 1. Visão Geral da Arquitetura Fim a Fim

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
                    ┌───────────────────────────────┐
                    │      EXPERIENCE ADAPTERS      │
                    │  MobileVM / TabletVM / etc.   │
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
                    │   8-ARTIFACT EVIDENCE SUITE   │
                    │  Runtime + Evidence Reports   │
                    └───────────────────────────────┘
```

---

## ⚙️ 2. Os 7 Protocolos Operacionais Executáveis

### 📌 Protocolo 1: Especificação Normativa do `AXAResponsiveSwitch` & Hydration

Para evitar *hydration mismatch*, duplicação desnecessária de árvores de renderização e escolhas ad-hoc da IA, o seletor de experiência é padronizado via `useSyncExternalStore` com *matchMedia* determinístico:

```tsx
// @packages/ui/src/axa/AXAResponsiveSwitch.tsx
import { useSyncExternalStore, ReactNode } from 'react';

export type ExperienceMode = 'mobile' | 'tablet' | 'desktop' | 'ultrawide';

const AXA_BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px) and (max-width: 1599px)',
  ultrawide: '(min-width: 1600px)',
} as const;

function subscribe(callback: () => void) {
  const mqls = Object.values(AXA_BREAKPOINTS).map(q => window.matchMedia(q));
  mqls.forEach(mql => mql.addEventListener('change', callback));
  return () => mqls.forEach(mql => mql.removeEventListener('change', callback));
}

function getSnapshot(): ExperienceMode {
  if (typeof window === 'undefined') return 'desktop'; // SSR Default Fallback
  if (window.matchMedia(AXA_BREAKPOINTS.mobile).matches) return 'mobile';
  if (window.matchMedia(AXA_BREAKPOINTS.tablet).matches) return 'tablet';
  if (window.matchMedia(AXA_BREAKPOINTS.ultrawide).matches) return 'ultrawide';
  return 'desktop';
}

function getServerSnapshot(): ExperienceMode {
  return 'desktop';
}

export function useAXAExperienceMode(): ExperienceMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function AXAResponsiveSwitch({
  mobile,
  tablet,
  desktop,
  ultrawide,
}: Record<ExperienceMode, ReactNode>) {
  const mode = useAXAExperienceMode();

  switch (mode) {
    case 'mobile': return mobile;
    case 'tablet': return tablet;
    case 'desktop': return desktop;
    case 'ultrawide': return ultrawide ?? desktop;
  }
}
```

---

### 📌 Protocolo 2: Contrato Estrito entre Domínio e Experiência (Adapters & ViewModels)

Zero regra de negócio ou lógica de cálculo em componentes visuais. O fluxo de dados segue a cadeia unidirecional obrigatoriamente:

```text
DOMAIN (Zod / OpenAPI / Entities)
   ↓
SHARED APPLICATION STATE (TanStack Query / Store)
   ↓
EXPERIENCE ADAPTER (MobileVM | TabletVM | DesktopVM | UltraWideVM)
   ↓
COMPOSITION SHELL (MobileAppShell | DesktopWorkspaceShell)
   ↓
ATOMIC UI COMPONENTS
```

#### Exemplo de ViewModel por Experiência:
- `useMobileKpiViewModel(data)`: Retorna formato resumido em pílula + atalho para `Bottom Drawer`.
- `useDesktopKpiViewModel(data)`: Retorna matriz de dados completa de 12 colunas para o Bento Grid.

---

### 📌 Protocolo 3: Mandatariedade do Bloco `EXPERIENCE_TARGET` em Toda Feature Spec

Nenhuma funcionalidade entra no pipeline sem o bloco `experience:` devidamente preenchido no arquivo de especificação (`/specs/` ou `spec.md`):

```yaml
experience:
  mobile:
    status: active
    mode: app-first
    shell: MobileAppShell
    navigation: bottom-dock
    interaction: touch-first
    filters: bottom-sheet
    tables: card-transformation
  tablet:
    status: active
    mode: hybrid
    shell: TabletWorkspaceShell
    navigation: rail
  desktop:
    status: active
    mode: workspace
    shell: DesktopWorkspaceShell
    composition: bento-12
  ultrawide:
    status: active
    mode: command
    shell: UltraWideWorkspaceShell
    composition: tri-column
```

---

### 📌 Protocolo 4: Roteamento Determinístico de Skills (Skill Routing Protocol)

O agente de IA classifica a tarefa e associa dinamicamente os pacotes de Skill e Grounding antes da fase de planejamento:

```text
TASK INPUT
    ↓
DOMAIN CLASSIFICATION (ex: UI / State / Auth / Performance)
    ↓
EXPERIENCE CLASSIFICATION (ex: Mobile Touch vs Desktop Grid)
    ↓
SKILL ROUTER
    ├── PRIMARY SKILL      (ex: dashboard-builder)
    ├── EXPERIENCE SKILL   (ex: adsentice-pwa-mobile | frontend-design)
    ├── QUALITY SKILLS     (ex: frontend-a11y | react-performance | web-perf)
    ├── GOVERNANCE SKILL  (ex: spec-kit)
    └── GROUNDING MCP      (ex: context7)
```

---

### 📌 Protocolo 5: Evidência de Grounding com Context7 (`07-context7-grounding.json`)

Nenhuma dependência externa ou API de terceiros é alterada sem a consulta prévia e evidência registrada.

#### Protocolo de Decisão:
1. Identificar biblioteca (`React 19`, `Vite`, `Tailwind v4`, `Hono`, `TanStack Query`).
2. Consultar MCP `context7`: `resolve-library-id` $\rightarrow$ `query-docs`.
3. Documentação confirmada?
   - **SIM:** Prosseguir e gravar evidência em `07-context7-grounding.json`.
   - **NÃO:** Parar execução (`STOP`), acionar **Escalation Protocol** e emitir `BLOCKED.md`.

---

### 📌 Protocolo 6: Análise de Impacto de Mudança (`02-change-impact.json`) & Artefatos EDD

A pasta de evidências auditáveis `/task-artifacts/REQ-XXX/` é composta obrigatoriamente por 8 arquivos:

```text
/task-artifacts/REQ-DASH-014/
├── 01-specification.md          # Especificação funcional e aceite
├── 02-change-impact.json        # Matriz de Impacto de Código & Contratos
├── 03-implementation-diff.patch # Diff limpo das alterações
├── 04-test-results.json         # Execução Vitest / Playwright
├── 05-a11y-axe-report.json      # Relatório de Acessibilidade (0 violações)
├── 06-perf-lighthouse.json      # Web Vitals P75 compliance
├── 07-context7-grounding.json   # Prova de Grounding Oficial Context7
└── 08-evidence-summary.md       # Matriz de Conformidade Assinada
```

#### Estrutura do `02-change-impact.json`:
```json
{
  "taskId": "REQ-DASH-014",
  "changedFiles": ["packages/ui/src/widgets/KpiWidget.tsx"],
  "affectedShells": ["MobileAppShell", "DesktopWorkspaceShell"],
  "impactedContracts": ["packages/contracts/src/kpi.schema.ts"],
  "requiredTestSuites": [
    "apps/web/src/widgets/KpiWidget.test.tsx",
    "apps/web/src/AXAResponsiveSwitch.spec.tsx"
  ]
}
```

---

### 📌 Protocolo 7: No-Progress & Escalation Protocol (`BLOCKED.md`)

Se o agente encontrar qualquer uma das condições impeditivas abaixo, ele é **ESTRITAMENTE PROIBIDO** de improvisar ou tentar "soluções criativas". Deve congelar a tarefa e emitir um relatório `BLOCKED.md`:

#### Condições de Bloqueio (Blocked Conditions):
1. **Especificação Conflitante:** Requisitos em desacordo com a Constituição ou ADRs.
2. **Critérios de Aceite Incompletos:** Ausência de `EXPERIENCE_TARGET` ou fluxo de erro indefinido.
3. **Falha de Grounding no Context7:** Documentação da API/biblioteca não localizada.
4. **Mismatch de Contrato:** Divergência entre Zod Schema e OpenAPI 3.1.
5. **Ambiguidade de Segurança:** Dúvida em permissões RBAC/ABAC ou exposição de dados PII.
6. **Violação de Fronteira Arquitetural:** Regra de negócio tentando entrar no `MobileAppShell`.
7. **Quebra de Teste Não-Relacionado:** Testes externos falhando antes do início da tarefa.

#### Artefato Emitido (`/task-artifacts/REQ-XXX/BLOCKED.md`):
- **Motivo do Bloqueio:** Descrição exata do gargalo.
- **Condição Violada:** Qual regra ou protocolo impediu a execução.
- **Recomendação de Decisão:** Opções técnicas para deliberação do Founder.

---

## 📊 3. Matriz de Capacidades da Experiência (AXA Experience Matrix)

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

---

## 👑 4. Hierarquia de Autoridade (Sovereign Pyramid)

```text
                    PRIORIDADE DE AUTORIDADE (SOVEREIGN PYRAMID)
                       ↓
1. Security & Safety Constraints (OWASP ASVS 5.0 Level 2/3)
2. Product Requirements & EXPERIENCE_TARGET Specs
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

## 🏆 Conclusão & Promulgação

Com esta atualização, o repositório **CASOSEX / Adsentice** promulga o **ADR-0001 v3.2 (Executable Operating Protocols)**, fechando integralmente o ciclo entre as diretrizes de engenharia e os algoritmos de execução do agente de Inteligência Artificial.