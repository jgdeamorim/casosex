# ADR-0242: Motor de Matching Multi-Atributo Avançado (EAN, Sabor, Geração, Descrição e Peso Físico)

**Status:** Aceita  
**Data:** 2026-09-09  
**Autor:** Jeferson Amorim / Antigravity Agent  
**Contexto:** CASOSEX & Adsentice OS  
**Supera / Ajusta:** ADR-0239 § 2.1 & ADR-0241 § 8 (Refinamento do Matching Algorítmico do Catálogo)

---

## 1. Contexto & Problema Identificado

No ecossistema **CASOSEX / Adsentice**, a paridade de preços com o Mercado Livre (ADR-0239 / ADR-0240 / ADR-0241) depende de um matching preciso entre os produtos do catálogo WooCommerce (560 SKUs da INTT) e o catálogo de produtos/anúncios do Mercado Livre.

A auditoria empírica na sincronização revelou que diversos produtos apresentaram **Score de Match de 40%** (o piso mínimo travado no algoritmo). As causas identificadas foram:
1. **Dependência Exclusiva do Título Sanitizado:** A busca por catálogo utilizava unicamente o nome do produto no WooCommerce (`$product->get_name()`), ignorando códigos determinísticos (EAN/GTIN) e a descrição curta do produto.
2. **Ambiguidade de Sabores e Variantes:** Géis e cosméticos com a mesma linha de produto (ex: géis beijáveis ou lubrificantes) mas de sabores/fragrâncias diferentes (ex: Morango vs Menta vs Algodão Doce) eram tratados de forma ambígua quando o título no WooCommerce era genérico.
3. **Versão Tecnológica Rígida:** A detecção de geração e versão tecnológica aplicava regras hardcoded (ex: Satisfyer Pro 2 Gen 3), sem varredura dinâmica para outras gerações (`Gen 1`, `Gen 2`, `Gen 3`, `V2`, `Pro 2`).
4. **Subaproveitamento de Meta-Atributos:** Informações ricas cadastradas no WooCommerce (como taxonomias `pa_sabor`, `pa_versao`, peso em gramas `$product->get_weight()`) não participavam da montagem da query de busca nem do cálculo de score.

---

## 2. Decisão Arquitetural: Motor Multi-Atributo de 5 Vetores

Fica ratificado que o motor `CasoSex_MeLi_Matcher` evoluirá para uma arquitetura de **matching multi-atributo em 5 camadas sucessivas**, aumentando a precisão algorítmica para a faixa de **85% a 100%**:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CAMADA EAN / GTIN (Precisão Absoluta = 100%)                  │
│ Busca direta no MeLi por product_identifier (Se existir GTIN/EAN) │
└────────────────────────────────┬────────────────────────────────┘
                                 │ (Se não houver EAN ou falhar)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. CAMADA DE SANITIZAÇÃO E PRESERVAÇÃO DE MARCA                 │
│ Query enriquecida com Título + Marca (INTT, Satisfyer, etc.)    │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. CAMADA DE PARIDADE DE SABOR E FRAGRÂNCIA                     │
│ Cruzamento de taxonomias pa_sabor / Descrição Curta             │
│ (Bônus +15% paridade / Penalidade -35% divergência)             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. CAMADA DE GERAÇÃO E VERSÃO TECNOLÓGICA                       │
│ Varredura dinâmica de Gen 1/2/3, V2, Bluetooth, App              │
│ (Penalidade -30% por versão incompatível)                       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. CAMADA DE VOLUMETRIA E PESO FÍSICO (get_weight)              │
│ Cruzamento de regex de ml/g com o peso cadastrado no WC          │
│ (Penalidade -30% por divergência volumétrica / sachê vs pote)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação Detalhada dos Vetores

### 3.1. Vetor EAN / GTIN
* Se `$product->get_sku()`, `_gtin` ou `_ean` contiverem um código numérico de 13/14 dígitos (EAN-13/GTIN-14), o motor realizará consulta prioritária em:
  `GET https://api.mercadolibre.com/products/search?site_id=MLB&product_identifier={gtin}`
* Havendo retorno do catálogo canônico do MeLi via EAN, o matching é aprovado com **Score 100%** de imediato, pulando heurísticas textuais.

### 3.2. Vetor Sabor e Fragrância
* Extração dos sabores do produto a partir de:
  1. Taxonomia nativa `pa_sabor` / `pa_fragrancia`.
  2. Palavras-chave na descrição curta (`$product->get_short_description()`).
* Regra de Pontuação:
  * Se ambos os títulos/atributos apresentarem o mesmo sabor (ex: `Morango` no WC e `Morango` no MeLi): **+15 pontos**.
  * Se o produto WC for `Morango` e o produto MeLi for `Menta` ou `Uva`: **-35 pontos** (invalida a paridade de SKU).

### 3.3. Vetor Geração e Versão Tecnológica
* Varredura Regex para identificação dinâmica de termos:
  `/(Gen\s*\d+|Generation\s*\d+|V\d+|Pro\s*\d+|Connect|Bluetooth|App)/i`
* Caso o produto WC especifique uma geração superior (ex: `Gen 3`) e o item retornado do Mercado Livre for de geração inferior (ex: `Gen 2`) ou versão clássica sem App: **-30 pontos**.

### 3.4. Vetor Peso Físico & Volumetria Integrada
* Cruzamento do peso cadastrado no WooCommerce (`$product->get_weight()`) com as grandezas extraídas em Regex (`15ml`, `50g`, `120ml`).
* Blindagem estrita para impedir que frascos de 50ml sejam comparados a ampolas/sachês de 3ml ou frascos de 120ml.

---

## 4. Consequências & Ganhos

- **Eliminação do Ruído de Score 40%:** Catálogo passa a classificar com fidelidade produtos de linhas cosméticas multiproduto (mesma marca, sabores variados).
- **Zero Intervenção Manual:** Totalmente integrado ao pipeline autônomo do gânglio `wp-adsentice-second-brain`.
- **Rastreabilidade Auditável:** Transparência no log de sincronização e nos campos ACF de inteligência do produto.

---

## 5. Status & Próximos Passos
- **ADR Promulgada:** `docs/adr/0242-casosex-advanced-multi-attribute-matching-engine.md`
- **Plano de Ação:** Atualização de [`class-meli-matcher.php`](file:///media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/plugins/casosex-mercadolivre-compare/inc/class-meli-matcher.php).
