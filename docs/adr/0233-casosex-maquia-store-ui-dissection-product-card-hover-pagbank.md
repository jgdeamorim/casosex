# ADR-0233: CASOSEX Maquia Store UI/UX Dissection & Dynamic PagBank Hover Product Card Architecture

- **Status:** Accepted
- **Data:** 2026-09-02
- **Autor:** Jeferson Amorim (Founder) & Engine Antigravity
- **Projeto Target:** CASOSEX / Volúpia (WordPress Blocksy Pro v2.1.55 + WooCommerce)
- **Doutrina:** `medido=verdade` (Afirmações baseadas na extração empírica de código e banco de dados WP)

---

## 📋 Contexto e Problema

Para aumentar a taxa de conversão (CRO) da loja **CASOSEX** e oferecer uma experiência visual premium de e-commerce de beleza/bem-estar, fez-se necessário dissecar o tema benchmark `Maquia - Store Pro (v1.2.3)` (`demo-maquia-store-pro-devrocket.commercesuite.com.br`) e incorporar seus componentes mais impactantes no **Blocksy Pro (v2.1.55)**.

Os 2 elementos focais selecionados foram:
1. **Top Header Bar & Header Menu**: Barra superior de ofertas rotativas com paleta Marsala/Blush e navegação de categorias.
2. **Hover Card de Produtos (`product.show-down`)**: Animação de elevação de card no hover com troca fluida de imagem (foto 1 ➔ foto 2) e gaveta deslizando com detalhes de parcelamento no cartão e desconto PIX.

Além disso, a regra de parcelamento e desconto PIX não pode ser estática (hardcoded), devendo respeitar dinamicamente as opções do gateway de pagamento **PagBank** (`woocommerce_pagbank_credit_card_settings`) e o percentual de desconto no PIX configurado no WordPress.

---

## 🔬 Auditoria & Extração Empírica (`medido=verdade`)

### 1. Extração do CSS e Animações da Maquia Store
Através do script de extração direta de `devrocket.css` (280KB), capturamos as regras exatas de transição:
- **Troca de Imagem no Hover**:
  ```css
  .card-image .imagem-produto-1, .card-image .imagem-produto-2 { transition: opacity 0.3s ease; }
  .card-image:has(.imagem-produto-2):hover .imagem-produto-1 { opacity: 0; }
  .card-image:has(.imagem-produto-2):hover .imagem-produto-2 { opacity: 1; }
  ```
- **Elevação do Card & Ocultação de Ratings (`show-down`)**:
  ```css
  .product.show-down:hover .product-rating { opacity: 0; }
  .product.show-down:hover .product-rating + .product-price { transform: translateY(-25px); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  ```

### 2. Configurações Ativas do PagBank & Product Reviews
Inspecionamos o banco de dados do WordPress (`casosex-wordpress`):
- `woocommerce_pagbank_credit_card_settings`:
  - `maximum_installments` = `6`
  - `maximum_installments_interest_free` = `6`
- Extensão `product-reviews` do Blocksy Pro:
  - `woo_advanced_reviews_summary` = `'yes'`
  - `woo_advanced_reviews_images` = `'yes'`
  - `woo_advanced_reviews_votes` = `'yes'`

### 3. Alinhamento com a Documentação Oficial Blocksy WooCommerce General
Conforme a documentação oficial (`https://creativethemes.com/blocksy/docs/woocommerce/woocommerce-general/`), o Blocksy Pro gerencia nativamente via Customizer:
- **Product Badges**: Selos de desconto (% off), estoque e lançamentos.
- **Star Rating & Quantity Inputs**: Estilo visual global para estrelas de avaliação e seletores numéricos (+ / -).
- **Mensagens de Checkout/Carrinho**: Estilização de avisos de informação, sucesso e erros.

A injeção do componente Hover Maquia respeita integralmente esses seletores nativos sem sobrescrevê-los ou quebrá-los.

### 4. Alinhamento com a Documentação Oficial Blocksy Header Builder Elements
Conforme a documentação oficial (`https://creativethemes.com/blocksy/docs/header-elements/header-builder-elements/`), o Blocksy Pro fornece elementos modulares e suporte a duplicação de elementos:
- **Contacts**: Elemento de links diretos configurado via `theme_mods_blocksy` para "Blog" e "Seja Revendedora".
- **HTML Element & Top Row**: Utilizado para injetar a barra de ofertas rotativa (ticker Swiper) no `Top Row` do cabeçalho global com paleta Marsala/Blush.
- **Cart, Search & Account**: Integram-se de forma nativa na `Main Row` mantendo a gaveta offcanvas e suporte a login modal.

