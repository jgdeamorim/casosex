# ADR-0240: Motor Dinâmico de Precificação Multicanal & Hub de Inteligência Comercial (Second Brain) — Compra Atacado B2B Caixa Fechada (INTT ES Local), Operação Própria (Envio/NF), Mercado Livre, DataForSEO, Google Merchant Plugin e Dossiê Vivo do Produto

- **Status:** Approved & Canonical (`medido=verdade`)
- **Data:** 2026-09-09
- **Autor:** Jeferson Amorim (Founder) & Antigravity AI Engine
- **Decisões Relacionadas:** ADR-0110, ADR-0223, ADR-0225, ADR-0237, ADR-0238, ADR-0239, ADR-0248
- **Modelo Operacional Real:** **ESTOQUE PRÓPRIO / ATACADO B2B CAIXA FECHADA** (NÃO é dropshipping terceirizado). Distribuidora INTT ES física na mesma cidade do founder (frete de fábrica R$ 0,00 ou desprezível, pedido mínimo B2B de R$ 450,00). Faturamento, emissão de NF, embalagem, logística e despacho 100% sob controle e operação própria.
- **Plugins Envolvidos:** `wp-adsentice-second-brain`, `casosex-mercadolivre-compare`, `casosex-google-merchant` (Plugin WordPress Nativo para Google Shopping), `easy-mcp-ai`

---

## 1. Contexto e Mudança de Paradigma Operacional

O modelo de negócio do CASOSEX foi refinado com base na realidade física e geográfica do founder:
1. **Zero Dropshipping:** Não há repasse de pedido para terceiro despachar com atraso ou margem espremida. A operação é de **E-commerce Soberano com Estoque Próprio**.
2. **Fornecedor Local (INTT ES na mesma cidade):**
   - **Frete de Captação:** R$ 0,00 (retirada física ou frete urbano simbólico).
   - **Condição Comercial B2B:** Compra em **caixa fechada** com **pedido mínimo de R$ 450,00**.
   - **Vantagem Competitiva Brutal:** O custo de mercadoria (CMV) é de atacado direto de fábrica, sem taxa de intermediação de plataformas de dropshipping.
3. **Operação 100% sob Controle do Founder:**
   - Emissão de Nota Fiscal Própria (Simples Nacional / MEI / ME).
   - Gestão de Embalagem e Despacho (Coleta Mercado Envios / Correios / Agência MeLi).
   - Velocidade de envio no mesmo dia garantindo reputação verde máxima no Mercado Livre e na loja própria.
4. **Google Merchant Center como Plugin Nativo do WordPress:**
   - Em vez de depender de servidores Python/MCP externos, o Google Merchant opera como um **plugin WordPress nativo PHP** com feed dinâmico (`google-merchant-feed.xml`), sincronização direta de catálogo com o Google Shopping Brasil e autenticação OAuth pelas credenciais salvas em `.secret/client_secret_...json`.

---

## 2. A Equação Financeira da Operação Própria

Sem a taxa de intermediação de dropshipping e com frete de captação zerado, a margem bruta expande drasticamente. 

A equação de precificação por canal $c \in \{\text{MeLi-Classico}, \text{MeLi-Premium}, \text{Loja-Virtual}, \text{Landing-Page}\}$ passa a ser:

$$P_{i,c} = \frac{C_{\text{atacado\_b2b}} + \text{Emb} + F_{\text{envio\_fixo}} + \text{CPA}_{\text{ads}}(c)}{1 - \big( \tau_{\text{canal}}(c) + \tau_{\text{imposto\_nf}} + \tau_{\text{gateway}}(c) + M_{\text{liquida}}(c) \big)}$$

Onde:
- $C_{\text{atacado\_b2b}}$: Custo unitário da mercadoria na caixa fechada Mercos/INTT (`_cost_price`).
- $\text{Emb}$: Custo unitário da embalagem discreta + fita + declaração/etiqueta (~R$ 2,00 a R$ 3,50).
- $F_{\text{envio\_fixo}}$: Custo fixo MeLi (para produtos < R$ 79,00) ou subsídio de frete.
- $\text{CPA}_{\text{ads}}(c)$: Custo de aquisição estimado via DataForSEO ($0 para canais orgânicos/MeLi).
- $\tau_{\text{canal}}(c)$: Comissão do canal:
  - MeLi Clássico: $12\% \text{ a } 14\%$
  - MeLi Premium: $17\% \text{ a } 19\%$ (10x sem juros)
  - Loja Própria: $0\%$
- $\tau_{\text{imposto\_nf}}$: Alíquota da Nota Fiscal própria (Simples Nacional ~4% a 6%).
- $\tau_{\text{gateway}}(c)$: Taxa de gateway de pagamento na loja própria (~3% a 4.5%).
- $M_{\text{liquida}}(c)$: Lucro líquido real no bolso.

---

