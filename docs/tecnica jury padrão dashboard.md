# ADR-0001: Padrão Arquitetural Enterprise Sovereign para Dashboards & Cockpits (v1.0)

- **Status:** ACEITO (Accepted)
- **Data:** 2026-08-25
- **Autor:** Jeferson Amorim & Antigravity Senior Architecture Team
- **Domínio:** Plataforma, UI/UX, API, Segurança, Observabilidade & Governança
- **Repositório Target:** Monorepo Enterprise / CASOSEX / Adsentice

---

## 1. Contexto & Motivação

Cockpits e Dashboards de missão crítica exigem mais do que componentes visuais atraentes. Eles demandam uma **arquitetura de plataforma resiliente, auditável, acessível, segura e de baixíssima latência**.

Este Architecture Decision Record (ADR v1.0) consolida a especificação técnica normativa soberana para desenvolvimento de cockpits e dashboards enterprise, alinhando a experiência do usuário (UI/UX) à governança rigorosa de backend, segurança de dados e observabilidade distribuída.

---

## 2. Topologia Geral de Plataforma & Fluxo de Dados

A arquitetura adota a estratégia **Schema-First (Contract-First)** onde o contrato Zod / OpenAPI 3.1 é a fonte única da verdade (Single Source of Truth), desacoplando a evolução do frontend e backend enquanto garante validação estrita em runtime.

```text
                    ┌──────────────────────────┐
                    │     OpenAPI 3.1 / Zod    │
                    │   Single Source of Truth │
                    └────────────┬─────────────┘
                                 │
             ┌───────────────────┴───────────────────┐
             ▼                                       ▼
     ┌─────────────────┐                     ┌─────────────────┐
     │ Backend         │                     │ Frontend        │
     │ Hono / Node.js  │                     │ React 19 / Vite │
     │                 │                     │                 │
     │ Validation      │                     │ TanStack Query  │
     │ Auth/RBAC/ABAC  │                     │ Suspense        │
     │ Observability   │                     │ A11y Components │
     └────────┬────────┘                     └────────┬────────┘
              │                                       │
              ▼                                       ▼
       ┌─────────────┐                       ┌────────────────┐
       │ Redis       │                       │ Design System  │
       │ Cache (L2)  │                       │ OKLCH / Bento  │
       └──────┬──────┘                       │ Container Qs   │
              │                              └────────────────┘
              ▼
       ┌─────────────┐
       │ PostgreSQL  │
       │ Primary DB  │
       └─────────────┘
```

---

## 3. Contratos de API & Governança de Esquema

### 3.1 Governança Single Source of Truth
```text
Schema (Zod) ──► OpenAPI 3.1 Spec ──► TypeScript Types & Client API ──► Runtime Validation
```

### 3.2 Envelope de Resposta como União Discriminada
Evita-se a ambiguidade de cascas de API com atributos opcionais conflitantes. A resposta da API é obrigatoriamente modelada como uma **União Discriminada estrita**:

```ts
export interface ApiMeta {
  timestamp: string;
  correlationId: string;
  requestId: string;
  version: string;
  pagination?: {
    page: number;
    pageSize: number;
    totalRecords: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// União Discriminada Estrita: Sucesso ou Erro são mutuamente exclusivos
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      meta: ApiMeta;
      error?: never;
    }
  | {
      success: false;
      data?: never;
      meta: ApiMeta;
      error: ApiError;
    };
```

---

## 4. Camada de Cache & Fluxo de Dados End-to-End

O cache de cliente e o cache de backend possuem responsabilidades claramente segregadas. O Redis atua exclusivamente como camada de aceleração de repositório no backend, enquanto o TanStack Query gerencia o estado de servidor no cliente:

```text
[ Browser ] ──► TanStack Query (Client L1 Cache) ──► [ API Hono ] ──► Service / Repository ──► Redis (Backend L2 Cache) ──► [ PostgreSQL DB ]
```

### 4.1 Reconciliação e Reavaliação Otimista (Optimistic UI)
- A alteração otimista é definida como **atualização síncrona local de estado antes da confirmação do servidor**.
- **Fluxo:** `onMutate` (Aplica estado local temporário e salva snapshot) $\rightarrow$ `onError` (Executa rollback automático para snapshot em falha) $\rightarrow$ `onSettled` (Invalida query para reconciliação final com o banco de dados).

---

## 5. UI/UX, Layout & Design System Engine

### 5.1 Layout Bento Grid Assimétrico de 12 Colunas
Organização modular responsiva utilizando CSS Grid nativo com 12 colunas e vãos (gaps) calculados:

```css
.bento-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.25rem;
  width: 100%;
}

.widget-hero       { grid-column: span 8; grid-row: span 2; }
.widget-kpi-stack  { grid-column: span 4; grid-row: span 2; }
.widget-feed       { grid-column: span 6; grid-row: span 1; }
.widget-full       { grid-column: span 12; }

@media (max-width: 1024px) {
  .bento-dashboard-grid > * { grid-column: span 12 !important; }
}
```

### 5.2 Responsive Layouts via CSS Container Queries (`@container`)
Componentes de widgets reagem à largura do seu recipiente pai, viabilizando reutilização modular pura em qualquer posição da grade.

### 5.3 Estratégia de Animação & Motion
- **Micro-interações triviais (hovers, fades, dialogs):** Executadas via CSS Transitions/Animations nativas e Web Animations API (WAAPI) para zero custo de JS bundle.
- **Animações complexas (FLIP layout morphing, timelines encadeadas, drag & drop):** Reservadas exclusivamente para o GSAP (carregado sob demanda).

---

## 6. Acessibilidade (A11y) & Padrões W3C Normativos

