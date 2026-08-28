# ADR-0211: Institucionalização do App-Jury DevTools Bridge (Porta 6661), Calibração Session-Start & Alinhamento Soberano SOP v3.3

**Status:** Accepted  
**Data:** 28 de Agosto de 2026  
**Decisores:** Jeferson Amorim (Founder) & Antigravity AI Architecture Board  
**Contexto:** Monorepo CASOSEX / Volúpia Cockpit V8 (`apps/cockpit/src`)  
**Tags Soberanas:** `app-jury` · `adsentice-session-start` · `sop-v3.3` · `devtools-bridge` · `medido=verdade`  

---

## Contexto & Problema

Durante os testes de homologação em dispositivo Android físico real (`AMXCN7Q86LHIMNRK`) conectado via ADB e porta `:8089`, surgiu a necessidade de:
1. Conectar a AI Agentic diretamente ao Chrome DevTools do dispositivo físico sem depender de recompilação manual ou inspeção cega.
2. Capturar em tempo real a performance gráfica (FPS, WebGPU, latência P50 $\le 16.6\text{ms}$) e logs de console do browser do celular.
3. Garantir que todo arranque de sessão (`/session-start` via skill `adsentice-session-start`) valide os canais de telemetria e o estado do SNC Brain-OODA sob as regras atualizadas da **SOP v3.3 (ADR-0210)**.

---

## Decisão Ratificada

 Ratificamos as seguintes diretrizes de arquitetura e infraestrutura:

1. **Institucionalização da DevTools Bridge Server (Porta `:6661`)**:
   - O servidor `tools/app_jury_bridge_server.py` (`ThreadingHTTPServer` multi-threaded HTTP/1.1) é promovido a serviço primário de telemetria tátil/remota do App-Jury.
   - O tráfego do browser do celular físico é canalizado via `adb reverse tcp:6661 tcp:6661` e `adb reverse tcp:8089 tcp:8089`.
   - Permite a injeção remota via `/eval`, inspeção do DOM tátil e captura contínua de FPS e suporte WebGPU/WebGL na GPU Mali.

2. **Atualização da Especificação Mestre do App-Jury (`docs/spec/app-jury-v1-0-master-specification.md`)**:
   - Formalização da arquitetura de ponte remota no capítulo 3 da especificação.
   - Registro dos parâmetros de hardware medidos: **59 FPS a 60 FPS**, latência GPU $< 16.6\text{ms}$, consumo JS Heap $\approx 16.8\text{ MB}$.

3. **Sincronização da Agent Skill `adsentice-session-start`**:
   - A skill `/session-start` (`~/.gemini/antigravity/skills/adsentice-session-start/SKILL.md`) é oficialmente atualizada para o padrão **SOP v3.3**.
   - Inclui no Módulo 3 a checagem automática dos endpoints do Antigravity-Router, FCE, AST Oxlint, e o teste de telemetria da Bridge DevTools `:6661` para sessões com foco mobile.

---

## Consequências Medidas (`medido=verdade`)

- **Frame Rate Medido**: 59 FPS estáveis em dispositivo Android físico real via ADB reverse (`AMXCN7Q86LHIMNRK`).
- **Latência de Telemetria Bridge**: $< 1.2\text{ms}$ por broadcast de payload em `http://127.0.0.1:6661/telemetry`.
- **Integridade da Governança**: Sincronização 1:1 realizada entre a Regra Global (`RULE[user_global]`), a Skill `adsentice-session-start`, o Master Spec `app-jury-v1-0` e a SOP v3.3.
- **Pontuação BOA**: Mantida em **0.9091 (EXCELLENT)** com registrador ativo no Redis `:6396`.

---
*ADR-0211 criada e aceita em 28/08/2026 sob a autorização do Founder.*
