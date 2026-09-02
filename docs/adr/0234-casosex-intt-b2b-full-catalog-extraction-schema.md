# ADR-0234: Especificação Mestra de Extração de Catálogo B2B INTT ➔ WooCommerce

- **Status:** Accepted
- **Data:** 2026-09-02
- **Autor:** Jeferson Amorim / Antigravity Agent
- **Contexto:** Projeto CASOSEX Dropshipping Sovereign
- **Doutrina:** `medido=verdade` (Grounding no Código-Fonte e no Banco de Dados)

---

## Contexto & Motivação

Para assegurar paridade absoluta entre a fábrica/distribuidora INTT e a vitrine de alta conversão da CASOSEX, fez-se necessária a padronização estrita do contrato de dados extraídos do portal B2B (`lojaintt.com.br`) e injetados via `wp/omie/intt_catalog_ingest.py` e `casosex-dropshipping-sync.php` no WooCommerce.

Após auditoria live no portal do fornecedor (`https://www.lojaintt.com.br` e `https://www.lojaintt.com.br/v2/login`) e homologação no banco de dados nos produtos `#1135` (Padrão Ouro) e `#1204`, este documento formaliza o contrato de 24 campos para toda a ingestão em massa dos ~500 SKUs do catálogo INTT.

---

## Decisão de Arquitetura: Esquema Mestre de 24 Atributos e Meta Keys

Cada produto e variação do fornecedor INTT deve ser extraído e persistido com os seguintes campos e meta keys no WooCommerce:

| # | Campo / Meta Key WooCommerce | Tipo | Origem no Fornecedor (INTT) | Destino / Utilidade no WooCommerce |
|---|---|---|---|---|
| **01** | `name` | String | Nome Comercial | Título principal da página e vitrine (`post_title`). |
| **02** | `sku` | String (Única) | Código de Referência B2B | Paridade SKU ↔ SKU e chave idempotente (`INTT-<ref>`). |
| **03** | `type` | String | Estrutura de Variação | `variable` / `variation` (Sabor, Volume, Aroma). |
| **04** | `status` | String | Trava de Governança | `pending` (Novos SKUs) / `publish` (Sincronizados). |
| **05** | `description` | HTML String | Descrição Completa B2B | Descrição técnica detalhada da página do produto. |
| **06** | `short_description` | Text String | Resumo Comercial | Resumo nos cards de listagem e na gaveta hover CRO. |
| **07** | `_casosex_cost_price` | Float (R$) | Preço de Custo Atacado B2B | Preço de custo de fábrica para cálculo de DRE. |
| **08** | `_cost_of_goods` | Float (R$) | Preço de Custo Atacado B2B | Sincronizado via hook nativo WooCommerce Cost of Goods. |
| **09** | `regular_price` / `price` | Float (R$) | Tabela Sugerida / Venda | Preço público de venda final na loja. |
| **10** | `manage_stock` | Boolean | Controle da Fábrica | `true` (Gerenciamento estrito de saldo). |
| **11** | `stock_quantity` | Integer | Saldo Físico B2B | Quantidade real (com trava de segurança se $\le 5$ un). |
| **12** | `stock_status` | String | Status de Estoque | `instock` / `outofstock` (Marca fora de estoque se $\le 5$). |
| **13** | `_gtin` | String | Código EAN de Barras | Código EAN 789... oficial (Google Shopping / PMax). |
| **14** | `_barcode` / `_global_unique_id`| String | Código EAN de Barras | Compatibilidade com gateways e sistemas fiscais. |
| **15** | `_ncm` | String | NCM Fiscal | Classificação fiscal para emissão de NF-e via Omie. |
| **16** | `weight` / `_weight` | Float (kg) | Peso Bruto da Embalagem | Cálculo exato de frete (Correios / J&T / Melhor Envio). |
| **17** | `_weight_net` | Float (kg) | Peso Líquido do Produto | Conteúdo real da embalagem (ex: 50g / 50ml). |
| **18** | `length` / `width` / `height` | Float (cm) | Dimensões da Caixa (C x L x A)| Dimensões para cálculo de cubicagem logístico. |
| **19** | `_casosex_supplier` | String | Fornecedor | `INTT` |
| **20** | `_casosex_supplier_id` | String / Int | Termo de Atributo | `69` (Taxonomia de Fornecedores). |
| **21** | `_casosex_supplier_cnpj` | String | Cadastro Nacional | `21.725.006/0001-04` (CNPJ faturamento B2B). |
| **22** | `_casosex_stock_type` | String | Roteamento Logístico | `dropshipping_intt`. |
| **23** | `_casosex_usage` / `_care` | HTML String | Modo de Uso / Cuidados | Conteúdo enriquecido em abas técnicas e SEO. |
| **24** | `images` | Array de URLs | Galeria Zoom CDN | Thumbnail HD (`_thumbnail_id`) + Galeria (`_product_image_gallery`). |

---

## Governança de Sincronização Agendada (Cron 2x/Dia)

A rotina `casosex_cron_intt_stock_cost_sync` (`twicedaily`) executa sem intervenção humana:
1. Recalcula o saldo real de estoque e aplica a **Trava de Segurança de 5 unidades** (se estoque na fábrica $\le 5$, marca `outofstock`).
2. Sincroniza oscilações de preço de custo (`_cost_of_goods` e `_casosex_cost_price`) para manter a margem bruta auditada.

---

## Consequências & Status

- **Status:** Aceito e Ativo.
- **Validação:** Auditado no WooCommerce (IDs `#1135` e `#1204`).
- **Próximos Passos:** Liberação para execução em massa dos ~500 produtos INTT via `wp/omie/intt_catalog_ingest.py`.
