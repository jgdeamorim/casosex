# SPEC-0095: Omie ERP Integration Shape & Data Mapping

- **Status:** Approved / Grounded
- **Data:** 2026-09-01
- **Empresa Cadastrada:** 57.997.882 BRUNO AMIN COSTA DA SILVA (CNPJ: 57.997.882/0001-29)
- **App Key:** 8125761540897
- **Corpus Target:** `casosex-inspiration` | **Tag:** `omie`

---

## 🎯 Visão Geral do Pipeline Omie ERP <-> WooCommerce CASOSEX

O Omie ERP atua como a **fonte soberana de Faturamento, NF-e, Clientes e Controle Financeiro/Estoque** para as operações Físicas e B2B do CASOSEX.

```
┌───────────────────────────────────────────────────────────┐
│               WOOCOMMERCE CASOSEX (LOCAL)                 │
│  ├── Varejo (Dropshipping External)                       │
│  └── Revenda (Atacado B2B - Estoque Físico Local)         │
└─────────────────────────────┬─────────────────────────────┘
                              │
               (Webhook / Rest API Ingestor)
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                  OMIE ERP INTEGRATOR                      │
│  ├── App Key: 8125761540897                               │
│  └── Endpoint Base: https://app.omie.com.br/api/v1/       │
└─────────────────────────────┬─────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
[Faturamento / NF-e]  [Gestão de Estoque]  [Contas a Receber]
 (pedidovendafat)       (movestoque)        (contareceber)
```

---

## 📐 Shape do Mapeamento de Ponta a Ponta

### 1. Clientes / Revendedores B2B (`geral/clientes`)
- **Endpoint Omie:** `https://app.omie.com.br/api/v1/geral/clientes/`
- **Call Omie:** `IncluirCliente` / `AlterarCliente` / `ListarClientes`
- **Fluxo:** Quando um revendedor se cadastra no `Whols Pro`, o `casosex-dropshipping-pipeline` envia o CNPJ/CPF e dados cadastrais para o Omie criar/atualizar a ficha do cliente.

### 2. Pedidos de Venda B2B / Estoque Físico (`produtos/pedido`)
- **Endpoint Omie:** `https://app.omie.com.br/api/v1/produtos/pedido/`
- **Call Omie:** `IncluirPedidoVenda`
- **Payload Shape:**
  ```json
  {
    "cabecalho": {
      "codigo_cliente_integracao": "CASOSEX-USER-102",
      "codigo_pedido_integracao": "WC-ORDER-99201",
      "etapa": "10"
    },
    "detalhes": [
      {
        "ide": { "codigo_item_integracao": "SKU-INTT-001" },
        "produto": {
          "codigo_produto_integracao": "SKU-INTT-001",
          "quantidade": 10,
          "valor_unitario": 45.00
        }
      }
    ]
  }
  ```

### 3. Faturamento & NF-e (`produtos/pedidovendafat`)
- **Endpoint Omie:** `https://app.omie.com.br/api/v1/produtos/pedidovendafat/`
- **Call Omie:** `FaturarPedidoVenda`
- **Fluxo:** Assim que o pedido de revenda B2B é separado no galpão, o Omie emite a Nota Fiscal Eletrônica (NF-e) e gera a cobrança.

---

## 🔬 Resultados da Suíte de Teste Probe (`probe_eval_omie.py`)

- **Empresas (`geral/empresas`):** `PASS` (Empresa `57.997.882 BRUNO AMIN COSTA DA SILVA` validada).
- **Clientes (`geral/clientes`):** `PASS` (Total de 9 clientes cadastrados lidos com sucesso).
- **Produtos (`geral/produtos`):** `PASS` (Conectividade 100% ok).
- **Pedidos (`produtos/pedido`):** `PASS` (Total de 3 pedidos de venda ativos lidos).

---

## 📁 Estrutura de Documentos e Evidências Salvas (`medido=verdade`)

1. **Documentação Oficial da API Omie (138 Serviços HTML):**
   - Diretório: `/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/docs/`
   - Sumário Executivo: `catalog.json`
2. **Central de Ajuda Omie:**
   - Diretório: `/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/docs/ajuda/index.html`
3. **Credenciais Seguras:**
   - `.env.OMIE` em `/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/.env.OMIE`
