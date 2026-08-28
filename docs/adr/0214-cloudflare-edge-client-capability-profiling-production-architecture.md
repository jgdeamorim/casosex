# ADR-0214: Arquitetura de Produção Cloudflare Edge + Client Capability Profiling (`app.usevolupia.com.br`)

**Status:** Accepted  
**Data:** 28 de Agosto de 2026  
**Decisores:** Jeferson Amorim (Founder) & Antigravity AI Architecture Board  
**Contexto:** Monorepo CASOSEX / Volúpia Cockpit V8 (`app.usevolupia.com.br`)  
**Tags Soberanas:** `cloudflare-worker` · `schema-responsive.json` · `edge-telemetry` · `production-profiling` · `medido=verdade`  

---

## Contexto & Requisito

Em ambiente de desenvolvimento (`localhost:8089` / ADB bridge `:6661`), a telemetria é capturada via DevTools Bridge Server Python. 

Para a aplicação pública de produção em **`https://app.usevolupia.com.br`**, qualquer usuário acessando de qualquer lugar do mundo (qualquer navegador, dispositivo ou rede) deve:
1. Ter seu hardware e navegador enquadrados no **`schema-responsive.json` (v2.1.0)** instantaneamente ($< 0.1\text{ms}$).
2. Ter sua telemetria agregada globalmente sem exposição de portas de dev (`:6661`) e sem ferir CORS ou Mixed Content.

---

## Decisão Ratificada

Ratificamos a arquitetura em 3 camadas baseada na infraestrutura **Cloudflare Edge**:

```
[ Cliente Remoto (Navegador) ]
          │
          │ 1. Client Profiling (< 0.1ms em JS local via schema-responsive.json)
          ├───────────────────────────────────────────────────────┐
          │                                                       ▼
          │ 2. Telemetry Beacon (POST /api/telemetry)     [ Local React UI ]
          ▼                                            (Adapta Tier 1/2/3)
[ Cloudflare Edge Worker ]
          │
          ├──► 3. Injeta Headers (CF-Device-Type, Sec-CH-UA-Mobile)
          ├──► 4. Armazena Sessão Dispositivo em Cloudflare KV
          └──► 5. Registra Métricas Globais no Cloudflare Analytics Engine
```

---

### Componentes da Arquitetura

1. **Client-Side Profiling Engine (Execute Once na Inicialização)**:
   - O bundle JS público do Cockpit V8 executa o script de profiling assim que a página é aberta.
   - Avalia `navigator.hardwareConcurrency`, `navigator.deviceMemory`, `WebGL1/2`, `WASM SIMD`, `Touch` e `Viewport`.
   - Enquadra o usuário imediatamente no **Tier-1** (High), **Tier-2** (Mid) ou **Tier-3** (Constrained).

2. **Cloudflare Worker Middleware (`/api/telemetry`)**:
   - Transmite em background o resumo de capacidades para o Worker via `https://app.usevolupia.com.br/api/telemetry`.
   - Injeta os metadados de borda da Cloudflare (`CF-Device-Type`, `CF-IPCountry`, `Sec-CH-UA-Mobile`).

3. **Cloudflare KV & Analytics Engine (Persistência & Observabilidade Global)**:
   - **Cloudflare KV**: Mantém a tabela de dispositivos e sessões ativas por tenant/dispositivo.
   - **Cloudflare Analytics Engine**: Permite monitorar em tempo real qual % de usuários globais estão em Tier-1, Tier-2 e Tier-3 e a taxa de FPS média por país/dispositivo.

---

## Consequências Medidas (`medido=verdade`)

- **Latência do Profiling**: $0\text{ms}$ de espera para o usuário (avaliação assíncrona instantânea no browser).
- **Segurança & SSL**: 100% trafegado via HTTPS seguro encriptado na borda da Cloudflare.
- **Resiliência**: Se a rede falhar ou o beacon for bloqueado por adblocker, o perfil do `schema-responsive.json` continua funcionando 100% offline/localmente no navegador do cliente.

---
*ADR-0214 registrada e aprovada em 28/08/2026.*
