# ADR-0239: Engine de Matching Score e Inteligência Competitiva Mercado Livre no WooCommerce (casosex-mercadolivre-compare)

- **Data / Timestamp:** 2026-09-09T11:46:00-03:00
- **Status:** Ratificado (Accepted)
- **Domínio:** Inteligência Competitiva / Arbitragem de Margens / Mercado Livre API / WooCommerce Plugin / CASOSEX
- **Autores:** Jeferson Amorim (Founder) / Antigravity Agent
- **Governança:** medido=verdade · TGDP 50% · ADR-0237 · ADR-0238

---

## 1. Contexto e Oportunidade

A auditoria financeira soberana do catálogo regional da **INTT Espírito Santo** (215 produtos ativos via Mercos B2B) revelou discrepâncias brutais de oportunidade comercial:
1. **Produtos de Alta Margem (High-Ticket Toys):** Ex: *Satisfyer Pro 2 Generation 3 com App* (Custo de Atacado: R$ 575,00 vs Preço Vencedor de Catálogo no Mercado Livre: R$ 939,90), gerando margem bruta unitária de **R$ 364,90** por venda — altamente viável para tráfego direto via Landing Page.
2. **Falso Barato vs Geração Real:** Marketplaces apresentam anúncios antigos (Pro 2 Gen 1 sem App) a R$ 309,00 a R$ 329,00 lado a lado com o Gen 3 oficial a R$ 939,90, exigindo um mecanismo determinístico de diferenciação de geração, cor e especificações técnicas.
3. **Ficha Técnica Fragmentada no B2B:** Distribuidores atacadistas frequentemente omitem dados como autonomia de bateria, decibéis, modos de vibração e nível de estanqueidade (IPX7), dados que o Mercado Livre catalogou exaustivamente.

A existência prévia de credenciais oficiais de desenvolvedor em `/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/.secret/.env.MERCADOLIVRE` (`hubmercado.wowup`, App ID `5355247799238397`) viabiliza a integração nativa direta e oficial via API OAuth 2.0 do Mercado Livre.

---

## 2. Decisão Arquitetural

Institui-se o plugin WordPress/WooCommerce **`casosex-mercadolivre-compare`**, acoplado ao ecossistema CASOSEX, com as seguintes responsabilidades soberanas:

### 2.1. Algoritmo de Matching Score Ponderado (0 a 100%)
Para vincular o produto do WooCommerce ao item canônico do Mercado Livre sem falsos positivos:

$$MatchingScore = 0.25 \cdot S_{brand} + 0.35 \cdot S_{model} + 0.15 \cdot S_{volume} + 0.10 \cdot S_{color} + 0.15 \cdot S_{price}$$

- **Score >= 85%:** Match Automático Confirmado.
- **Score 60% a 84%:** Match Sugerido (Confirmação em 1 clique no painel).
- **Score < 60%:** Rejeitado.

### 2.2. Ingestão de Métricas de Mercado e Concorrência
O plugin armazena no `wp_postmeta` do produto:
- `_meli_catalog_id`: ID oficial do catálogo MeLi (ex: `MLB41352084`).
- `_meli_market_price`: Preço vencedor do Buy Box.
- `_meli_market_sales_tier`: Faixa de tração comercial (ex: `+1000 vendidos`).
- `_meli_market_rating`: Nota média das avaliações dos clientes (ex: `4.5`).
- `_meli_market_reviews_count`: Total de reviews analisados.
- `_meli_market_active_days`: Tempo de produto ativo em catálogo desde a criação.
- `_meli_opportunity_index`: Classificação de viabilidade para Landing Page (`HIGH_MARGIN`, `ORDER_BUMP`, `SEO_ONLY`).

### 2.3. Enriquecimento de Atributos Globais (`pa_*`)
Mapeamento dos 29 atributos do catálogo MeLi para os atributos globais do WooCommerce:
- `QUANTITY_OF_VIBRATION_MODES` ➔ `pa_modos-vibracao`
- `MATERIALS` ➔ `pa_material`
- `WATER_RESISTANCE_TYPE` ➔ `pa_resistencia-agua`
- `POWER_SUPPLY_TYPE` ➔ `pa_alimentacao`

### 2.4. Estrutura de Arquivos do Plugin
```
wp-content/plugins/casosex-mercadolivre-compare/
├── casosex-mercadolivre-compare.php       # Bootstrap, hooks e lifecycle
├── inc/
│   ├── class-meli-oauth.php              # Auth e renovação de token via .env.MERCADOLIVRE
│   ├── class-meli-matcher.php            # Algoritmo de cálculo do Matching Score
│   ├── class-meli-enricher.php           # Ingestão de atributos MeLi -> pa_*
│   ├── class-meli-metabox.php            # Metabox no editor do produto (post.php)
│   └── class-meli-admin-columns.php      # Coluna de inteligência competitiva na listagem
└── assets/
    ├── css/meli-compare.css              # Estilos e badges de margem
    └── js/meli-compare.js                # Ações assíncronas AJAX
```

---

## 3. Consequências e Benefícios

- **Eliminação de Pesquisa Manual:** O founder visualiza a concorrência, preço e tração de vendas de qualquer produto diretamente na tela de edição do WooCommerce.
- **Identificação Imediata de Produtos para Landing Pages:** O semáforo de margem destaca instantaneamente os 78 produtos que possuem mais de R$ 50 a R$ 360 de margem limpa para tráfego pago.
- **Fidelidade Cadastral Máxima:** Atributos técnicos avançados preenchidos com dados oficiais de fábrica e homologação da Anvisa.
- **Soberania e Segurança:** As credenciais sensíveis permanecem isoladas no diretório seguro de ambiente sem exposição externa.
