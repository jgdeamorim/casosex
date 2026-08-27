# Especificação Técnica: VM Rust Android & Bonsai Adsentice Core

## 1. Visão Geral (Spec-Driven)

A **VM Rust Android** é o substrato de execução de ultra-baixa latência do ecossistema Adsentice / V8 Cockpit para dispositivos móveis Android. Projetada sob as premissas de Doutrina `medido=verdade` e Intent-Driven SOP v3.0, a arquitetura garante isolamento soberano de dados, caching determinístico via BLAKE3 e parsing de AST em sub-milissegundos.

## 2. Componentes da Arquitetura

### 2.1. Substrato NDK & Compilação
- **Target**: `aarch64-linux-android` e `wasm32-unknown-unknown`.
- **Bibliotecas Base**: `oxc_parser` (Rust AST Fast Parser), `blake3` (Cryptographic Hasher), `redb` (Local KV Store).
- **Interface JNI/Wasm**: Exposição de funções C-ABI puras para invocação segura a partir do Android Runtime.

### 2.2. Protocolo de Comunicação IPC (Zero-Copy)
- **RingBuffer IPC**: Mapeado via Mmap em `/media/jeffer/RSXT/ast_ringbuffer.ipc`.
- **Protobuf Mesh**: Armazenamento binário de sessões (`.pb`) com redução estimada de tokens de `> 92.5%`.

### 2.3. Pipeline de Ingestão de Especificações (DevTools Console Bridge)
- **Origem dos Dados**: Interface web do ChatGPT (mensagens de arquiteto).
- **Mecanismo de Bypass CSP**: Injeção de Form-Submit com `target="_blank"` enviando dados para `http://localhost:6669/push`.
- **Servidor Bridge Local**: `tools/adsentice_bridge_server_6669.py` persistindo os eventos em `docs/spec/incremental_events/`.

## 3. Modelo de Dados & Invariantes de Código

```typescript
// Interface de Contrato de Comunicação VM Rust -> RenderContext
export interface BonsaiVmState {
  sessionId: string;
  boaScore: number;
  tokensEconomizedPercent: number;
  lastBlake3Hash: string;
  status: 'IDLE' | 'COMPUTING' | 'SYNCED' | 'ERROR';
}
```

## 4. Matriz de Rastreabilidade

| Requisito | Implementação | Validação |
|-----------|---------------|-----------|
| AST Parsing < 1ms | OXC Parser em Rust RSXT | `adsentice_ast_validate` MCP |
| Zero-Copy Session | Mmap + Protobuf `.pb` | `adsentice_token_mesh_telemetry` MCP |
| Ingestão Soberana | Bridge Server 6669 + Form-Submit | Eventos em `docs/spec/incremental_events/` |
| ADR Correspondente | `docs/adr/0199-vm-rust-android-bonsai-adsentice.md` | Auditado via SOP v3.0 |
