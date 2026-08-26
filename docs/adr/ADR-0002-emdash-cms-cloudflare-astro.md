# ADR-0002: EmDash como Base de Controle Geral (Business Control Plane & Sovereign OS) do CASOSEX

- **Status:** Accepted
- **Data:** 2026-08-13
- **Autores:** Jeferson Amorim (Founder) & Antigravity (AI Architect)

---

## Contexto

O projeto **CASOSEX** exige mais do que um simples CMS de publicação de conteúdo. Ele necessita de uma **Base de Controle Geral (Business Control Plane & Sovereign OS)** capaz de orquestrar a operação inteira do negócio na borda (edge): catálogo, estoque, pedidos, checkout, faturamento fiscal (Bling ERP NFe), rede de afiliados, revendedores B2B, comissões e auditoria por IA — tudo executando com latência ultrabaixa, custo mínimo de infraestrutura e soberania total de dados.

---

## Decisão

Efetivar o **EmDash** (`@emdash-cms`) não apenas como um gerenciador de posts, mas como a **Base de Controle Geral (Business Control Plane & Sovereign OS)** do CASOSEX, integrado nativamente ao **Astro** e à infraestrutura da **Cloudflare**:

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
10. **Servidor MCP Nativo (`/_emdash/api/mcp`):** Utilização da interface MCP embutida para permitir que agentes de IA (Antigravity) gerenciem conteúdo, schemas e catálogo com autorização e auditabilidade.
11. **Modelo de Segurança Least Privilege & Portable Text:**
    - Manifest estático de capabilities por plugin (`content:read`, `network:fetch` com allowlist).
    - Formato Rich Text em **Portable Text** em vez de HTML bruto, permitindo renderização limpa e segura em múltiplos canais.
    - Suporte nativo ao plugin **DashCommerce** (`@dashcommerce/core`) para catálogo, estoque e cupons.
12. **Operação Agêntica Co-Piloto (AI-Native Merchandising & CI/CD):**
    - **Copywriting & Merchandising Automático:** Geração e atualização autônoma de descrições persuavidas em Portable Text, SEO JSON-LD e taxonomias diretamente nas coleções EmDash via protocolo MCP.
    - **Evolução de Schema sem Downtime:** Criação agêntica de novas coleções no `.emdash/seed.json` e aplicação via `emdash seed --on-conflict=update`.
    - **Sentinela de Estoque & SEO:** Auditoria contínua de integridade do catálogo, detecção de baixa disponibilidade e otimização de metadados sem interrupção do serviço.
13. **Módulos & Plugins Customizados Soberanos (Afiliados, Revenda, Comissões & Bling ERP):**
    - **Módulo de Afiliados, Revenda & Comissões:** Coleção nativa `affiliates` e `commissions` no D1 com rastreamento por sessão/cookie, tabelas de comissão por nível, portal de autosserviço para revendedores e liquidação via Pix.
    - **Integração Nativa Bling ERP (NFe & Estoque):** Sincronização bi-direcional em tempo real de produtos/estoque e emissão automática de Nota Fiscal Eletrônica (NFe) via webhook pós-pagamento (`order.paid` -> API v3 do Bling ERP).
14. **Tema Exclusivo e Sob Medida CASOSEX (Custom UI/UX Architecture):**
    - **Design System Autoral:** Desenvolvimento de um tema 100% exclusivo sob medida para a marca CASOSEX utilizando a fundação do Astro 5.x + React 19 + Tailwind CSS, extraindo componentes de alta conversão do `astro-ecommerce-main`.
    - **Zero JS Bloatware:** Hydration seletiva (Islands Architecture) para garantir pontuação 98-100 no Google PageSpeed Mobile e TTFB < 200ms.
    - **Integração Nível Kernel:** Consumo direto das coleções da Base de Controle Geral (`getEmDashCollection`) com segurança de tipos end-to-end (TypeScript).
