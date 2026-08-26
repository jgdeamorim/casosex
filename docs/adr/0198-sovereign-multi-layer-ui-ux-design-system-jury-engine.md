# 🏛️ ADR-0198: Sovereign Multi-Layer UI/UX Design System Jury Engine

* **Status:** Aceito (Accepted)
* **Data:** 2026-08-26
* **Autor:** Jeferson Amorim & Antigravity AI (Deepmind Pair)
* **Contexto:** Governança Visual B2B, V8 Cockpit, ADR-0054 (Intent-Driven Dynamic Composer), ADR-0195 (Multi-Viewport Facets), SOP v3.2.
* **Doutrina:** `medido=verdade` (Toda asserção visual ou estática possui fonte e evidência rastreável).

---

## 1. Contexto e Problema

O ecossistema V8 Cockpit evoluiu para dar suporte a múltiplos viewports (`smartwatch`, `mobile`, `tablet`, `desktop`, `ultra-screen`). No entanto, a validação de qualidade de interface era limitada a:
1. Linters estáticos de código (`oxlint`, `tsc`) que analisam exclusivamente erros sintáticos e de tipagem, ignorando o significado semântico e estrutural de layouts CSS/Tailwind.
2. Regras de verificação ad-hoc e locais (ex: barrar strings isoladas como `w-[1200px]`), gerando julgamentos arbitrários, frágeis e desconectados da ciência normativa de UI/UX.

A proliferação de padrões visuais desalinhados (ex: empilhamento vertical com `flex-col items-end` em cabeçalhos desktop) evidenciou a necessidade de um **mecanismo de governança estrutural soberano** fundamentado em documentação técnica oficial.

---

## 2. Decisão Arquitetural

Decidimos instituir a **Arquitetura de Governança Normativa em 3 Camadas** e o **Multi-Layer Jury Engine**, estruturados conforme o pipeline abaixo:

```
                       CONTEXT7
                          │
          ┌───────────────┴───────────────┐
          │                               │
   Design Systems                  UX/UI Patterns
   (Material 3, Carbon, WAI-ARIA)  (Navigation, Status, Tables)
          │                               │
          └───────────────┬───────────────┘
                          ▼
            DESIGN PATTERN KNOWLEDGE LAYER
          (Mapeamento Conceitual Normalizado)
                          │
                          ▼
                      SOP / SPEC
             (Política de Aceite do Projeto)
                          │
                          ▼
              MULTI-LAYER JURY ENGINE
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
  AST Jury            DOM / ARIA          Visual Jury
(OXC / Python)       (Accessibility)     (Playwright Snapshot)
      │                   │                   │
      └───────────────────┼───────────────────┘
                          ▼
               GATE DE BUILD / CI DE ALTA CONFIANÇA
```

### 2.1 Protocolo de Descoberta Normativa via Context7
É proibido realizar buscas genéricas de UI/UX. Todo julgamento de padrão deve seguir o algoritmo de 8 etapas:
1. **Identificação do Padrão**: Mapear o componente para um padrão formal (`UI-PATTERN-STATUS-INDICATOR`, `UI-PATTERN-DATA-TABLE`, etc.).
2. **Design System Relevante**: Identificar a norma primária (Material Design 3, Carbon, WAI-ARIA, Tailwind v4).
3. **Resolução de Biblioteca no Context7**: Consultar a biblioteca correspondente no MCP `context7`.
4. **Extração Conceitual**: Recuperar princípios normativos (*Proximity, Hierarchy, Affordance, Visual Density, Semantic Color*).
5. **Knowledge Layer Storage**: Armazenar os princípios no schema YAML em `docs/spec/design-patterns/`.
6. **Vinculação com SOP**: Declarar a política na SOP (`docs/spec/casosex-coding-sop-ts-tsx.md`).
7. **Multi-Jury Enforcement**: Executar a verificação através dos 3 Júnis especializados.
8. **Gate Decision**: Conceder `PASS`, `WARN` ou `FAIL`.

---

## 3. Divisão de Responsabilidades do Multi-Layer Jury Engine

| Camada do Júri | Mecanismo / Ferramenta | Responsabilidade Medida (`medido=verdade`) | Tempo Target |
| :--- | :--- | :--- | :--- |
| **1. AST Jury** | `adsentice_v8_autodebug_bridge.py` + OXC Rust Parser | Estrutura JSX, papéis semânticos estáticos, composição, uso de tokens de design e violações sintáticas de layout. | **< 3ms** |
| **2. DOM/ARIA Jury** | `auditory_usability_coverage.py` + JSDOM | Atributos `aria-*`, acessibilidade WCAG 2.2 AA, focabilidade, anéis de contraste estático e leitores de tela. | **< 50ms** |
| **3. Visual Jury** | `visual_regression_jury.py` + Playwright Headless | Pixel diffing real, colisões visuais, overflow, densidade de dados e regressão nos 5 viewports declarativos. | **< 2.5s** |

---

## 4. Consequências e Benefícios

### Positivas:
- **Eliminação de Regras Ad-Hoc**: O ecossistema deixa de aceitar "regras inventadas na hora" e passa a exigir fundamentação normativa via Context7.
- **Rastreabilidade Total (`medido=verdade`)**: Toda rejeição de layout cita a fonte normativa (ex: WAI-ARIA Status Pattern, Material Design 3 Spacing).
- **Sub-milissegundo no Dev Loop**: O AST Jury avalia o código localmente em sub-milissegundos durante a edição, enquanto o Visual Jury assegura a qualidade no gate de build.
- **Resiliência Multi-Device**: Garantia estrita de alinhamento visual nos 5 `screen_model` declarativos (`smartwatch` a `ultra-screen`).

### Requisitos Operacionais:
- Todo novo padrão de interface deve ter seu schema correspondente cadastrado em `docs/spec/design-patterns/`.
- O script `adsentice_v8_autodebug_bridge.py` deve ser continuamente alimentado pelos schemas da Design Pattern Knowledge Layer.

---

*ADR-0198 Aceita · CASOSEX Architecture Board · 2026-08-26*
