# ADR-0246: Governança Matemática do Ponto de Equilíbrio de Caixa Fechada, Amortização por Margem de Contribuição e Lógica de MOQ de Fábrica (R$ 450,00)

**Status:** Aceita  
**Data:** 2026-09-09  
**Autor:** Jeferson Amorim (Founder) & Antigravity Agent  
**Contexto:** CASOSEX & Adsentice OS  
**Dependências & Conexões:** ADR-0240, ADR-0243, ADR-0244, ADR-0245  

---

## 1. Contexto & Correção de Falha Conceitual

Nas implementações preliminares do motor de precificação e nos relatórios de projeção de vendas, identificou-se uma inconsistência conceitual entre duas regras comerciais distintas da distribuidora INTT ES:

1. **O Falso Vínculo do Pedido Mínimo (R$ 450,00) com Caixas de Maior Valor:**
   - Para produtos cujo valor da caixa fechada supera o faturamento mínimo (ex: Pico Pulse, 36 unidades a R$ 43,34 = R$ 1.560,24), o valor de R$ 450,00 é irrelevante para o cálculo de risco financeiro do produto.
   - O capital efetivamente desembolsado pelo lojista é o valor total da caixa: **R$ 1.560,24**.
2. **A Falácia do "100% vira lucro livre":**
   - O cálculo anterior dividia o investimento pelo faturamento bruto ($PV$), assumindo que após pagar o estoque todo o faturamento restante virava lucro.
   - Na realidade contábil e tributária, **toda venda** continua deduzindo custos variáveis operacionais: Imposto Simples Nacional (5%), Gateway de pagamento (4%), Embalagem sigilosa (R$ 3,50) e custos logísticos.
   - O abatimento do estoque deve ocorrer estritamente pela **Margem de Contribuição Unitária Líquida ($MC_{\text{unit}}$)**.

---

## 2. Decisão Arquitetural & Matemática Rigorosa

Fica estabelecido o modelo definitivo de cálculo de viabilidade e Ponto de Equilíbrio de Lotes de Fábrica no ecossistema CASOSEX:

### 2.1. Lógica Condicional do Lote Mínimo de Fábrica ($MOQ$)

Seja $C_{\text{unit}}$ o custo unitário B2B e $Q_{\text{caixa}}$ a quantidade de unidades na caixa fechada (atributo `pa_caixa_atacado`):

$$\text{Custo de 1 Caixa} = C_{\text{unit}} \times Q_{\text{caixa}}$$

1. **Caso 1: $\text{Custo de 1 Caixa} \ge \text{Pedido Mínimo (R\$ 450,00)}$**
   - O pedido mínimo é satisfeito por uma única caixa.
   - $\text{Caixas Compradas} = 1$
   - $\text{Unidades do Lote} = Q_{\text{caixa}}$
   - $\text{Investimento Total do Lote} = \text{Custo de 1 Caixa}$
2. **Caso 2: $\text{Custo de 1 Caixa} < \text{Pedido Mínimo (R\$ 450,00)}$**
   - A fábrica exige a compra de um número inteiro de caixas para faturar:
     $$\text{Caixas Necessárias} = \left\lceil \frac{R\$\ 450,00}{\text{Custo de 1 Caixa}} \right\rceil$$
   - $\text{Unidades do Lote} = \text{Caixas Necessárias} \times Q_{\text{caixa}}$
   - $\text{Investimento Total do Lote} = \text{Caixas Necessárias} \times \text{Custo de 1 Caixa}$

---

### 2.2. Equação da Margem de Contribuição Unitária Líquida ($MC_{\text{unit}}$)

A sobra real de caixa de cada unidade vendida que atua para amortizar o boleto do lote de fábrica é:

$$MC_{\text{unit}} = PV_{\text{venda}} - \text{Embalagem} - \left( PV_{\text{venda}} \times \frac{\text{Simples (5\%)} + \text{Gateway (4\%)}}{100} \right)$$

---

### 2.3. Equação do Ponto de Equilíbrio Real do Lote ($BreakEven$)

O número exato de unidades que precisam ser vendidas para recuperar 100% do capital de giro investido e quitar todos os custos variáveis associados a essas vendas é:

$$BreakEven_{\text{unidades}} = \min \left( \left\lceil \frac{\text{Investimento Total do Lote}}{MC_{\text{unit}}} \right\rceil, \ \text{Unidades do Lote} \right)$$

- **Unidades de Lucro Livre no Lote:**
  $$Unidades_{\text{lucro}} = \text{Unidades do Lote} - BreakEven_{\text{unidades}}$$
- **Lucro Líquido Real Gerado pelo Lote Inteiro:**
  $$Lucro_{\text{lote}} = (Unidades_{\text{lucro}} \times MC_{\text{unit}}) = (\text{Unidades do Lote} \times Lucro_{\text{unitário}})$$

---

## 3. Demonstração Prática Medida (`medido=verdade`)

### Exemplo 1: SKU de Alto Ticket / Caixa Grande (Pico Pulse 16g)
- $C_{\text{unit}}$: R$ 43,34 | $Q_{\text{caixa}}$: 36 unidades
- $\text{Custo de 1 Caixa}$: $36 \times 43,34 = \mathbf{R\$\ 1.560,24} \ (> R\$\ 450,00)$
- Caixas Necessárias: **1 caixa** | Investimento Total: **R$ 1.560,24**
- Preço Loja Virtual / D2C: **R$ 79,90**
- Embalagem: R$ 3,50 | Imposto (5%) + Gateway (4%): R$ 7,19
- $MC_{\text{unit}} = 79,90 - 3,50 - 7,19 = \mathbf{R\$\ 69,21}$
- **Ponto de Equilíbrio Real:**
  $$BreakEven = \left\lceil \frac{R\$\ 1.560,24}{R\$\ 69,21} \right\rceil = \mathbf{23\ unidades}$$
- **Resultado:**
  - **23 unidades vendidas:** Amortizam 100% dos R$ 1.560,24 do boleto da fábrica e pagam todos os impostos e embalagens. Risco zero.
  - **13 unidades restantes:** Geram o lucro líquido real de caixa da operação:
    $$13 \times R\$\ 69,21 = \mathbf{R\$\ 899,73\ de\ Lucro\ Líquido\ Real}$$

### Exemplo 2: SKU de Baixo Ticket (Gel Sachê ou Acessório)
- $C_{\text{unit}}$: R$ 15,00 | $Q_{\text{caixa}}$: 12 unidades
- $\text{Custo de 1 Caixa}$: $12 \times 15,00 = \mathbf{R\$\ 180,00} \ (< R\$\ 450,00)$
- Caixas Necessárias: $\lceil 450 / 180 \rceil = \mathbf{3\ caixas}$
- Investimento Total do Lote Faturado: $3 \times 180,00 = \mathbf{R\$\ 540,00}$ (36 unidades)
- O Break-Even é calculado sobre os **R$ 540,00** mínimos exigidos pela INTT.

---

## 4. Impacto no Código e Governança

1. **Atualização no Core:** A classe [`CasoSex_MeLi_Pricing_Engine`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins/casosex-mercadolivre-compare/inc/class-meli-pricing-engine.php) é atualizada para implementar rigorosamente as fórmulas de $MC_{\text{unit}}$, $MOQ$ e $BreakEven$.
2. **Atualização nos Dossiês:** O Dossiê Comercial Vivo e as exportações para o snapshot JSON refletirão os dados corrigidos de $BreakEven$, unidades de lucro e ROI do lote.
