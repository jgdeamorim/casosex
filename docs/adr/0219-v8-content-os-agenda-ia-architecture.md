# ADR-0219: V8 Content OS & Agenda IA — Sovereign Architecture

**Status**: Accepted  
**Data**: 2026-08-30  
**Contexto**: CASOSEX / Volúpia Content Engine / V8 Cockpit  
**Autores**: Jeferson Amorim (Founder) & Antigravity (Pair Engine)  
**Refinamento Adversarial**: Incorporação dos 5 Pilares do AI Content OS (Content Opportunity Stepper, Brand & Character Library, Deterministic Prompt Compiler, Asset Registry Versionado e Transversal Server-Side RBAC).

---

## 1. Visão Geral & Filosofia

A **Agenda IA** deixa de ser um mero calendário visual de postagens para se tornar o **V8 Content OS**: um sistema operacional soberano de conteúdo que conecta **Sinais de Mercado → Intenção Estratégica → Brand DNA → Roteiro Intent-Driven → Compilador de Prompts → Asset Pipeline (9:16/16:9) → Publicação Multi-Plataforma → OODA Learning Loop**.

Cada post-it na agenda não é um cartão estático, mas sim a projeção gráfica de uma **Entidade Operacional Relacional (`ContentPost`)** auditável, versionada e imutável a cada alteração de lifecycle.

---

## 2. Decisões Arquiteturais Chave

### 2.1 Entidade Operacional Relacional (`ContentPost`)
A estrutura de dados do post deixa de usar JSONs flexíveis não-validados e passa a ser regida pelo esquema relacional D1 de 9 sub-domínios:

```typescript
export interface ContentPost {
  identity: {
    id: string; // Ex: POST-2026-0830-0042
    tenantId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  };
  intent: {
    objective: 'awareness' | 'authority' | 'conversion' | 'retention';
    funnelStage: 'top' | 'middle' | 'bottom';
    targetAudience: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
  brand: {
    dnaPillarId: string; // Ex: Erotic Luxury, Educativo, Bastidores, Prova Social
    campaignId?: string;
    brandVersion: string;
  };
  script: {
    hook: string; // Scroll-stopper (0-3s)
    body: string; // Storytelling / Desenrolar
    cta: string; // Trigger de acionamento (Ex: "Comente VIP no Direct")
    estimatedDurationSeconds: number;
  };
  prompt: {
    compiledPrompt: string;
    promptHash: string; // Hash BLAKE3 do prompt compilado
    characterId?: string;
    model: string;
    seed: number;
    negativePrompt?: string;
    aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
    safeZoneProfile: 'reels_instagram' | 'tiktok_vertical' | 'youtube_thumb' | 'feed_carousel';
  };
  assets: {
    coverUrl?: string; // Capa do Reel / TikTok (9:16)
    videoUrl?: string;
    thumbnailUrl?: string; // Miniatura YouTube / Facebook (16:9 ou 1:1)
    carouselUrls?: string[];
    sourceReferences?: string[];
  };
  schedule: {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'whatsapp_status';
    publishAt: string; // ISO 8601 UTC
    timezone: string;
  };
  lifecycle: {
    status: 'draft' | 'generated' | 'review' | 'approved' | 'scheduled' | 'published' | 'failed';
    approvedBy?: string;
    approvedAt?: string;
  };
  analytics: {
    impressions?: number;
    engagementRate?: number;
    directClicks?: number;
    conversionsCount?: number;
    updatedAt?: string;
  };
}
```

---

### 2.2 Content Opportunity Stepper (Assistente de 4 Etapas)
A criação de novas pautas substitui o formulário solto de "Novo Post" por um assistente guiado (*Stepper*):

1. **Etapa 1: Intenção / Objetivo**: Seleção do objetivo de funil (Awareness, Autoridade, Conversão, Retenção).
2. **Etapa 2: Pilar do Brand DNA**: Vínculo com os pilares visuais e verbais cadastrados no Brand Library.
3. **Etapa 3: Roteiro Intent-Driven**: Construção estruturada do Gancho (Hook), Corpo (Storytelling) e CTA de acionamento.
4. **Etapa 4: Capa & Prompt Compiler**: Compilação automática do prompt com preview de Safe Zones e pré-visualização 9:16/16:9.

---

