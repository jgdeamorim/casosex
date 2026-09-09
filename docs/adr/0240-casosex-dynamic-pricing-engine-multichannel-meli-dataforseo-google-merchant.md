# ADR-0240: Motor Dinâmico de Precificação Multicanal & Hub de Inteligência Comercial (Second Brain) — Dropshipping, Mercado Livre, DataForSEO, Google Merchant e Dossiê Vivo do Produto

- **Status:** Approved & Canonical (`medido=verdade`)
- **Data:** 2026-09-09
- **Autor:** Jeferson Amorim (Founder) & Antigravity AI Engine
- **Decisões Relacionadas:** ADR-0110, ADR-0223, ADR-0225, ADR-0237, ADR-0238, ADR-0239, ADR-0248
- **Plugins Envolvidos:** `wp-adsentice-second-brain`, `casosex-mercadolivre-compare`, `woocommerce-dropshipping`, `easy-mcp-ai`

---

## 1. Contexto e Problema

O catálogo do CASOSEX (`casosex-wordpress` :8085) conta com **680 produtos** cadastrados com custo base de fábrica via distribuidora INTT ES / Mercos, porém a precificação para o consumidor final operava de forma cega (markup estático arbitrário de 1.8x fixado em banco de dados).

Na aba de configurações do WooCommerce Dropshipping (`/wp-admin/admin.php?page=wc-settings&tab=wc_dropship_settings`), o cálculo de *Estimated Profit* limita-se a uma subtração linear simples sem considerar:
1. **Diferenciação Crítica por Canal de Venda:**
   - **Mercado Livre Clássico:** Comissão de 12% a 14%, sem parcelamento sem juros embutido.
   - **Mercado Livre Premium:** Comissão de 17% a 19%, exigindo absorção obrigatória do custo financeiro de parcelamento em até 10x ou 12x sem juros.
   - **Mercado Livre Catálogo / BuyBox / Full:** Taxa fixa de frete para produtos abaixo de R$ 79,00 e disputa agressiva pelo menor preço.
   - **Loja Virtual Própria (`casosex.com.br`):** Taxa de gateway de pagamento (~3% a 5%) e frete local.
   - **Landing Pages de Conversão (`lp.casosex.com.br`):** Necessidade de margem bruta expandida para cobrir o **CPA de Tráfego Pago (Google Ads / Meta Ads)** e ofertas de Order Bump / Upsell.
2. **Custos Fiscais / Tributários:** Alíquota incidente de Simples Nacional / ICMS ST.
3. **Ausência de Inteligência Visual e Contingência:** O lojista não possui um dossiê comercial detalhado para avaliar o potencial de cada produto antes de decidir investir em tráfego ou campanhas.

---

## 2. Decisão Arquitetural

Fica estabelecida a criação do **Motor Dinâmico de Precificação Multicanal & Hub de Inteligência Comercial**, utilizando o plugin nativo **`wp-adsentice-second-brain`** como o *Gânglio Nervoso Local* no WordPress, transformando a aba `wc_dropship_settings` no Cockpit Financeiro e gerando um **Dossiê Comercial Vivo (Estilo Pico Pulse)** para cada produto do catálogo.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   HUB DE INTELIGÊNCIA COMERCIAL CASOSEX (SECONDBRAIN)                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   ┌───────────────────────────┐    REST 0ms     ┌──────────────────────────────────┐   │
│   │ wc_dropship_settings      │ <─────────────> │ wp-adsentice-second-brain        │   │
│   │ (Cockpit de Margem & Fees)│                 │ (Transient Cache + TTL + Resili) │   │
│   └─────────────┬─────────────┘                 └──────────────┬───────────────────┘   │
│                 │                                              │                       │
│                 ▼                                              ▼                       │
│   ┌───────────────────────────┐                 ┌──────────────────────────────────┐   │
│   │ Equação Multicanal        │                 │ Dossiê Comercial Vivo (HTML/CSS) │   │
│   │ • MeLi Clássico / Premium │                 │ • KPIs Financeiros Multicanal    │   │
│   │ • Loja Própria            │                 │ • Benchmarking Mercado Livre     │   │
│   │ • Landing Page (CPA Ads)  │                 │ • Palavra-Chave & CPC DataForSEO │   │
│   │ • Trava de Piso (Floor)   │                 │ • Reviews, Elogios & Dúvidas FAQ │   │
│   └─────────────┬─────────────┘                 └──────────────┬───────────────────┘   │
│                 │                                              │                       │
│                 └───────────────────────┬──────────────────────┘                       │
│                                         │                                              │
│                                         ▼                                              │
│               ┌──────────────────────────────────────────────────┐                     │
│               │ PROVEDORES EXTERNOS & SUBSTRATO SOBERANO RSXT    │                     │
│               │ • MeLi API (Concorrentes, Vendas, BuyBox)        │                     │
│               │ • DataForSEO API ($13.52 saldo no Easy MCP AI)   │                     │
│               │ • Google Merchant MCP (Feed & Paridade Shopping) │                     │
│               │ • rsxt-router 2.0 (:9755 / Qdrant :6352)         │                     │
│               └──────────────────────────────────────────────────┘                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação Matemática do Motor de Preços

