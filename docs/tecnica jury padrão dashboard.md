# ADR-0001: Arquitetura 360° v2.0 — Enterprise Mobile-First Dashboard Standard

- **Status:** ACEITO (Accepted & Frozen)
- **Versão:** 2.0.0
- **Data:** 2026-08-25
- **Autor:** Jeferson Amorim & Antigravity Enterprise Architecture Board
- **Escopo:** Plataforma Enterprise, UI/UX Mobile-First, APIs, Segurança (OWASP ASVS 5.0), Data Engine, Observabilidade, Testes & Governança Monorepo
- **Repositório Target:** `CASOSEX` / `Adsentice` Monorepo (`apps/web`, `apps/api`, `packages/ui`, `packages/contracts`, `packages/tokens`)

---

## 1. Visão Geral & Manifesto dos 12 Domínios Arquiteturais

Este documento define o **Padrão Soberano v2.0** para desenvolvimento de Cockpits e Dashboards operacionais de classe Enterprise. A arquitetura migra de uma especificação focada em frontend para uma **Plataforma Digital de Alta Criticidade (OWASP ASVS 5.0 Level 2/3)** baseada em 12 domínios fundamentais:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ENTEPRISE DASHBOARD PLATFORM (v2.0)                             │
├───────────────────┬───────────────────┬───────────────────┬────────────────────────────┤
│ 01. Accessibility │ 02. Design Tokens │ 03. Mobile UX 360 │ 04. Contracts (OpenAPI 3.1)│
├───────────────────┼───────────────────┼───────────────────┼────────────────────────────┤
│ 05. Data & State  │ 06. Real-time Eng │ 07. Offline-First │ 08. Performance (RUM)      │
├───────────────────┼───────────────────┼───────────────────┼────────────────────────────┤
│ 09. ASVS Security │ 10. Observability │ 11. Data Viz System│ 12. Quality Gate (QA/CI)   │
└───────────────────┴───────────────────┴───────────────────┴────────────────────────────┘
```

---

## 🏛️ DOMÍNIO 01: Acessibilidade (A11y) & Modelo Trimodal de Interação

A acessibilidade é construída sobre o **WCAG 2.2 Level AA** como baseline legal e técnico incondicional, incorporando os 3 modelos de interação simultâneos por componente:

### 1.1 Modelo Trimodal por Componente (Touch / Keyboard / AT)
```text
                            ┌─────────────────────────────────┐
                            │    Componente de UI Sovereign   │
                            └────────────────┬────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
    │ 1. Touch Model  │             │ 2. Keybd Model  │             │ 3. Assistive Tech│
    │ • Tap           │             │ • Tab / Shift+Tab│            │ • Semantics HTML│
    │ • Swipe / Sheet │             │ • Arrow Navigation│           │ • ARIA States   │
    │ • Long Press    │             │ • Enter / Space │             │ • Live Regions  │
    │ • Target >= 44px│             │ • Escape        │             │ • Screen Summary│
    └─────────────────┘             └─────────────────┘             └─────────────────┘
