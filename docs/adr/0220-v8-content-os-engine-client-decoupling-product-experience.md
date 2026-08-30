# ADR-0220: Desacoplamento Arquitetural V8 Content OS Engine (Headless Hono) vs Executive Cockpit Client (UX Encapsulada)

- **Status:** Accepted
- **Data:** 2026-08-30
- **Autor:** Jeferson Amorim (Founder) & Antigravity (Engine Agent)
- **Domínio:** Arquitetura de Produto / V8 Content OS / Cockpit UX

---

## 1. Contexto

Durante o processo de consolidação e hardening do V8 Content OS (fases P1–P5 e P6), identificou-se um ruído de escopo arquitetural: o projeto em `apps/volupia-content-worker` foi originalmente tratado por intervenções anteriores como se fosse a interface visual (Cockpit), tentando injetar componentes React e layouts visuais nele.

Uma auditoria exaustiva do código-fonte em `apps/volupia-content-worker` demonstrou que ele é uma aplicação de **Backend/API Worker pura** construída sobre o framework **Hono**, utilizando bindings do Cloudflare D1 (`volupia-db`), R2 Vault (`adsentice`), KV namespaces, Redis telemétrico (`:6396`) e Qdrant (`:6352`).

Além disso, a interface de usuário apresentava jargões excessivos de engenharia (`Prompt Compiler`, `Asset Registry`, `OODA`, `BLAKE3`, `Seeds`, `Qdrant`), forçando o usuário/founder a operar o sistema como uma ferramenta de desenvolvimento, em vez de um **workspace executivo de criação e publicação de conteúdo**.

---

## 2. Decisão

Decidimos formalizar o **Desacoplamento Arquitetural Estrito** do V8 Content OS e o **Encapsulamento de Engenharia na Interface de Produto**:

### 2.1. Definição de Papéis Soberanos

1. **V8 Content OS Engine (`apps/volupia-content-worker`)**:
   - É o núcleo soberano e headless da plataforma.
   - Responsável por: Persistência relacional D1 (7 tabelas atômicas), streaming binário R2 Vault, execução determinística do compilador de prompts, emissão telemétrica Redis OODA e vetorização Qdrant.
   - **Regra Dura:** NENHUM código de interface (React, HTML, JSX, CSS) ou biblioteca visual será adicionado a este repositório/worker. Ele serve estritamente respostas JSON via API REST com suporte a versionamento (`/api/v1`, `/api/v2`).

2. **Executive Cockpit Client (Consumidor REST)**:
   - É o workspace executivo e cliente visual que consome o Engine.
   - Responsável por: Apresentar um ambiente calmo, sofisticado e orientado à intenção de negócio.
   - Habilita suporte futuro para múltiplos clientes (**Web Cockpit**, **Agentes IA autônomos**, **Mobile App**) consumindo a mesma verdade via REST.

### 2.2. Tradução de Linguagem (Engenharia ➔ Produto)

A interface do Cockpit passa a traduzir todos os conceitos técnicos sob a linguagem do negócio:

- `Prompt Compiler` ➔ **Creative** *(Visual, Personagem, Enquadramento, Roteiro)*.
- `Asset Registry` ➔ **Versions** *(Variações visuais geradas: Versão 01, Versão 02, Publicada)*.
- `Learning Loop / OODA` ➔ **Performance & AI Insights** *(Alcance, Retenção, Conversões e Recomendações)*.
- `Brand DNA` ➔ **Brand** *(Identidade, Tom de Voz, Guia Visual e Elenco Digital)*.
- `Create Post` ➔ **Criar Conteúdo** *(Stepper de Intenção: Objetivo ➔ Canal ➔ Pilar ➔ Ideia)*.
- `BLAKE3 / Seed / Hash / SQL` ➔ **Advanced (10% Power User)** *(Isolado no rodapé de gavetas técnicas)*.

### 2.3. Navegação Executiva (5 Blocos Soberanos)

```
OVERVIEW      │ Painel Executivo Diário ("Dashboard Calmo" / Atenção Necessária)
CONTENT       │ Agenda 30/60/90, Pipeline, Biblioteca de Conteúdo, Brand
COMMERCE      │ Fornecedores, Dossiês de Vendas, Polos Regionais
INSIGHTS      │ Performance de Mídia, Análise de Mercado, Recomendações dos Agentes
SETTINGS      │ Configurações de Conta, RBAC e Integrações (Isolado)
```

---

## 3. Consequências

### Positivas:
- **Segurança de Código:** O `volupia-content-worker` permanece 100% tipado (`tsc --noEmit` limpo), sem misturar dependências visuais com o runtime V8/Cloudflare Workers.
- **Redução do Ruído Cognitivo:** O Founder/Operador navega por uma interface calma de decisões de conteúdo sem se preocupar com hashing ou estruturas de banco de dados.
- **Escalabilidade Multi-Cliente:** O motor REST pode ser consumido simultaneamente por dashboards Web, aplicativos mobile ou scripts de automação.

### Mitigações:
- **Auditoria de Endpoints:** Todas as rotas REST em `volupia-content-worker` foram validadas e mapeadas para garantir que atendam 100% das demandas da nova interface executiva sem a necessidade de mudar a API.

---

## 4. Conformidade

- **Doutrina:** `medido=verdade` — Cita fontes e tipos auditados no worker.
- **Código Relacionado:** `apps/volupia-content-worker/src/index.ts`, `migrations/0001_content_os_tables.sql`, `v8_content_os_product_blueprint.md`.