15. **Absorção de Motores & Padrões de Elite do Ecossistema Adsentice:**
    - **Cache Determinístico BLAKE3 KV:** Renderização e consulta de coleções em 0ms servidas do cache de borda (Edge KV) sem consultas repetitivas ao D1.
    - **Dynamic Composer & RenderContext Engine:** Composição dinâmica de seções da Home diretamente pelo EmDash CMS sem alterar o código do frontend.
    - **Co-Piloto de Atendimento & Vendas Discretas no WhatsApp:** Integração de botões flutuantes WACTA (WhatsApp Call to Action) com mensagens anônimas pré-formatadas para matar dúvidas de compra.
    - **Motor de Recompra Automática (Commerce Intel):** Lembretes preditivos para itens consumíveis (lubrificantes, géis, óleos) gerando receita recorrente com checkout de 1-clique.
    - **Checkout Pix Transparente In-Modal:** Exibição do QR Code Pix e cópia-e-cola diretamente em modal glassmorphism com confirmação via webhook em < 2 segundos.
16. **Topologia Dual-Stack & Identidade de Marca (Volúpia B2C + casosex-os Control Plane):**
    - **Identidade da Marca**: A marca comercial e a loja virtual e-commerce B2C oficial é **Volúpia** (`usevolupia.com.br` / `app.usevolupia.com.br`). O nome **casosex-os** refere-se exclusivamente à infraestrutura do sistema operacional de controle.
    - **Superfície B2C Air-Gapped**: A loja virtual é alimentada por **WordPress + WooCommerce** (executando em container Docker local `:8085` com o plugin soberano `wp-adsentice-second-brain`), mantendo o painel administrativo `/wp-admin` air-gapped contra ataques públicos.
    - **Center-OS na Borda**: O `casosex-os` (EmDash na Cloudflare Pages/D1/R2) gerencia a orquestração agêntica MCP, discovery de fornecedores B2B, inteligência de vendas e sincronização de catálogo.

### Mapeamento de Tags do Knowledge Graph (Qdrant `:6352`)
- **`tag=casosex`**: Governança, SOP v3.0, Constituição e ADRs.
- **`tag=emdash-docs`**: Especificações do Emdash ADE, Monorepo Nx e MCP Server.
- **`tag=astro-docs`**: Framework Core Astro 5.x, Islands e Collections.
- **`tag=snipcart-docs`**: SDK, Atributos HTML e Webhooks do Snipcart v3.
- **`tag=astro-commerce`**: Componentes UI e Design System do tema E-Commerce.
- **`tag=dashcommerce-docs`**: Especificações oficiais da documentação do DashCommerce.
- **`tag=dashcommerce`**: Estrutura e pacotes do código-fonte local do DashCommerce (`packages/core`).
- **`tag=shopo-react`**: Suíte de 30 módulos de referência UI/UX do tema ThemeForest Shopo (React + Tailwind CSS).

```typescript
// astro.config.mjs
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import emdash from "emdash/astro";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { dashcommerce } from "@dashcommerce/core";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB" }),
			storage: r2({ binding: "MEDIA" }),
			plugins: [dashcommerce()],
		}),
	],
});
```

### Protocolo de Seeding CLI
```bash
# Exportar banco e estrutura para o arquivo de seed
mkdir -p .emdash
npx emdash export-seed --with-content > .emdash/seed.json

# Mesclar schemas do DashCommerce no seed
bunx dashcommerce-merge-seed --with-demo-catalog

# Validar e aplicar integridade do schema
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
- Operação automatizada por agentes de IA via servidor MCP nativo (`/_emdash/api/mcp`).
- Isolamento estrito de permissões (Least Privilege) impedindo que extensões acessem recursos não declarados.
- Capacidade de copywriting, merchandising, evolução de schemas e auditorias de SEO executadas autonomamente pelo Co-Piloto Antigravity.
- Ecossistema de rede de Afiliados, Revendedores B2B com gestão de comissões e automação fiscal/estoque via Bling ERP NFe sem depender de plugins terceiros pagos.
- Tema visual autoral, exclusivo e hiper-veloz sob medida para o CASOSEX, totalmente integrado à Base de Controle Geral.
- Absorção dos 5 motores de inteligência Adsentice (BLAKE3 KV, Dynamic Composer, WhatsApp Copilot, Recompra Automática e Pix In-Modal < 2s).