### 3.1. Equação Geral de Precificação por Canal

Para qualquer canal $c$, o preço sugerido $P_{i,c}$ é calculado pela fórmula de margem sobre a venda:

$$P_{i,c} = \frac{C_{\text{fabrica}} + F_{\text{fixo}} + \text{CPA}_{\text{ads}}(c)}{1 - \big( \tau_{\text{canal}}(c) + \tau_{\text{imposto}} + \tau_{\text{gateway}}(c) + M_{\text{liquida}}(c) \big)}$$

Onde:
- $C_{\text{fabrica}}$: Custo base B2B fornecido pela distribuidora INTT ES (`_cost_price`).
- $F_{\text{fixo}}$: Custo operacional fixo (taxa fixa MeLi para produtos < R$ 79,00 ou custo de expedição).
- $\text{CPA}_{\text{ads}}(c)$: Custo estimado de aquisição por tráfego pago via **DataForSEO** ($0 para canais puramente orgânicos).
- $\tau_{\text{canal}}(c)$: Taxa percentual da plataforma:
  - MeLi Clássico: $12\% \text{ a } 14\%$
  - MeLi Premium: $17\% \text{ a } 19\%$ (absorvendo parcelamento 10x sem juros)
  - Loja Própria: $0\%$ (apenas gateway)
- $\tau_{\text{imposto}}$: Carga tributária Simples Nacional (ex: $6\% \text{ a } 11\%$).
- $\tau_{\text{gateway}}(c)$: Taxa do checkout transparente ($3.5\% \text{ a } 4.99\%$).
- $M_{\text{liquida}}(c)$: Margem líquida mínima pretendida.

### 3.2. Trava de Segurança "Prejuízo Impossível" (Hard Floor Margin)
Para impedir que a BuyBox ou promoções forcem venda com margem negativa:

$$P_{\text{final}} = \max\Big( P_{i,c}, \quad C_{\text{fabrica}} \times 1.25 + F_{\text{fixo}} \Big)$$

Se o menor preço concorrente no Mercado Livre for inferior a esse piso, o produto é sinalizado com a tag de proteção: `OPPORTUNITY: UNCOMPETITIVE_SAFE`.

---

## 4. O Papel Estratégico do `wp-adsentice-second-brain`

O plugin atua como o motor de orquestração local, fornecendo:

1. **Cache com TTL e Fallback em Banco de Dados (`Transient Cache`):**
   - Respostas de benchmarking de concorrentes, volume de busca e CPC ficam armazenadas no banco de dados local do WordPress (`wp_options` / transients) com TTL de 15 a 30 dias.
   - **Zero Latência (0ms):** Se os serviços externos oscilarem, a loja opera no último estado gravado sem quebrar checkout ou listagens.
2. **Integração com DataForSEO Inteligente:**
   - Consumo das credenciais salvas em `easy-mcp-ai-external-data` ($13.52 USD de saldo).
   - Otimização de custos: apenas produtos classificados como `HIGH_MARGIN` ou selecionados para Landing Pages disparam consultas de Search Volume e CPC na DataForSEO, preservando o saldo.
