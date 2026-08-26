# ==============================================================================
# Dockerfile Alpine Pure Rust — Substrato Soberano Adsentice / Micro-Wrangler
# Multi-stage build ultra-compacto (< 30MB imagem final, < 90MB RAM execution)
# Ref: ADR-0016 (CAX11 $5.39/mês) & ADR-0207 (Mode Duplo Host/Alpine)
# ==============================================================================

# STAGE 1: Builder (Rust + Alpine + MUSL)
FROM rust:1.80-alpine AS builder

# Pacotes de compilação C/C++ leves para crates nativas (redb, rusqlite, tokio)
RUN apk add --no-cache musl-dev gcc g++ make sqlite-dev pkgconfig openssl-dev

WORKDIR /app

# Copia arquivos de build
COPY Cargo.toml Cargo.lock ./
COPY src ./src

# Compilação Release nativa estática (musl)
RUN cargo build --release --target x86_64-unknown-linux-musl

# ==============================================================================
# STAGE 2: Runtime Mínimo (Alpine Pure < 30MB)
# ==============================================================================
FROM alpine:3.20

# Dependências de runtime essenciais
RUN apk add --no-cache ca-certificates tzdata sqlite-libs libgcc

WORKDIR /app

# Copia o binário compilado em Rust do stage builder
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/antigravity-router /app/antigravity-router

# Cria os diretórios de persistência para redb e SQLite D1
RUN mkdir -p /data/redb /data/d1 && chmod -R 755 /data

# Variáveis de Ambiente Padrão
ENV RUST_LOG=info \
    REDIS_HOST=127.0.0.1 \
    REDIS_PORT=6396 \
    DATA_DIR=/data \
    TARGET_ENV=dev

# Expõe as portas de comunicação:
# 8787: Hono Edge API / Worker Local
# 6396: Redis IPC / State OODA
EXPOSE 8787 6396

# Volume Persistente para o banco redb e casosex_local.sqlite
VOLUME ["/data"]

# Entrypoint soberano
ENTRYPOINT ["/app/antigravity-router"]