```

### 1.2 Regras Normativas W3C
- **Target Size (SC 2.5.8 vs Design Standard):** WCAG 2.2 exige $24 \times 24\text{px}$ como limite normativo. O padrão interno do Design System exige **$44 \times 44\text{px}$** para todos os elementos interativos touch.
- **Contraste (WCAG + APCA):** Contraste normativo WCAG 2.2 AA (mínimo de 4.5:1 para texto normal, 3:1 para grandes textos e UI). APCA (Advanced Perceptual Contrast Algorithm) é utilizado na validação de paletas OKLCH.
- **Tabelas vs ARIA Grid:** Tabelas de dados utilizam HTML5 semântico nativo (`<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope="col|row">`, `aria-sort`). `role="grid"` é reservado exclusivamente para matrizes bidimensionais editáveis com foco controlado por teclado.

---

## 🎨 DOMÍNIO 02: Design System & Arquitetura de Tokens (Design Token Engine)

Nenhum estilo é declarado ad-hoc. Toda a interface é gerada a partir da árvore tricotômica de tokens:

```text
Design Tokens
├── Foundations (Primitive Tokens): Raw Values (OKLCH, Pixels, Ms)
├── Semantic Tokens: Propósito no contexto (bg-surface-primary, text-danger)
└── Component Tokens: Específicos por componente (button-primary-bg)
```

### 2.1 Matriz de Tokens da Plataforma
```ts
export const DesignTokens = {
  color: {
    primitive: {
      coral500: 'oklch(0.65 0.22 260)',
      neutral900: 'oklch(0.18 0.02 260)',
      neutral50: 'oklch(0.98 0.005 260)',
    },
    semantic: {
      brandPrimary: 'var(--coral500)',
      surfaceBackground: 'var(--neutral50)',
      textPrimary: 'var(--neutral900)',
      focusRing: 'oklch(0.65 0.22 260 / 0.8)',
    }
  },
  spacing: {
    xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem',
  },
  radius: {
    sm: '0.375rem', md: '0.75rem', lg: '1.25rem', full: '9999px',
  },
  motion: {
    durationFast: '150ms', durationNormal: '250ms', durationSlow: '400ms',
    easingStandard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  },
  zIndex: {
    base: 0, dropdown: 1000, sticky: 1100, drawer: 1200, modal: 1300, toast: 1400, tooltip: 1500,
  }
} as const;
```

---

## 📱 DOMÍNIO 03: UX Mobile-First 360° (Interaction-First Model)

Invertemos a prioridade: o design não encolhe do desktop para o mobile. O modelo de interação nasce no touch e se compõe até o desktop:

```text
Mobile Interaction Model ──► Tablet Adaptation ──► Desktop Grid Composition
```

### 3.1 Padrões Obrigatórios de Mobile UX
- **Dynamic Viewports:** Uso estrito de `dvh` (Dynamic Viewport Height), `svh` e `lvh` eliminando quebras causadas por barras de endereço nativas em iOS/Android.
- **Safe Area Insets:** Todo o contêiner inferior implementa `padding-bottom: env(safe-area-inset-bottom)`.
- **Bottom Navigation Dock & Drawers:** Ações primárias ancoradas no alcance do polegar. Modais desktop convertem-se automaticamente em **Bottom Sheets** deslizáveis com gestos no mobile.
- **Scroll Restoration & Gesture Management:** Isolamento de gestos de pull-to-refresh nativos versus scroll de gráficos interativos.

---

## 📜 DOMÍNIO 04: API & Contratos Fim a Fim (OpenAPI 3.1 + Zod)

### 4.1 Schema-First Pipeline
```text
Schema Zod ──► Spec OpenAPI 3.1 ──► Type Generation ──► HTTP Client ──► Runtime Guard
```

### 4.2 Modelo de Resposta Padrão (União Discriminada)
```ts
export interface ApiMeta {
  timestamp: string;
  correlationId: string;
  requestId: string;
  version: string;
  pagination?: { page: number; pageSize: number; totalRecords: number; hasMore: boolean; };
}

export type ApiResponse<T> =
  | { success: true; data: T; meta: ApiMeta; error?: never }
  | { success: false; data?: never; meta: ApiMeta; error: { code: string; message: string; details?: unknown } };
```

---

## 🗄️ DOMÍNIO 05: Data Engine & Gestão de Estado

Segregação estrita entre Estado de Servidor, Estado Local e Cache:

```text
Data Layer
├── Server State: TanStack Query v5 (Suspense, Query Invalidation)
├── Offline Storage: IndexedDB via Dexie.js (Persistência L1 no Browser)
├── Repository Cache: Redis :6396 (Aceleração L2 no Backend)
└── Primary DB: PostgreSQL (Fonte da Verdade)
```

### 5.1 Reconciliação e Resiliência de Mutações
Mutações locais ocorrem de forma **síncrona otimista** (`onMutate`), salvando um snapshot no IndexedDB. Em caso de falha de rede, a mutação é enfileirada com chave de idempotência (`Idempotency-Key: UUIDv4`).

---

## ⚡ DOMÍNIO 06: Motor Real-time & Event Dispatcher

Dashboards operacionais exigem atualizações vivas sem estouro de consumo de conexões:

```text
                          ┌───────────────────────────┐
                          │     REAL-TIME ENGINE      │
                          └─────────────┬─────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
      ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
      │     SSE      │           │  WebSocket   │           │ Smart Poll   │
      │ (Default /   │           │ (Bi-directional│          │ (Fallback /  │
      │ Push Unidirec)│          │ Dashboard)   │           │ Low Net)     │
      └──────┬───────┘           └──────┬───────┘           └──────┬───────┘
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        ▼
                           ┌──────────────────────────┐
                           │ Event Dispatcher Router  │
                           └────────────┬─────────────┘
                                        ▼
                           ┌──────────────────────────┐
                           │ TanStack Query Invalid.  │
                           └──────────────────────────┘
