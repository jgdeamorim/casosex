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

## 6. Consequências & Ganhos

- **Zero Esforço Operacional:** O founder nunca precisa abrir um produto no admin para digitar preço ou calcular margem.
- **Competitividade Extrema na Landing Page:** O preço da LP passa a ser agressivo (R$ 912 a R$ 989 em vez de R$ 1.691), permitindo conversões em escala com CPA baixo medido no Google Ads.
- **Logística Profissional & Sigilosa:** Integração fluida entre o estoque local no ES, frete barato pelo Melhor Envio e rastreamento automático para o comprador.
- **Auditoria Transparente:** O Dossiê Comercial (`/?casosex_dossier={id}`) permanece como a tela de visualização dos dados consolidados gerados pela IA.
- **Alinhamento com a Doutrina Mãe:** Respeita integralmente `medido=verdade` e preserva os tokens e saldos de APIs via cache determinístico.

