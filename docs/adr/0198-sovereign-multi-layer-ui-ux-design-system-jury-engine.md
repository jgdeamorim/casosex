# 🏛️ ADR-0198: Sovereign Multi-Layer UI/UX Design System Jury Engine

* **Status:** Aceito com Refinamentos Arquiteturais (Accepted & Refined)
* **Data:** 2026-08-26
* **Autor:** Jeferson Amorim & Antigravity AI (Deepmind Pair)
* **Contexto:** Governança Visual B2B, V8 Cockpit, ADR-0054 (Intent-Driven Dynamic Composer), ADR-0195 (Multi-Viewport Facets), SOP v3.2.
* **Doutrina:** `medido=verdade` (Toda asserção visual ou estática possui fonte e evidência rastreável com proveniência).

---

## 1. Contexto e Problema

O ecossistema V8 Cockpit evoluiu para dar suporte a 5 viewports declarativos (`smartwatch`, `mobile`, `tablet`, `desktop`, `ultra-screen`). No entanto, a validação de qualidade de interface apresentava duas falhas conceituais graves:
1. **Regras Lexicais Ad-Hoc**: Tentar proibir utilitários CSS isolados (ex: `flex-col items-end` ou `w-[1200px]`) sem levar em conta o papel semântico do componente e a responsividade contextual.
2. **Equívoco de Autoridade**: Confundir ferramentas de busca/recuperação (ex: Context7) ou linguagens de implementação (ex: Tailwind CSS v4) com a autoridade normativa de design.

A governança exigia uma separação estrita entre **Fontes Normativas (W3C/Carbon)**, **Recuperação de Documentação (Context7)**, **Política do Projeto (SOP)**, **Camada de Conhecimento** e **Enforcement Técnico (Multi-Jury)**.

---

## 2. Decisão Arquitetural: A Pipeline de Governança Normativa em 6 Etapas

Decidimos reestruturar a arquitetura de governança visual conforme a matriz abaixo:

```
                    ┌──────────────────────────┐
                    │    NORMATIVE SOURCES     │
                    │                          │
                    │ W3C / WAI-ARIA APG       │
                    │ IBM Carbon (B2B Primary) │
                    │ Material 3 (Secondary)   │
                    │ Tailwind v4 (Impl Vocab) │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ CONTEXT7 DISCOVERY       │
                    │ PROTOCOL                 │
                    │                          │
                    │ resolver → retrieve     │
                    │ evidence → provenance   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ DESIGN PATTERN           │
                    │ KNOWLEDGE LAYER          │
                    │                          │
                    │ patterns · components    │
                    │ accessibility contracts  │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ SOP / PROJECT POLICY     │
                    │                          │
                    │ MUST / SHOULD / MAY      │
                    │ severity · exceptions    │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
             ┌─────────────┐          ┌──────────────┐
             │ AST JURY    │          │ DOM/ARIA JURY │
             │ OXC / Rust  │          │ Playwright    │
             │ Python      │          │ ARIA Snapshot │
             └──────┬──────┘          └───────┬──────┘
                    │                         │
                    └────────────┬────────────┘
                                 ▼
                       ┌──────────────────┐
                       │ VISUAL JURY      │
                       │ Playwright       │
                       │ screenshot diff  │
                       │ geometry/bounds  │
                       └────────┬─────────┘
                                ▼
                       ┌──────────────────┐
                       │ EVIDENCE REPORT  │
                       │ PASS / WARN /    │
                       │ FAIL (With Proof)│
                       └──────────────────┘
```

---

## 3. Matriz Soberana de Fontes Normativas (Governance Stack)

```yaml
design_system_governance:
  primary:
    name: IBM Carbon Design System
    role: b2b_data_dense_interface # Padrão primário para data tables, alta densidade e operações B2B
  secondary:
    - name: Material Design 3 (Google)
      role: general_ui_patterns
  accessibility:
    primary:
      name: WAI-ARIA APG (Authoring Practices Guide)
      role: interaction_semantics_keyboard_contracts
  implementation:
    primary:
      name: Tailwind CSS v4
      role: implementation_vocabulary # Representação CSS, NÃO princípio de UX
  retrieval:
    primary:
      name: Context7 MCP
      role: discovery_and_documentation_retrieval
  verification:
    engine: Playwright + OXC Rust Parser
    role: rendered_ui_dom_aria_visual_validation
```

---

## 4. Divisão de Responsabilidades e Matriz de Frequência do Júri

| Camada do Júri | Mecanismo / Ferramenta | Responsabilidade Medida (`medido=verdade`) | Frequência de Execução | Latência Target |
| :--- | :--- | :--- | :--- | :--- |
| **1. AST Jury** | `adsentice_v8_autodebug_bridge.py` + OXC Rust | Validação sintática, tokens, papéis semânticos estáticos, composição de componentes. | **Dev Loop Local** (a cada save) | **< 3ms** |
| **2. DOM/ARIA Jury** | `Playwright ARIA Assertions` (`toMatchAriaSnapshot`, `toHaveRole`, `toHaveAccessibleName`) | Contrato WAI-ARIA, árvore de acessibilidade, focabilidade por teclado e estilos computados. | **Pre-push / PR / CI** | **< 200ms** |
| **3. Visual Jury** | `Playwright Visual Diffing` (`toHaveScreenshot`) + Bounding Box Geometry | Screenshot pixel diffing, colisões visuais de container, overflow e densidade em 5 viewports. | **PR / CI / Release** | **< 2.5s** |

---

## 5. Contrato Semântico dos 5 Viewports Declarativos

```yaml
viewports:
  smartwatch:
    width: 280
    height: 340
    purpose: constrained_navigation_micro_display
  mobile:
    width: 390
    height: 844
    purpose: touch_primary_portrait
  tablet:
    width: 768
    height: 1024
    purpose: hybrid_touch_keyboard_dashboard
  desktop:
    width: 1440
    height: 900
    purpose: b2b_primary_high_density_workspace
  ultra-screen:
    width: 1920
    height: 1080
    purpose: multi_panel_command_center
```

---

## 6. O Modelo de Evidência e Rastreabilidade (`Evidence Layer`)

Toda rejeição do Júri gera uma estrutura auditável de evidência (`finding`), contendo:

```json
{
  "finding_id": "JURY-UI-00421",
  "pattern": "data-table/header",
  "rule_id": "CARBON-DATATABLE-ROW-ALIGNMENT",
  "source": {
    "authority": "IBM Carbon Design System",
    "document": "data-table/style",
    "retrieved_via": "context7"
  },
  "evidence": {
    "type": "normative_contract_violation",
    "confidence": "HIGH"
  },
  "enforcement": {
    "ast": "PASS",
    "dom_aria": "PASS",
    "visual": "FAIL"
  },
  "severity": "BLOCKING"
}
```

---

*ADR-0198 Aceita & Refinada · CASOSEX Architecture Board · 2026-08-26*
