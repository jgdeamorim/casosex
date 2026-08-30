# ADR-0219: V8 Content OS & Agenda IA — Sovereign Architecture

**Status**: Accepted  
**Data**: 2026-08-30  
**Contexto**: CASOSEX / Volúpia Content Engine / V8 Cockpit  
**Autores**: Jeferson Amorim (Founder) & Antigravity (Pair Engine)  
**Refinamento Adversarial**: Absorção da Arquitetura Transversal de Segurança (Auth/RBAC no Hono), Contrato de Entidade Unificada, Compilador Puro de Prompts com Hash BLAKE3, Matriz de Tabelas D1 com Event Sourcing (`content_events`) e Decoupling do OODA (D1 como fonte soberana).

---

## 1. Visão Geral & Filosofia

O **V8 Content OS** é o sistema operacional de conteúdo do V8 Cockpit que conecta **Sinais de Mercado → Intenção Estratégica → Brand DNA → Roteiro Intent-Driven → Compilador Determinístico de Prompts → Asset Pipeline (9:16/16:9) → Publicação Multi-Plataforma → OODA Learning Loop**.

A Agenda IA (30/60/90 Dias) e o Kanban CRM deixam de ser simples componentes visuais com dados no cliente (`localStorage`) e passam a ser **visões gráficas projetadas** de uma entidade relacional soberana (`ContentPost`) gerenciada por uma API REST no Worker Hono (`apps/volupia-content-worker`) protegida por RBAC server-side.

---

## 2. Decisões Arquiteturais Chave

### 2.1 Transversalidade da Segurança (Auth / RBAC no Hono)
A autenticação e a autorização baseada em cargos (RBAC) não são adiadas para o final do projeto nem dependem do `ScopeGuard` ou `localStorage` do React. Elas funcionam como dependência transversal aplicada em todas as rotas `/api/v1/content/*`:

```
                    AUTH / RBAC (Hono Worker Middleware)
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   agenda-core      brand-dna       asset-registry
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                 prompt-compiler
                        │
                        ▼
                  learning-loop
```

#### Matriz de Autorização RBAC
| Operação | Founder | Ops | Commercial |
| :--- | :---: | :---: | :---: |
| Visualizar Agenda | ✓ | ✓ | ✓ |
| Criar / Editar Conteúdo | ✓ | ✓ | ✓ |
| Brand DNA / Characters | ✓ | ✓ | — |
| Compilar Prompt / Asset | ✓ | ✓ | ✓ |
| Aprovar Conteúdo | ✓ | ✓ | — |
| Agendar / Publicar | ✓ | ✓ (apenas agendar) | ✓ (apenas publicar) |
| Métricas & Telemetria | ✓ | ✓ | ✓ |

---

### 2.2 Contrato da Entidade Soberana (`ContentPost`)

```typescript
export type ContentPostStatus =
  | 'draft'
  | 'generated'
  | 'review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export type ContentObjective = 'awareness' | 'authority' | 'conversion';

export type ContentPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook';

export interface ContentPost {
  id: string; // Formato: POST-YYYYMMDD-XXXX (Ex: POST-20260830-0001)
  title: string;

  objective: ContentObjective;
  dnaPillarId: string;

  platform: ContentPlatform;
  format: string; // Ex: 'reels_9_16', 'carousel_4_5', 'youtube_16_9'

  scheduledAt: string | null;

  hook: string;
  script: string;
  cta: string;

  brandDnaVersion: number;
  characterId: string | null;
  promptTemplateId: string | null;

  compiledPrompt: string | null;

  status: ContentPostStatus;

  createdBy: string;
  approvedBy: string | null;

  createdAt: string;
  updatedAt: string;
}
```

---

### 2.3 Modelagem Relacional no Cloudflare D1 (7 Tabelas Separadas)

O D1 permanece como a **fonte transacional soberana de verdade**. Nenhuma decisão de persistência definitiva é delegada apenas ao Redis ou Qdrant:

1. `content_posts`: Entidade principal do post.
2. `brand_dna`: Diretrizes visuais, paletas, tom de voz e pilares.
3. `characters`: Biblioteca de personagens e referências visuais com seeds de consistência.
4. `prompt_templates`: Templates de prompts parametrizados por formato e objetivo.
5. `asset_generations`: Versionamento de gerações de mídia (`generation-001`, `generation-002`, `published-version`).
6. `content_events`: Trilha de auditoria event-driven (`created`, `edited`, `prompt_compiled`, `asset_generated`, `approved`, `scheduled`, `published`, `metric_received`).
7. `content_metrics`: Métricas de engajamento pós-publicação (impressões, retenção, cliques em Vendas Discretas).

