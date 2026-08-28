# ADR-0212: Schema Soberano de Detecção e Profiling Responsivo de Hardware & Browser (`schema-responsive.json`)

**Status:** Accepted  
**Data:** 28 de Agosto de 2026  
**Decisores:** Jeferson Amorim (Founder) & Antigravity AI Architecture Board  
**Contexto:** Monorepo CASOSEX / Volúpia Cockpit V8 (`apps/cockpit/src`)  
**Tags Soberanas:** `schema-responsive.json` · `app-jury` · `hardware-profiling` · `mode:mobile` · `medido=verdade`  

---

## Contexto & Problema

Para simular e entregar uma experiência B2B de altíssima performance para qualquer usuário acessando a aplicação em `:8089` de qualquer dispositivo no planeta, a renderização do Cockpit V8 precisa ir além do simples breakpoint de largura de tela (`min_width` / `max_width`).

É necessário profilar e mapear dinamicamente as **capacidades de hardware e APIs do navegador**, tais como:
1. Capacidade de aceleração GPU (WebGL 1/2 e WebGPU).
2. Instruções aceleradas por hardware no cliente (WASM + WASM SIMD).
3. Capacidade de multithreading (Web Workers, Shared Workers).
4. Persistência de alta performance no cliente (OPFS, IndexedDB, Quota Storage).
5. Preferências de cor, contraste, gamut (sRGB / Display P3 / Rec2020) e HDR.
6. Tipos de entrada e gestos (Touch Targets $\ge 44\text{px}$, Pointer Events, Sensor Motion).

---

## Decisão Ratificada

Ratificamos o estabelecimento do **`schema-responsive.json` (v2.0.0)** na árvore `apps/cockpit/src/seeds/`, com as seguintes regras de orquestração:

1. **Classificação em 3 Tiers de Hardware (Hardware Tier Matrix)**:
   - **Tier 1 (High Performance)**: CPU $\ge 8$ cores, RAM $\ge 8\text{ GB}$, WebGL2/WebGPU. Habilita Glassmorphism 16px, animações 60 FPS, renderização de 5.000 marcadores no mapa e Offscreen Canvas.
   - **Tier 2 (Mid Range)**: CPU 4-6 cores, RAM 4-6 GB, WebGL1. Habilita Glassmorphism 8px, WASM SIMD e lazy loading otimizado.
   - **Tier 3 (Constrained / Power Saver)**: CPU $\le 2$ cores, RAM $\le 2\text{ GB}$ ou modo Save-Data ativo. Desativa blurs pesados (fundo sólido), utiliza tiles estáticos e desativa animações não-essenciais.

2. **Auditoria Contínua via DevTools Bridge (Porta `:6661`)**:
   - O probe de telemetria `tools/probe_browser_capabilities.py` é integrado à suíte de testes do App-Jury, enviando payloads serializados via POST `/eval` para validação em tempo real.

3. **Versionamento na Árvore de Código**:
   - O arquivo `apps/cockpit/src/seeds/schema-responsive.json` é versionado e serve como contrato de verdade para o `ResponsiveViewportEngine.tsx` e `DeviceLayoutFacet.ts`.

---

## Consequências Medidas (`medido=verdade`)

- **Probe Result (Ambiente Medido)**:
  - **CPU Cores**: 8 cores detectados (`navigator.hardwareConcurrency`).
  - **Memória**: 8 GB RAM (`navigator.deviceMemory`).
  - **GPU**: WebGL1/2 ativo via Intel Iris Xe Graphics (ANGLE OpenGL ES 3.2), Max Texture Size $16384\times 16384$.
  - **Aceleração WASM SIMD**: Medida e ativa (`true`).
  - **Armazenamento Local Quota**: $161.601\text{ MB}$ ($\approx 161\text{ GB}$).
- **Compatibilidade**: Habilita o Cockpit V8 a adaptar sua UI/UX automaticamente em sub-milissegundo com base na capacidade real do cliente.

---
*ADR-0212 registrada e aprovada em 28/08/2026.*