3. **Google Merchant Center MCP Bridge:**
   - Exportação contínua de feeds XML/JSON com campos enriquecidos de catálogo para o Google Shopping Brasil, utilizando as credenciais em `.secret/client_secret_...json`.

---

## 5. Dossiê Comercial Vivo do Produto (Padrão Mobile-First Pico Pulse)

Cada um dos 680 produtos passa a ter um **Dossiê Comercial Executivo**, acessível diretamente pelo painel administrativo do WooCommerce (`/wp-admin/post.php?post=ID&action=edit` ou link público assinado):

### Estrutura do Dossiê:
1. **Design & Identidade Visual:**
   - Layout Mobile-First escuro com tipografia moderna (`Outfit` + `Plus Jakarta Sans`), paleta neon roxo/verde, backdrop blur e badges de alta visibilidade.
2. **Painel de KPIs Comerciais:**
   - *Custo de Fábrica B2B:* R$ [Valor INTT]
   - *Preço MeLi Clássico:* R$ [Preço] (Margem Líquida R$)
   - *Preço MeLi Premium (10x sem juros):* R$ [Preço] (Margem Líquida R$)
   - *Preço Loja Virtual (`casosex.com.br`):* R$ [Preço]
   - *Preço Landing Page:* R$ [Preço] (Margem com CPA Ads Absorvido)
3. **Benchmarking & Concorrência:**
   - Menor Preço Concorrente no MeLi e BuyBox Golden Price.
   - Volume de Vendas histórico do anúncio concorrente.
4. **Inteligência de Tráfego & SEO (DataForSEO):**
   - Palavra-chave primária e secundária.
   - Volume mensal de buscas no Google Brasil e CPC estimado.
5. **Mineração de Objeções (Copy & FAQ):**
   - Top 3 elogios extraídos de reviews reais de clientes.
   - Top 3 dúvidas e pontos de atenção para quebra de objeções na copy da Landing Page.

---

## 6. Persistência & REST API (ACF)

Os dados calculados pelo Second Brain são expostos na REST API do WordPress (`/wp-json/wp/v2/product/<id>`) com `show_in_rest = true`:
- `pricing_cost_b2b`
- `pricing_meli_classico`
- `pricing_meli_premium`
- `pricing_loja_virtual`
- `pricing_landing_page`
- `pricing_cpa_ads_target`
- `pricing_hard_floor_price`
- `pricing_dossier_url`

---

## 7. Matriz de Benefícios Factualizados (`medido=verdade`)

| Dimensão | Antes | Com a ADR-0240 & Second Brain |
| :--- | :--- | :--- |
| **Margem por Canal** | Cega (1.8x fixo) | Preços calibrados individualmente para MeLi Clássico, Premium, Loja e LP |
| **Risco de Prejuízo** | Alto (taxa fixa e frete MeLi comiam a margem) | Zero (Trava de Piso Rígido $C_{\text{fabrica}} \times 1.25 + \text{taxas}$) |
| **Gasto com Nuvem/APIs** | Alto e desordenado | Otimizado via Cache TTL no Second Brain (0ms e $0 no dia a dia) |
| **Decisão de Tráfego** | No escuro sem saber CPC | Dossiê Comercial completo indicando viabilidade de Google Ads |
| **IA de Vendas (Easy MCP)** | Sem contexto de taxas e concorrência | Agente de IA sabe em tempo real o teto de desconto e margem por canal |

---

## 8. Cronograma de Implementação

1. **Fase 1:** Atualização da classe de settings em `class-wc-dropshipping-product-extra-fields.php` para renderizar o Cockpit de Taxas em `wc_dropship_settings`.
2. **Fase 2:** Ativação dos módulos do `wp-adsentice-second-brain` com a classe de cálculo de preços multicanal e transients com TTL.
3. **Fase 3:** Implementação do gerador de template HTML do **Dossiê Comercial Vivo** (renderizando o modelo Pico Pulse para qualquer produto por ID).
4. **Fase 4:** Integração pontual com DataForSEO para produtos `HIGH_MARGIN` e sincronização do feed com Google Merchant.
