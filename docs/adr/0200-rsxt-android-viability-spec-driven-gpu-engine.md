# ADR-0200: Arquitetura de Reconstrução e Análise de Experiência Mobile `rsxt-android` & Eliminação do Veto #4

* **Status**: Aceito (Accepted) / Refatorado
* **Data**: 27 de Agosto de 2026
* **Autores**: Founder Jeferson Amorim & Antigravity AI Engine (Google DeepMind)
* **Substrato**: Rust (`rsxt-android`) · Tokio (Async Runtime) · Redb (L1 MVCC KV Store) · WGPU (Vulkan / GLES3 GPU Backend) · Slint (Declarative GUI Engine) · Qdrant (`tag=app-jury`, `tag=app-mercadopago`)
* **Doutrina**: `medido=verdade` · Intent-Driven (ADR-0054) · Token Economy (ADR-0082) · Superação do Veto #4

---

## 1. Contexto & Problema Refatorado

Historicamente, o **Veto #4** da arquitetura V8 Cockpit / Adsentice estipulava que o acúmulo de especificações em YAML/JSON (`docs/spec/mobile-app-first/`) não alterava a interface do usuário sem a codificação manual e direta de componentes React/TSX.

Ademais, decompiladores e analisadores estáticos tradicionais de APK (Smali/XML AST) fornecem apenas evidências estruturais parciais. Para obter uma auditoria e reconstrução fiéis de experiência mobile em hardware de custo limitado (Intel Core i5 / Aspire 5), o projeto evolui de um simples analisador estático para uma **Runtime Experience Engine** nativa em GPU.

---

## 2. Decisão Arquitetural: Reconstrução & Análise de Experiência Mobile

Consolidamos o motor nativo **`rsxt-android`** como uma engine de reconstrução e análise de experiência baseada na divisão entre **Evidência Estática** e **Evidência de Runtime**:

```
                         rsxt-android
                              │
              ┌───────────────┴────────────────┐
              │                                │
        STATIC EVIDENCE                   RUNTIME EVIDENCE
              │                                │
     ┌────────┼────────┐              ┌────────┼──────────┐
     │        │        │              │        │          │
   APK      Smali     XML          Screen    Input      Frame
   DEX      Kotlin   Assets        State     Gesture    Motion
   Res      Manifest Resources     Event     Timing     Effect
     │        │        │              │        │          │
     └────────┴────────┘              └────────┴──────────┘
              │                                │
              └──────────────┬─────────────────┘
                             ▼
                      KNOWLEDGE GRAPH
                             │
                 ┌───────────┴───────────┐
                 │                       │
              redb                  Qdrant
          identidade/state        semântica
          relationships           embeddings
          BLAKE3                  metadata
                 │                       │
                 └───────────┬───────────┘
                             ▼
                          AI UX
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   Design DNA          Interaction DNA       Motion DNA
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ▼
                    Runtime Experience DNA
```

---

## 3. Divisão Estrita de Responsabilidades Técnicas

Para evitar acoplamentos indevidos e garantir previsibilidade no loop de frames, estabelecemos a separação clara entre a orquestração I/O, o estado da interface e o renderizador GPU:

```
          Tokio
            │
       Async Control
            │
            ▼
      Runtime State
            │
            ▼
          Slint
            │
      UI / Animation
            │
            ▼
       GPU Renderer
            │
            ▼
          WGPU
```

* **Tokio (Async Control & Substrate)**:
  Responsável por ingestão de arquivos, I/O assíncrono no filesystem, comunicação com Qdrant/Redis, gerenciamento de banco `redb`, processamento de eventos assíncronos e envio de telemetria.
* **Slint (Declarative UI & Animations)**:
  Responsável pelo estado da UI, cálculo de layouts declarativos, animações nativas, timers e manipulação de entrada de usuário (input).
* **WGPU (GPU Backend & Rasterization)**:
  Responsável por recursos de GPU, compilação de shaders WGSL, pipeline de renderização, texturas e composição final de frames.

---

## 4. Classificação Estrita de Conhecimento no Knowledge Graph

Para evitar misturar fatos mensuráveis com inferências geradas por LLM, a engine armazena evidências no Knowledge Graph categorizadas por quatro níveis de granularidade:

