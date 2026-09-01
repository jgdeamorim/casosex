# ADR-0223: Arquitetura Dual-Channel E-Commerce (Dropshipping Varejo vs. Revenda Atacado B2B)

- **Status:** Accepted
- **Data:** 2026-09-01
- **Autor:** Jeferson Amorim & Antigravity AI Engine
- **Domínio/Projeto:** CASOSEX (`/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX`)
- **Alinhamento:** Doutrina `medido=verdade` · Requisitos do E-commerce CASOSEX · WordPress + WooCommerce 11.x

---

## 📑 Contexto e Problema

O ecossistema **CASOSEX** possui dois modelos de negócios simultâneos que exigem segregação estrita de fluxo de caixa, cálculo de frete, controle de estoque e canal de entrega:

1. **Varejo (B2C - Dropshipping Total):**
   - Venda no site para consumidores finais com preço de varejo cheio (margem/markup aplicado).
   - **Estoque:** Zero estoque próprio na loja.
   - **Faturamento e Envio:** O pedido é roteado para o fornecedor parceiro (ex: INTT / AliExpress / Distribuidor local drop), que fatura e envia o produto diretamente para o endereço do cliente final.
   
2. **Revenda Local (B2B - Atacado de Estoque Físico):**
   - Venda para revendedores locais credenciados.
   - **Estoque:** 100% Estoque Físico Próprio do CASOSEX.
   - **Faturamento e Envio:** O revendedor loga com conta B2B, visualiza a tabela de preços de revenda (desconto de atacado), e o CASOSEX separa e entrega o pedido em caixa fechada.

Qualquer sobreposição entre estes dois canais (ex: tentar enviar um produto de dropshipping com regras de estoque físico, ou permitir que um cliente final veja preços B2B) compromete a margem financeira e a operação logística do CASOSEX.

---

## 🏛️ Decisão de Arquitetura

Fica estabelecido a adoção da **Arquitetura Dual-Channel no WooCommerce do CASOSEX**, estendendo e customizando os dois plugins canônicos armazenados no repositório do projeto (`/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins/`):

```
                                  [PEDIDO NO CASOSEX]
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
          [CANAL VAREJO (B2C - DROP)]                [CANAL REVENDA (B2B - ATACADO)]
  ├── Plugin: woocommerce-dropshipping        ├── Plugin: whols-pro
  ├── Origem: Fornecedor Externo              ├── Origem: Estoque Físico Próprio
  ├── Preço: Varejo Cheio (Markup Dinâmico)   ├── Preço: Tabela B2B (User Role Scoped)
  ├── Frete: Calculado p/ Endereço do Cliente ├── Frete: Tabela de Envio/Retirada Local
  └── Envio: Direto do Fornecedor ao Cliente └── Envio: Separação em Caixa no Galpão
```

---

## 🛠️ Especificação de Customização dos Plugins

### 1. Customização do Core `woocommerce-dropshipping` (Varejo Dropshipping)
- **Mapeamento de Dados do Pedido:** Injertar no gerador de Ordem de Compra (`packing slip`) o repasse automático do **Endereço do Cliente Final + CPF + Valor do Frete Cobrado**, enviando a ordem por e-mail/API para o fornecedor.
- **Roteamento de Markup:** Configurar regras automáticas de margem sobre o custo do fornecedor importado (ex: catalogador de `lojaintt.com.br`).
- **Supressão de Ruídos UI:** Manter o aviso administrativo e mensagens de extensão suprimidas diretamente na raiz do core do plugin (`ali-api/woocommerce_aliexpress.php`).

### 2. Customização do Core `whols-pro` (Revenda Atacado B2B)
- **Escopamento de Catálogo:** Associar as regras de tabela de atacado exclusivamente aos SKUs marcados como **Estoque Físico Local**.
- **User Roles B2B:** Definição dos papéis de revendedor (`whols_default_role`, `revendedor_bronze`, `revendedor_ouro`).
- **Formulário de Pedido em Lote (Bulk Order):** Ativação da interface de compra em matriz para revendedores fazerem pedidos rápidos de múltiplos itens físicos.

---

## 📊 Consequências e Validação (`medido=verdade`)

### Positivas:
- **Segregação Total:** Nenhuma colisão entre produtos de dropshipping e produtos do estoque físico.
- **Margens Preservadas:** O markup do varejo não interfere na tabela B2B do revendedor.
- **Entregabilidade Garantida:** Uso do `FluentSMTP` integrado ao WooCommerce para envio das ordens de compra e comprovantes de despacho.

### Riscos & Mitigações:
- **Risco:** Sincronização de estoque zerado no fornecedor de drop afetar a exibição da loja.
- **Mitigação:** Monitoramento via MCP / Action Scheduler e sincronização periódica de estoque via API do portal INTT (`lojaintt.com.br/v2/`).

---

## 📝 Auditoria e Rastreabilidade
- **Arquivo Criado:** `docs/adr/0223-casosex-dual-channel-dropshipping-b2b-architecture.md`
- **Data da Decisão:** 01/09/2026
- **Status da Validação:** Aceito pelo Founder / Pronto para Implementação.
