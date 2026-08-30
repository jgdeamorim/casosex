# ADR-0216: Arquitetura Intent-Driven do Volúpia Content Engine e Stack MVP (ComfyUI + Vast.ai + Gemini)

**Status:** Accepted  
**Data:** 30 de Agosto de 2026  
**Decisores:** Jeferson Amorim (Founder) & Antigravity AI Architecture Board  
**Contexto:** Volúpia Content OS / CASOSEX (`apps/volupia-content-worker`, Volúpia Cockpit `:5556`, Redis `:6396`, Qdrant `:6352`)  
**Tags Soberanas:** `volupia-content-engine` · `intent-driven` · `comfyui` · `vastai` · `gemini` · `ooda-redis` · `medido=verdade`  

---

## Contexto & Motivação

Com a institucionalização bem-sucedida da infraestrutura base **Volúpia A2A (Agent-to-Agent)**, **MCP (Model Context Protocol)** e suporte de memórias e fluxos no **Volúpia Cockpit** (`:5556`) e no **Worker Backend** (`:7860`), estabeleceu-se a necessidade de formalizar a arquitetura soberana do **Content Engine (MVP)**.

Historicamente, plataformas de geração de mídia falham por acoplar chamadas diretas a APIs de geração de imagens/vídeos sem grounding prévio de mercado, resultando em produções desconectadas das demandas de audiência e sem auditabilidade estratégica.

Para o projeto Volúpia / BBQ Content OS, a decisão arquitetural central é que **nenhuma operação autônoma de mídia pode iniciar diretamente pela geração visual**. Toda criação deve ser fundamentada em evidências observadas e intenções estratégicas.

---

## Decisão Ratificada

Ratificamos as seguintes diretrizes normativas de arquitetura, contrato e pilha tecnológica para o **Volúpia Content Engine MVP**:

### 1. Doutrina Intent-Driven de Produção (Pipeline de 10 Etapas)
Toda publicação autônoma ou semi-autônoma DEVE transitar obrigatoriamente pelas seguintes fases em sequência linear rastreável:

```
Intent (Objetivo)
   ↓
Market Intelligence (Sinais de Busca, Redes e Reviews via DataForSEO/MCP)
   ↓
Evidence Pack (Compilação Estruturada + Confidence Score)
   ↓
Content Strategy (Hipótese Estratégica)
   ↓
Bruno + Reference Set (Modelos de Identidade e Personagem)
   ↓
Gemini Prompt Compiler (Compilação do Prompt Multimodal)
   ↓
ComfyUI / Vast.ai (Renderização de Imagem/Vídeo 9:16)
   ↓
Gemini Vision QA (Avaliação Multimodal Qualitativa)
   ↓
Approval (Aprovação no Cockpit React :5556)
   ↓
Instagram Adapter (Publicação via Meta Graph API)
   ↓
Metrics & OODA/KG Update (Realimentação do Grafo Semântico)
```

### 2. Abstrações de Provedores e Adaptação Externa
Para impedir o acoplamento do motor de negócio com infraestruturas ou APIs de terceiros, são estabelecidas duas interfaces de abstração normativas:

#### A. `GenerationProvider` (Renderização multimídia)
Isola o motor de geração de mídia. Implementação inicial: `ComfyUIProvider` operando em instâncias GPU da Vast.ai (ou RunPod/Local).
- `createJob(params: GenerationJobParams): Promise<GenerationJob>`
- `getJobStatus(jobId: string): Promise<JobStatus>`
- `getResult(jobId: string): Promise<GeneratedAsset>`
- `cancelJob(jobId: string): Promise<void>`
- `healthCheck(): Promise<boolean>`

#### B. `InstagramAdapter` (Integração Social)
Isola a publicação e métricas no Meta Graph API:
- `createMediaContainer(assetUrl: string, caption: string): Promise<ContainerId>`
- `publishMedia(containerId: string): Promise<PublicationResult>`
- `getMedia(mediaId: string): Promise<MediaDetails>`
- `getInsights(mediaId: string): Promise<MediaMetrics>`

### 3. Stack Oficial do MVP Selada
- **Orquestrador LLM & QA**: **Gemini Multimodal** (Síntese de Evidence Pack, Prompting, Gemini Vision QA e Legendagem).
- **Intelligence & State**: **OODA-Redis** (`:6396`) + **Semantic Knowledge Graph** (Qdrant `:6352`) + **Intent Engine**.
- **Motor Multimídia**: **ComfyUI** com workflows JSON versionados em repositório (`comfyui/workflows/bruno-reel-9x16.json`).
- **Infraestrutura GPU**: **Vast.ai** sob a interface `GenerationProvider`.
- **Canal Social MVP**: **Instagram Graph API** em formato **Reel 9:16 (1080x1920)**.
- **Armazenamento Transacional & Blocs**: **PostgreSQL** (metadados transacionais) e **S3-Compatible Object Storage** (assets brutos e finais).

### 4. Modelo Semântico de Entidades no KG
As decisões de conteúdo devem ser persistidas com nós diferenciados no Grafo de Conhecimento (`tag=casosex` / `tag=volupia`):
`MarketSignal` → `MarketTrend` → `Audience` → `ContentOpportunity` → `Hypothesis` → `Experiment` → `Outcome` → `Strategy`.

### 5. Escopo Deliberado Fora do MVP
Ficam explicitamente postergados para versões posteriores: DeepSeek (árbitro cost-capped), Higgsfield/Seedance APIs, Temporal, Flow Builder visual completo (clone n8n), conectores X/YouTube/Blog e Multi-Agent complexo.

---

## Consequências Medidas (`medido=verdade`)

- **Auditabilidade Total**: Daqui a 6 meses será possível responder com precisão *por que* qualquer Reel foi produzido, citando o `Evidence Pack` e a `Strategic Hypothesis` originais.
- **Portabilidade de GPU**: A troca do backend de geração (ex: Vast.ai para RunPod ou local) exige zero alterações na camada de aplicação do Cockpit ou no Worker.
- **Garantia de Qualidade Visual**: O `Gemini Vision QA` atua como barreira de segurança prevenindo renderizações distorcidas ou fora do tom de marca antes da aprovação humana.

---
*ADR-0216 registrada, aprovada e institucionalizada em 30/08/2026.*
