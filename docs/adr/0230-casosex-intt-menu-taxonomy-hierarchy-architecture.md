# ADR-0230: Arquitetura de Taxonomia e Hierarquia do Menu CASOSEX / Volúpia Baseada no Catálogo INTT

- **Status**: Aceito (Accepted)
- **Data**: 2026-09-02
- **Autor**: Sovereign Antigravity Engine & Founder Jeferson Amorim
- **Domínio**: CASOSEX / Volúpia (WooCommerce & Navigation System)

---

## Contexto

A loja CASOSEX / Volúpia opera no modelo de dropshipping e distribuição de produtos eróticos e cosméticos sensuais, tendo o catálogo da INTT como sua principal matriz de fornecimento. Para maximizar a taxa de conversão (CRO), a encontrabilidade dos produtos e a paridade de experiência com o fornecedor oficial, é fundamental estruturar as categorias do WooCommerce e a navegação do site utilizando a mesma taxonomia de 3 níveis padronizada pela INTT.

A estrutura atual do WooCommerce necessita de automação nativa para criar, atualizar e vincular as categorias principais, subcategorias de 2º nível e subcategorias específicas de 3º nível, mapeando os produtos automaticamente durante a ingestão e sincronização.

---

## Decisão de Arquitetura

1. **Taxonomia Hierárquica de 3 Níveis no WooCommerce**:
   - **Nível 1 (Categoria Raiz)**: 9 grandes pilares (ex: *Saúde e bem-estar*, *Gel Deslizante*, *Cosméticos sensuais*, *Vibradores líquidos*, *Vibradores*, *Sugadores de clitóris*, *Produtos eróticos*, *Linhas / Coleções*, *Promoção*).
   - **Nível 2 (Grupos/Famílias)**: Subcategorias pai intermediárias (ex: *Saúde Íntima*, *À base de água*, *Excitantes*, *Sexo Anal*, *Sexo Oral*, *Femininos*, *BDSM e Fetiche*).
   - **Nível 3 (Especialidades/Subprodutos)**: Subcategorias filhas diretas dos produtos (ex: *Beijável*, *Dessensibilizante*, *Garganta Profunda*, *Realísticos*, *Clitorianos*, *Plug anal*, *Masturbadores Eggs*).

2. **Mapeador Inteligente de Categorias no Plugin (`casosex-dropshipping-sync`)**:
   - O plugin PHP nativo `casosex-dropshipping-sync` incluirá uma matriz de mapeamento (`casosex_resolve_category_hierarchy`) que associa o nome/tags do produto INTT à sua árvore taxonômica completa (Nível 1 → Nível 2 → Nível 3).
   - A função garante a criação idempotente de categorias e subcategorias no WooCommerce (`wp_insert_term` com `parent`), evitando duplicações e vinculando o produto aos 3 níveis da hierarquia.

3. **Menu Dinâmico WooCommerce / Navigation Engine**:
   - As taxonomias criadas alimentam nativamente o sistema de menus do WordPress (`wp_nav_menu`) e os endpoints REST da loja CASOSEX / Volúpia, permitindo renderizar mega-menus responsivos e filtros faceted navigation.

---

## Consequências

### Positivas
- **Paridade 100% de Catálogo**: Estrutura idêntica à loja oficial da INTT, facilitando a localização de produtos pelos clientes.
- **Automação Sem Intervenção Manual**: Produtos ingeridos via REST API já recebem a árvore hierárquica completa sem necessidade de categorização manual no painel do WordPress.
- **Melhoria Significativa no SEO & UX**: Estrutura clara de URLs semânticas no WooCommerce (ex: `/categoria/cosmeticos-sensuais/sexo-oral/beijaveis`).

### Riscos / Mitigações
- **Reorganização de Produtos Existentes**: Produtos ingeridos anteriormente na categoria genérica "Produtos Eróticos INTT" precisam ser reclassificados.
  - *Mitigação*: Criar rotina de migração em lote via script CLI/REST no plugin para re-processar e re-categorizar os produtos existentes no banco.

---

## Status de Aprovação
- **Decisão**: Aceito e pronto para execução no ecossistema CASOSEX.
