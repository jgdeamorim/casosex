# ADR-0218: Volúpia Social Kanban CRM Engine Architecture

* **Status:** Aceito (Accepted)
* **Data:** 2026-08-30
* **Autor:** Founder Jeferson Amorim & Antigravity AI Engine
* **Domínio:** CASOSEX / Volúpia Content Engine / Cockpit UI

---

## Contexto e Problema

O Cockpit UI do Volúpia Content Engine (`self-essentials/langflow-main`, porta `:5556`) foi herdado do Langflow original e limita a visualização de projetos a duas abas principais: **Fluxos** e **Servidor MCP**.

Embora os fluxos visuais permitam a construção de grafos complexos de IA, o produtor de conteúdo necessita de um **Hub Operacional de Mídia Social (CRM-IA)** que centralize:
1. O acompanhamento do ciclo de vida das postagens (Ideia → Criação → Revisão → Agendamento → Publicado).
2. A agenda e calendário de distribuição automatizada.
3. A telemetria de postagens em tempo real sem dependência de SaaS externos de agendamento.

---

## Decisão Arquitetural

Decidimos evoluir a interface do projeto no Cockpit UI para integrar o **Volúpia Social Kanban CRM Engine**, reestruturando a navegação principal do projeto e conectando o ciclo de vida dos posts ao worker de execução e ao Redis `:6396`.

### 1. Reestruturação das Abas do Projeto

A visualização de projeto passa a contar com quatro visões principais:
1. 📊 **Kanban Social & Agenda IA** *(Visão Padrão)*: Gestão de cards de postagens em tempo real.
2. ⚡ **Fluxos de Automação**: Construtor visual de grafos do Langflow.
3. 🌐 **Servidor MCP**: Gerenciamento de ferramentas e conectores MCP.
4. 📈 **Telemetria & BOA Score**: Métricas operacionais e score de saúde do sistema.

### 2. Estágios do Pipeline Kanban (5 Colunas)

| Estágio | Origem / Automação | Ação de IA & Worker |
| :--- | :--- | :--- |
| **1. 💡 Ideias & Prompts** | Gerado por LLM ou inserido pelo founder | Qwen 2.5 1.5B (local $0) / DeepSeek gera pautas e scripts |
| **2. 🎨 Em Criação** | Disparado a partir da aprovação da ideia | GPU Vast.ai / Fal.ai gera imagens/vídeos via Volúpia Worker (`:7860`) |
| **3. ✍️ Revisão & Preview** | Artefato pronto para validação | Exibe preview fiel do post (Instagram/TikTok/X/LinkedIn) |
| **4. 📅 Agendados** | Data/hora definida pelo usuario/IA | Agendador registra timer no Redis (`casosex:volupia:posts:scheduled`) |
| **5. 🚀 Publicados & Métricas** | Publicação efetuada via API/Worker | Ingestão de engajamento e métricas soberanas |

### 3. Stack Teórico & Componentes de UI

- **Drag-and-Drop**: Integração via `@dnd-kit/core` / `@dnd-kit/sortable` (consultado via Context7) garantindo movimentação de cards com latência < 1ms.
- **Camada de Customização**: O componente é injetado via `src/customization/components/custom-project-kanban.tsx`, mantendo a separação entre o core do Langflow e as extensões do Volúpia.
- **Armazenamento de Estado**: 
  - **Sessões e Filas**: Redis `:6396` (`casosex:volupia:posts:*`).
  - **Persistência Relacional**: Cloudflare D1 via Volúpia Content Worker (`:7860`).

---

## Consequências

### Positivas
- **Foco em Produto**: Transforma a interface de um simples criador de nós em um CRM completo de gerenciamento de mídias sociais impulsionado por IA.
- **Automação End-to-End**: Conecta a geração de ideias, produção gráfica na GPU e agendamento de postagens em uma única experiência visual.
- **Soberania e Custo $0**: Dispensa o uso de ferramentas pagas de agendamento (ex: Buffer, Hootsuite, Later).

### Negativas / Riscos
- **Manutenção de Customização**: Exige manter o componente customizado sincronizado durante eventuais atualizações da base do Langflow.

---

## Referências

- **ADR-0216**: Intent-Driven Content Engine (Langflow + Vast.ai + Gemini).
- **ADR-0217**: Volúpia Cloudflare D1/R2/KV Persistence Architecture.
- **Context7**: `/clauderic/dnd-kit` (Dokumentação de Drag and Drop React).
