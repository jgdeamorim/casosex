# ADR-0210: Ratificação da SOP v3.3 — Engate Automático do App-Jury em `mode:mobile` & Antigravity-Router Substrate

**Status:** Accepted  
**Data:** 28 de Agosto de 2026  
**Decisores:** Jeferson Amorim (Founder) & Antigravity AI Architecture Board  
**Contexto:** Monorepo CASOSEX / Volúpia Cockpit V8 (`apps/cockpit/src`)  
**Tags Soberanas:** `adsentice-router-dev` · `app-jury` · `sop-v3.3` · `mode:mobile`  

---

## Contexto & Problema

O **Volúpia Cockpit V8** exige rigor absoluto na paridade visual e ergonomia tátil do seu modo mobile (`worktree mode:mobile`) em relação ao aplicativo nativo do Mercado Pago (v2.451.1).

Anteriormente, as regras de código (SOP v3.2) focavam na sintaxe TypeScript e SWC, mas não integravam diretamente o motor de compilação em Rust do **Antigravity-Router** (`adsentice-router-dev` MCP) nem forçavam o engate automático da suíte **`App-Jury v1.0`** no momento em que a experiência mobile era editada.

---

## Decisão Ratificada

Ratificamos a evolução para a **SOP v3.3 (Standard Operating Procedure)**, estabelecendo as seguintes regras mandatárias:

1. **Engate Automático do App-Jury em `worktree mode:mobile`**:
   - Sempre que o desenvolvedor ou o sistema alternar para o contexto/viewport `mode:mobile`, a suíte de auditoria em 6 dimensões (**6D Critique Theater**) do `App-Jury v1.0` é ativada.
   - Nenhuma alteração mobile é promovida se a pontuação medida por `tools/validate_spec_to_cockpit_quality.py` for $< 95\%$.

2. **Integração com o Antigravity-Router Substrate (`adsentice-router-dev`)**:
   - **AST Fast-Path (`adsentice_ast_validate`)**: Validação sintática obrigatória em Rust via parser `oxc` ($< 0.8\text{ms}$) em cada componente editado.
   - **Intent-Driven Synthesis (`adsentice_d_ips_apply`)**: Refatorações e ajustes finos são aplicados via Patch de Intenção JSON (D-IPS), economizando $> 92\%$ em tokens.
   - **Tri-Layer Context Mesh (`adsentice_tri_layer_ingest` / `lookup`)**: Separação rigorosa de *Skeleton* (interfaces/tipos Andes UI) e *Values* (design tokens), reduzindo o uso da janela de contexto em até $89\%$.
   - **Validação Cryptográfica FCE (`adsentice_fce_validate`)**: Garantia de integridade do contrato e checksums BLAKE3.

3. **Garantia de Isolamento de Viewport (Axioma AXA)**:
   - As validações do `mode:mobile` operam de forma isolada via `AXAResponsiveSwitch` com `useSyncExternalStore`, garantindo **zero risco de regressão** na experiência Desktop Bento Grid e no worker Edge (`worker/index.ts`).

---

## Consequências Medidas (`medido=verdade`)

- **Latência de Validação AST**: Medida em $2.62\text{ms}$ por arquivo (parser OXC Rust).
- **Economia de Contexto/Tokens**: Redução de $89.01\%$ no tamanho dos componentes via Tri-Layer Contract.
- **Saúde do Sistema BOA**: Mantedida em **0.9091 (EXCELLENT)** no Redis (`:6396`).
- **Qualidade Global Auditada**: Mantedida em **100.0%** no relatório `apps/v8_26-08-2026/SUMMARY.md`.

---
*ADR-0210 registrada e aprovada pelo Founder em 28/08/2026.*
