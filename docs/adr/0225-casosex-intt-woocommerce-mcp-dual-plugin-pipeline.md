# ADR-0225: Pipeline Soberano CASOSEX — Ingestão INTT, Orquestração MCP WordPress e Dual-Plugin Refinement

- **Status:** Accepted
- **Data:** 2026-09-01
- **Autor:** Jeferson Amorim (Founder) & Antigravity (Sovereign Engine)
- **Domínio:** CASOSEX / E-Commerce Dual-Channel (B2C Dropshipping & B2B Revenda)
- **Decisões Anteriores:** [ADR-0223](0223-casosex-dual-channel-dropshipping-b2b-architecture.md) (Arquitetura Dual-Channel)

---

## 🎯 Contexto e Problema

O ecossistema **CASOSEX** necessita de uma esteira automatizada e soberana para gerenciar o catálogo de produtos e os fluxos de despacho do modelo Dual-Channel:

1. **Catálogo Dropshipping (INTT):** O fornecedor parceiro (`lojaintt.com.br/v2/`) possui um catálogo extenso de produtos de revenda. Contudo, itens novos não podem ser injetados diretamente na vitrine pública sem curadoria de imagens, precificação e descrição.
2. **Orquestração Agêntica (MCP WordPress):** O WordPress rodando em container Docker no CASOSEX (`0.0.0.0:8085`) possui o conector MCP `easy-mcp-ai` ativo no endpoint `/wp-json/easy-mcp-ai/v1/mcp`.
3. **Mecanismo de Despacho & Atacado (Custom Plugins):**
   - O plugin `woocommerce-dropshipping` precisa enviar as ordens de compra ao fornecedor com o **CPF e Endereço Completo do Cliente Final**, além de frete.
   - O plugin `whols-pro` precisa aplicar regras de desconto atacado **exclusivamente aos SKUs de estoque físico local**.

---

## 💡 Decisões de Arquitetura

### 1. Ingestão e Curadoria INTT ➔ WooCommerce (`pending` status)
- **Extrator de Metadados INTT:** Script de extração autenticado via `lojaintt.com.br/v2/login` e `ajax/catalogo.php` obtendo nome, SKU, preço de custo de revendedor, imagens, categoria e descrição técnica.
- **Status Rascunho / Pendente:** Todos os produtos ingeridos são criados no WooCommerce com status `pending` (Pendente de Revisão).
- **Curadoria Agêntica / Manual:** O founder ou os agentes de IA aprovam os itens, ajustam a margem de markup do varejo e acionam a publicação.

### 2. Governança e Operação via MCP WordPress (`easy-mcp-ai`)
- **Transporte:** Streamable HTTP / JSON-RPC sobre o endpoint `http://localhost:8085/wp-json/easy-mcp-ai/v1/mcp`.
- **Autenticação:** Bearer Token isolado para o ecossistema CASOSEX.
- **Ferramentas MCP Expensas:** `wc_get_products`, `wc_create_product`, `wc_update_product_status`, `wc_get_orders`.

### 3. Refatoração dos Plugins em `wp/plugins/`

#### A. Customização do `woocommerce-dropshipping` (Varejo B2C)
- **Mapeamento Packing Slip:** Edição de `packingslip.html` e `woocommerce-dropshipping-functions.php` para incluir no modelo de Ordem de Compra:
  - CPF / CNPJ do comprador.
  - Endereço completo de entrega (Logradouro, Número, Bairro, Cidade, UF, CEP).
  - Método e valor do frete cobrado do cliente.
- **Supressão de Logs / License Noise:** Saneamento em `ali-api/woocommerce_aliexpress.php`.

#### B. Customização do `whols-pro` (Revenda B2B)
- **Filtro de SKUs por Tipo de Estoque:** Injeção de guard clause em `whols-pro.php` que verifica a taxonomia/meta `_casosex_stock_type` (apenas `physical_local` ativa o preço B2B).
- **Roles & Bulk Order:** Habilitação do formulário de pedidos em lote para revendedores credenciados (`revendedor_bronze`, `revendedor_ouro`).

---

## 📊 Consequências e Validação (`medido=verdade`)

- **Segurança da Vitrine:** 0% de risco de lançar produtos com preços incorretos ou fora do nicho na loja live.
- **Zero Trabalho Manual de Digitação:** Pedidos de dropshipping chegam para a INTT já formatados com a etiqueta do destinatário final.
- **Isolamento de Margem:** O preço B2B não interfere nas vendas B2C e vice-versa.
- **Governança Agêntica:** Antigravity / Cursor conseguem auditar e publicar itens diretamente via MCP `:8085`.

---

## 📝 Auditoria e Rastreabilidade

- **Versão:** 1.0 (Accepted)
- **Endereço MCP:** `http://localhost:8085/wp-json/easy-mcp-ai/v1/mcp`
- **Diretório Plugins:** `/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins`
