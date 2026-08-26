# Inspiração: Docker Alpine Pure Rust (Adsentice / Micro-Wrangler)

Este repositório de inspiração define a receita soberana para execução do **Antigravity-Router + Micro-Wrangler Deployer** dentro de 1 único container Alpine Linux em Rust, cumprindo as diretrizes da **ADR-0016** (Hetzner CAX11 $5.39/mês) e **ADR-0207** (Execução em Modo Duplo Host/Alpine).

---

## 📐 Especificações de Recursos:

- **Imagem Base**: `alpine:3.20` + `rust:1.80-alpine` (Multi-stage build).
- **Tamanho da Imagem Final**: ~28 MB.
- **Consumo de Memória RAM**: < 90 MB (Cota máxima 200 MB).
- **Latência I/O**: < 0.1 ms (redb zero-copy) + D1 Local Emulator SQLite.
- **Portas Expostas**:
  - `8787`: Hono Edge API / Router REST.
  - `6396`: Redis IPC / OODA State.

---

## 🛠️ Como Executar via Docker CLI:

```bash
# 1. Build da imagem soberana
docker build -t adsentice-alpine-rust:latest -f Dockerfile .

# 2. Execução com volume persistente em /data
docker run -d \
  --name adsentice-router-engine \
  --memory=200m \
  -p 8787:8787 \
  -p 6396:6396 \
  -v $(pwd)/data:/data \
  adsentice-alpine-rust:latest
```

---

## 📄 docker-compose.yml de Referência:

```yaml
version: '3.8'

services:
  adsentice-router:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: adsentice-router-engine
    restart: unless-stopped
    ports:
      - "8787:8787"
      - "6396:6396"
    volumes:
      - ./data:/data
    environment:
      - RUST_LOG=info
      - TARGET_ENV=dev
      - REDIS_HOST=127.0.0.1
      - REDIS_PORT=6396
    deploy:
      resources:
        limits:
          memory: 200M
```
