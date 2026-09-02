# ADR-0227: Arquitetura de Sincronização Automática via Cron (INTT Live Sync & Curadoria Humana)

**Status:** Aceito (Accepted)  
**Data:** 2026-09-02  
**Contexto:** Ecossistema CASOSEX — Dropshipping Nacional INTT  
**Autor:** Jeferson Amorim (Founder) / Antigravity Agent  

---

## 1. Contexto e Problema

Anteriormente, o processo de importação de estoque/produtos dependia de arquivos CSV manuais do plugin legacy. Essa abordagem era propensa a falhas, causava desalinhamento de estoque em tempo real e exigia intervenção operacional constante para download e upload de planilhas.

Com a disponibilização do portal `https://www.lojaintt.com.br/v2/login`, é possível realizar o scraping/ingestão direta via API de todos os produtos do catálogo INTT, atualizando estoque, custos e imagens em tempo real.

---

## 2. Decisão Arquitetural

Decide-se substituir o fluxo de importação manual CSV por uma **Esteira de Sincronização Automática via Cron (INTT Live Sync)** associada a um filtro de **Curadoria Humana (Human-in-the-Loop)** no WooCommerce.

### 2.1. Fluxo de Funcionamento (Cron & Ingestão)

```
[ INTT Portal (v2/login) ]
            │
            ▼ (Cron Job / Worker Recorrente)
[ intt_catalog_ingest.py ] ──► Extrai SKU, Nome, Descrição, Fotos, Custo, Estoque e Atributos
            │
            ▼
[ WooCommerce REST API / WP-Cron ]
            │
            ├──► PRODUTO NOVO? ──► Salva com post_status = 'pending' (Rascunho / Aguardando Curadoria)
            │
            └──► PRODUTO EXISTENTE? ──► Atualiza apenas Estoque, Custo e Preço (Preserva post_status)
```

### 2.2. Mapeamento Completo de Campos WooCommerce

Cada produto vindo da INTT é enriquecido no WooCommerce com a seguinte estrutura de campos:

| Campo WooCommerce | Origem / Regra INTT | Finalidade Operacional |
| :--- | :--- | :--- |
| `post_title` | `name` do catálogo INTT | Nome comercial do produto |
| `post_content` | `description` do portal INTT | Descrição detalhada e modo de uso |
| `post_excerpt` | `short_description` | Resumo para cards da loja virtual |
| `sku` | `INTT-<codigo_produto>` | SKU único e rastreável |
| `_regular_price` | Preço sugerido ou `cost_price * 2.0` | Preço de tabela |
| `_price` | Preço de venda calculado | Preço ativo na loja |
| `_manage_stock` | `true` | Habilita controle estrito de estoque |
| `_stock` | Quantidade real disponível na INTT | Evita venda sem estoque na matriz |
| `_stock_status` | `instock` ou `outofstock` | Status visual de estoque |
| `_casosex_cost_price` | `cost_price` INTT | Cálculo de margem em tempo real |
| `_casosex_supplier_id` | `69` | Vínculo fixo com o fornecedor INTT |
| `_casosex_supplier_cnpj`| `21.725.006/0001-04` | CNPJ de despacho fiscal |
| `_casosex_stock_type` | `dropshipping_intt` | Roteamento de pedido (B2C Dropshipping) |
| `post_status` | Novos: `pending` / Existentes: Mantém | Filtro de aprovação pelo operador |

---

## 3. Governança da Curadoria Humana (Pending -> Publish)

1. **Automação Sem Poluição:** Novos produtos descobertos no catálogo INTT **NUNCA** são publicados automaticamente como visíveis na loja virtual.
2. **Status 'Pendente' (`pending`):** Ficam retidos no WooCommerce sob a aba **"Pendente"** (`http://localhost:8085/wp-admin/edit.php?post_status=pending&post_type=product`).
3. **Validação do Operador:** O operador CASOSEX revisa título, imagens, margem de preço e copy.
4. **Publicação (`publish`):** Uma vez aprovado pelo operador, o produto passa para `publish` e se torna público no e-commerce.

---

## 4. Agendamento via Cron

O script `wp/omie/intt_catalog_ingest.py` pode ser acionado:
- Via **WP-Cron** (hook interno de evento registrado no WooCommerce).
- Via **Crontab do Sistema (Docker Worker)**: Executado de 6 em 6 horas (ou de 1 em 1 hora para atualização de estoque).

---

## 5. Consequências e Benefícios

- **Zero Trabalho Manual com CSV:** Eliminação total de uploads manuais e arquivos de planilha desatualizados.
- **Estoque Sempre Sincronizado:** Impedimento de vendas de produtos esgotados na matriz INTT.
- **Controle de Qualidade:** Curadoria humana garante que novos itens só fiquem visíveis na loja após revisão de precificação e branding.
- **Auditoria Medida:** Cada ingestão gera logs estruturados no ecossistema OODA/Redis.
