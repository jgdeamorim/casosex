# ADR-0226: Governança de Roteamento Duplo de Pedidos WooCommerce — Dropshipping INTT (B2C) vs Revenda B2B / Atacado (Whols Pro)

**Status:** Aceito  
**Data:** 2026-09-02  
**Autor:** Jeferson Amorim (Founder) / Antigravity AI  
**Domínio:** CASOSEX — WooCommerce & Supply Chain Architecture  

---

## 1. Contexto & Desafio Operacional

A **CASOSEX** consolida sua operação em um modelo híbrido dual-channel no WooCommerce (`casosex-wordpress`), atendendo dois perfis de público distintos com regras de suprimento e logística opostas:

1. **Dropshipping Nacional INTT (B2C):**
   - **Público:** Consumidores finais (loja pública varejo).
   - **Suprimento:** Catálogo virtual sincronizado da INTT (`lojaintt.com.br/v2/`).
   - **Logística:** Despacho direto pela INTT em formato *White Label* com romaneio PDF contendo o CPF/CNPJ do destinatário final.
   - **Financeiro:** Compra efetuada pela CASOSEX no portal B2B da INTT após compensação do pagamento do cliente final no WooCommerce.

2. **Atacado / Revenda B2B (Whols Pro):**
   - **Público:** Revendedores autorizados cadastrados via painel Whols (`page=whols-admin#/dashboard`).
   - **Suprimento:** **Exclusivamente Estoque Próprio / Físico da CASOSEX** (sem dependência de fornecedores externos).
   - **Logística:** Expedição interna do depósito físico CASOSEX.
   - **Financeiro:** Precificação diferenciada com descontos progressivos por faixa de quantidade.

O desafio consiste em garantir que o WooCommerce diferencie e isole rigidamente estes fluxos na gestão unificada de pedidos (`wc-orders`), evitando que pedidos de revendedores disparem ordens na INTT ou que pedidos dropshipping deem baixa indevida no estoque físico próprio.

---

## 2. Decisões Arquiteturais Adotadas

### 2.1. Execução Incremental em Duas Fases Estritas

- **FASE 1 (Foco Atual Imediato):** 
  Institucionalização e sanitização 100% da esteira de **Dropshipping Nacional INTT (B2C)** no plugin `woocommerce-dropshipping`, incluindo:
  - Wizard simplificado de 5 etapas em pt-BR.
  - Romaneio PDF White Label com CPF/CNPJ do destinatário final.
  - Cockpit de aprovação humana de pedidos com automação agêntica de checkout na INTT (`lojaintt.com.br/v2/login`).

- **FASE 2 (Fase Sequencial):** 
  Análise e refinamento da **Revenda Interna / Atacado B2B** no plugin **Whols Pro** (`whols-admin`), configurando regras de preço por faixa de quantidade e amarrações de estoque próprio.

### 2.2. Governança e Taxonomia Unificada em `wc-orders`

Todos os pedidos da plataforma serão processados centralidamente na página nativa `http://localhost:8085/wp-admin/admin.php?page=wc-orders` através de colunas personalizadas e meta-tags de diferenciação:

| Identificador em `wc-orders` | Origem da Venda | Origem do Estoque | Destino do Despacho | Ação Operacional |
| :--- | :--- | :--- | :--- | :--- |
| 📦 **`Dropshipping: INTT`** | Varejo B2C | Estoque Virtual INTT | Portal INTT (`lojaintt.com.br/v2/`) | Confirmação Humana + Script Agêntico INTT |
| 🏷️ **`Atacado B2B (Whols)`** | Painel Revendedor | Estoque Físico CASOSEX | Depósito Próprio CASOSEX | Separação Interna + NF-e Própria |
| 🏪 **`Varejo (Estoque Próprio)`** | Varejo B2C | Estoque Físico CASOSEX | Depósito Próprio CASOSEX | Separação Interna + Correios/Melhor Envio |

### 2.3. Cockpit de Confirmação Humana (Human-in-the-Loop) para Dropshipping INTT

Para eliminar riscos de prejuízo financeiro ou envio com dados incorretos, adota-se a política **Human-in-the-Loop**:
1. **Gatilho de Pagamento:** Somente pedidos com status `processing` (pagamento compensado via PIX/Cartão no WooCommerce) são liberados para o Cockpit INTT.
2. **Aprovação em 1-Clique:** O operador valida visualmente margem, frete e CPF do cliente final.
3. **Execução Agêntica:** O script Python/Playwright autentica na INTT (`lojaintt.com.br/v2/login`), monta o carrinho com os SKUs, insere os dados do destinatário final e devolve a chave PIX da INTT para pagamento rápido pela CASOSEX.

---

## 3. Consequências & Ganhos

- **Isolamento de Estoque:** Impedimento total de concorrência ou baixa indevida entre o estoque físico da CASOSEX e o catálogo virtual da INTT.
- **Transparência Operacional:** A equipe visualiza instantaneamente na tela `wc-orders` o destino de cada pedido sem necessidade de abrir item por item.
- **Risco Financeiro Zero:** O pagamento na INTT só ocorre após a confirmação inequívoca do recebimento do valor do cliente final.
- **Auditabilidade Medida (`medido=verdade`):** Rastreabilidade total entre o ID do pedido no WooCommerce, a ordem de compra INTT e os registros no ERP (Omie/Bling).
