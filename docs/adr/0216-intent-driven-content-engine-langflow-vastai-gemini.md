# ADR-0216: Arquitetura Intent-Driven do Volúpia Content Engine no Langflow Modificado (Cockpit React + Volúpia Worker)

**Status:** Accepted  
**Data:** 30 de Agosto de 2026  
**Decisores:** Jeferson Amorim (Founder) & Antigravity AI Architecture Board  
**Contexto:** Volúpia Content OS / CASOSEX (`apps/volupia-content-worker` `:7860`, `self-essentials/langflow-main` / Volúpia Cockpit `:5556`, Redis `:6396`, Qdrant `:6352`)  
**Tags Soberanas:** `volupia-content-engine` · `intent-driven` · `langflow-modified` · `vastai` · `gemini` · `ooda-redis` · `medido=verdade`  

---

## Contexto & Motivação

Com a institucionalização bem-sucedida da infraestrutura base **Volúpia A2A (Agent-to-Agent)**, **MCP (Model Context Protocol)**, suporte a memórias e gerenciamento de fluxos no **Volúpia Cockpit** (`:5556`) e no **Worker Backend** (`:7860`), estabelece-se a arquitetura normativa do **Content Engine MVP**.

Esclarecimento fundamental: a orquestração e execução visual de nós de IA no ecossistema Volúpia/CASOSEX é realizada exclusivamente pelo **Langflow Modificado** (`self-essentials/langflow-main` no Cockpit `:5556` e `apps/volupia-content-worker` no `:7860`), e NÃO por engines externas de terceiros como ComfyUI.

Para o projeto Volúpia / BBQ Content OS, a decisão arquitetural central é que **nenhuma operação autônoma de mídia pode iniciar diretamente pela geração visual**. Toda criação deve ser fundamentada em evidências observadas e intenções estratégicas orquestradas via Custom Nodes do Langflow Modificado.

---

## Decisão Ratificada

Ratificamos as seguintes diretrizes normativas de arquitetura, contrato e pilha tecnológica para o **Volúpia Content Engine MVP**:

### 1. Doutrina Intent-Driven de Produção (Pipeline de 10 Etapas)
Toda publicação autônoma ou semi-autônoma DEVE transitar obrigatoriamente pelas seguintes fases em sequência linear e auditável:

```
Intent (Objetivo no Cockpit)
   ↓
Market Intelligence (Sinais de Busca, Redes e Reviews via DataForSEO/MCP)
   ↓
Evidence Pack (Compilação Estruturada + Confidence Score)
   ↓
Content Strategy (Hipótese Estratégica)
   ↓
Brand DNA + Reference Set (Elenco Digital & Personagens IA CASOSEX)
   ↓
Gemini Prompt Compiler (Compilação do Prompt Multimodal)
   ↓
Langflow Volúpia Worker Engine (Execução de Fluxos & Custom Nodes em GPU Vast.ai/API)
   ↓
Gemini Vision QA (Avaliação Multimodal Qualitativa)
   ↓
Approval (Aprovação no Cockpit React :5556)
   ↓
Instagram Adapter (Publicação via Meta Graph API)
   ↓
Metrics & OODA/KG Update (Realimentação do Grafo Semântico)
```

### 2. Orquestrador & Engine de Fluxos: Langflow Modificado
- **Control Plane & UI**: Cockpit React (`:5556`) baseado em `self-essentials/langflow-main`, gerenciando a criação, edição e monitoramento dos fluxos de conteúdo.
- **Execution Plane & Worker**: `apps/volupia-content-worker` (`:7860`), provendo os endpoints soberanos (`/api/v1/flows`, `/api/v1/components`, `/api/v1/mcp`, `/api/v1/a2a`, `/api/v1/memories`) e executando os Custom Nodes do Langflow.

### 3. Abstrações de Provedores e Adaptação Externa
Para impedir o acoplamento do motor de negócio com infraestruturas ou APIs de terceiros, são estabelecidas duas interfaces de abstração normativas integradas como Custom Nodes do Langflow:

#### A. `GenerationProvider` (Renderização multimídia)
Isola o motor de geração de mídia invocado pelos nós do Langflow (operando em GPU Vast.ai ou APIs terceiras):
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

### 4. Stack Oficial do MVP Selada
- **Orquestrador de Fluxos & UI**: **Langflow Modificado** (`self-essentials/langflow-main` + `apps/volupia-content-worker`).
- **Orquestrador LLM & QA**: **Gemini Multimodal** (Síntese de Evidence Pack, Prompting, Gemini Vision QA e Legendagem).
- **Intelligence & State**: **OODA-Redis** (`:6396`) + **Semantic Knowledge Graph** (Qdrant `:6352`) + **Intent Engine**.
- **Infraestrutura GPU**: **Vast.ai** sob a interface `GenerationProvider` executada por Custom Nodes.
- **Canal Social MVP**: **Instagram Graph API** em formato **Reel 9:16 (1080x1920)**.
- **Armazenamento Transacional & Blobs**: **PostgreSQL** (metadados transacionais) e **S3-Compatible Object Storage** (assets brutos e finais).

---

## Consequências Medidas (`medido=verdade`)

- **Paridade Total com o Cockpit**: Os fluxos intent-driven são editáveis e visualizáveis diretamente na interface do Cockpit React (`:5556`), aproveitando toda a biblioteca de Custom Nodes do Langflow Modificado.
- **Auditabilidade Total**: Daqui a 6 meses será possível responder com precisão *por que* qualquer Reel foi produzido, citando o `Evidence Pack` e a `Strategic Hypothesis` originais.
- **Portabilidade de GPU**: A troca da infraestrutura GPU (ex: Vast.ai para RunPod ou local) exige apenas a atualização da configuração no Custom Node `GenerationProvider`, sem tocar no frontend ou no worker.

---
*ADR-0216 atualizada, aprovada e institucionalizada no Langflow Modificado em 30/08/2026.*