## 3. Gestão de Pedido Mínimo B2B (R$ 450,00) & Caixas Fechadas

O motor dinâmico e o Dossiê Comercial ganham a camada de **Viabilidade de Reposição de Estoque**:
1. **Métrica `units_per_box`:** Quantidade de unidades que vêm na caixa fechada (cadastrado no atributo `pa_caixa_atacado`).
2. **Métrica `box_investment`:** Investimento total para comprar a caixa fechada:
   $$\text{Investimento Caixa} = C_{\text{atacado\_b2b}} \times \text{Qtd Caixa}$$
3. **Métrica `roi_box_payback` (Ponto de Equilíbrio):**
   - Quantas unidades da caixa precisam ser vendidas para pagar o pedido mínimo de R$ 450,00 da fábrica.
   - Em produtos como o Cliv (custo R$ 37,70, venda R$ 108,29), **apenas 4 unidades vendidas pagam o lote todo**, e as unidades restantes tornam-se **100% de lucro líquido livre**.

---

## 4. O Cockpit no WordPress (`admin.php?page=wc-settings&tab=wc_dropship_settings`)

A aba de configurações do WooCommerce é ressignificada:
- Deixa de ser "Dropshipping terceirizado" e vira o **Cockpit de Custos Operacionais & Precificação Própria**:
  - Parâmetros de Embalagem Fixa por Pedido (R$).
  - Alíquota de Nota Fiscal (%).
  - Taxas do Mercado Livre (Clássico / Premium).
  - Trava de Piso de Segurança (Hard Floor Margin: $C_{\text{atacado}} \times 1.25 + \text{Emb} + \text{Imposto}$).
  - Simulador interativo multicanal em tempo real (Calculadora JS ao vivo).

---

## 5. Dossiê Comercial Vivo (Estilo Pico Pulse)

O template [`relatorio-comercial-pico-pulse.html`](file:///home/jeffer/Downloads/relatorio-comercial-pico-pulse.html) passa a destacar a **vantagem competitiva física**:

1. **Card de Logística Própria:**
   - "Fornecedor Local (INTT ES) · Retirada Imediata · Despacho no Mesmo Dia".
2. **Análise de Lote / Caixa Fechada:**
   - Unidades na Caixa | Custo Total da Caixa | Ponto de Equilíbrio (Break-Even de Unidades).
3. **Margens Reais por Canal:**
   - Preço Sugerido e Lucro Líquido Real deduzido de Embalagem, NF e Comissão de Canal.
4. **Inteligência de Tráfego DataForSEO:**
   - Volume de busca da palavra-chave no Google Brasil, CPC médio e viabilidade de tráfego pago.
5. **Mineração de Objeções (Mercado Livre):**
   - Elogios e Dúvidas Frequentes extraídos de reviews reais.

---

## 6. Arquitetura dos Plugins Nativos WordPress

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITETURA DE PLUGINS WORDPRESS CASOSEX                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. wp-adsentice-second-brain (Gânglio de Inteligência & Cache)                         │
│    • Transient Cache com TTL (15-30 dias) no MySQL (0ms / contingência)                │
│    • Renderizador do Dossiê Comercial Vivo (/casosex-dossier/{id})                     │
│    • DataForSEO Bridge ($13.52 saldo em easy-mcp-ai) com chamadas sob demanda          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. casosex-mercadolivre-compare (ADR-0239 & Precificação)                             │
│    • Motor Algorítmico Multicanal (CasoSex_MeLi_Pricing_Engine)                        │
│    • Eliminação definitiva do markup estático de 1.8x                                  │
│    • Sincronização e matching de preços concorrentes MeLi (400ms delay)                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. casosex-google-merchant (Plugin Nativo WordPress para Google Shopping)              │
│    • Geração de feed XML/RSS dinâmico (http://localhost:8085/google-merchant-feed.xml) │
│    • Conexão OAuth nativa com client_secret_319155445934...json                        │
│    • Sincronização automática de preços, estoque e GTIN/EAN com o Merchant Center      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Matriz de Benefícios Factualizados (`medido=verdade`)

| Dimensão | Dropshipping Terceirizado | Operação Própria INTT ES + Plugins Nativos (ADR-0240) |
| :--- | :--- | :--- |
| **Frete de Captação** | R$ 25 a R$ 45 por pedido do fornecedor | **R$ 0,00** (Fornecedor físico na mesma cidade) |
| **Tempo de Despacho** | 2 a 5 dias úteis (risco de reputação) | **Mesmo dia** (Coleta MeLi / Correios rápida) |
| **Margem Líquida** | Apertada (~15% a 25%) | **Alta (~40% a 70% limpa)** |
| **Google Merchant** | Servidor Python MCP em terminal | **Plugin WordPress Nativo PHP** (Zero dependências externas) |
| **Governança de Preço** | 1.8x fixo e cego | **Motor dinâmico com Trava de Piso Rígido** |
