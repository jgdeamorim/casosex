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

### 4. Análise Arquitetural Profunda ("Até o Osso"): Padrões de Inspiração de Mídia (`self-essentials/Open-Generative-AI-main`)

Em conformidade com a Doutrina de Isolamento #10 (o repositório em `self-essentials` atua como fonte de referência de padrões sem acoplamento de runtime ou containers), a análise detalhada da codebase do `Open-Generative-AI-main` revela 5 motores arquiteturais a serem adaptados para o Langflow e o Social Kanban (`medido=verdade`):

#### A. Compilador de Prompts Cinematográficos e Física de Câmera (`src/lib/promptUtils.js`)
- **Descoberta**: Função `buildNanoBananaPrompt()` traduz parâmetros físicos de fotografia e cinema em prompts hiper-realistas:
  - `CAMERA_MAP`: Câmeras 8K Digital, Full-Frame Cine, 70mm Grand Format, S35.
  - `LENS_MAP`: Lentes Anamórficas, Tilt, 70s Cinema Prime, Macro, Halation Diffusion.
  - `FOCAL_PERSPECTIVE`: Mapeamento milimétrico de distância focal (8mm wide → 85mm portrait).
  - `APERTURE_EFFECT`: Controle de profundidade de campo e bokeh (`f/1.4`, `f/4`, `f/11`).
- **Aplicação no Langflow**: Criação do **Nó Customizado "Direção de Fotografia / Cinematic Prompt Builder"** no Langflow, permitindo que os grafos de automação de conteúdo configurem parâmetros ópticos de câmera antes de enviar o prompt à GPU.

#### B. Engine Dual de Inferência Local ($0 Custo de API) (`src/lib/localInferenceClient.js` & `localModels.js`)
- **Descoberta**: Suporte a execução de modelos locais via:
  - `sd.cpp`: Engine compilado em C++ nativo para Stable Diffusion / Flux rodando localmente sem dependência de cloud.
  - `Wan2GP`: Servidor Gradio local para modelos de vídeo de alta fidelidade (Wan2.1 T2V/I2V 14B/1.3B).
- **Aplicação no Volúpia Worker (`:7860`)**: O worker pode se conectar a instâncias locais de `sd.cpp` e `Wan2GP`, permitindo a geração de imagens/vídeos com custo R$0 para postagens de menor prioridade no Kanban.

#### C. Arquitetura MCP Native & Agentes CLI (`src/components/McpCliStudio.js`)
- **Descoberta**: Servidor MCP nativo (`muapi-mcp-server`) que expõe 100+ modelos generativos como ferramentas MCP estruturadas (`--output-json`), combinado com a suíte `Generative-Media-Skills` (Skills pré-prontas para Cinema Director, Logo Creator, Shorts Presets e AI Clipping).
- **Aplicação no Langflow**: Expansão do **Servidor MCP** da aba 3 do projeto no Langflow, permitindo que agentes autônomos dentro dos fluxos invoquem ferramentas MCP de mídia de forma assíncrona.

#### D. Suíte de Estúdios de Mídia Por Formato Social (`src/components/*Studio.js`)
- **Descoberta**: Componentes especializados por tipo de produção visual:
  - `CinemaStudio.js`: Controle de enquadramento 16:9 / 21:9 para vídeos e banners com overlay de parâmetros e histórico local.
  - `LipSyncStudio.js`: Sincronização labial e geração de avatares falantes a partir de áudio/script.
  - `VideoStudio.js`: Geração de vídeos curtos (Reels, TikTok, Shorts em 9:16) com controle de movimento e câmera.
- **Aplicação no Kanban CRM**: Utilização dessa especificação visual para estruturar a **Modal de Preview & Edição de Mídia** do Kanban Social, com seletores dedicados para cada rede social (Reels 9:16, Feed 1:1, Youtube 16:9).

#### E. Gestão de Jobs Assíncronos & Polling (`src/lib/pendingJobs.js` & `uploadHistory.js`)
- **Descoberta**: Sistema resiliente para rastrear jobs de geração pesados em background com atualizações de progresso via polling e cache local.
- **Aplicação na Persistência**: Integração com as filas do Redis `:6396` (`casosex:volupia:posts:*`) e tabelas no Cloudflare D1 via Volúpia Worker, garantindo que o status dos cards no Kanban seja atualizado em tempo real à medida que a GPU conclui a renderização.

> **Resumo da Reanálise Profunda:** O `Open-Generative-AI-main` fornece a especificação técnica completa para transformarmos o Volúpia Content Engine em um estúdio generativo multimídia autônomo, nativo em C/C++ e GPU local, gerenciado visualmente pelo nosso Social Kanban CRM no Langflow.

---

## Consequências

### Positivas
- **Foco em Produto**: Transforma a interface de um simples criador de nós em um CRM completo de gerenciamento de mídias sociais impulsionado por IA.
- **Automação End-to-End**: Conecta a geração de ideias, produção gráfica na GPU e agendamento de postagens em uma única experiência visual.
- **Soberania e Custo $0**: Dispensa o uso de ferramentas pagas de agendamento (ex: Buffer, Hootsuite, Later) e APIs de imagem/vídeo através de inferência local.

### Negativas / Riscos
- **Manutenção de Customização**: Exige manter o componente customizado sincronizado durante eventuais atualizações da base do Langflow.

---

## Referências

- **ADR-0216**: Intent-Driven Content Engine (Langflow + Vast.ai + Gemini).
- **ADR-0217**: Volúpia Cloudflare D1/R2/KV Persistence Architecture.
- **Context7**: `/clauderic/dnd-kit` (Documentação de Drag and Drop React).
- **Self-Essentials**: `/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/Open-Generative-AI-main`.
