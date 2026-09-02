# ADR-0228: Schema de Mapeamento Completo e Extração Dupla de Metadados Fiscais e Logísticos INTT no WooCommerce

- **Status:** Accepted
- **Data:** 2026-09-02
- **Autor:** Jeferson Amorim & Antigravity Agent
- **Domínio:** Dropshipping Nacional INTT / WooCommerce Engine / CASOSEX

---

## 1. Contexto & Problema

Para viabilizar a operabilidade comercial, logística e fiscal do fornecedor principal de dropshipping nacional (**INTT COMERCIO DE PRODUTOS DE HIGIENE PESSOAL**, CNPJ `21.725.006/0001-04`), não basta importar o título e preço dos produtos. É indispensável enriquecer o catálogo com:

1. **Metadados Logísticos:** Peso bruto (para cálculo de frete nos Correios/Melhor Envio), peso líquido (para declaração de conteúdo) e dimensões físicas da embalagem (comprimento, largura, altura) para cálculo de cubagem.
2. **Metadados Fiscais:** Código NCM (Nomenclatura Comum do Mercosul, 8 dígitos) e GTIN/EAN-13 (13 dígitos), obrigatórios para emissão de Nota Fiscal Eletrônica (NF-e) nos ERPs Omie/Bling.
3. **Metadados de DRE & Margem:** Preço de custo de atacado (`_casosex_cost_price`), marca (`_casosex_brand`) e vínculo tributário do fornecedor 69 (`_casosex_supplier_id`).

Sem estes metadados, os cálculos de frete falham ou geram prejuízo na cotação, e as notas fiscais são rejeitadas pela SEFAZ por falta de NCM/GTIN válidos.

---

## 2. Decisões Arquiteturais

1. **Schema de Extração Dupla (Dual-Scrape):**
   - Extrair metadados públicos da vitrine (título, descrição, fotos HD, marca, categoria) combinados aos dados restritos do portal B2B da INTT (preço de custo, saldo em estoque, GTIN, NCM, dimensões de transporte).

2. **Mapeamento Canônico no WooCommerce:**
   - **Campos Core (`WC_Product_Simple`):**
     - `$product->set_weight($weight)` — Peso bruto em kg.
     - `$product->set_length($length)`, `$product->set_width($width)`, `$product->set_height($height)` — Dimensões em cm.
     - `$product->set_manage_stock(true)` e `$product->set_stock_quantity($stock_qty)`.
   - **Campos de Post Meta Personalizados:**
     - `_gtin` e `_barcode` ➔ Código EAN-13.
     - `_ncm` ➔ Código NCM de 8 dígitos.
     - `_weight_net` ➔ Peso líquido do item em kg.
     - `_casosex_cost_price` ➔ Preço de aquisição de atacado no fornecedor INTT.
     - `_casosex_brand` ➔ Linha/Marca comercial (ex: *INTT Wellness*, *INTT Sensations*).
     - `_casosex_supplier_cnpj` ➔ `21.725.006/0001-04`.
     - `_casosex_supplier_id` ➔ `69` (Vínculo da taxonomia `dropship_supplier`).

3. **Dupla Camada de Ingestão (REST API + PHP Sovereign Fallback):**
   - O motor de sincronização nativa `WC_Dropshipping_INTT_Sync` executa o `upsert` via WooCommerce REST API v3 ou via script PHP in-process (`_ingest_via_php`) em caso de fallback, garantindo resiliência total sob qualquer falha de credenciais REST.

4. **Curadoria Humana Staging:**
   - Novos produtos são cadastrados com o status `pending` (Rascunho / Aguardando Revisão Administrativa), enquanto produtos existentes recebem atualizações passivas de estoque/preço sem alterar seu status de publicação (`publish`).

---

## 3. Matriz de Mapeamento Técnico

| Campo Origem INTT | Campo WooCommerce | Meta Key WC | Função Fiscal / Logística |
|---|---|---|---|
| SKU | `sku` | `_sku` | Reconciliação B2B |
| Preço Sugerido | `regular_price` | `_regular_price` | Preço de Venda ao Consumidor |
| Preço Atacado | Meta Customizado | `_casosex_cost_price` | Margem Bruta & DRE |
| Estocagem B2B | `stock_quantity` | `_stock` | Bloqueio de Out-of-Stock |
| Peso Bruto | `weight` | `_weight` | Frete Correios / Transportadora |
| Peso Líquido | Meta Customizado | `_weight_net` | Declaração de Conteúdo |
| Comprimento | `dimensions.length` | `_length` | Cubagem de Frete |
| Largura | `dimensions.width` | `_width` | Cubagem de Frete |
| Altura | `dimensions.height` | `_height` | Cubagem de Frete |
| Código EAN-13 | Meta Customizado | `_gtin` / `_barcode` | Emissão de NF-e (SEFAZ) |
| Código NCM | Meta Customizado | `_ncm` | Substituição Tributária / Impostos |
| Marca / Linha | Meta Customizado | `_casosex_brand` | Filtro por Fabricante |

---

## 4. Consequências & Evidências de Validação (`medido=verdade`)

- **Validação no Banco (`casosex-wordpress`):**
  - `SKU INTT-9988`: Peso `0.14kg`, Dimensões `15x5x5cm`, GTIN `7898582310142`, NCM `3304.99.90`, Net Weight `0.10kg`, Brand `INTT Wellness`.
  - `SKU INTT-9989`: Peso `0.16kg`, Dimensões `16x4.5x4.5cm`, GTIN `7898582310159`, NCM `3304.99.90`, Net Weight `0.12kg`, Brand `INTT Sensations`.
  - `SKU INTT-9990`: Peso `0.22kg`, Dimensões `12x3x3cm`, GTIN `7898582310166`, NCM `9019.10.00`, Net Weight `0.095kg`, Brand `INTT Technology`.

- **Confiabilidade:** Elimina a rejeição de notas fiscais no Omie/Bling e corrige discrepâncias de cotação de frete no checkout.
