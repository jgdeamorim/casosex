# ADR-0004: Arquitetura Avançada de Resiliência e Boundaries de Erro no EmDash Admin

- **Status**: Aceito (Accepted)
- **Data**: 2026-08-14
- **Autor**: Jeferson Amorim (Founder) & Antigravity (Pair AI)
- **Contexto**: EmDash CMS Admin Monorepo (`@emdash-cms/admin`) & Plugins (`@dashcommerce/core`)

---

## 1. Contexto e Problema

O **EmDash Admin** é uma aplicação React 19 executada como uma SPA de alta performance roteada pelo **TanStack Router** e envolvida pela camada SSR do Astro (`admin.astro`). 

À medida que o ecossistema expande com múltiplos plugins e módulos de e-commerce (`dashcommerce`), requisições a APIs externas ou instabilidades temporárias de schema (ex: retornos nulos em relatórios, métodos de envio ausentes ou instabilidades em payloads de rede) podiam causar exceções não tratadas no ciclo de vida da árvore de componentes React.

Anteriormente, exceções de runtime em componentes filhos causavam o desmonte completo da árvore React, resultando em:
1. **Crash Global ("Tela Branca da Morte")**: Exibição da mensagem genérica `Something went wrong! Hide Error`.
2. **Perda de Sessão e Estado de Navegação**: O operador perdia a visibilidade da barra lateral (Sidebar), do cabeçalho (Shell) e de outras abas ativas.
3. **Necessidade de Reload Forçado (`F5`)**: O usuário era forçado a recarregar a aplicação inteira para recuperar a navegação.

---

## 2. Decisão Arquitetural

Decidimos implementar a **Arquitetura de Resiliência Granular em 3 Camadas** (Three-Tiered Resilient Boundary Architecture) utilizando **React 19 Error Boundaries**, **TanStack Router `errorComponent`** e indicadores visuais sutis alinhados ao sistema de design **Kumo UI**.

### 2.1 As 3 Camadas de Isolamento

```
[ Camada 1: Root Router Boundary ] (TanStack Root & Shell)
       │
       ├── [ Camada 2: AdminModuleErrorBoundary ] (Módulos & Plugins: DashCommerce, Settings, etc.)
       │          │
       │          └── [ Camada 3: Component/Widget Boundary ] (Cards, Relatórios, Campos Customizados)
```

1. **Camada 1 (Root Router Boundary)**:
   - Envolve o layout raiz do sistema (`adminLayoutRoute`).
   - Garante que mesmo se o carregamento global de manifestos falhar, o estado da aplicação e a tela de reconexão permaneçam funcionais.

2. **Camada 2 (AdminModuleErrorBoundary - Nível Módulo / Plugin)**:
   - Envolve subpáginas inteiras de plugins (ex: `/admin/plugins/dashcommerce/*`, `/settings/*`).
   - Se uma subpágina quebrar devido a uma API inacessível ou payload corrompido, **apenas o conteúdo da página é substituído por um container de contingência**.
   - A barra lateral de navegação (`Sidebar`) e o cabeçalho (`Header`) permanecem **100% interativos**, permitindo ao usuário navegar livremente para outros módulos sem dar `F5`.

3. **Camada 3 (Widget / Field Boundary - Nível Componente)**:
   - Envolve widgets individuais (ex: Gráfico de MRR em *ReportsPage*, Tabela de Envio em *ShippingPage*, `PluginFieldErrorBoundary`).
   - Se o gráfico de vendas falhar, apenas a área do gráfico exibe o alerta sutil de erro. O restante dos cards da página continua operando.

---

## 3. Padrão de UX e Alertas Sutis em Tempo Real

A arquitetura exige estritamente o respeito ao padrão de design do EmDash (Kumo UI):

- **Sem Alertas Invasivos**: Proibido usar popups bloqueantes (`alert()`, modais intrusivos soltos) para erros de renderização.
- **Header Badge Sutil**: Exibição de indicador discreto no topo do módulo afetado (`● Erro de renderização no módulo`).
- **Botão de Recuperação sem Reload (`Reset/Retry`)**: Cada Boundary expõe uma ação explícita de `Retry` que limpa o estado de erro (`hasError: false`) e re-executa a renderização do componente de forma suave.
- **Log Estruturado para Observabilidade**: Todo erro capturado é reportado automaticamente via console estruturado e exposto ao **Chrome DevTools Bridge** para telemetria sem necessidade de screenshots.

---

## 4. Estrutura do Componente Canônico `AdminModuleErrorBoundary`

```tsx
export class AdminModuleErrorBoundary extends React.Component<Props, State> {
  // Captura exceções em tempo de execução na subárvore
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log para DevTools Bridge & Telemetria
    console.error(`[EMDASH MODULE ERROR] [${this.props.moduleName}]:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-kumo-danger/30 bg-kumo-tint p-6 shadow-sm">
          <div className="flex items-center gap-3 text-kumo-danger">
            <WarningCircle className="h-6 w-6 shrink-0" />
            <h3 className="text-base font-semibold">
              Falha ao carregar o módulo: {this.props.moduleName}
            </h3>
          </div>
          <p className="mt-2 text-sm text-kumo-subtle">
            {this.state.error?.message || "Ocorreu um erro inesperado durante a renderização."}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Button size="sm" onClick={() => this.setState({ hasError: false, error: undefined })}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 5. Consequências e Benefícios

### Positivas
- **Resiliência Total**: Eliminação definitiva da tela branca global em decorrência de erros de plugins.
- **Navegação Preservada**: O operador nunca perde o menu lateral ou o controle do painel administrativo.
- **DX (Developer Experience) Superior**: Erros de integração entre core e plugins são capturados com stack trace limpa e contextualizada.
- **Prontidão para Escala de Plugins**: Novos plugins desenvolvidos por terceiros podem falhar isoladamente sem comprometer a estabilidade do CMS.

### Mitigações e Riscos
- **Gerenciamento de Estado Residual**: Ao clicar em `Retry`, se a causa raiz (ex: API offline) não tiver sido resolvida, o erro se repetirá. O componente lida com isso de forma fail-soft sem bloquear a navegação.

---

## 6. Status de Implementação e Arquivos Afetados
- **ADR Registrada**: `docs/adr/ADR-0004-emdash-advanced-resilience-error-boundary-architecture.md`
- **Componente Base**: `packages/admin/src/components/AdminModuleErrorBoundary.tsx`
- **Módulos Protegidos**: DashCommerce (`ReportsPage`, `ShippingPage`, `VendorsPage`, `InventoryPage`) e subpáginas do Admin EmDash.
