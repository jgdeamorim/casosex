# ADR-0236: Arquitetura do Fluxo de Dados Ponta-a-Ponta (INTT B2B ➔ WooCommerce ➔ Blocksy ➔ PagBank ➔ Omie)

- **Status:** Accepted
- **Data:** 2026-09-02
- **Autor:** Jeferson Amorim / Antigravity Agent
- **Contexto:** Projeto CASOSEX Dropshipping Sovereign
- **Doutrina:** `medido=verdade` (Grounding em Código-Fonte, Hooks do WordPress e Schemas de Banco de Dados)

---

## Contexto & Motivação

Para assegurar que o ecossistema CASOSEX opere como uma plataforma e-commerce B2B/B2C soberana de alta performance e conversão, foi estabelecido o mapeamento end-to-end do fluxo de dados. 

Esta ADR documenta as **6 conexões sistêmicas** que interligam a extração do fornecedor INTT, o banco de dados WooCommerce, a renderização CRO no Tema Blocksy PRO, a simulação logístico/fiscal, o parcelamento PagBank e a transmissão para emissão de Nota Fiscal no Omie ERP.

---

## Decisão de Arquitetura: As 6 Conexões do Fluxo de Dados

```
[ INTT B2B Portal ] ──(1. Extrator Python)──> [ WooCommerce Core ] ──(2. Hooks Blocksy PRO)──> [ Vitrine & Cards CRO ]
                                                       │
                                 ┌─────────────────────┼─────────────────────┐
                                 ▼                     ▼                     ▼
                       (3. Gateway PagBank)   (4. Cubagem Frete)    (5. Omie NFe ERP)
                       12x & PIX 5% OFF        Correios / J&T       GTIN + NCM Fiscal
```

### 1. Conexão Origem ➔ Motor de Ingestão (`wp/omie/intt_catalog_ingest.py`)
- **Extração**: Raspagem B2B autenticada com cookies de sessão mantidos.
- **Mapeamento**:
  - Código B2B ➔ `_sku` (`INTT-<ref>`).
  - Preço Atacado ➔ `_casosex_cost_price` & `_cost_of_goods`.
  - Preço Sugerido ➔ `_regular_price` & `_price`.
  - Estoque Físico ➔ `_stock` com Trava Crítica (se saldo $\le 5$, marca `outofstock`).
  - Imagens Zoom CDN ➔ `_thumbnail_id` + `_product_image_gallery`.
  - Scraping HTML ➔ `_casosex_usage` (Modo de Uso) e `_casosex_care` (Precauções).

### 2. Conexão WooCommerce ➔ Tema Blocksy PRO & UX CRO
- **Card e Vitrine**: O hook `blocksy:woocommerce:product-card:summary:after` injeta o componente de precificação dinâmica da CASOSEX.
- **Exibição Dinâmica**:
  - `_casosex_volume` exibido no badge do card (ex: `16g`, `50ml`).
  - Imagem principal com transição suave para imagem de galeria no hover.
  - Carregamento assíncrono da gaveta de checkout sem quebrar o layout SWC/React.

### 3. Conexão WooCommerce ➔ Gateway PagBank (Checkout)
- **Parcelamento & PIX**: A partir do `_price`, calcula automaticamente parcelas de até 12x e aplicação do desconto de 5% no PIX.
- **Antifraude**: O código `_gtin` (EAN 789...) é enviado como ID único de produto para validação nas rotinas de segurança do PagBank.

### 4. Conexão Logística ➔ Cálculo de Frete & Cubagem
- **Frete Bruto**: A calculadora de frete consome `_weight` (peso bruto da embalagem em kg) + `_length`, `_width`, `_height` (dimensões da caixa em cm).
- **Ficha Técnica**: O metadado `_weight_net` exibe o conteúdo líquido real (ex: 16g / 50ml) nas especificações.

### 5. Conexão Fiscal ➔ Emissão de NF-e via Omie ERP
- **Identificação Fiscal**: `_ncm` (`3304.99.90`) + `_gtin` (EAN-13) + `_casosex_supplier_cnpj` (`21.725.006/0001-04`) garantem o faturamento automático e a emissão da NF-e no Omie ERP.

### 6. Conexão de Governança ➔ Cron Agendado 2x/Dia (`casosex-dropshipping-sync.php`)
- **Background Sync**: Disparado via `wp-cron` no Linux para atualizar saldos de estoque e preço de custo, garantindo margem DRE precisa (`_cost_of_goods`).

---

## Consequências & Status

- **Status:** Aceito e Ativo.
- **Validação:** Auditado no WooCommerce local através dos produtos `#1135` e `#1204`.
- **Próximos Passos:** Liberação para execução em massa dos ~500 produtos INTT via `wp/omie/intt_catalog_ingest.py`.
