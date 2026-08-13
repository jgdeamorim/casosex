# ADR-0002: Adção do EmDash CMS (Astro + Cloudflare D1/R2) para a Arquitetura CASOSEX

- **Status:** Accepted
- **Data:** 2026-08-13
- **Autores:** Jeferson Amorim (Founder) & Antigravity (AI Architect)

---

## Contexto

O projeto **CASOSEX** necessita de uma camada de gestão de conteúdo estruturado, catálogo de produtos e gerenciamento de mídia de altíssima performance, com custo próximo a $0 de infraestrutura e execução serverless na borda.

---

## Decisão

Adotar o **EmDash CMS** (`@emdash-cms`) integrado nativamente ao **Astro** e à infraestrutura da **Cloudflare**:

1. **Framework Core:** Astro 5.x (`output: "server"`, adapter `@astrojs/cloudflare`).
2. **Banco de Dados Relacional:** Cloudflare D1 (`binding: "DB"`), mapeando schemas estruturados diretamente para tabelas SQL nativas.
3. **Armazenamento de Mídia & Imagens:** Cloudflare R2 (`binding: "MEDIA"`), sem custos de egresso.
4. **Admin Cockpit:** Interface administrativa integrada construída em React (`@astrojs/react` + `emdash/astro`).
5. **Plugins em Isolates:** Arquitetura de plugins em sandbox executando em Cloudflare Isolates.

```typescript
// astro.config.mjs
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import emdash from "emdash/astro";
import { d1, r2 } from "@emdash-cms/cloudflare";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB" }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
});
```

---

## Consequências

- Desempenho de borda (edge) com latência mínima para os clientes do CASOSEX.
- Zero dependência de servidores pesados Node.js/PHP ou bancos de dados tradicionais caros.
- Conteúdo fortemente tipado e integrado às páginas estáticas/SSR do Astro.
