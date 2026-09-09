# ADR-0238: Schema de Mapeamento Rico e Ingestão de Catálogo Regional INTT ES via API Mercos B2B no WooCommerce

- **Data / Timestamp:** 2026-09-09T08:46:00-03:00
- **Status:** Ratificado (Accepted)
- **Domínio:** Suprimentos / Dropshipping Regional ES / Mercos B2B Engine / WooCommerce Schema / CASOSEX

---

## 1. Contexto e Problema

A validação empírica (`medido=verdade`) da API B2B da plataforma Mercos (`https://app.mercos.com/api_b2b/v1/produtos/`) do atacadista regional **INTT Espírito Santo** revelou um catálogo de **+2.400 produtos** equipados com metadados de alta fidelidade:
- Nomes comerciais sanitizados
- Fotos HD hospedadas em CDN CloudFront (`https://arquivos.mercos.com/media/...`)
- Descrições técnicas com modo de uso, precauções, modo de conservação e composição química
- Dimensões físicas (altura, largura, comprimento) e peso bruto em kg
- Categorias organizadas e marcas/representadas (`INTT ES`)

Faz-se necessário formalizar a especificação do **Schema de Ingestão e Mapeamento Rico** destes ~2.400 produtos para o WooCommerce local, garantindo compatibilidade com o catálogo existente da matriz e isolamento do fornecedor regional.

---

## 2. Decisão Arquitetural

1. **Mapeamento de Campos Mercos API ➔ WooCommerce (`postmeta`):**

   | Campo Mercos API | Campo WooCommerce | Meta Key WC | Regra de Transformação |
   | :--- | :--- | :--- | :--- |
   | `codigo` | `sku` | `_sku` | Prefixo fixo: `INTT-ES-<codigo>` (ex: `INTT-ES-IN0159`). |
   | `nome` | `post_title` | N/A | Título sanitizado do produto. |
   | `informacoes_adicionais` | `post_content` | N/A | Descrição HTML completa (uso, precauções e composição). |
   | `imagens` | `_product_image_gallery` | `_thumbnail_id` | Importação e vinculação das URLs HD CloudFront da galeria Mercos. |
   | `peso_bruto` | `weight` | `_weight` | Peso bruto em kg para cálculo de frete. |
   | `altura`, `largura`, `comprimento` | `dimensions` | `_height`, `_width`, `_length` | Dimensões em cm. |
   | `representada.nome` | Brand Term | `_casosex_brand` | Atribuição da marca/linha (`INTT ES`). |
   | `categorias` | Taxonomy Term | `product_cat` | Mapeamento automático para as categorias do WooCommerce. |
   | N/A | Supplier Meta | `_casosex_supplier_id` | Valor fixo `70` (INTT ES Regional). |
   | N/A | Stock Type | `_casosex_stock_type` | `dropshipping_intt_es`. |

2. **Cruzar NCM e GTIN com a Matriz INTT:**
   - O script de ingestão executa o cruzamento de SKUs (`IN0159` $\leftrightarrow$ `INTT-0159` da matriz) para herdar o NCM fiscal e GTIN/EAN de fábrica quando disponíveis no catálogo da matriz.

3. **Status de Ingestão Inicial:**
   - Todo produto importado do INTT ES entra com `post_status = 'pending'` (rascunho para curadoria humana) ou é vinculado ao produto pai equivalente caso já exista no WooCommerce.

4. **Script de Automação Executável:**
   - Criação do script dedicado [`wp/omie/mercos_intt_es_ingest.py`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/mercos_intt_es_ingest.py) para orquestrar o fetching paginado (48 itens/pág), autenticação Bearer e upsert via WooCommerce REST API.

---

## 3. Consequências

- **+2.400 Itens Sincronizados:** Catálogo regional completo do Espírito Santo disponível no WooCommerce.
- **Roteamento Inteligente:** Frete reduzido e entrega expressa local identificada por `_casosex_supplier_id = 70`.
- **Rastreabilidade Factual (`medido=verdade`):** Auditabilidade total no banco do WooCommerce, Redis `:6396` e Qdrant `casosex-self`.
