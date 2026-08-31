# ADR-0221: Especificação Normativa dos Módulos M0–M5 e Benefícios de Inteligência do V8 Studio (AI Content OS)

- **Status:** Accepted
- **Data:** 2026-08-30
- **Autor:** Jeferson Amorim (Founder) & Antigravity (Engine Agent)
- **Domínio:** Arquitetura de Produto / V8 Content OS / Inteligência Criativa & Automação Multi-Canal
- **Dependências:** ADR-0094, ADR-0200, ADR-0216, ADR-0219, ADR-0220

---

## 1. Contexto

Após o desacoplamento formal do `v8_studio` como a engine e estúdio visual exclusivo de **AI Content OS** (ADR-0220), fez-se necessário institucionalizar a especificação normativa completa dos **6 Módulos Estruturais (M0–M5)** e da matriz de benefícios operacionais sintetizados a partir da inteligência histórica do ecossistema.

O `v8_studio` opera como uma fábrica autônoma e assistida por IA para geração, validação visual, agendamento e publicação multi-canal (Instagram, TikTok, YouTube Shorts, LinkedIn), com foco em alta fidelidade de mídia e consistência absoluta de marca.

---

## 2. Decisão Normativa: Módulos M0–M5

Fica estabelecida e ratificada a especificação técnica dos 6 módulos operacionais do V8 Studio:

### 2.1. M0 — Fundação & Governança Multitenant (Auth & Schemas)
- **Auth/RBAC Transversal:** Papéis estritos (`Founder`, `Creator`, `Reviewer`, `AutomationAgent`).
- **Validação de Contratos:** Zod schemas obrigatórios para todos os fluxos e parâmetros de execução no backend Hono (`:7860`).
- **Persistência Relacional:** Schema D1 com 7 tabelas atômicas (`content_projects`, `content_flows`, `content_posts`, `brand_dna`, `asset_registry`, `generation_logs`, `performance_metrics`).

### 2.2. M1 — Agenda IA Executiva (30/60/90 Dias)
- **Visualização Tripla:** Alternância reativa entre **Kanban**, **Calendário** e **Lista**.
- **Filtro por Canal:** Separação por rede social (Instagram, TikTok, YouTube Shorts, LinkedIn).
- **Drawer de Inspeção de Post:** Visualização de prompt compilado, thumbnail HD, status do render em GPU (`vast.ai`) e métricas estimadas.

### 2.3. M2 — Stepper de Intenção ("Criar Conteúdo" em 4 Passos)
- **Wizard Orientado a Negócio:**
  1. *Objetivo Estratégico* (Vendas, Conscientização, Engajamento)
  2. *Canal & Formato* (Reels 15s, Carrossel 5 slides, Shorts)
  3. *Pilar de Conteúdo* (Dicas, Bastidores, Depoimentos, Produto)
  4. *Ideia Base / Gancho*
- **Compilador Transparente de Prompts:** Conversão automática do formulário de intenção em prompt multimodal otimizado para o Gemini e vast.ai.

### 2.4. M3 — Brand DNA & Elenco Digital CASOSEX
- **Ficha do Elenco Digital:** Armazenamento de sementes determinísticas (Seeds), guias de iluminação, paletas de cores e arquivos de referência dos personagens IA.
- **Invariância de Identidade:** Garantia de que a fisionomia, estilo e tom de voz dos personagens permaneçam idênticos em todas as gerações.

### 2.5. M4 — Performance Loop & Aprendizado Contínuo (OODA Engine)
- **Realimentação de Métricas:** Métricas de engajamento (curtidas, retenção, conversão) realimentam a base vetorial Qdrant (`:6352`).
- **Otimização Preditiva de Prompts:** Os agentes analisam os posts de maior performance e sugerem ganchos e estilos otimizados nos ciclos subsequentes.

### 2.6. M5 — Studio Flow Canvas (Custom Nodes Visuais)
- **Editor em Grafo (Langflow-based):** Capacidade de construir, modificar e versionar fluxos de criação visualmente arrastando nós (*Input Sinais ➔ Brand DNA ➔ Prompt Compiler ➔ Render vast.ai ➔ Vision QA ➔ Publicador*).

---

## 3. As 5 Engrenagens Operacionais

Toda execução no `v8_studio` deve respeitar o pipeline de 5 fases:

```
1. INTENÇÃO & SINAIS       ➔ Analisa tendências de busca e redes sociais (DataForSEO/MCP)
2. CONSISTÊNCIA DE MARCA   ➔ Aplica o Brand DNA e Elenco Digital CASOSEX (estilo visual único)
3. GERAÇÃO DE MÍDIA HD     ➔ Renderiza imagens e vídeos cinematográficos via GPUs (vast.ai)
4. CONTROLADOR DE QUALIDADE➔ Gemini Vision QA aprova se a imagem/vídeo cumpre os critérios
5. AGENDA IA & PUBLICAÇÃO  ➔ Organiza a Agenda (30/60/90 dias) e publica direto nas redes
```

---

## 4. Consequências

### Positivas:
- **Autonomia & Alta Velocidade:** Capacidade de gerar 30, 60 ou 90 dias de conteúdo com intervenção humana mínima.
- **Redução Custo de GPU:** Renderização via `vast.ai` sob demanda elimina custos de infraestrutura ociosa.
- **Rastreabilidade Medida:** Todo o pipeline é auditado com hashes BLAKE3 e métricas OODA no Redis (`:6396`).

---

## 5. Conformidade (`medido=verdade`)

- **Código Backend:** `apps/v8_studio/src/index.ts`
- **Código Frontend:** `apps/v8_studio/frontend/`
- **Migrações D1:** `migrations/0001_content_os_tables.sql`
- **ADRs Relacionadas:** ADR-0094, ADR-0200, ADR-0216, ADR-0219, ADR-0220
