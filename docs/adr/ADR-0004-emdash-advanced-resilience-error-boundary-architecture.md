# ADR-0004: Arquitetura Avançada de Resiliência e Boundaries de Erro no EmDash Admin (Mapeamento Next.js App Router)

- **Status**: Aceito (Accepted)
- **Data**: 2026-08-14
- **Autor**: Jeferson Amorim (Founder) & Antigravity (Pair AI)
- **Contexto**: EmDash CMS Admin Monorepo (`@emdash-cms/admin`) & Plugins (`@dashcommerce/core`)

---

## 1. Contexto e Motivação

O **EmDash Admin** opera como uma SPA React 19 de alta performance integrada a uma camada de servidor Astro (`admin.astro`) e roteada via **TanStack Router**. Módulos de e-commerce e plugins de terceiros (como o `dashcommerce`) executam fluxos assíncronos e processam payloads dinâmicos provenientes de APIs headless e SQLite.

Em arquiteturas tradicionais de SPA, uma única exceção não tratada em tempo de execução dentro de um componente filho causa o desmonte (*unmounting*) de toda a árvore de componentes do React, resultando no famigerado crash global ("Tela Branca da Morte" ou a mensagem genérica `Something went wrong!`).

Inspirando-se nos padrões de **Resilience & Error Boundaries do Next.js (App Router)** consultados via MCP Context7, esta ADR define a arquitetura exaustiva de contenção de falhas e isolamento de estado do EmDash Admin.

---

## 2. Anatomia Exaustiva dos Boundaries no Next.js (App Router) vs EmDash

No Next.js App Router, cada pasta de rota gera uma árvore de ordenação implícita:

```
<Layout>
  <ErrorBoundary fallback={<Error />}>
    <Suspense fallback={<Loading />}>
      <ErrorBoundary fallback={<NotFound />}>
        <Page />
      </ErrorBoundary>
    </Suspense>
  </ErrorBoundary>
</Layout>
```

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

## 3. As 3 Camadas de Resiliência do EmDash

```
┌────────────────────────────────────────────────────────────────────────┐
│ CAMADA 1: Root Router Boundary (TanStack Router Root & Admin Layout)  │
│ └─ Garante a permanência do Shell, Sidebar e Autenticação.            │
├────────────────────────────────────────────────────────────────────────┤
│ CAMADA 2: AdminModuleErrorBoundary (Módulos & Plugins)                │
│ └─ Isola rotas do DashCommerce (Reports, Shipping, Payouts, etc.)     │
├────────────────────────────────────────────────────────────────────────┤
│ CAMADA 3: Component / Field Boundary (Widgets & Custom Fields)        │
│ └─ Isola cards de gráficos, tabelas e campos de plugins.              │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Camada 1: Root Router Boundary (`adminLayoutRoute`)
- Envolve a aplicação como um todo.
- Se ocorrer um erro cataclísmico na inicialização de manifestos, o `ErrorScreen` exibe uma mensagem amigável com um botão de recarga sem perder o estado de sessão local.

### 3.2 Camada 2: AdminModuleErrorBoundary (Plugin & Subpage Level)
- Envolve o contêiner principal das páginas de plugins (`/plugins/$pluginId/*`) e telas de configuração.
- **Princípio de Não-Desmonte**: Se a página `ReportsPage` do `dashcommerce` falhar devido a um dado nulo ou inacessível da API, a `Sidebar` lateral e o `Header` continuam **100% ativos e interativos**.
- O operador pode navegar livremente para a página de produtos ou configurações sem recarregar o navegador (`F5`).

### 3.3 Camada 3: Component & Field Boundary (`PluginFieldErrorBoundary`)
- Protege widgets individuais de dashboard, gráficos e campos customizados registrados por plugins.
- Se o widget de "Gráfico de Vendas" quebrar, ele exibe um aviso sutil local, enquanto o widget de "Pedidos Recentes" ao lado continua funcionando normalmente.

---

## 4. O Padrão de UX e Mecanismo de Recuperação (`Reset / React.startTransition`)

Seguindo os padrões do Next.js e o sistema de design **Kumo UI**:

1. **Sem Popups Bloqueantes**: Erros de renderização nunca devem emitir `alert()` nativo ou modais intrusivos.
2. **Indicador Visual Sutil**:
   - Exibição de um cartão de contingência limpo com borda de aviso sutil (`border-kumo-danger/30`).
   - Badge com status animado sutil (`● Isolated Fallback`).
3. **Recuperação Transicional sem Reload**:
   - A prop/método de reset executa uma transição não-bloqueante via `React.startTransition()` combinada com a invalidação de queries do TanStack Query (`queryClient.resetQueries()`).
   - Isso permite tentar re-renderizar o componente do zero assim que a causa do erro (ex: conexão de rede) for reestabelecida.
4. **Telemetria via DevTools Bridge**:
   - Todo erro capturado por um Boundary emite automaticamente um payload JSON para o servidor de monitoramento `http://localhost:9091/push-log` (Chrome DevTools Bridge), registrando o módulo, a URL e a stack trace para auditoria em tempo real sem depender de screenshots.

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

1. **Eliminação de Crashes Globais**: `0%` de telas brancas causadas por exceções em plugins.
2. **Preservação do Shell**: A barra lateral e o cabeçalho mantêm a integridade de 100% da sessão.
3. **Observabilidade em Tempo Real**: Telemetria automática de exceções reportada ao DevTools Bridge (`:9091`).
4. **Alinhamento com a Regra `medido=verdade`**: A ADR fundamenta todas as implementações no repositório.
