# ADR-0241: Reorientação Autonômica do Adsentice Second Brain & Fechamento do Loop OODA/BOA no WooCommerce

**Status:** Aceita  
**Data:** 2026-09-09  
**Autor:** Jeferson Amorim / Antigravity Agent  
**Contexto:** CASOSEX & Adsentice OS  
**Supera / Ajusta:** ADR-0240 (§ 2.3 & § 2.5 - Eliminação de Parâmetros com Aparência Manual)

---

## 1. Contexto & Problema Identificado

Na implementação inicial da **ADR-0240**, foi estabelecido o motor de precificação multicanal e a tela de cockpit em:
`http://localhost:8085/wp-admin/admin.php?page=wc-settings&tab=wc_dropship_settings`.

Entretanto, o founder apontou com precisão cirúrgica a contradição arquitetural:
1. O ecossistema Adsentice dispõe de um gânglio nervoso avançado (**`wp-adsentice-second-brain`**) com **Telemetria Ativa, Loop OODA, BOA Score (`0.6667`) e Análise Semântica de Intenção**.
2. A tela criada em `wc_dropship_settings` continha uma calculadora interativa com inputs de custo que transmitiam uma percepção errônea de **"precificação manual"** produto a produto.
3. O objetivo do sistema soberano **NÃO é exigir intervenção humana** para calcular ou decidir preços, mas sim operar como um **agente autônomo contínuo (Autonomous Pricing & Channel Allocation Agent)**.

---

## 2. Decisão Arquitetural: O Loop OODA Autônomo Fechado

Fica estabelecido que a precificação, o benchmarking e a alocação de canais de venda serão **100% autônomos e dirigidos por dados medidos**, operando sob o ciclo contínuo **OODA (Observe, Orient, Decide, Act)**:

```
                  ┌──────────────────────────────────────────────┐
                  │ 1. OBSERVE (Adsentice Observer Engine)       │
                  │ - Tráfego, VUIDs, Telemetria de Carrinho     │
                  │ - Catálogo B2B INTT ES (680 SKUs importados) │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │ 2. ORIENT (Grounding Semântico & APIs)       │
                  │ - DataForSEO: Volume de busca e CPC real Ads │
                  │ - MeLi Top 5: Preço médio dos 5 líderes      │
                  │ - Custo B2B e Unidades Caixa Fechada INTT ES │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │ 3. DECIDE (BOA Score & Trava Anti-Prejuízo)  │
                  │ - Classificação: HIGH_MARGIN | BUMP | SEO    │
                  │ - Cálculo do Preço de Ouro e Payback Caixa   │
                  │ - Aplicação da Trava de Piso Rígido (Floor)  │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │ 4. ACT (Ação Direta no Banco & Feeds)        │
                  │ - Atualização automática de _price no WC     │
                  │ - Gravação dos metadados multicanal no ACF   │
                  │ - Regeneração do Feed Google Shopping XML    │
                  │ - Atualização do Dossiê Comercial Vivo       │
                  └──────────────────────────────────────────────┘
```

---

## 3. Redefinição da Aba `wc_dropship_settings`

A aba de configurações do WooCommerce deixa de ser uma "calculadora simuladora" e passa a ser um **Console de Telemetria e Governança do Second Brain**:

1. **Dashboard de Telemetria OODA:**
   - **Contador de Catálogo Sincronizado:** % dos 680 produtos precificados pelo Second Brain.
   - **Distribuição de Oportunidades:** Contagem de produtos em `🟢 HIGH_MARGIN` (Landing Page ativa), `🟡 ORDER_BUMP` e `🔴 SEO_ONLY`.
   - **BOA Score do Tenant:** Leitura e exibição da saúde algorítmica do catálogo.
   - **Status das APIs:** Indicadores de saúde da DataForSEO ($13.52 balance) e Mercado Livre OAuth.

2. **Gatilho de Automação Batch com 1 Clique (Zero Manualidade):**
   - Botão **"⚡ Disparar Ciclo OODA em Todo o Catálogo"** acionando o processamento assíncrono via background worker / WP-Cron (`class-meli-batch-sync.php`).
   - Sincronização automática contínua programada diariamente às 03:00.

3. **Constantes Globais de Contorno (Governança, não Operação):**
   - Os únicos inputs mantidos são os limites fiscais e operacionais da empresa (Embalagem R$ 3,50, Simples Nacional 5%, Taxas MeLi 13%/18%), tratados como parâmetros do modelo matemático e não como campos para edição manual frequente.

---

## 4. Integração Nativa entre os Plugins

Para evitar fragmentação de responsabilidades:
- O plugin **`wp-adsentice-second-brain`** assume o papel de **Maestro / Cérebro**:
  - Fornece a telemetria, orquestra a ponte DataForSEO, expõe os Dossiês Comerciais e aciona os gânglios.