### 6.1 Baseline Normativo: WCAG 2.2 Level AA
- O baseline obrigatório de conformidade do produto é o **WCAG 2.2 Nível AA**.
- Critérios do Nível AAA são aplicados de forma seletiva apenas quando tecnicamente viáveis para a experiência do usuário.

### 6.2 Padrão de Contraste Visual
- **WCAG 2.2 AA (Normativo):** Razão mínima de **4.5:1** para texto normal e **3:1** para texto grande/componentes de interface.
- **APCA (Advanced Perceptual Contrast Algorithm):** Utilizado como ferramenta complementar de design engineering para refinamento de legibilidade em temas escuros/claros OKLCH.

### 6.3 Target Size (Tamanho de Alvo de Toque)
- **WCAG 2.2 SC 2.5.8 (Mínimo Normativo):** 24×24 CSS px como limite de conformidade legal.
- **Padrão Interno de Elite (Design Policy):** **44×44 CSS px** como diretriz padrão para componentes touch e botões de alta frequência em mobile/desktop.

### 6.4 Semântica HTML vs ARIA Grid
- **Tabelas de Dados Padrão:** Utilizam HTML5 semântico nativo (`<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope="col|row">`, `aria-sort`).
- **`role="grid"`:** Reservado **estritamente** para planilhas editáveis ou matrizes altamente interativas com navegação bidimensional por setas do teclado.

---

## 7. Metas de Performance & Web Vitals (Níveis de Service Level)

Para evitar que metas de laboratório engessem a operação em redes/dispositivos reais, dividimos os indicadores em três faixas operacionais:

| Métrica Core Web Vital | SLO Recomendado (P75 RUM) | Target de Elite (P95 Lab) | Limite de Regressão (CI/CD Gate) |
| :--- | :---: | :---: | :---: |
| **LCP (Largest Contentful Paint)** | `< 2.0s` | `< 1.2s` | `> 2.5s` |
| **INP (Interaction to Next Paint)** | `< 100ms` | `< 50ms` | `> 200ms` |
| **CLS (Cumulative Layout Shift)** | `< 0.05` | `0.00` | `> 0.10` |
| **FID / TBT (Total Blocking Time)** | `< 200ms` | `< 50ms` | `> 300ms` |

---

## 8. Camada 7: Segurança Enterprise (Security Protocol)

1. **Autenticação & Sessões:** OpenID Connect (OIDC) / OAuth 2.0 com tokens JWT de vida curta em cookies `HttpOnly`, `SameSite=Strict`, `Secure`.
2. **Autorização Granular (RBAC + ABAC):** Controle de acesso baseado em papéis (Role-Based Access Control) e atributos da requisição (Attribute-Based Access Control) aplicados nas bordas de serviço.
3. **Content Security Policy (CSP):** Cabeçalhos estritos bloqueando scripts inline não assinados (`nonce-based CSP`).
4. **Proteção Anti-CSRF & Rate Limiting:** Tokens Anti-CSRF em operações mutativas e Rate Limiting distribuído no Redis por IP/Tenant ID.
5. **Sanitização de Input/Output:** Validação incondicional na borda com Zod para prevenção de XSS e Injection attacks.
6. **Audit Trail Imutável:** Registro append-only de ações administrativas com identificadores do usuário, IP, timestamp e payload sanitizado.

---

## 9. Camada 8: Observabilidade Distribuída (OpenTelemetry)

A plataforma instrumenta rastreamento distribuído fim a fim através do **OpenTelemetry**:

```text
[ Request ] ──► Header (x-correlation-id / traceparent) ──► Frontend ──► API ──► DB Query
```

- **Logs Estruturados (JSON):** Todos os logs incluem obrigatoriamente `correlationId`, `requestId`, `tenantId` e `userId`.
- **Métricas:** Emissão de métricas RED (Rate, Errors, Duration) por endpoint e por componente de dashboard.
- **Traces:** Spans integrados rastreando desde o clique do usuário no React até a consulta SQL/Redis no repositório.

---

## 10. Camada 9: Pipeline de Testes & Governança de Qualidade

```text
Unit Tests (Vitest) ──► Integration (Testing Library) ──► Contract Tests (OpenAPI) ──► A11y (axe-core) ──► E2E (Playwright) ──► Perf (Lighthouse CI)
```

1. **Unit & Integration:** Testes de hooks e componentes isolados via Vitest e Testing Library.
2. **Contract Verification:** Validação automatizada garantindo que a API atende 100% da especificação OpenAPI 3.1.
3. **Accessibility Audits:** Testes estáticos via `eslint-plugin-jsx-a11y` e dinâmicos via `axe-core` / `@axe-core/playwright`.
4. **E2E & Visual Regression:** Cenários críticos de negócio executados no Playwright em navegadores Chromium/Webkit/Firefox.
5. **Performance Gates:** Testes de regressão no CI/CD bloqueando deploys que estourem os Limites de Regressão de Web Vitals.

---

## 11. Conclusão & Próximos Passos de Implantação

Este dossiê fica oficialmente congelado como **ADR-0001 (v1.0)**. 

### Roteiro de Execução Recomendado:
1. **Estrutura de Monorepo (pnpm workspaces / Turborepo):** `apps/web`, `apps/api`, `packages/contracts`, `packages/ui`.
2. **Gerador de Contrato:** Compilação do `packages/contracts` emitindo `openapi.json` e tipos TypeScript.
3. **Setup do Design System:** Base de tokens OKLCH + utilitários CSS Container Queries + primitivos de acessibilidade.
4. **Pipelines de CI/CD:** Automação dos testes de contrato, acessibilidade e regressão de performance.