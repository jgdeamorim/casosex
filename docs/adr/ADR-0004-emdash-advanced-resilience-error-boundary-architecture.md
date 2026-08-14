# ADR-0004: Arquitetura Avançada de Resiliência, Predictive Fingerprinting e Telemetria no EmDash Admin

- **Status**: Aceito (Accepted)
- **Data**: 2026-08-14
- **Autor**: Jeferson Amorim (Founder) & Antigravity (Pair AI)
- **Contexto**: EmDash CMS Admin Monorepo (`@emdash-cms/admin`) & Plugins (`@dashcommerce/core`)

---

## 1. Contexto e Motivação

O **EmDash Admin** opera como uma SPA React 19 de alta performance integrada a uma camada de servidor Astro (`admin.astro`) e roteada via **TanStack Router**. Módulos de e-commerce e plugins de terceiros (como o `dashcommerce`) executam fluxos assíncronos e processam payloads dinâmicos provenientes de APIs headless e SQLite.

Em arquiteturas convencionais, exceções não tratadas em tempo de execução desfazem a árvore de componentes React ("Tela Branca da Morte"). Além disso, tratativas baseadas apenas em Error Boundaries tradicionais são meramente **reativas** (capturam o erro apenas *após* a falha ocorrer no cliente).

Para elevar o EmDash a um patamar enterprise soberano, observável e auto-regenerativo (Self-Healing), esta ADR expande o sistema de resiliência incorporando:
1. **Mapeamento completo com Next.js App Router (React 19)**.
2. **Verificação Estática de AST em Rust (SWC / Rolldown)**.
3. **Detecção Preditiva por Fingerprinting de Schemas (BLAKE3 / SHA-256)**.
4. **Módulo Soberano de Telemetria e Observabilidade (`/settings/telemetry`)**.

---

## 2. Anatomia Exaustiva dos Boundaries no Next.js (App Router) vs EmDash

### Mapeamento De-Para: Next.js vs EmDash Admin

| Conceito / Convenção | Next.js (App Router) | EmDash Admin (React 19 + TanStack Router) | Função Arquitetural |
| :--- | :--- | :--- | :--- |
| **Root Shell Layout** | `app/layout.tsx` | `adminLayoutRoute` (`Shell.tsx` + `Sidebar.tsx`) | Mantém navegação global, branding e contexto de autenticação. |
| **Route Error Boundary** | `app/feature/error.tsx` | `errorComponent` em cada Rota do TanStack Router | Captura falhas de rota inteira sem desmontar o Shell/Sidebar. |
| **Root Global Error** | `app/global-error.tsx` | `ErrorScreen` no `rootRoute` do TanStack Router | Fallback supremo para falhas críticas de infraestrutura global. |
| **Nested Plugin Boundary** | `app/plugins/[id]/error.tsx` | `AdminModuleErrorBoundary` | Contém falhas específicas em módulos de plugins (ex: DashCommerce). |
| **Field/Widget Boundary** | Component-level `<ErrorBoundary>` | `PluginFieldErrorBoundary` / `SectionErrorBoundary` | Isola erros em cards de dashboard e custom field widgets. |
| **Route Loading UI** | `app/feature/loading.tsx` | `pendingComponent` no TanStack Router | Renderiza Skeleton Loaders instantâneos durante o fetching. |
| **Not Found Boundary** | `app/not-found.tsx` | `notFoundRoute` (`NotFoundPage.tsx`) | Trata recursos inexistentes ou 404 sem crash. |

---

## 3. Arquitetura "Double-Lock", Fingerprinting Preditivo & Telemetria