- O plugin **`casosex-mercadolivre-compare`** atua como o **Gânglio Especializado de Marketplace**:
  - Executa o cálculo algorítmico multicanal, varre os Top 5 concorrentes e grava os metadados nos produtos.
- O plugin **`casosex-google-merchant`** atua como o **Gânglio de Distribuição de Tráfego**:
  - Consome os preços gerados e gera o feed dinâmico para os leilões do Google Shopping.

---

## 5. Logística & Frete Inteligente: Integração com Melhor Envio

A operação da CASOSEX baseia-se em **Estoque Físico Próprio no Espírito Santo (ES)** através de compras em caixa fechada da distribuidora local **INTT ES** (com retirada imediata e frete de fábrica R$ 0,00).

Para a expedição e entrega ao cliente final nos diferentes canais de venda, a ADR-0241 formaliza a governança de frete via **Melhor Envio**:

1. **Origem e Despacho Centralizado:**
   * **CEP de Origem:** Cadastro do CEP sede da operação no Espírito Santo (ES) nas configurações de frete do WooCommerce (`woocommerce_store_postcode` e zona de envio ES).
   * **Embalagem Sigilosa Padronizada:** A taxa fixa de **R$ 3,50** por pedido já cobrada pelo motor algorítmico cobre a caixa de papelão kraft lisa, fita gomada sem impressão e plástico bolha, garantindo discrição total (sem menção a sex shop na etiqueta).

2. **Diferenciação por Canal:**
   * **Loja Virtual (`casosex.com.br`):**
     * O plugin oficial do **Melhor Envio** cota em tempo real com múltiplas transportadoras (Correios SEDEX/PAC, Jadlog, Loggi, Azul Cargo).
     * O frete é pago diretamente pelo cliente final no checkout ou bonificado acima de ticket médio definido (ex: Frete Grátis acima de R$ 199,00 absorvido pela margem líquida de 40%).
   * **Mercado Livre (Clássico & Premium):**
     * Operação sob **Mercado Envios** (coleta ou agência / cross-docking `xd_drop_off`). Produtos acima de R$ 79,00 contam com coparticipação obrigatória de frete já descontada no motor de precificação.
   * **Landing Pages de Conversão (`lp.casosex.com.br`):**
     * **Estratégia de Oferta Irresistível:** "Frete Fixo Simbólico" (ex: R$ 9,90 para Sudeste) ou "Frete Grátis Embutido".
     * Com a recalibração da **DataForSEO**, o CPA de Google Ads caiu de R$ 115,00 para **R$ 23,60** (CPC real R$ 0,59), abrindo uma folga de margem líquida superior a **R$ 250,00**.
     * Parte dessa folga (R$ 15,00 a R$ 22,00) pode subsidiar o frete via Melhor Envio (Jadlog/SEDEX), permitindo anunciar na Landing Page **"Produto Original com Envio Discreto e Frete Grátis"** sem jamais ferir a trava de piso rígido anti-prejuízo.

---

---

## 6. Estratégias Comerciais Avançadas: Matriz Pico Pulse (Kits D2C & Escala por Lotes)

