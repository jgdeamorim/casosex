# CASOSEX / Adsentice Monorepo Constitution (SS-AES v3.1)

- **Version**: 3.1.0
- **Ratified**: 2026-08-25
- **Status**: ACTIVE & MANDATORY (Sovereign Spec-Driven Governance)

---

## 🏛️ Core Architectural Principles

### Article I: Specification-First & Intent Inversion
No implementation code, refactoring, or UI modification shall be executed without an explicit Specification (`/specs/` or feature spec) and Implementation Plan (`plan.md`). Code serves specifications; specifications do not serve code.

### Article II: AXA Axiom (Adaptive Experience Architecture)
> **"Mobile is not a responsive breakpoint of Desktop. Mobile is an independent application experience sharing the same domain, state, contracts, design tokens and component primitives."**
Composition Roots must be decoupled per Experience Mode: `MobileAppShell`, `TabletWorkspaceShell`, `DesktopWorkspaceShell`, `UltraWideWorkspaceShell`. Media Queries pick the Mode; Container Queries adapt components inside their allocated slot.

### Article III: OWASP ASVS 5.0 Security & Zero-Trust
All authentication, authorization (RBAC/ABAC), data storage (R2/Postgres), and API endpoints must adhere strictly to **OWASP ASVS 5.0 Level 2/3**. Secrets must never be committed to git or exposed client-side.

### Article IV: Single Source of Truth Contracts (Zod + OpenAPI 3.1)
All data exchanges between `apps/web` and `apps/api` must be governed by shared TypeScript schemas in `packages/contracts`. Breaking changes require explicit API versioning or deprecation policy.

### Article V: Design System Tokens & OKLCH
Color palettes, typography, spacing, and micro-interactions must use semantic CSS variables defined in `packages/tokens` (OKLCH color space). Hardcoded HEX, RGB, or arbitrary spacing values are strictly prohibited.

### Article VI: Evidence-Driven Development (EDD)
Every completed feature task MUST produce an audit artifact directory at `/task-artifacts/REQ-XXX/` containing `01-specification.md`, `03-test-results.json`, `04-a11y-axe-report.json`, and `05-perf-lighthouse.json`.

### Article VII: Non-Negotiable Test & Quality Gates (DoD)
No feature shall be marked DONE without passing the Executable DoD:
1. `npx tsc --noEmit` (Zero type errors).
2. Oxlint / SWC SOP compliance (Zero empty catches, proper async handling).
3. Vitest unit and integration test suite passing 100%.
4. axe-core zero Critical/Serious accessibility violations.

### Article VIII: Context7 Grounding Before Execution
Before utilizing external libraries (React 19, Vite, Tailwind v4, Hono, Supabase, TanStack Query), the agent MUST query the `context7` MCP server to ensure zero API syntax hallucinations.

### Article IX: Monorepo Clean Isolation & Single Responsibility
The workspace is organized into:
- `apps/web`: React 19 + Vite Frontend Cockpit.
- `apps/api`: Hono / Node Sovereign Backend.
- `packages/ui`: Accessible Design System Primitives.
- `packages/contracts`: Zod / OpenAPI Shared Schemas.
- `packages/tokens`: OKLCH Color Space & Motion Design Tokens.

### Article X: Dynamic Skill Invocation Alert Protocol
Whenever a task in the 5-Step Workflow requires specialized domain execution (e.g. `dashboard-builder`, `frontend-a11y`, `d3-visualization`, `spec-kit`, `context7`), the system MUST emit an explicit **Skill Trigger Alert** (`> [!NOTE] 🔮 Skill Invoked: <skill-id>`), verify/register the skill in `.antigravity/skills/index.yaml`, and activate its domain instructions into the execution context.

---

## 📜 Governance Rules

1. **Sovereign Pyramid Hierarchy**: Security (ASVS 5.0) > Requirements > ADRs > Contracts > Tokens > Specs > Grounding (Context7) > Skills > Code > Agent Heuristics.
2. **Amendments**: Modifying this constitution requires formal approval from the Founder (Jeferson Amorim) and an updated version number.

