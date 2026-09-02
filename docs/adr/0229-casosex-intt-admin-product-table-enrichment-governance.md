# ADR-0229: Enriquecimento e Governança da Tabela de Produtos Admin (`edit.php?post_type=product`)

- **Status:** Accepted
- **Data:** 2026-09-02
- **Autor:** Jeferson Amorim (Founder) & Antigravity
- **Domínio:** CASOSEX / WooCommerce Dropshipping INTT / B2B

---

## 1. Contexto

A listagem padrão de produtos no WooCommerce Admin (`wp-admin/edit.php?post_type=product`) foi desenhada para operações tradicionais de e-commerce com estoque próprio. Ela exibe apenas colunas básicas: *Imagem, Nome, SKU, Estoque, Preço, Categoria, Tags e Data*.

Com a instituição do **Pipeline de Dropshipping INTT Nacional (ADR-0223 / ADR-0228)**, o operador precisa visualizar rapidamente dados críticos da operação B2B e Dropshipping sem a necessidade de abrir cada produto individualmente:
1. **Fornecedor Responsável:** Identificação visual se o produto é do fornecedor **INTT** (Termo 69) ou estoque próprio.
2. **Dados Fiscais:** NCM (8 dígitos) e GTIN/EAN (13 dígitos) para conferência de emissão de NF-e.
3. **Custo & Margem Bruta:** Exibição do Preço de Custo (`_casosex_cost_price`) e cálculo em tempo real da Margem Bruta (% e R$).
4. **Logística:** Status da Classe de Frete (`dropship-intt`, CEP 18685-540).
5. **Status de Curadoria:** Distinção clara entre produtos 🟡 *Aguardando Curadoria* (`pending`) e 🟢 *Publicados* (`publish`).
6. **Filtros por Fornecedor:** Dropdown de filtro no topo da tabela para isolar produtos de determinado fornecedor.

---

## 2. Decisão

Instituimos o módulo nativo **`WC_Dropshipping_Admin_Products_View`** dentro da extensão `woocommerce-dropshipping`:

### 2.1 Colunas Adicionadas na Tabela Admin
- **`dropshipping_supplier` (Fornecedor & Frete):** Exibe a badge visual do fornecedor (ex: `INTT`) e a classe de frete associada.
- **`fiscal_data` (Fiscal):** Exibe NCM e GTIN/EAN.
- **`cost_margin` (Custo & Margem):** Exibe Preço de Custo e Margem % (destaque em verde se ≥ 40%, amarelo se 20-39%, vermelho se < 20%).
- **`curation_status` (Curadoria):** Badge visual para o status do produto (`pending` / `publish`).

### 2.2 Filtros e Pesquisa
- Hook no `restrict_manage_posts` para injetar dropdown **"Todos os Fornecedores" / "INTT Dropshipping"**.
- Hook no `parse_query` para filtrar a query `edit.php?post_type=product` por `tax_query` de `dropship_supplier`.

---

## 3. Consequências

- **Positivas:**
  - Redução drástica no tempo de curadoria de produtos INTT.
  - Visibilidade financeira imediata da margem bruta por SKU.
  - Conferência fiscal simplificada para NCM/GTIN.
  - Capacidade de filtrar produtos por fornecedor em 1 clique.
- **Auditoria:**
  - Medido=verdade via renderização de colunas e testes no container `casosex-wordpress`.
