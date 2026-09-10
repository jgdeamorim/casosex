# ADR-0248: Governança de Dual Supply Chain (Fábrica SP vs Armazém Serra ES), Padronização de Caixas Fechadas (`pa_caixa_atacado`) e Algoritmo de Pedido Mínimo B2B (MOQ R$ 450,00)

**Status:** Aceita  
**Data:** 2026-09-09  
**Autor:** Jeferson Amorim (Founder) & Antigravity Agent  
**Contexto:** CASOSEX & Adsentice OS  
**Dependências & Conexões:** ADR-0240, ADR-0241, ADR-0243, ADR-0244, ADR-0246, ADR-0247  

---

## 1. Contexto & Realidade Medida (`medido=verdade`)

A operação de e-commerce e varejo privativo da CASOSEX (base operacional em Serra - Espírito Santo) depende intrinsecamente da relação comercial com a fabricante e distribuidora de cosméticos sensuais **INTT**.

Auditoria forense executada no banco de dados MariaDB (`casosex-wordpress-db`) em 2026-09-09 revelou uma estrutura dual de fornecimento já estabelecida na taxonomia `dropship_supplier`, porém operando sem uma governança algorítmica formal de abastecimento:

| Origem / Fornecedor | Papel Operacional | SKUs Totais | SKUs c/ Estoque Físico | Saldo em Estoque | Custo Médio B2B | Lead Time Médio |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **INTT Dropshipping Nacional** (`intt-dropshipping`) | **Fábrica Matriz (São Paulo)** | **469** | 3 | 123 un | **R$ 74,33** | 4 a 7 dias úteis |
| **INTT Espírito Santo** (`intt-es-dropshipping`) | **Distribuidor Local (Armazém Serra - ES)** | **215** | **172** | **6.214 un** | **R$ 89,37** | 0 a 1 dia útil |

### O Problema Identificado:
1. **Ausência de Venda Fracionada na Indústria:**
   A fábrica da INTT em São Paulo **não comercializa unidades avulsas (fracionadas)** para reposição B2B. Todo o catálogo industrial é expedido estritamente em **caixas fechadas / embalagens master** (`pa_caixa_atacado`).
2. **Gargalo Cadastral no WooCommerce:**
   Embora os termos de caixa (`20 un`, `24 un`, `32 un`, `36 un`, `42 un`, `55 un`, `72 un`, `105 un`) existam no banco de dados, apenas **5 produtos** possuíam o atributo associado com `pricing_box_units > 1`. Os demais 470 produtos operavam erroneamente com o default `1 un`, distorcendo cálculos de desembolso inicial de estoque.
3. **Conflito de Pedido Mínimo Industrial ($MOQ = \text{R\$ 450,00}$):**
   Para produtos de baixo valor unitário (ex.: sachês, bisnagas funcionais de 5g a 15g e géis beijáveis com custo B2B entre R$ 3,91 e R$ 8,60), **uma única caixa fechada não atinge os R$ 450,00 mínimos exigidos para faturamento na fábrica**.
   * *Exemplo real:* 1 caixa de 36 sachês a R$ 8,60 = **R$ 309,60** ($< \text{R\$ 450,00}$). Faltam R$ 140,40 para liberar o faturamento.

---

## 2. Decisão Arquitetural

Fica instituída a **Governança de Suprimentos e Compras da CASOSEX (Purchase Order & Supply Engine)**, dividida em três pilares fundamentais:

```mermaid
graph TD
    A["Necessidade de Reposição de Estoque em Serra - ES"] --> B{"Ruptura Imediata / Emergencial?"}
    B -- "Sim (Lead Time D+0 / D+1)" --> C["Canal Transbordo: INTT Espírito Santo<br>Armazém Local Serra - ES<br>(Custo Médio R$ 89,37)"]
    B -- "Não (Lead Time D+5 Planejado)" --> D["Canal Primário: INTT Fábrica SP<br>Caixas Fechadas (pa_caixa_atacado)<br>(Custo Médio R$ 74,33 - 17% menor)"]
    
    D --> E["Cálculo da Caixa Fechada:<br>V_box = Custo_unit x Q_caixa"]
    E --> F{"V_box >= R$ 450,00?"}
    F -- "Sim" --> G["Pedido Monoproduto Aprovado<br>(Compra de 1 Caixa)"]
    F -- "Não" --> H["Algoritmo de Composição B2B"]
    H --> I["Rota 1: Múltiplos Monoproduto<br>N = ceil(450 / V_box)<br>(Ex: 2 Caixas = R$ 619,20)"]
    H --> J["Rota 2: Pedido Sortido Inteligente<br>1 Caixa Sachê (R$ 309,60) +<br>Caixas Complementares de Giro em Serra<br>Total >= R$ 450,00"]
```

