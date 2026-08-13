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
6. **Seeding & Bootstrap Determinístico (`.emdash/seed.json`):** Versionar no Git toda a estrutura de tabelas, taxonomias, menus e configurações iniciais de produtos via `.emdash/seed.json` para auto-discovery e provisionamento automático no boot do Cloudflare D1.
7. **Camada de Tema & Componentes UI E-Commerce (`astro-ecommerce-main`):** Utilizar a arquitetura de componentes do `self-essentials/astro-ecommerce-main` (70+ componentes UI em Astro/React) alimentados pelas consultas de dados e collections do EmDash CMS no Cloudflare D1.
8. **Motor de Checkout & Carrinho Headless (`Snipcart v3`):** Integrar o SDK do Snipcart v3 no Astro para gerenciar a sessão do comprador, carrinho dinâmico e checkout seguro com validação de preços server-side (Crawler Validation).
9. **Pagamento Brasil via Mercado Pago (Pix + Checkout Pro) & Plano Gratuito Cloudflare ($0/mês):**
   - **Plano Gratuito Cloudflare ($0/mês):** Execução do EmDash CMS com plugins In-Process (`plugins: [...]`), desativando o bloco `"worker_loaders"` no `wrangler.jsonc` para operar dentro das cotas gratuitas (5M leituras/dia no D1 e 5GB no R2).
   - **Mercado Pago Pix & Checkout Pro:** Processamento de pagamentos locais via Server Endpoints do Astro (`src/pages/api/checkout/pix.ts`) utilizando o SDK oficial `@mercadopago/sdk-node` e webhooks de notificação instantânea (`src/pages/api/webhooks/mercadopago.ts`).
   - **Preços em Centavos:** Armazenamento de valores monetários como inteiros em centavos no `.emdash/seed.json` (`8990` = R$ 89,90) para prevenir erros de precisão decimal.

### Mapeamento de Tags do Knowledge Graph (Qdrant `:6352`)
- **`tag=casosex`**: Governança, SOP v3.0, Constituição e ADRs.
- **`tag=emdash-docs`**: Especificações do Emdash ADE e Monorepo Nx.
- **`tag=astro-docs`**: Framework Core Astro 5.x, Islands e Collections.
- **`tag=snipcart-docs`**: SDK, Atributos HTML e Webhooks do Snipcart v3.
- **`tag=astro-commerce`**: Componentes UI e Design System do tema E-Commerce.

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

### Protocolo de Seeding CLI
```bash
# Exportar banco e estrutura para o arquivo de seed
mkdir -p .emdash
npx emdash export-seed --with-content > .emdash/seed.json

# Validar integridade do schema antes do deploy
npx emdash seed .emdash/seed.json --validate
```

---

## Consequências

- Desempenho de borda (edge) com latência mínima para os clientes do CASOSEX.
- Zero dependência de servidores pesados Node.js/PHP ou bancos de dados tradicionais caros.
- Conteúdo fortemente tipado e integrado às páginas estáticas/SSR do Astro.
- Bootstrap determinístico do banco Cloudflare D1 no primeiro boot via `.emdash/seed.json`.
- Aceleração de UI/UX com 70+ componentes de e-commerce (`astro-ecommerce-main`) desacoplados da camada de dados do EmDash.
- Processamento de checkout seguro e headless via Snipcart v3 com preços validados e protegidos contra fraudes.
- Suporte nativo a Pix (QR Code) e Checkout Pro no Brasil via Mercado Pago sem custos adicionais de plataforma, operando no Plano Gratuito Cloudflare ($0/mês).
