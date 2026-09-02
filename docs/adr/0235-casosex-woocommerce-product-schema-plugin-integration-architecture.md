# ADR-0235: Arquitetura de Mapeamento Completo de Produtos WooCommerce & Integração de Plugins

- **Status:** Accepted
- **Data:** 2026-09-02
- **Autor:** Jeferson Amorim / Antigravity Agent
- **Contexto:** Projeto CASOSEX Dropshipping Sovereign
- **Doutrina:** `medido=verdade` (Inspecionado via WP-CLI e Banco de Dados MySQL no Produto `#1135`)

---

## Contexto & Motivação

A plataforma CASOSEX utiliza uma pilha integrada composta pelo Tema **Blocksy PRO**, gateway **PagBank**, emissor fiscal **Omie ERP**, plugins de cálculo de frete, além do plugin soberano **CasoSex Dropshipping Sync**.

Para garantir que a ingestão de catálogo em massa (provinda do fornecedor INTT B2B) não cause regressões visuais, erros fiscais ou inconsistências nos relatórios financeiros (DRE), foi realizada uma varredura "até o osso" no produto Padrão Ouro (`#1135`).

Este documento estabelece a especificação técnica formal das 54 meta keys e 6 taxonomias consumidas e produzidas pelos plugins ativos no ecossistema WooCommerce.

---

## Decisão de Arquitetura

### 1. Mapeamento de Atribuição por Plugin

| Plugin / Componente | Papel no Ecossistema | Meta Keys & Taxonomias Consumidas / Produzidas |
|---|---|---|
| **Blocksy Companion PRO** (`2.1.52`) | Vitrine CRO, Galeria HD Zoom, Gaveta Hover de Checkout e Badges. | `_thumbnail_id`, `_product_image_gallery`, `blocksy_post_meta_options` |
| **WooCommerce Core** (`11.0.1`) | Catálogo, estoque, precificação pública e variação. | `_sku`, `_price`, `_regular_price`, `_stock`, `_manage_stock`, `_tax_status`, `product_cat`, `product_type` |
| **WooCommerce Dropshipping** (`5.2.7`) | Mapeamento logístico de expedição pelo fornecedor. | `supplier`, `dropship_supplier` (Term ID: `69`), `_casosex_supplier` |
| **PagBank for WooCommerce** (`2.0.2`) | Cálculo dinâmico de parcelamento (12x) e PIX 5% OFF na ficha/card. | `_price`, `_regular_price`, `_gtin` (Rastreabilidade PagBank) |
| **Shipping Simulator / Better Shipping** | Simulação de frete e prazo diretamente na ficha do produto. | `_weight` (Peso Bruto com caixa), `_length`, `_width`, `_height` |
| **CasoSex Dropshipping Sync** (`2.6.0`) | Sync 2x/dia, Trava de Estoque ($\le 5$ un), Custo B2B e Conteúdo CRO. | `_cost_of_goods`, `_casosex_cost_price`, `_casosex_usage`, `_casosex_care`, `_casosex_content`, `_weight_net`, `_casosex_stock_type` |
| **Omie ERP Integrator** | Emissão automatizada de NFe e gestão fiscal de pedidos. | `_ncm`, `_gtin`, `_casosex_supplier_cnpj` (`21.725.006/0001-04`) |
| **Stackable / Greenshift Builders** | Blocos Gutenbergs avançados e animações de alto padrão. | `stackable_optimized_css`, `stackable_optimized_css_raw` |

---

## Inventário Formal de Meta Keys (54 Campos Auditados)

1. **Núcleo WooCommerce:** `_sku`, `_price`, `_regular_price`, `_manage_stock`, `_stock`, `_stock_status`, `_backorders`, `_sold_individually`, `_virtual`, `_downloadable`, `_download_limit`, `_download_expiry`, `_tax_status`, `_tax_class`, `total_sales`, `_wc_average_rating`, `_wc_review_count`, `_product_version`.
2. **Fiscal & Rastreabilidade Global:** `_gtin` (EAN-13), `_barcode`, `_global_unique_id`, `_ncm` (Classificação fiscal Omie).
3. **Logística & Cubagem:** `_weight` (Peso bruto com caixa), `_weight_net` (Peso líquido do líquido/produto), `_length`, `_width`, `_height`.
4. **Financeiro & Margem DRE:** `_cost_of_goods`, `_casosex_cost_price`, `custom_field`.
5. **Dropshipping & Governança:** `_casosex_supplier`, `_casosex_supplier_id` (`69`), `_casosex_supplier_cnpj`, `_casosex_stock_type` (`dropshipping_intt`), `supplier`.
6. **Conteúdo & CRO:** `_casosex_brand`, `_casosex_volume`, `_casosex_active_ingredients`, `_casosex_origin`, `_casosex_usage`, `_casosex_care`, `_casosex_content`, `_custom_product_text_field_description`, `custom_field_description`.
7. **Mídia HD:** `_thumbnail_id`, `_product_image_gallery`.
8. **Atributos & Layout:** `_product_attributes`, `_default_attributes`, `attribute_opcao`, `_variation_description`, `blocksy_post_meta_options`, `stackable_optimized_css`, `stackable_optimized_css_raw`, `_edit_lock`.

---

## Taxonomias Vinculadas

1. **`product_cat`**: Categoria em 3 níveis (ex: `Géis Sensacionais`, Term ID: `173`).
2. **`product_brand`**: Marca oficial (ex: `INTT`, Term ID: `179`).
3. **`dropship_supplier`**: Termo de Fornecedor (ex: `INTT Dropshipping Nacional`, Term ID: `69`).
4. **`product_type`**: Tipo de produto (`variable`, Term ID: `6`).
5. **`product_visibility`**: Visibilidade de estoque (`instock`/`outofstock`).
6. **`product_tag`**: Tags de busca (`INTT`, `Sex Shop`, `Gel Erótico`, `Dropshipping Nacional`).

---

## Consequências & Validação

- **Status:** Aceito e em vigor.
- **Validação:** Inspecionado e validado no banco de dados local através do produto `#1135`.
- **Compatibilidade:** O motor de ingestão `wp/omie/intt_catalog_ingest.py` deve popular rigorosamente estas 54 meta keys para todos os ~500 SKUs a serem importados.