---

### 2.1. Dual-Tier Supply Governance (Fábrica SP vs Armazém Serra ES)

1. **Tier 1 — Reposição Primária de Alta Rentabilidade (Fábrica São Paulo):**
   - **Objetivo:** Maximizar a margem bruta de contribuição através do custo direto de fábrica (~17% mais baixo em relação ao distribuidor local).
   - **Regras:**
     - Pedido faturado estritamente em **caixas fechadas** (`pa_caixa_atacado`).
     - Valor total do pedido de compra $\ge \mathbf{\text{R\$\ 450,00}}$.
     - Planejamento de compra disparado quando o estoque em Serra atinge o **Ponto de Reposição (ROP)**, considerando o lead time rodoviário de 5 a 7 dias úteis.
2. **Tier 2 — Transbordo & Contingência de Pronta-Entrega (Armazém Serra - ES):**
   - **Objetivo:** Evitar ruptura (stockout) de campanhas de alta conversão (ex.: campanhas Google Ads e PMax ativas nos Filés Mignons).
   - **Regras:**
     - Utilizado como backup imediato (fulfillment em 24h) caso o armazém central sofra pico de demanda súbito enquanto o lote da fábrica de São Paulo está em trânsito rodoviário.

---

### 2.2. Padronização Cadastral de Caixas Fechadas (`pa_caixa_atacado`)

Fica definida a taxonomia estrita e mapeamento compulsório de unidades por caixa fechada para todos os produtos do catálogo:

| Família de Produtos | Quantidade Padrão da Caixa Master (`pa_caixa_atacado`) | Exemplos de SKUs |
| :--- | :---: | :--- |
| **Linha Sachês / Doses Únicas (5g / 8g)** | **36 un** ou **72 un** | Sachês excitantes, bisnagas mono-aplicador |
| **Géis Funcionais / Bisnagas (15g a 17g)** | **42 un** ou **72 un** | Cliv Dessensibilizante, Excitation |
| **Cosméticos Médios (50ml a 100ml)** | **24 un** ou **36 un** | Pomadas, óleos beijáveis, lubrificantes tubulares |
| **Linha Premium / Frascos Grandes (150ml+)** | **20 un** ou **32 un** | Esfoliante Déborah Secco, Hidratantes corporais |
| **Vibradores / Dispositivos Eletrônicos** | **12 un** ou **20 un** | Vibradores líquidos, bullets, estimuladores |

*Mapeamento no Banco:* Cada produto WooCommerce deve possuir o termo correspondente em `pa_caixa_atacado` e a sincronização espelhada em `_pricing_box_units` para alimentar os motores de precificação e o Dossiê Comercial.

---

### 2.3. Algoritmo de Pedido Mínimo B2B (MOQ R$ 450,00 Engine)

Seja:
- $C_{\text{unit}}$: Custo unitário B2B do produto (registrado em `_casosex_cost_price`);
- $Q_{\text{caixa}}$: Quantidade de unidades na caixa fechada (`pa_caixa_atacado`);
- $V_{\text{box}} = C_{\text{unit}} \times Q_{\text{caixa}}$: Custo financeiro de 1 caixa fechada;
- $MOQ = \text{R\$\ 450,00}$: Pedido mínimo de faturamento da fábrica INTT.