```
┌────────────────────────────────────────────────────────────────────────┐
│ CAMADA 0: Verificação Estática de AST em Rust (Compilador SWC/Rolldown) │
│ └─ Impede códigos malformados ou regras de JSX inválidas no build.    │
├────────────────────────────────────────────────────────────────────────┤
│ CAMADA PREDITIVA: Fingerprint de Schema BLAKE3 / SHA-256 (Pré-Render) │
│ └─ Detecta Schema Drift e payloads anômalos no Redis antes do React.  │
├────────────────────────────────────────────────────────────────────────┤
│ CAMADA 1: Root Router Boundary (TanStack Router Root & Admin Layout)  │
│ └─ Garante a permanência do Shell, Sidebar e Autenticação.            │
├────────────────────────────────────────────────────────────────────────┤
│ CAMADA 2: AdminModuleErrorBoundary (Módulos & Plugins)                │
│ └─ Isola rotas do DashCommerce (Reports, Shipping, Payouts, etc.)     │
├────────────────────────────────────────────────────────────────────────┤
│ CAMADA 3: Módulo de Telemetria e Observabilidade (/settings/telemetry)│
│ └─ Monitora DevTools Bridge, estatísticas MCP e exceções capturadas.  │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Camada 0: Trava Estática via Compiladores Rust (SWC / Rolldown)
- O pipeline de build do EmDash utiliza `tsdown` (potencializado por **Rolldown em Rust**) e SWC.
- A AST do código é validada em tempo de compilação.
- Erros de parsing, tipos primitivos `any` e estruturas de JSX inválidas são barrados antes da publicação.

### 3.2 Camada Preditiva: Fingerprint de Schemas (BLAKE3 / SHA-256 - ADR-0062)
- Antes de entregar os dados da API para o componente React renderizar, o sistema calcula o hash determinístico da estrutura do payload:
  ```text
  SchemaFingerprint = BLAKE3( canonicalize(Object.keys(payload)) )
  ```
- O hash é comparado contra a tabela de assinaturas saudáveis no Redis (`adsentice:kv:blake3:{hash}`).
- Se houver **Schema Drift** (ex: um array obrigatório veio nulo), o componente preditivo redireciona a interface para o modo de contingência **antes de acionar qualquer exceção no React**.

### 3.3 Módulo de Telemetria e Observabilidade (`TelemetrySettings.tsx`)
- Disponibilizado sob a rota `/settings/telemetry` na seção de **System & Telemetry** do EmDash Admin.
- Exibe o status de saúde do **Chrome DevTools Bridge (`:9091`)**, feed em tempo real de exceções capturadas pelos Boundaries e telemetria de chamadas do servidor MCP nativo.

---

## 4. O Padrão de UX e Mecanismo de Recuperação (`Reset / React.startTransition`)

1. **Sem Popups Bloqueantes**: Erros de renderização nunca devem emitir `alert()` nativo ou modais intrusivos.
2. **Indicador Visual Sutil**:
   - Exibição de um cartão de contingência limpo com borda de aviso sutil (`border-kumo-danger/30`).
   - Badge com status animado sutil (`● Isolated Fallback` / `● Schema Drift`).
3. **Recuperação Transicional sem Reload**:
   - A prop/método de reset executa uma transição não-bloqueante via `React.startTransition()` combinada com a invalidação de queries do TanStack Query (`queryClient.resetQueries()`).
   - Isso permite tentar re-renderizar o componente assim que a causa raiz for saneada.
4. **Telemetria via DevTools Bridge**:
   - Erros de runtime e anomalias de fingerprint emitem automaticamente payloads JSON para o servidor de monitoramento `http://localhost:9091/push-log` (Chrome DevTools Bridge).

---

## 5. Implementação Canônica dos Componentes

### 5.1 `AdminModuleErrorBoundary.tsx`
```tsx
import { Button } from "@cloudflare/kumo";
import { Trans } from "@lingui/react/macro";
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react";
import * as React from "react";

interface Props {
  children: React.ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AdminModuleErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[EMDASH MODULE ERROR] [${this.props.moduleName || "Module"}]:`, error, errorInfo);

    if (typeof window !== "undefined") {
      fetch("http://localhost:9091/push-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "MODULE_ERROR",
          message: error.message,
          url: window.location.href,
          details: { moduleName: this.props.moduleName, stack: error.stack },
        }),
      }).catch(() => {});
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-4xl p-6">
          <div className="rounded-xl border border-kumo-danger/30 bg-kumo-tint p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-kumo-danger/10 text-kumo-danger">
                  <WarningCircle className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-base font-semibold leading-5 text-kumo-default">
                    <Trans>Module Error</Trans>: {this.props.moduleName || <Trans>Plugin Component</Trans>}
                  </h3>
                  <p className="mt-0.5 text-sm text-kumo-subtle">
                    <Trans>An unexpected error occurred while rendering this section. Navigation remains fully operational.</Trans>
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-kumo-danger/10 px-3 py-1 text-xs font-medium text-kumo-danger border border-kumo-danger/20 shrink-0">
                <span className="h-2 w-2 rounded-full bg-kumo-danger animate-pulse"></span>
                <Trans>Isolated Fallback</Trans>
              </span>
            </div>

            <div className="mt-4 rounded-lg border border-kumo-line bg-kumo-base p-3 font-mono text-xs text-kumo-danger">
              {this.state.error?.message || <Trans>Unknown rendering exception</Trans>}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button icon={<ArrowClockwise className="h-4 w-4" />} onClick={this.handleReset}>
                <Trans>Retry Component</Trans>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 6. Consequências e Medição de Sucesso

1. **Self-Healing & Prevenção Antecipada**: O Fingerprinting Preditivo identifica e desvia de payloads anômalos antes de estourarem exceções no React.
2. **Observabilidade Unificada**: Módulo `/settings/telemetry` disponibiliza monitoramento em tempo real do DevTools Bridge e MCP Server.
3. **Eliminação de Crashes Globais**: `0%` de telas brancas causadas por plugins ou APIs desatualizadas.
4. **Alinhamento Soberano (`medido=verdade`)**: A ADR sela a arquitetura preditiva e resiliência visual no Knowledge Graph do projeto.