### 2.3 Character & Brand Identity Library
Sistema de cadastro relacional de identidades e personagens para garantir consistência fotorealista entre gerações de IA (ComfyUI / Vast.ai / Gemini / Seed-Locking):

- `brand_dna_pillars`: Armazena paleta de cores, iluminação dramática, tom de voz, regras de enquadramento e diretrizes da marca.
- `character_library`: Guarda referências faciais (frente/perfil), características físicas imutáveis e seeds de retenção de personagem.
- `prompt_templates`: Modelos de prompts de alta performance categorizados por formato (Reels 9:16, Carrossel, Thumbnail YouTube).

---

### 2.4 Prompt Compiler Determinístico & Auditável
Os prompts de geração de mídia **nunca são escritos manualmente em campos soltos**. O compilador funde deterministicamente 9 camadas:

$$\text{Prompt Final} = \text{System} + \text{Brand Rules} + \text{Character Identity} + \text{Content Intent} + \text{Scene} + \text{Camera/Lighting} + \text{Composition} + \text{Platform SafeZone} - \text{Negative Rules}$$

Toda compilação gera um hash **BLAKE3 (`promptHash`)**. Se um asset gerado alcançar alto engajamento, o sistema consegue reproduzir ou refinar a mesma composição com 100% de rastreabilidade.

---

### 2.5 Asset Registry & Versionamento de Gerações
Cada post possui uma sub-tabela `content_post_generations` para versionar cada tentativa de geração de imagem ou vídeo:

```
POST-2026-0830-0042
 ├── generation-001 (seed: 8492041, model: SDXL, status: discarded)
 ├── generation-002 (seed: 8492042, model: ComfyUI-Flux, status: selected)
 └── published-version (asset_id: AST-9921)
```

---

### 2.6 Segurança Transversal Server-Side (Hono D1 + RBAC)
Erradicação de validações client-side frágeis (como `localStorage` ou `ScopeGuard` estático do frontend). Toda a segurança do Content OS é executada no middleware do Worker Hono (`apps/volupia-content-worker`):

- **Verificação de Token Bearer / OAuth**: Validação da sessão assinada no cabeçalho `Authorization`.
- **Perfis de Acesso (RBAC)**:
  - `Admin / Owner`: Acesso total (Criar, Editar, Gerar Mídia, Aprovar, Agendar, Publicar, Configurar Brand DNA).
  - `Editor`: Criar, Editar e Solicitante de Aprovação (não pode publicar diretamente).
  - `Viewer / Analyst`: Visualizar calendário, drawer e métricas (somente leitura).

---

### 2.7 Navegação no Cockpit V8 (3 Níveis)

1. **Visão Calendário (30 / 60 / 90 Dias)**:
   - Grade temporal de 4 a 12 semanas organizada por horários de pico.
   - Post-its visuais codificados por cor conforme a plataforma e o status (`Rascunho`, `Gerado`, `Aprovado`, `Agendado`, `Publicado`).
2. **Drawer do Conteúdo (Detalhes do Post-it)**:
   - Painel lateral ativado ao clicar no card, exibindo Intenção, Pilar DNA, Gancho, Roteiro, CTA, Capa (preview 9:16 com Safe Zones), Prompt Compilado e Controles de Mudança de Status.
3. **Biblioteca de Mídia & Brand DNA**:
   - Cockpit administrativo para gestão dos Pilares de Marca, Biblioteca de Personagens, Templates de Prompt e Histórico de Assets.

---

## 3. Matriz de Tabelas Relacionais (Cloudflare D1 / SQLite)

1. `content_posts`: Entidade principal do post.
2. `content_post_generations`: Versionamento de cada geração de mídia por post.
3. `brand_dna_pillars`: Pilares de marca e diretrizes visuais/verbais.
4. `character_library`: Personagens e referências visuais de consistência.
5. `prompt_templates`: Templates modulares do compilador.
6. `content_events`: Trilha de auditoria (quem criou, aprovou, alterou status ou publicou).
7. `content_analytics`: Telemetria e métricas de desempenho pós-publicação.

---

## 4. OODA Learning Loop

As métricas registradas na tabela `content_analytics` são vetorizadas no Qdrant (`:6352`) e realimentam o motor de sugestão de pautas. Pautas e prompts que atingiram maior conversão em Vendas Discretas/WhatsApp Direct ganham maior peso na recomendação das semanas seguintes.
