# Roadmap & Status: V8 Cockpit (`apps/v8-cockpit`)

**Data de Selo**: 26/08/2026  
**Status Atual**: Soberano / Estável (Refatorado para Padrão B2B Executivo)  
**Porta Dev**: `:8088` (Vite) / `:2727` (Proxy L7 + Astro EmDash)

---

## 📌 Status Atual do V8 Cockpit (Versão 8.0)

### 1. Autenticação & Perfil Soberano
- **PAT Token & Direct-Pass**: Autenticação administrativa minteada via `tools/mint_adsentice_auth.mjs`.
- **Role Switching**: Gating por perfil (`Founder`, `Ops`, `Commercial`) via `userRules.ts` mantido de forma reativa.
- **Header & Branding**: Estilização B2B de alta fidelidade visual com badge do fundador Jeferson Amorim (`jeferson@adsentice.com`).

### 2. Módulos Ativos
- **Market Intel**: KPI Grid executivo com estatísticas em tempo real de fornecedores e ANVISA.
- **Geomapeamento Comercial**: Leaflet Map responsivo com pins geolocalizados de parceiros SP & RJ.
- **Dossiê de Homologação**: Formulário de auditoria e conformidade técnica ANVISA.
- **Matriz de Fornecedores**: Diretório pesquisável de 307 fornecedores com badges de status de visita.

---

## 🗺️ Roadmap Futuro (Fases Planejadas)

### Fase A: Digital Twin Headless CMS (EmDash :2727)
- [ ] Conectar os endpoints `/api/dashboard`, `/api/schema`, `/api/content/posts` da porta `:2727`.
- [ ] Renderizar feed Bento Grid de artigos e mídias do hub Headless CMS no Cockpit V8.
- [ ] Implementar revalidação offline resiliente (`CacheRevalidationService`).

### Fase B: Agente Copiloto Lateral (EVO-API & OODA Telemetry)
- [ ] Integrar o drawer lateral de chat (`TeamChatDrawer`) com o motor OODA Redis `:6396`.
- [ ] Exibir o BOA Score em tempo real na barra superior do Cockpit.

### Fase C: Exportação & Relatórios Executivos
- [ ] Gerar PDF/DOCX de Dossiês de Homologação via pipeline soberana.
- [ ] Filtro avançado de Fornecedores por segmento e score de qualidade.
