# ADR-0243: Cockpit Transparente de Engenharia Financeira & Decomposição Visual de Markup nos 4 Canais

**Status:** Aceita  
**Data:** 2026-09-09  
**Autor:** Jeferson Amorim / Antigravity Agent  
**Contexto:** CASOSEX & Adsentice OS  
**Supera / Ajusta:** ADR-0240 (§ 2.3 - Cockpit Operacional) & ADR-0241 (Governança Autônoma)

---

## 1. Contexto & Problema Identificado

No ecossistema **CASOSEX / Adsentice**, a precificação de produtos (560 SKUs da INTT ES) é realizada via cálculo de margem de contribuição. Entretanto, a tela de configurações do admin WooCommerce (`http://localhost:8085/wp-admin/admin.php?page=wc-settings&tab=wc_dropship_settings`) apresentava apenas campos de entrada para alíquotas soltas, criando um ponto cego de governança ("estou cego aqui").

O founder necessita de **transparência absoluta na formação do preço de venda final**, com visualização detalhada da relação entre o custo de compra B2B de fábrica (INTT ES), os custos fixos por pedido, os custos variáveis por canal (impostos, comissões de marketplace, taxas de gateway, frete e CPA de tráfego pago) e a margem líquida real gerada.

---

## 2. Decisão Arquitetural: Motor de Divisor de Margem & Simulador Interativo em Tempo Real

Fica ratificado que o cálculo de precificação obedecerá estritamente à **Matemática por Divisor de Margem de Contribuição**, eliminando markups multiplicativos cegos:

$$Preço\ de\ Venda\ Final\ (PV) = \frac{Custo\ B2B\ (INTT) + Custos\ Fixos\ (Embalagem + Fee\ Fixa)}{1 - \left(\frac{Imposto\% + Comissão\% + Gateway\% + Margem\ Alvo\%}{100}\right)}$$

### 2.1. Componentes do Cálculo de Custos

1. **Custos Fixos ($CF$):**
   - **Custo B2B INTT (R$):** Valor de compra de fábrica na Nota Fiscal.
   - **Embalagem Kraft Sigilosa (R$ 3,50):** Caixa kraft neutra, fita e insumos de expedição.
   - **Taxa Fixa Marketplace MeLi (R$ 6,50):** Aplicada para vendas com valor $< R\$ 79,00$.
2. **Custos Variáveis ($CV$):**
   - **Imposto Simples Nacional (5,0%):** Alíquota sobre faturamento bruto.
   - **Comissão MeLi Clássico (13,0%) / Premium (18,0%):** Comissão do marketplace.
   - **Taxa Gateway Loja Própria / LP (4,0%):** Processamento de cartão / PIX.
   - **CPA Estímulo Ads / DataForSEO:** Custo por aquisição medido via tráfego pago.
   - **Frete Subsidiado Melhor Envio:** Média logística de expedição ES.

### 2.2. Injeção do Simulador Transparente em `wc_dropship_settings`

A classe [`CasoSex_MeLi_Dropship_Cockpit`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins/casosex-mercadolivre-compare/inc/class-meli-dropship-cockpit.php) renderizará um **Cockpit Interativo de Engenharia Financeira**, exibindo em tempo real para qualquer Custo B2B digitado pelo usuário:

- **Tabela Comparativa dos 4 Canais:** Loja Virtual, MeLi Clássico, MeLi Premium e Landing Page (Pico Pulse).
- **Detalhamento Linha a Linha:**
  - Custo B2B INTT + Custos Fixos
  - Valor absoluto de impostos e comissões deduzidos do faturamento
  - **Preço de Venda Sugerido**
  - **Multiplicador Markup Efetivo** (ex: `2.06x`)
  - **Lucro Líquido Real em R$ e %**
- **Trava Visual de Piso Rígido:** Alertas visuais indicando a preservação da margem de segurança.

---

## 3. Consequências & Ganhos

- **Controle Total & Visibilidade:** O fundador visualiza com exatidão como cada centavo de custo impacta o preço final e o lucro de caixa.
- **Auditoria Transparente:** Fim de dúvidas sobre se determinado preço está cobrindo comissões e impostos.
- **Alinhamento com a Doutrina `medido=verdade`:** Todos os cálculos eSimulações são auditáveis no código e no admin do WooCommerce.

---

## 4. Status
- **ADR Promulgada:** `docs/adr/0243-casosex-transparent-financial-pricing-cockpit-and-markup-breakdown.md`
- **Próximo Passo:** Atualização de [`class-meli-dropship-cockpit.php`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins/casosex-mercadolivre-compare/inc/class-meli-dropship-cockpit.php) e [`class-meli-pricing-engine.php`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins/casosex-mercadolivre-compare/inc/class-meli-pricing-engine.php).