#### Caso 1: Caixa Autossuficiente ($V_{\text{box}} \ge MOQ$)
O pedido mínimo é atingido na compra de uma única caixa:
$$\text{Caixas Compradas} = 1$$
$$\text{Investimento Total} = V_{\text{box}}$$
*Exemplo:* Pico Pulse 16g ($36 \times \text{R\$ 43,34} = \text{R\$ 1.560,24}$). 1 caixa fecha o pedido com folga de R$ 1.110,24.

#### Caso 2: Caixa Sub-MOQ ($V_{\text{box}} < MOQ$)
Uma única caixa não atinge o faturamento mínimo da fábrica. O motor oferece duas rotas matemáticas de decisão:

* **Rota 1 — Múltiplos Fechados Monoproduto (Single-SKU Multiplier):**
  $$\text{Caixas Necessárias} = \left\lceil \frac{MOQ}{V_{\text{box}}} \right\rceil$$
  $$\text{Investimento Total} = \text{Caixas Necessárias} \times V_{\text{box}}$$
  $$\text{Unidades Totais} = \text{Caixas Necessárias} \times Q_{\text{caixa}}$$
  *Exemplo (Sachê de R$ 8,60 com 36 un = R$ 309,60):*
  $$\text{Caixas} = \left\lceil \frac{450,00}{309,60} \right\rceil = 2 \text{ caixas} \implies 72 \text{ un} = \mathbf{\text{R\$\ 619,20}}$$

* **Rota 2 — Cesta Sortida de Reposição Inteligente (Assorted Smart Replenishment):**
  Quando a demanda prevista do SKU não justifica duplicar o estoque imediato, o algoritmo de compras compõe uma **Cesta de Caixas Fechadas Sortidas**, selecionando SKUs complementares do armazém de Serra - ES que estejam com maior giro ou menor cobertura de estoque:
  $$\sum_{i=1}^{k} \left( N_i \times V_{\text{box}, i} \right) \ge \text{R\$\ 450,00} \quad \text{onde } N_i \in \mathbb{N}^+ \text{ e cada } N_i \text{ é uma caixa fechada}$$
  *Exemplo:*
  - $1 \times \text{Caixa Sachê 36 un} = \text{R\$ 309,60}$
  - $1 \times \text{Caixa Gel Lubrificante 20 un (R\$ 10,00/un)} = \text{R\$ 200,00}$
  - **Total do Pedido:** $\text{R\$ 309,60} + \text{R\$ 200,00} = \mathbf{\text{R\$\ 509,60} \ge \text{R\$\ 450,00}}$
  - *Resultado Operacional:* Faturamento aprovado na fábrica, zero fracionamento e giro otimizado do armazém em Serra.

---

## 3. Impacto no Dossiê Comercial e no Motor de Precificação

1. **Camada de Supply no Dossiê (V8.2+):**
   - O card de viabilidade de lote deve exibir explicitamente:
     * *Unidades por Caixa Fechada:* $Q_{\text{caixa}}$
     * *Custo da Caixa:* $V_{\text{box}}$
     * *Status MOQ Fábrica:* `APROVADO (1 Caixa)` ou `SUB-MOQ (Exige R$ X adicionais ou N Caixas)`
     * *Opção Recomendada:* Compra sortida vs Múltiplo monoproduto.
2. **Reconciliação com Break-Even Financeiro (ADR-0246):**
   - O Ponto de Equilíbrio em unidades ($BreakEven$) passa a considerar o lote efetivamente faturado (seja de 1 caixa, $N$ caixas monoproduto ou cota rateada da cesta sortida), evitando ilusão de liquidez.

---

## 4. Governança e Próximos Passos de Execução

1. **Rotina de Enriquecimento de Catálogo:**
   Desenvolver script determinístico para preencher em lote as unidades por caixa (`pricing_box_units` e `pa_caixa_atacado`) baseado no histórico de compras da INTT e especificações técnicas de embalagem da indústria.
2. **Atualização do Matcher e Simulador:**
   Ajustar [`CasoSex_MeLi_Pricing_Engine`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins/casosex-mercadolivre-compare/inc/class-meli-pricing-engine.php) e [`class-commercial-dossier.php`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins/casosex-mercadolivre-compare/inc/class-commercial-dossier.php) para exibir os dados de Pedido Mínimo e Reposição Sortida.
