# Specification: V8 Studio AI Content OS (Master Specification)

- **Status:** Approved / Master Spec
- **Data:** 2026-08-30
- **Versão:** 1.0.0
- **Relacionado:** ADR-0220, ADR-0221, ADR-0216, ADR-0219

---

## 1. Visão Geral & Arquitetura Soberana

O **V8 Studio AI Content OS** é o estúdio de produção e automação de conteúdo visual e textual de escala industrial do ecossistema **CASOSEX**. 

Sua arquitetura é rigorosamente desacoplada entre:
1. **Engine Server (`apps/v8_studio`)**: Servidor Hono.js em V8 Isolates/Cloudflare Workers executando na porta `:7860`, responsável pelas APIs REST `/api/v1`, persistência relacional D1 (7 tabelas atômicas), streaming R2 Vault, compilador determinístico de prompts, telemetria Redis `:6396` e vetorização Qdrant `:6352`.
2. **Executive Cockpit Client (`apps/v8_studio/frontend`)**: Interface React 19 + Vite executando na porta `:5556`, minimalista (Linear-style / Dark Mode Glassmorphism) que consome o Engine via REST e oferece uma experiência de "Dashboard Calmo" orientada a intenções de negócio.

---

## 2. As 5 Engrenagens & Módulos M0–M5

```
1. INTENÇÃO & SINAIS       ➔ M1: Sinais de Mercado & Stepper de Intenção (DataForSEO / MCP)
2. CONSISTÊNCIA DE MARCA   ➔ M2: Brand DNA & Elenco Digital CASOSEX (Seeds Determinísticas)
3. GERAÇÃO DE MÍDIA HD     ➔ M3: Renderizador GPU Cinematográfico (Vast.ai / Fal.ai / Flux / SDXL)
4. CONTROLADOR DE QUALIDADE➔ M4: Gemini Vision QA & Compliance Gate (Score ≥ 85)
5. AGENDA IA & PUBLICAÇÃO  ➔ M5: Agenda IA 30/60/90 Dias & Publicador Multicanal (Instagram/TikTok)
```

### M0: Executive Overview & Canvas Visual
- **Objetivo**: Prover um painel diário calmo com resumo de atividade do estúdio, postagens programadas, saúde dos agentes e o Canvas Visual Infinito (nós customizados React Flow do Langflow modificado).

### M1: Sinais de Mercado & Stepper de Intenção
- **Objetivo**: Capturar tendências via MCP DataForSEO/Social Listening e transformar o processo de criação num Stepper intuitivo de 4 passos: `Objetivo ➔ Canal ➔ Pilar ➔ Ideia`.

### M2: Brand DNA & Elenco Digital
- **Objetivo**: Garantir consistência absoluta de marca aplicando os perfis de personagens do CASOSEX com sementes visuais (*seeds*) salvas no banco D1.

### M3: Vast.ai GPU Rendering Engine
- **Objetivo**: Despachar prompts compilados deterministicamente para instâncias de GPU em nuvem (Vast.ai / Fal.ai), gerando mídias em resolução HD com custo reduzido em >90%.

### M4: Gemini Vision QA & Compliance Gate
- **Objetivo**: Inspecionar imagens e vídeos gerados via IA multimodal (Gemini 1.5 Pro / Vision) auditando critérios de qualidade visual, enquadramento e segurança de marca antes da publicação.

### M5: Agenda IA 30/60/90 Dias & Publicação
- **Objetivo**: Organizar e agendar postagens em visão de 30/60/90 dias com publicação automatizada via Instagram Graph API e TikTok API.

---

## 3. Navegação Executiva (5 Blocos Soberanos)

| Bloco | Rota | Descrição |
| :--- | :--- | :--- |
| **OVERVIEW** | `/overview` | Painel diário calmo, métricas de estúdio e atalhos rápidos |
| **CONTENT** | `/content` | Agenda IA (30/60/90), Pipeline de postagens e Biblioteca de Mídia HD |
| **CREATIVE** | `/creative` | Studio Canvas Visual (Langflow Nodes) e Gestão do Elenco Digital |
| **INSIGHTS** | `/insights` | Performance de conteúdo, retenção e recomendações dos agentes IA |
| **SETTINGS** | `/settings` | Configurações isoladas do estúdio, chaves API e provedores |

---

## 4. Matriz de Benefícios de Inteligência

1. **Consistência Ultra-Elevada de Marca**: Sementes determinísticas eliminam deformações visuais.
2. **Custo Reduzido em >90%**: Alocação dinâmica de GPUs Vast.ai elimina custos fixos de servidores pesados.
3. **Automação de Ponta a Ponta (M0–M5)**: Redução drástica de intervenções manuais.
4. **Zero Alucinações de Marca**: Validação rigorosa pelo Gemini Vision QA (Threshold ≥ 85).
5. **Previsibilidade Operacional**: Planejamento contínuo em ondas de 30/60/90 dias.
6. **Agilidade em Tempo Real**: Conexão nativa a sinais de mercado via ferramentas MCP.
7. **Soberania Multi-Tenant**: Dados persistidos em D1 isolado com backup de mídias no Cloudflare R2 Vault.