1. `OBSERVED`: Dados brutos de tempo de execução (ex: `transition.duration = 280ms`, `tap_latency = 37ms`, `frame_drops`).
2. `EXTRACTED`: Propriedades estruturais extraídas do APK/Smali/Res (ex: `button.background = #009EE3`, `layout_width = match_parent`).
3. `INFERRED`: Classificações eurísticas por IA (ex: `interaction.feedback = "strong"`).
4. `AI_ASSESSMENT`: Diagnósticos consolidados de UX (ex: `discoverability = 0.87`, `interaction_friction = 0.21`, `motion_consistency = 0.91`).

---

## 5. Diretrizes de Desempenho e Persistência (`medido=verdade`)

* **Banco `redb`**:
  O `redb` provê leituras zero-copy (quando aplicáveis), MVCC, transações ACID e persistência local de baixa latência. A garantia de latência **não será afirmada como `< 0.1ms` incondicional**, devendo ser aferida através de **benchmarks p95/p99 obrigatórios** no hardware alvo (Intel Core i5).
* **Lazy Loading de Telas (1.012 Screens)**:
  Catalogar 1.012 telas no `redb` não implica alocar 1.012 objetos pesados na GPU. O fluxo de carregamento segue:
  $$\text{redb} \longrightarrow \text{Screen Catalog} \longrightarrow \text{Lazy Load} \longrightarrow \text{Screen Runtime Model} \longrightarrow \text{Slint} \longrightarrow \text{WGPU}$$
  Permanecem na GPU apenas a tela ativa, o estado de transição imediata (previous/next) e os assets estritamente necessários.

---

## 6. Viewport Profiles & MaterialDNA

### 6.1. Perfis de Viewport (`ViewportProfile`)
O tamanho `390x844px` passa a ser o benchmark padrão de smartphone, integrado a uma estrutura de perfis adaptativos:
* `MobileSmall` (390x844px)
* `MobileLarge`
* `Tablet`
* `Desktop`

Cada perfil carrega metadados dinâmicos de `width`, `height`, `dpi`, `scale_factor`, `orientation`, `safe_area` e `input_model`.

### 6.2. MaterialDNA
Em vez de copiar especificações proprietárias, a engine define o `MaterialDNA` via shaders WGSL abertos, capturando propriedades observáveis:
```json
{
  "opacity": 0.72,
  "blur_radius": 18,
  "saturation": 1.12,
  "border_alpha": 0.18,
  "elevation": 4,
  "interaction_response": "dynamic"
}
```

---

## 7. Roadmap de Execução da Engine em 6 Fases

1. **Fase 1 — Viewport Engine**: Profiles adaptativos (`390x844`), responsividade, safe areas e orientação.
2. **Fase 2 — Runtime Interaction**: Eventos de tap, swipe, drag, scroll, back button e rotas de navegação.
3. **Fase 3 — Motion Capture**: Captura e simulação de transições, duration, easing, física de springs, opacity e scale.
4. **Fase 4 — GPU Material**: Pipeline WGPU + WGSL para blur, glass, sombras, refração e composição visual.
5. **Fase 5 — Experience Graph**: Fusão do Static Graph com o Runtime Graph alimentando `redb` e Qdrant.
6. **Fase 6 — AI UX Analyst**: Agente IA consumindo o Experience Graph para emissão de relatórios de Design DNA, Interaction DNA e Motion DNA.

---

## 8. Status de Auditoria & Trilha Git

* **Commit Crate Code**: `691c055` (`feat(rsxt-android): implement native rust tokio redb slint gpu engine & probe agent`)
* **Commit ADR Baseline**: `de2de0af3`
* **Commit ADR Refactored Specification**: Atualizado nesta sessão.
* **Arquivos Canônicos**: 
  - [`docs/adr/0200-rsxt-android-viability-spec-driven-gpu-engine.md`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/adr/0200-rsxt-android-viability-spec-driven-gpu-engine.md)
  - [`crates/rsxt-android/src/main.rs`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/rsxt/crates/rsxt-android/src/main.rs)
  - [`crates/rsxt-android/src/redb_store.rs`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/rsxt/crates/rsxt-android/src/redb_store.rs)
  - [`crates/rsxt-android/ui/app_window.slint`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/rsxt/crates/rsxt-android/ui/app_window.slint)
* **Qdrant Key**: Tag `adsentice`, `app-jury`, `app-mercadopago` em `claude-memory`
* **Redis State**: `adsentice:ooda:stage:act` -> `SELADO v12`
* **BOA Score**: `0.9091` (`EXCELLENT`)
