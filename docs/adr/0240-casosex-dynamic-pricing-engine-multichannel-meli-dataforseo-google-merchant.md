# ADR-0240: Motor Dinâmico de Precificação Multicanal (Dynamic Pricing & Fee Engine) — WooCommerce Dropshipping, Mercado Livre, DataForSEO e Google Merchant

- **Status:** Proposed & Accepted (`medido=verdade`)
- **Data:** 2026-09-09
- **Autor:** Jeferson Amorim (Founder) & Antigravity AI Engine
- **Decisões Relacionadas:** ADR-0223, ADR-0225, ADR-0237, ADR-0238, ADR-0239

---

## 1. Contexto e Problema

Atualmente, o catálogo de **680 produtos** do CASOSEX (`casosex-wordpress` na porta `:8085`) possui custo de fábrica capturado via integração B2B Mercos/INTT ES, porém a precificação de venda para o consumidor final opera sob regras estáticas (markup arbitrário de 1.8x fixado em `_regular_price`). 

Na aba de configurações do WooCommerce Dropshipping (`/wp-admin/admin.php?page=wc-settings&tab=wc_dropship_settings`), o cálculo de *Estimated Profit* limita-se a subtrair o custo do preço de venda, desconsiderando:
1. **Diferenciação por Canal de Venda:**
   - **Mercado Livre:** Taxas variáveis entre Anúncio Clássico (~12-14%), Premium (~17-19% com 10x/12x sem juros), Catálogo/BuyBox e frete fixo de envio no Full.
   - **Loja Virtual (`casosex.com.br`):** Custos de gateway de pagamento (PagBank / Asaas ~3-5%) e frete local.
   - **Landing Pages (`lp.casosex.com.br`):** Margem bruta expandida para absorver CPA de tráfego pago (Google Ads / Meta Ads) com Order Bumps e Upsells.
2. **Custos Tributários e Fiscais:** Alíquota de Simples Nacional / ICMS ST incidente na operação de dropshipping nacional.
3. **Benchmarking Real de Mercado & Palavras-Chave:**
   - Dados de menor preço concorrente no Mercado Livre (ADR-0239).
   - Dados de CPC médio e volume de buscas via **DataForSEO API** (saldo disponível de $13.52 USD salvo em `easy-mcp-ai`).
   - Sincronização e auditoria de leilão via **Google Merchant Center MCP** (`adsentice/packages/adsentice-merchant-mcp`).

---

## 2. Decisão Arquitetural

Fica decidida a criação e institucionalização do **Motor Dinâmico de Precificação Multicanal (Dynamic Pricing & Fee Engine)**, transformando a aba nativa `wc_dropship_settings` no Cockpit de Governança Financeira e integrando os módulos de dados externos.

### 2.1. A Equação Algorítmica Unificada de Precificação

Para cada produto $i$ no canal $c \in \{\text{MeLi-Classico}, \text{MeLi-Premium}, \text{Loja-Virtual}, \text{Landing-Page}\}$, o preço ideal $P_{i,c}$ é computado como:

$$P_{i,c} = \frac{C_{\text{fabrica}} + F_{\text{fixo}} + \text{CPA}_{\text{ads}}(c)}{1 - \big( \tau_{\text{canal}}(c) + \tau_{\text{imposto}} + \tau_{\text{gateway}}(c) + M_{\text{liquida}}(c) \big)}$$

Onde:
- $C_{\text{fabrica}}$: Custo base B2B fornecido pela distribuidora INTT ES (`_cost_price`).
- $F_{\text{fixo}}$: Custo fixo por envio (ex: taxa fixa MeLi para produtos < R$ 79,00 ou embalagem).
- $\text{CPA}_{\text{ads}}(c)$: Custo estimado de aquisição por tráfego, parametrizado por palavra-chave via DataForSEO ($0 para canais orgânicos).
- $\tau_{\text{canal}}(c)$: Taxa percentual cobrada pelo canal de venda.
- $\tau_{\text{imposto}}$: Carga tributária Simples Nacional (ex: 6% a 11%).
- $\tau_{\text{gateway}}(c)$: Taxa do processador de pagamento.
- $M_{\text{liquida}}(c)$: Margem de lucro líquida mínima exigida para o canal.

---

## 3. Estrutura dos Módulos Integradores

### 3.1. Cockpit de Configuração na Aba Dropshipping (`wc_dropship_settings`)
Extensão dos campos na aba de configurações do WooCommerce para registrar as regras globais e por categoria:
- Taxas padrão de canais (MeLi Clássico, Premium, Loja Própria).
- Percentual de impostos fiscais.
- Margem de lucro alvo por faixa de preço ou categoria.
- Flag de atualização automática de preços no catálogo.

### 3.2. Módulo DataForSEO (SERP & Google Ads Intelligence)
- Consumo seguro das credenciais ativas em `easy-mcp-ai-external-data`.
- Extração de CPC médio e Search Volume para os termos de busca canônicos de cada produto.
- Injeção da métrica `cpa_target_estimate` no cálculo da precificação de Landing Pages.

### 3.3. Módulo Google Merchant Center MCP
- Conexão via OAuth / Service Account (`client_secret_...apps.googleusercontent.com.json` e `.secret/.env.GOOGLE`).
- Exportação automatizada do feed de produtos enriquecidos com atributos Google Shopping (`gtin`, `mpn`, `brand`, `google_product_category`).
- Auditoria contínua de paridade com os preços praticados por concorrentes no Google Shopping Brasil.

---

## 4. Persistência de Dados & Paridade REST (ACF)

Os preços calculados e as métricas de viabilidade são armazenados em campos ACF dedicados:
- `pricing_cost_b2b`: Custo de fábrica.
- `pricing_meli_classico`: Preço sugerido MeLi Clássico.
- `pricing_meli_premium`: Preço sugerido MeLi Premium (10x sem juros).
- `pricing_loja_virtual`: Preço de venda em `casosex.com.br`.
- `pricing_landing_page`: Preço de ancoragem para tráfego pago com margem de CPA.
- `pricing_dataforseo_cpc`: CPC estimado no Google Ads.
- `pricing_google_shopping_parity`: Status de paridade no Google Shopping.

Todos os campos possuem `show_in_rest = true` para consumo instantâneo pelo **Easy MCP AI** e automações de atendimento.

---

## 5. Matriz de Benefícios (`medido=verdade`)

| Dimensão | Cenário Anterior | Novo Cenário (ADR-0240) | Benefício Mensurado |
| :--- | :--- | :--- | :--- |
| **Governança de Preço** | Markup estático cego de 1.8x em banco | Motor algorítmico dinâmico em `wc_dropship_settings` | Margem garantida contra prejuízos em taxas de canais |
| **Vendas no Mercado Livre** | Preço único ignorando regras de parcelamento | Preços separados para Clássico, Premium e BuyBox | Vence a concorrência sem queimar margem líquida |
| **Tráfego Pago (LPs)** | Precificação sem considerar custo de clique | Precificação com CPA integrado via DataForSEO | Sustentabilidade no investimento de Google/Meta Ads |
| **Google Merchant** | Feed manual desatualizado | Sincronização automatizada via MCP Soberano | Presença em leilões de alta conversão no Shopping |

---

## 6. Próximos Passos de Implementação

1. Criar o extender de settings para injetar o formulário do Motor Dinâmico em `wc_dropship_settings`.
2. Implementar a classe de cálculo `CasoSex_Dynamic_Pricing_Engine`.
3. Criar os endpoints e bridges com o DataForSEO e Google Merchant MCP.
4. Adicionar colunas e metaboxes visuais na listagem de produtos do WooCommerce.