---

## 🎯 Decisão de Arquitetura

Instituímos a **Arquitetura Reativa de Product Card & UI Hover Maquia Store**:

### 1. Motor de Cálculo Dinâmico PagBank + PIX
No plugin soberano `casosex-dropshipping-sync.php` (v2.7.0), criamos a função `casosex_get_product_card_payment_info($product)`:
- Lê em runtime as parcelas sem juros do PagBank (`maximum_installments_interest_free`).
- Lê a taxa de desconto PIX (`casosex_pix_discount_percent`, default 10%).
- Calcula o valor exato da parcela e o valor com desconto PIX para cada produto.

### 2. Animação Responsiva Hover no Blocksy Pro
Injetamos os seletores CSS extraídos da Maquia Store acoplados aos hooks e containers nativos do Blocksy Pro (`.ct-media-container`, `.product`, `blocksy:woocommerce:product-card:summary:after`):
- Transição de 0.3s na troca da foto secundária do produto.
- Revelação da gaveta de parcelamento/PIX ao passar o mouse.

### 3. Integração Não-Invasiva com Blocksy Product Reviews & Badges
As estrelas de avaliação (`woo_advanced_reviews_summary`) e os selos de produto (`Product Badges`) do Blocksy permanecem intactos, aproveitando as personalizações do Customizer enquanto compartilham o layout do card durante o hover.

### 4. Mapeamento de Responsabilidade: Customizer Blocksy PRO vs. Code Injections
Conforme análise cirúrgica do Customizer do Blocksy PRO (`Personalizar > WooCommerce > Arquivos de Produtos`), estabelecemos a separação clara de responsabilidades sem duplicação de esforço:

1. **Customizer Blocksy PRO (Configuração Zero-Code)**:
   - **Card Type Base**: Seleção do `Type 1` ou `Type 2` em `Arquivos de Produtos > Configurações do Card`.
   - **Troca de Imagem no Hover (Image Swap)**: Ativação nativa em `Arquivos de Produtos > Imagem do Produto > Efeito de Hover = Swap Image`.
   - **Badges / Selos**: Gerenciamento de `SALE`, `Esgotado` e `Novo` em `Arquivos de Produtos > Badges / Selos`.
   - **Star Rating & Atributos**: Habilitação dos seletores visuais nativos `Rating` e `Variation Swatches`.

2. **Injeção de Código (Plugin `casosex-dropshipping-sync.php` + CSS Adicional)**:
   - **Hook de Injeção**: `blocksy:woocommerce:product-card:summary:after` para o bloco de parcelas PagBank e desconto PIX.
   - **CSS de Elevação de Card**: Classe `.product.show-down` acoplada ao container `.entry-card` para o efeito de elevação `translateY(-25px)` no desktop.
   - **Responsividade Mobile**: Manutenção dos dados de pagamento de forma estática e legível em telas touch onde o hover não se aplica.

---

## 📊 Diagrama da Arquitetura

```mermaid
graph TD
    A[Maquia UI Dissection Engine] --> B[1. Visual Tokens & CSS Extraction]
    A --> C[2. PagBank Gateway Integration]
    A --> D[3. Dynamic Product Card Hover Component]

    B --> B1[Opacity 0.3s Image Switch]
    B --> B2[translateY -25px Hover Elevation]

    C --> C1[Read maximum_installments_interest_free from PagBank]
    C --> C2[Read casosex_pix_discount_percent]

    D --> D1[Calculated 6x sem juros]
    D --> D2[Calculated 10% OFF no PIX]
    D --> D3[Blocksy Product Reviews Star Ratings Integration]
```

---

## 🚀 Consequências

1. **Fidelidade Visual Benchmark**: Reconstrução pixel-perfect das melhores animações do tema Maquia Store Pro dentro do Blocksy Pro v2.1.55.
2. **Reatividade Total a Gateways**: Alterações no parcelamento do PagBank refletem instantaneamente em toda a vitrine.
3. **Alto Impacto em CRO**: Apresentação de parcelamento e desconto PIX no hover aumenta drasticamente a taxa de cliques e adição ao carrinho.

