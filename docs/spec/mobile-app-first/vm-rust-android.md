# Especificação Técnica: VM Rust Android & RSXT-Android Engine

## 1. Visão Geral & Quebra do Veto #4 (Spec-to-Code Realtime Engine)

A **VM Rust Android (`rsxt-android`)** evolui o conceito de especificações estáticas no ecossistema Adsentice / V8 Cockpit. 

Historicamente, o **Veto #4** definia que conter 10 artefatos YAML/JSON em `docs/spec/mobile-app-first/` não alterava a interface sem a escrita manual de componentes `.tsx`. Com o **`rsxt-android`** (baseado no trifólio de arquiteturas `rsxt-engine` [tag: `oxibonsai-27b`], `rsxt-v0k3` [tag: `astro-emdash`] e agora `rsxt-android` [tag: `APP-MERCADOPAGO`]), o motor em **Rust + Tokio + Redb + WGPU + Slint** consome a árvore de especificações compilada em `redb` e renderiza nativamente na GPU (via WGPU/Slint), **eliminando o Veto #4 definitivamente**.

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │       10 Artefatos Sintetizados (docs/spec/mobile-app-first/)           │
  │ ├── 8.122 Strings PT-BR          ├── 4.308 Árvores de Layout           │
  │ ├── 5.868 Tokens Spacing/Dimens   ├── 895 Deep Links & 1.012 Rotas     │
  │ └── Matriz Andes UI Tokens       └── master-design-system.json         │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │ Ingestão Redb Zero-Copy (< 0.1ms)
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ Engine rsxt-android [tag: APP-MERCADOPAGO] (Rust+Tokio+Redb+WGPU+Slint)│
  │ ├── Tokio Async Runtime          ├── Redb Embedded KV L1 Caching       │
  │ ├── WGPU Graphics Substrate      └── Slint Declarative GUI Compiler    │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │ Renderização Nativa Direta na GPU
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │       Interface Android / Desktop Viva (Zero Transpilação TS/JSX)      │
  └────────────────────────────────────────────────────────────────────────┘
```

## 2. Trilogia da Família RSXT

1. **`rsxt-engine`** (`tag=oxibonsai-27b`): Motor Cérebro/LLM Local soberano em Rust zero-FFI para geração e síntese.
2. **`rsxt-v0k3`** (`tag=astro-emdash`): Substrato de publicação estática e gestão resiliente de CMS/SSG.
3. **`rsxt-android`** (`tag=APP-MERCADOPAGO`): VM Executável de Interface Nativa (Rust + Tokio + Redb + WGPU + Slint) para Android (`aarch64-linux-android`) e Desktop.

## 3. Componentes da Arquitetura `rsxt-android`

### 3.1. Stack Tecnológica Core
- **Runtime Async**: `tokio` (orquestração concorrente de I/O, IPC e eventos touch).
- **Embedded Persistence L1**: `redb` (carregamento instantâneo do `master-design-system.json` em sub-milissegundo).
- **Graphics & Pipeline Hardware**: `wgpu` (aceleração gráfica via Vulkan / GLES3 no Android).
- **GUI Engine Declarativa**: `slint` (compilação de layouts nativos a partir da árvore `component-routes-metadata.yaml` e `andes-ui-tokens.yaml`).

### 3.2. Protocolo de Comunicação IPC (Zero-Copy)
- **RingBuffer IPC**: Mapeado via Mmap em `/media/jeffer/RSXT/ast_ringbuffer.ipc`.
- **Protobuf Mesh**: Armazenamento binário de sessões (`.pb`) com economia estimada de tokens `> 92.5%`.

### 3.3. Consumo dos 10 Artefatos Sintetizados
1. `index.yaml`: Índice Mestre v3.0.0.
2. `deep-links-routes.yaml`: 895 URIs e 1.012 Telas mapeadas no Tokio Router.
3. `micro-copy-ptbr.yaml`: 8.122 Strings em PT-BR injetadas diretamente na UI Slint.
4. `andes-ui-tokens.yaml`: Cores, elevações e tipografia mapeadas em estilos Slint.
5. `assets-catalog.yaml`: 792 SVGs + 201 Imagens rasterizadas via WGPU Texture Pipeline.
6. `component-routes-metadata.yaml`: 4.308 Árvores de Layout transformadas em Slint Components.
7. `interactive-states-actions.yaml`: Física de gestos e toques processada no Tokio Event Loop.
8. `dimens-spacing.yaml`: 5.868 Dimensões compiladas estaticamente.
9. `motion-animations.yaml`: Interpolação de Animação e Lotties direto em Shader WGPU.
10. `master-design-system.json`: Bundled Schema Zero-Copy.

## 4. Modelo de Dados & Invariantes de Código

```rust
// Invariante de Estado do Engine rsxt-android em Rust
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct RsxtAndroidState {
    pub session_id: String,
    pub boa_score: f32,
    pub redb_hit_rate: f32,
    pub active_route: String,
    pub rendered_components_count: usize,
    pub status: RsxtEngineStatus,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum RsxtEngineStatus {
    Idle,
    WgpuInitializing,
    SlintRendering,
    Synced,
    Error(String),
}
```

## 5. Matriz de Rastreabilidade

| Requisito | Implementação | Validação |
|-----------|---------------|-----------|
| Superação do Veto #4 | WGPU + Slint Direct Render dos 10 Artefatos | Pipeline `rsxt-android` |
| Caching de Especificação | Redb Store (`< 0.1ms` hit) | `adsentice-blake3-kv-cache` |
| Zero-Copy Session | Mmap + Protobuf `.pb` | `adsentice_token_mesh_telemetry` MCP |
| Pipeline Ingestão | Bridge Server 6669 + Form-Submit | Eventos em `docs/spec/incremental_events/` |
| ADR Correspondente | `docs/adr/0199-vm-rust-android-bonsai-adsentice.md` | Auditado via SOP v3.0 |