```

- **Resiliência de Conexão:** Heartbeat a cada $15\text{s}$, reconexão com **Exponential Backoff com Jitter**, desduplicação de eventos por `sequenceId`.

---

## 📲 DOMÍNIO 07: Arquitetura Offline-First & Sincronização

```text
[ ONLINE STATE ] ──► Fetch API ──► TanStack Query ──► Persist in IndexedDB ──► Render UI
                                                            │
[ OFFLINE STATE ] ──► Read IndexedDB ──► Render UI ──► Queue Mutations (IndexedDB)
                                                                 │
[ BACK ONLINE ] ──► Flush Queue ──► Sync Server ──► Reconcile Conflicts (CRDT / Last-Write-Wins)
```

- **Estratégias de Cache no Service Worker:** `Stale-While-Revalidate` para assets estáticos e `Network-First com Fallback para IndexedDB` para chamadas de dados operacionais.

---

## 📊 DOMÍNIO 08: Metas de Performance RUM (Real User Monitoring)

A performance é avaliada no campo (P75 Real User Monitoring) e no laboratório (CI Gate):

| Indicador Web Vital | Target Operacional (P75 RUM) | Elite Standard (P95 Lab) | Limite de Regressão (CI Gate) |
| :--- | :---: | :---: | :---: |
| **LCP (Largest Contentful Paint)** | $\le 2.5\text{s}$ | $\le 1.5\text{s}$ | $> 2.5\text{s}$ |
| **INP (Interaction to Next Paint)** | $\le 200\text{ms}$ | $\le 100\text{ms}$ | $> 200\text{ms}$ |
| **CLS (Cumulative Layout Shift)** | $\le 0.10$ | $\le 0.05$ | $> 0.10$ |
| **TTFB (Time to First Byte)** | $\le 800\text{ms}$ | $\le 300\text{ms}$ | $> 1200\text{ms}$ |

---

## 🛡️ DOMÍNIO 09: Arquitetura de Segurança (OWASP ASVS 5.0 Level 2/3)

A segurança da plataforma é aderente ao padrão **OWASP Application Security Verification Standard (ASVS 5.0)**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE (ASVS 5.0)                     │
├──────────────────────────┬──────────────────────────┬───────────────────┤
│ Auth & Sessions          │ Access Control & RBAC    │ Data Protection   │
│ • OAuth 2.1 / OIDC       │ • Granular Permissions   │ • AES-GCM-256     │
│ • JWT em HttpOnly Cookie │ • Tenant Isolation       │ • TLS 1.3 Strict  │
│ • Refresh Token Rotate   │ • ABAC (Attributes)      │ • Zero PII Leakage│
├──────────────────────────┼──────────────────────────┼───────────────────┤
│ Application Protection   │ API & Input Security     │ Resilience        │
│ • Nonce-based CSP        │ • Strict Zod Validation  │ • Rate Limit Redis│
│ • Anti-CSRF Token        │ • Parameterized Queries  │ • Threat Modeling │
│ • HSTS & Security Headers│ • Audit Trail Imutável   │ • Supply-Chain Scan│
└──────────────────────────┴──────────────────────────┴───────────────────┘
```

### 9.1 Multi-Tenancy & Isolamento de Dados
```text
User ──► Organization ──► Tenant ──► Workspace ──► Role ──► Permissions (View, Create, Update, Delete, Export, Admin)
```
- **Isolamento no Banco:** Todas as queries SQL injetam incondicionalmente o `tenant_id` derivado do token JWT validado no backend (Row-Level Security ou filtro obrigatório na camada de repositório).

---

## 👁️ DOMÍNIO 10: Observabilidade Distribuída & RUM (OpenTelemetry)

