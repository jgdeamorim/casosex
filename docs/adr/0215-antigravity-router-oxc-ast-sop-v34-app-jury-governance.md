# ADR-0215: Governança do Antigravity-Router (Rust RSXT) com AST Gate OXC, SOP v3.4 e Substrato App-Jury 6D

**Status:** Accepted  
**Data:** 28 de Agosto de 2026  
**Decisores:** Jeferson Amorim (Founder) & Antigravity AI Architecture Board  
**Contexto:** Monorepo CASOSEX / Volúpia Cockpit V8 (`apps/cockpit/worker/landingHtml.ts` & `/media/jeffer/RSXT/antigravity-router`)  
**Tags Soberanas:** `antigravity-router` · `oxc-ast-gate` · `sop-v3.4` · `app-jury` · `mobile-app-first` · `medido=verdade`  

---

## Contexto & Motivação

Com a consolidação da infraestrutura Mobile-App-First e o avanço da **SOP de Engenharia v3.4**, tornou-se imperativo institucionalizar como o motor em Rust **`Antigravity-Router`** (`antigravity-router mcp-server`) valida e aplica as regras normativas no ciclo de codificação do ecossistema Adsentice/Volúpia.

Investigações de telemetria revelaram que a validação rápida em sub-milissegundo ($\approx 24\mu\text{s}$) executada pelo parser OXC nativo (`src/gate/ast.rs`) deve estar estritamente alinhada com o **Substrato App-Jury 6D** (`tag=app-jury`), vetorizado no cluster Qdrant (`:6352`) e documentado em `docs/spec/mobile-app-first/`.

Sem este alinhamento explícito, divergências de especificação (como alvos de toque em cabeçalho inferiores a $48\text{px}$ ou feedbacks táteis com `scale` incorreto) poderiam passar despercebidas pela validação sintática pura.

---

## Decisão Ratificada

Ratificamos as seguintes diretrizes normativas de arquitetura e governança:

### 1. Guardião Sintático e Estrutural In-Process (`Antigravity-Router`)
- O motor `antigravity-router` (compilado em Rust em `/media/jeffer/RSXT/antigravity-router/target/release/antigravity-router`) é o **árbitro sintático definitivo** antes de qualquer build ou commit.
- A ferramenta MCP **`adsentice_ast_validate`** executa o parser OXC 0.147 real em $\approx 24\mu\text{s}$, interceptando erros de sintaxe TS/TSX e anti-patterns da SOP (ex: blocos `catch {}` vazios).
- A ferramenta MCP **`adsentice_fce_validate`** garante a integridade de integridade via checksum **BLAKE3** ($< 2\text{ms}$).

### 2. Axiomas Normativos do Substrato App-Jury 6D (`tag=app-jury`)
Toda interface mobile (`mode:mobile`) deve obedecer rigorosamente aos axiomas definidos em `docs/spec/mobile-app-first/index.yaml` e `andes-ui-tokens.yaml`:
1. **WCAG 2.2 AA / Top Actions Ergonomics**: Touch Targets $\ge 44\text{px}$, sendo **$48\text{px}$ obrigatório para botões de Top Action** (ex: `.btn-login-header`).
2. **Tactile Feedback Standard**: Botões Andes UI devem implementar resposta táctil de pressão com `active:scale-95 transition-all`.
3. **Axioma AXA-12**: Mobile é uma experiência de aplicação independente (App-Shell nativa), não um mero breakpoint responsivo do Desktop.

### 3. Motor de Telemetria Militar & Auditoria Continuada (`medido=verdade`)
- O motor `tools/casosex_military_telemetry_engine.py` deve ser utilizado para validar o hashing zero-copy **BLAKE2b** dos 17 artefatos descompilados em `docs/spec/mobile-app-first/` em $< 22\text{ms}$.
- A suíte `tools/validate_spec_to_cockpit_quality.py` atua como o verificador contínuo de paridade entre a especificação `tag=app-jury` e os componentes React/HTML em `apps/cockpit/`.

---

## Consequências Medidas (`medido=verdade`)

- **Latência de Validação Sintática**: $24\mu\text{s}$ a $56\mu\text{s}$ via `adsentice_ast_validate` (OXC Rust).
- **Tempo de Auditoria Militar Telemétrica**: $21.57\text{ ms}$ para o dossiê militar completo (`military_telemetry_dossier.json`).
- **Garantia de Qualidade de UI**: Rejeição automática de componentes que violem o contrato ergonômico de $48\text{px}$ para ações de topo em dispositivos mobile.

---
*ADR-0215 registrada, aprovada e institucionalizada em 28/08/2026.*