Inspirado na modelagem de unit economics validada no relatório comercial [`relatorio-comercial-pico-pulse.html`](file:///home/jeffer/Downloads/relatorio-comercial-pico-pulse.html), a ADR-0241 incorpora formalmente três alavancas de alta conversão ao motor multicanal da CASOSEX:

### 6.1. Superação da Armadilha do Unitário via "Kits D2C" (Kit Duplo & Combos)
* **A Armadilha do Unitário em Marketplace:** Vender 1 unidade isolada de produtos de ticket baixo/médio (géis, lubrificantes, estimuladores) em marketplaces gera compressão severa de margem (devido a taxas fixas de frete e comissão de ~16-18%).
* **Alavanca Kit Duplo / Combo na Landing Page:**
  * O motor calcula automaticamente a oferta **Kit Duplo (2 unidades)** e o **Combo Estratégico (Produto Principal + Order Bump INTT)**.
  * O frete único do Melhor Envio e o CPA de Google Ads (DataForSEO) são diluídos no mesmo envio.
  * A margem líquida real salta para patamares superiores a **24% a 35% NET livre**, gerando um lucro em Reais ($R\$$) muito mais robusto por transação.

### 6.2. Matriz de Escala e Retorno por Lote (Batch Investment Model)
O Dossiê Comercial e o motor passam a projetar 3 níveis de retorno sobre o capital investido na fábrica local (INTT ES):
1. **Lote 1: Caixa Fechada da Fábrica (Ex: 36 ou 72 un):**
   * Ponto de equilíbrio de vendas (*Break-Even*): cálculo exato de quantas unidades pagam 100% da caixa.
   * Lucro Líquido Real gerado nas unidades excedentes (+40% a +50% NET sobre o investimento).
2. **Lote 2: Operação em Tração (100 Pedidos D2C):**
   * Projeção de faturamento bruto e resultado líquido limpo após dedução de todos os custos fiscais, embalagem e CPA de Ads.
3. **Lote 3: Escala Atacadista / Distribuição (500+ un):**
   * Retorno expandido e poder de negociação de bonificação direta com a diretoria da INTT.

### 6.3. Blindagem de Conversão: Copywriting & FAQ de Três Níveis
Incorporação no modelo de landing page das 3 barreiras psicológicas mineradas do nicho de bem-estar íntimo:
1. **Quebra de Objeção #1 (Privacidade Absoluta):** Garantia de embalagem kraft neutra, sem qualquer menção à sex shop na etiqueta de envio.
2. **Quebra de Objeção #2 (Originalidade & Garantia):** Origem homologada direta de fábrica com nota fiscal eletrônica.
3. **Quebra de Objeção #3 (Velocidade de Entrega):** Despacho prioritário via Melhor Envio no mesmo dia para pedidos efetuados até as 14h.

---

## 7. Consequências & Ganhos

- **Zero Esforço Operacional:** O founder nunca precisa abrir um produto no admin para digitar preço ou calcular margem.
- **Maximização do Ticket Médio (AOV):** A criação de Kits Duplos e Combos na Landing Page viabiliza frete grátis via Melhor Envio com margem líquida preservada.
- **Competitividade Extrema na Landing Page:** Preço balizado pelo CPA real da DataForSEO (R$ 23,60) elimina valores inflados e viabiliza escala de tráfego pago.
- **Logística Profissional & Sigilosa:** Despacho rápido a partir do estoque no ES com rastreamento integrado Melhor Envio.
- **Auditoria Transparente:** O Dossiê Comercial (`/?casosex_dossier={id}`) renderiza os KPIs, a tabela de Top 5 MeLi e os cenários de Kits idênticos ao Pico Pulse.
- **Alinhamento com a Doutrina Mãe:** Respeita integralmente `medido=verdade` e preserva os tokens e saldos de APIs via cache determinístico.

---

## 8. Diretrizes Universais de Matching e Paridade Algorítmica (560 Produtos do Catálogo)

Para assegurar que o benchmarking com o Mercado Livre e Google Shopping seja auditável e não distorça a margem do catálogo (560 SKUs da INTT), o motor `CasoSex_MeLi_Matcher` e `CasoSex_MeLi_Benchmarking` deve aplicar 5 filtros universais mandatórios em lote:

1. **Purga Internacional & Validação de Origem Local (Zero Cross-Border):**
   - Descarte sumário de anúncios com tag de envio internacional / remessa da China (`shipping: international`).
   - Todos os produtos da operação CASOSEX possuem pronta entrega física no Espírito Santo com emissão de NF-e. Concorrentes internacionais que demoram 20 a 40 dias para entrega não constituem paridade de mercado.
2. **Paridade Dimensional e Volumétrica Estrita:**
   - Extração por regex de grandezas físicas no título do SKU WooCommerce (`17g`, `50ml`, `15ml`, `120ml`, `caixa com X un`).
   - Rejeição de anúncios concorrentes com volumetrias discrepantes (ex: comparar pote de 17g com sachê promocional de 3g ou refil de 50g).
3. **Paridade de Versão Tecnológica (Toys & Hardware):**
   - Diferenciação estrita entre modelos `Com App / Bluetooth / Connect` vs `Sem App / Manual`.
   - Diferenciação entre produtos `Recarregável Magnético / USB` vs `A Pilha (AAA)`.
   - Produtos de tecnologia superior nunca podem ter seu preço ancorado em variações inferiores ou descontinuadas.
4. **Filtro Estatístico Anti-Outlier (Piso de Sanidade de 70% do Custo B2B):**
   - Anúncios com preço de venda abaixo de 70% do nosso custo B2B direto de fábrica da INTT representam:
     - Peças sobressalentes avulsas (cabos USB, bocais de silicone, tampas);
     - Réplicas ou falsificações sem homologação;
     - Contas novas sem histórico de reputação.
   - Esses ruídos são purgados automaticamente do cálculo da média dos Top 5 concorrentes.
5. **Corte por Reputação, Histórico e Termos Permitidos:**
   - Priorização exclusiva de vendedores com reputação consolidada (`5_green`, `power_seller` ou Loja Oficial) com volume de vendas medido.
   - Aplicação dos filtros do nicho de bem-estar íntimo (`MLB2818` / `adult_content: true`), respeitando o limite máximo de 60 caracteres no título e banindo termos vulgares que ativem a moderação punitiva do marketplace.