```text
                               OpenTelemetry Collector
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
   ┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
   │ Structured Logs  │          │ Metrics & RED    │          │ Traces & Spans   │
   │ (JSON + Context) │          │ (Rate/Errors/Dur)│          │ (End-to-End Flow)│
   └────────┬─────────┘          └────────┬─────────┘          └────────┬─────────┘
            │                             │                             │
            └─────────────────────────────┼─────────────────────────────┘
                                          ▼
                      Trace Context Injector (correlationId)
```

- **Campos Obrigatórios em Logs & Spans:** `correlationId`, `requestId`, `tenantId`, `userId`, `environment`, `deviceType`.
- **Real User Monitoring (RUM):** Captura em tempo real de exceções JS não tratadas (`window.onerror`), rejeições de promises e métricas `web-vitals` enviadas em background via `navigator.sendBeacon`.

---

## 📈 DOMÍNIO 11: Sistema de Visualização de Dados (Data Viz System)

### 11.1 Componentes e Equivalente Acessível Obrigatório
Todo gráfico interativo possui **obrigatoriamente** uma tabela acessível equivalente ou sumário descritivo para leitores de tela:

```tsx
export function AccessibleAreaChart({ data, title }: { data: ChartPoint[]; title: string }) {
  return (
    <div role="region" aria-label={title}>
      {/* Componente Gráfico Visuall */}
      <AreaChartVisual data={data} aria-hidden="true" />

      {/* Fallback Acessível para Assistive Technologies */}
      <details className="sr-only focus-within:not-sr-only">
        <summary>Ver tabela de dados acessível para {title}</summary>
        <table>
          <caption>{title}</caption>
          <thead><tr><th>Data</th><th>Valor</th></tr></thead>
          <tbody>
            {data.map((pt) => (
              <tr key={pt.x}><td>{pt.x}</td><td>{pt.y}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
```

- **Regras Visuais:** Decodificação independente de cor (uso de hachuras/padrões além da cor), tooltips navegáveis por teclado e suporte ao modo `prefers-reduced-motion`.

---

## 🧪 DOMÍNIO 12: Quality Gate & Pipeline de Testes (QA 360°)

```text
                  ┌────────────────────────────────────────┐
                  │          QUALITY GATE PIPELINE         │
                  └───────────────────┬────────────────────┘
                                      │
 ┌──────────────┬──────────────┬──────┴───────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼              ▼              ▼
Unit (Vitest) Integration   Contract Spec   A11y (axe)    Visual Regr.   E2E & Perf
(Components)  (Testing Lib) (OpenAPI 3.1)   (WCAG AA)     (Playwright)   (Lighthouse)
```

---

## 🌐 DOMÍNIOS TRANSVERSAIS

### A. Internacionalização (i18n & l10n)
- Uso nativo da API `Intl` do JavaScript para todas as formatações:
  - `Intl.NumberFormat(locale, { style: 'currency', currency })`
  - `Intl.DateTimeFormat(locale, { dateStyle: 'full' })`
  - `Intl.RelativeTimeFormat(locale, { numeric: 'auto' })`
- Suporte a idiomas `pt-BR`, `en-US`, `es` e layouts RTL (Right-to-Left) via CSS Logical Properties (`margin-inline-start`, `padding-block-end`).

### B. Monorepo Architecture & Definition of Done (DoD)
- **Estrutura de Pastas:**
  ```text
  apps/
    ├── web/           # React 19 + Vite (Frontend Cockpit)
    └── api/           # Hono / Node.js (Backend Enterprise)
  packages/
    ├── ui/            # Design System (Tokens + Accessible Components)
    ├── contracts/     # Single Source of Truth (Zod + OpenAPI 3.1)
    └── config/        # ESLint, TypeScript, Tailwind Configs
  ```
- **Definition of Done (DoD):**
  1. Contrato Zod/OpenAPI validado e sem divergências.
  2. Cobertura de testes de unidade e integração $\ge 85\%$.
  3. Validação de acessibilidade `axe-core` sem nenhum erro Crítico ou Grave.
  4. Web Vitals dentro dos limites de regressão no Lighthouse CI.
  5. Checklist de Segurança OWASP ASVS 5.0 verificado.
  6. Git commit assinado com rastreabilidade de issue/feature.