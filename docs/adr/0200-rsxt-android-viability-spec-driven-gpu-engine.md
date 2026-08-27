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

## 2. Decisão Arquitetural: Reconstrução Intermediária & Análise 1:1 de Experiência Mobile

Rejeitamos a abordagem ingênua `Smali ➡️ Rust ➡️ APK ➡️ Tela` (que tenta recompilar os 18 diretórios Smali e falha em fidelidade 1:1). Consolidamos a arquitetura de **Representação Intermediária (IR)** em pipeline:

```
                 APK / DECOMPILED
                        │
                        ▼
                 rsxt-ingestor
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
       Smali           RES          Manifest
   (DexSet 1..18)  (Resource IR)    (App IR)
          │             │              │
          └─────────────┼──────────────┘
                        ▼
                 App Knowledge Graph
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
             redb               Qdrant
          identidade          semântica
          BLAKE3              embeddings
              │                   │
              └─────────┬─────────┘
                        ▼
                   App Runtime
                      Model
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
         Interaction             Motion
             │                     │
             └──────────┬──────────┘
                        ▼
                  Slint + WGPU
                        │
                        ▼
                ┌───────────────┐
                │   Smartphone  │
                │    390×844    │
                └───────────────┘
                        │
                        ▼
                    AI UX
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
          Design      Motion    Interaction
            DNA         DNA        DNA
```

---

## 3. Os 4 Níveis da Experiência 1:1

Para alcançar fidelidade absoluta de experiência sem executar um emulador Android pesado, dividimos a reconstrução em 4 camadas estruturadas:

1. **Nível 1 — Estrutura**: `Activity`, `Fragment`, `View`, `Button`, `TextView`, `ImageView`, `RecyclerView`, `Layout`.
2. **Nível 2 — Visual**: Posição, largura, altura, padding, margin, cor, fonte, radius, shadow, imagem, ícone.
3. **Nível 3 — Estado**: `pressed`, `focused`, `selected`, `disabled`, `loading`, `expanded`, `collapsed`, `checked`.
4. **Nível 4 — Comportamento**: `tap`, `swipe`, `scroll`, `drag`, `navigation`, `transition`, `animation`, `feedback`.

---

## 4. Modos de Operação da Engine (`rsxt-android`)

### 4.1. Modo A — Static Reconstruction
Ingere estaticamente `smali/` (DexSet 1..18), `res/`, `assets/`, `AndroidManifest.xml` e gera o `AppModel`:

```rust
pub struct ScreenModel {
    pub id: String,
    pub name: String,
    pub components: Vec<ComponentSpec>,
    pub transitions: Vec<TransitionSpec>,
}

pub struct ComponentSpec {
    pub id: String,
    pub component_type: ComponentType,
    pub bounds: Rect,
    pub style: StyleSpec,
    pub states: Vec<ComponentState>,
}
```

### 4.2. Modo B — Runtime Reconstruction
Registra e simula eventos de entrada, timing e transição de estado, registrando a trilha de execução diretamente no Knowledge Graph:

```rust
pub struct InteractionTrace {
    pub screen_id: String,
    pub component_id: String,
    pub event: InteractionEvent,
    pub timestamp_ns: u64,
    pub duration_ns: u64,
}
```

---

## 5. Divisão Estrita de Responsabilidades Técnicas

```
          Tokio (Async Control, I/O, redb, Qdrant)
            │
            ▼
       App Runtime Model (State, InteractionTrace)
            │
            ▼
       Slint (Declarative UI & Component State)
            │
            ▼
       WGPU (Vulkan / DX12 / OpenGL GPU Backend)
```

---

## 6. Otimização de Recursos no Aspire 5 (`medido=verdade`)

* **Lazy Loading de VRAM**: Catalogar 1.012 telas no `redb` não aloca 1.012 telas na GPU.
  $$\text{1.012 telas catalogadas no redb} \neq \text{1.012 telas renderizadas na VRAM}$$
  Permanecem na VRAM apenas: `ScreenModel` ativa + `Transition` (anterior/próxima) + `Assets` do frame corrente.
* **Backend de GPU Selecionável**: WGPU orquestra o backend via variável `WGPU_BACKEND` (`Vulkan` no Linux, `DX12` no Windows, `OpenGL` fallback).

---

## 7. Status de Auditoria & Trilha Git

* **Commit Crate Code**: `c481b66` (`feat(rsxt-android): add 5 ViewportProfiles comparison benchmarks and MaterialDNA struct`)
* **Commit ADR Baseline**: `de2de0af3`
* **Commit ADR Refactored Specification**: Atualizado com pipeline IR 1:1 e Modos A/B.
* **Arquivos Canônicos**: 
  - [`docs/adr/0200-rsxt-android-viability-spec-driven-gpu-engine.md`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/adr/0200-rsxt-android-viability-spec-driven-gpu-engine.md)
  - [`crates/rsxt-android/src/main.rs`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/rsxt/crates/rsxt-android/src/main.rs)
  - [`crates/rsxt-android/src/redb_store.rs`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/rsxt/crates/rsxt-android/src/redb_store.rs)
  - [`crates/rsxt-android/ui/app_window.slint`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/rsxt/crates/rsxt-android/ui/app_window.slint)
* **Qdrant Key**: Tag `adsentice`, `app-jury`, `app-mercadopago` em `claude-memory`
* **Redis State**: `adsentice:ooda:stage:act` -> `SELADO v16`
* **BOA Score**: `0.9091` (`EXCELLENT`)



