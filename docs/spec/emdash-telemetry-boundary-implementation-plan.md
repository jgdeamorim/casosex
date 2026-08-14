# Plano de Implementação: Telemetria, Observabilidade e Predictive Boundary no EmDash (DAG + SOP v3.0)

- **Documento**: Specification & Implementation Plan
- **Autoridade**: ADR-0004 & SOP v3.0 (`docs/spec/adsentice-coding-sop-ts-tsx.md`)
- **Regra Governante**: `medido=verdade` · 1 feature = 1 commit

---

## 📍 Fase 1: Grounding & DAG (KG-First)
Antes de qualquer código ou modificação de arquivos, validar as dependências e padrões no ecossistema:
1. **Consultar Coleções Qdrant**: `adsentice-conversation_search` para referências a `SettingsNavRow`, `SettingsSection` e `kumo`.
2. **Checar Filesystem**:
   - `packages/admin/src/components/Settings.tsx` (Hub de Configurações)
   - `packages/admin/src/components/settings/McpSettings.tsx` (Padrão Canônico de Subpágina)
   - `packages/admin/src/router.tsx` (Registro de Rotas do TanStack Router)
3. **Pré-Voo Obliterativo Anti-Duplicação (SOP §III.B)**:
   ```bash
   grep -rn "Telemetry" self-essentials/emdash-main/packages/admin/src/
   ```

---

## 🎨 Fase 2: Construção da UI de Telemetria (`TelemetrySettings.tsx`)
Criar o componente canônico de configurações respeitando os componentes do Kumo UI e o padrão EmDash:

1. **Arquivo**: `packages/admin/src/components/settings/TelemetrySettings.tsx`
2. **Estrutura Visual**:
   - Header com `SettingsFrame` e `SettingsSection`.
   - Card 1: **Status do Chrome DevTools Bridge (`:9091`)** (Badge de Conexão Ativa / IP / Porta).
   - Card 2: **Telemetria de Error Boundaries** (Tabela com logs recentes de falhas capturadas pelo `AdminModuleErrorBoundary`).
   - Card 3: **Métricas do MCP Server** (Contagem de chamadas e ferramentas ativas).
3. **Regras SWC / SOP v3.0**:
   - Usar `inline props type` ou types exportados diretamente.
   - Tratar erros assíncronos com `catch (e: unknown) { void e }`.
   - Imports do Lingui `@lingui/react/macro` para i18n/tradução (`Trans`, `t`).

---

## 🧭 Fase 3: Roteamento e Registro no Hub (`Settings.tsx` & `router.tsx`)
1. **Atualizar Hub `Settings.tsx`**:
   - Adicionar a seção **System & Telemetry** (ou expandir Integrations).
   - Adicionar o `SettingsNavRow` com ícone `Activity` apontando para `/settings/telemetry`.
2. **Atualizar `router.tsx`**:
   - Declarar `telemetrySettingsRoute` vinculada ao `adminLayoutRoute` com path `/settings/telemetry`.
   - Adicionar a rota na árvore `adminRoutes`.

---

## 🧪 Fase 4: Validação & Build (SOP Compliance)
1. **Verificação de Tipagem**: `npx tsc --noEmit`
2. **Build do Pacote Admin**: `pnpm --filter @emdash-cms/admin build`
3. **Validação Visual**: Acessar `http://localhost:4321/_emdash/admin/settings` e testar a navegação para `/settings/telemetry`.

---

## 📦 Fase 5: Commit Automático & Auto-Ingestão de Memória (SELO)
1. **Git Commit**: `git add . && git commit -m "feat(admin): implement Telemetry settings dashboard under ADR-0004"`
2. **Ingestão no KG**: Persistir a decisão e o estado no `claude-memory` com tag `casosex`.