---

### 2.4 Prompt Compiler Puro com Hash BLAKE3 / SHA-256

O módulo `promptCompiler.ts` é uma **função pura sem efeito colateral** que aceita um payload estruturado e devolve um prompt compilado e um hash determinístico:

```typescript
export interface PromptCompileInput {
  system: string;
  brandDna: string;
  character: string;
  intent: string;
  scene: string;
  camera: string;
  lighting: string;
  composition: string;
  platform: string;
  safeZone: string;
  negativeRules: string;
}

export interface CompiledPromptOutput {
  text: string;
  blocks: Record<string, string>;
  hash: string; // Hash BLAKE3 dos inputs formatados
}

export function compilePrompt(input: PromptCompileInput): CompiledPromptOutput;
```

---

### 2.5 Nomenclatura Padronizada de IDs e Mídia
- **Posts**: `POST-YYYYMMDD-XXXX` (Ex: `POST-20260830-0001`).
- **Gerações**: `generation-001`, `generation-002`, `generation-003`, `published-version`.
- Cada registro em `asset_generations` guarda modelo, versão do modelo, seed, `prompt_hash`, dimensões (`width`/`height`), `mime_type` e URL no Cloudflare R2.

---

### 2.6 Arquitetura de APIs REST (Hono Worker)

```
GET    /api/v1/content/posts
POST   /api/v1/content/posts
GET    /api/v1/content/posts/:id
PATCH  /api/v1/content/posts/:id
DELETE /api/v1/content/posts/:id

POST   /api/v1/content/posts/:id/compile
POST   /api/v1/content/posts/:id/generate
POST   /api/v1/content/posts/:id/approve
POST   /api/v1/content/posts/:id/schedule
POST   /api/v1/content/posts/:id/publish

GET    /api/v1/content/posts/:id/assets
GET    /api/v1/content/posts/:id/events
GET    /api/v1/content/posts/:id/metrics

GET/POST/PATCH /api/v1/content/brand-dna
GET/POST/PATCH /api/v1/content/characters
GET/POST/PATCH /api/v1/content/prompt-templates
```

---

### 2.7 Decoupling do OODA Learning Loop
- **Cloudflare D1**: Fonte transacional de verdade (grava eventos e posts).
- **Redis (`:6396`)**: Camada de estado operacional temporário, filas de geração e agregações rápidas.
- **Qdrant (`:6352`)**: Camada de memória semântica e padrão de busca vetorial para recomendação de pautas de alta conversão.

---

## 3. Roteiro Oficial de Implementação (M0 - M5)

- **M0 — Fundação**: Contrato de autenticação, Middleware Hono RBAC, Estrutura de rotas `/api/v1/content`, Migrations D1, Tipos compartilhados.
- **M1 — Agenda Core**: Entidade `content_posts`, CRUD de posts, Calendário 30/60/90 Dias, Filtros por plataforma/status, Drawer do conteúdo, Ciclo de vida.
- **M2 — Brand DNA**: Biblioteca de Brand DNA, Personagens (`characters`), Templates de Prompts.
- **M3 — Prompt Compiler**: Função pura do compilador, separação em blocos, cálculo de Hash, preview, recompilação e testes determinísticos.
- **M4 — Asset Registry**: Versionamento de gerações de mídia, seeds, modelos, versões e marcação da `published-version`.
- **M5 — Learning Loop**: Processamento de `content_events`, agregação de métricas, integração com Redis/Qdrant e motor OODA de recomendação.

---

## 4. Definition of Done (DoD)

- [ ] Usuário autenticado no servidor via JWT/Session Token.
- [ ] RBAC server-side ativo nas rotas do Hono.
- [ ] Entidade `ContentPost` totalmente persistida no D1.
- [ ] Visões de Calendário (30/60/90 Dias) e Drawer de Conteúdo operacionais.
- [ ] Brand DNA e Character Library com versionamento ativo.
- [ ] Compilador de Prompts determinístico com Hash BLAKE3 gerado e testado.
- [ ] Asset Registry com versionamento de gerações e seeds.
- [ ] Trilha auditável em `content_events`.
- [ ] D1 como fonte transacional com telemetria alimentando Redis e Qdrant.
- [ ] Validação de compilação TS/SWC sem erros.
