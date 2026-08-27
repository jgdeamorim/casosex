# ADR-0203: Sistema Mobile Dual Edge-Drawers com RBAC e Copilot Contextual por Telemetria (`tag=`)

- **Status:** Aceito / Planejado (Roadmap de Implantação Futura)
- **Data:** 2026-08-27
- **Autor:** Jeferson Amorim (Founder) & Antigravity Agent Engine
- **Domínio:** Arquitetura Mobile App-First / UI Shell / IA Copilot Internal / RBAC Security

---

## Contexto e Problema

No acesso mobile (smartphones iOS e Android) aos cockpits do ecossistema CASOSEX / Adsentice (ex: `v8-cockpit` em `usevolupia.com.br`), gestos nativos de deslizar o dedo da borda da tela para o centro ativam a ação padrão do navegador (`history.back()` / `popstate`). Esse comportamento causa problemas operacionais:

1. **Colisão de Distribuições no Cloudflare:** O recuo acidental no histórico pode carregar distribuições e builds antigas hospedadas no Cloudflare Pages/Workers (`volupia-cockpit` vs `volupia-v8-cockpit`).
2. **Falta de Navegação Sistêmica Unificada:** O operador precisa navegar entre múltiplos cockpits operacionais (ex: Compras & Fornecedores V8, Vendas, Financeiro e Admin) mantendo o respeito às permissões de acesso (`UserRole`).
3. **Necessidade de Assistência Contextual Isolada:** O assistente de inteligência artificial (Copilot Internal) deve fornecer respostas altamente assertivas e alinhadas ao contexto específico da tela/cockpit em uso.
4. **Sigilo de Infraestrutura Interna:** Dados de telemetria ao vivo (`Redis :6396`, portas de infraestrutura, BOA Scores, estatísticas internas) NUNCA podem ser expostos para usuários externos, telas de onboarding público ou demonstrações não autorizadas.

---

## Decisão de Arquitetura

Fica estabelecido para o **Roadmap Futuro** a implementação do sistema **Dual Edge-Drawers com Copilot Contextual por Telemetria**:

### 1. Interceptação de Gestos Laterais (Edge Swipable Drawers)
- Implementar manipuladores de toque (`onTouchStart` / `onTouchMove`) nas bordas extremas da tela (`x < 20px` e `x > window.innerWidth - 20px`).
- Executar `e.preventDefault()` para **bloquear o gesto nativo de `history.back()`** do navegador mobile, eliminando a troca acidental de distribuições no Cloudflare.

### 2. Menu Global da Esquerda (Menu Esquerda — Cockpits & RBAC)
- **Gesto:** Deslizar da borda esquerda para o centro.
- **Função:** Menu Global de Navegação do Ecossistema.
- **Controle de Acesso (RBAC):** Integrado ao `userRules.ts` e `ScopeGuard`. Exibe apenas os cockpits e módulos permitidos para o perfil logado (`founder`, `ops`, `commercial`).
- **Módulos Suportados:** Cockpit Compras & Fornecedores V8, Cockpit Vendas/CRM, Cockpit Financeiro e Cockpit Admin.

### 3. Menu Contextual da Direita (Menu Direita — Copilot Internal & Tools)
- **Gesto:** Deslizar da borda direita para o centro.
- **Função:** Ferramentas internas e assistente inteligente do Cockpit ativo.
- **Copilot Internal IA (Tag-Scoped):**
  - O cockpit ativo injeta sua chave de telemetria (ex: `tag="v8-cockpit"` ou `tag="commercial-pipeline"`).
  - O Copilot executa grounded retrieval (Qdrant + Redis) escopado estritamente pela `tag=`, garantindo respostas assertivas e sem contaminação de contexto.
- **Gestão de Perfil:** Modal de troca/visualização de perfil (`UserProfileModal`).

### 4. Diretiva Estrita de Proteção de Telemetria Privada
- **Isolamento Total:** Informações de telemetria ao vivo (`Redis :6396`, BOA Score, portas de serviços e estatísticas de infraestrutura) são **estritamente privadas e proibidas de serem exibidas** em onboardings públicos ou interfaces de clientes externos.
- **Gating de Founder:** Qualquer visualização de telemetria infraestrutural permanece 100% restrita ao ambiente privado do Founder.

---

## Consequências

- **Positivas:**
  - Experiência mobile de nível nativo (iOS/Android) sem conflito de navegação com o navegador.
  - Garantia de que distribuições legado no Cloudflare não serão acidentalmente reabertas.
  - Copilot com alta coesão e assertividade de respostas fundamentadas em `medido=verdade`.
  - Segurança e confidencialidade da infraestrutura interna preservadas.
- **Mitigações/Tarefas de Roadmap:**
  - Desenvolver o componente reutilizável `EdgeSwipeDrawer.tsx` com `touch-action: pan-y`.
  - Ajustar o CSS global para `overscroll-behavior-x: none`.
