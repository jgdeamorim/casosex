# ADR-0231: Orquestração Nativa do Advanced Mega Menu Blocksy no WordPress CASOSEX / Volúpia

- **Status**: Aceito (Accepted)
- **Data**: 2026-09-02
- **Autor**: Sovereign Antigravity Engine & Founder Jeferson Amorim
- **Domínio**: CASOSEX / Volúpia (Theme Navigation & Blocksy Integration)

---

## Contexto

O site CASOSEX / Volúpia utiliza o tema **Blocksy Pro** (v2.1.55) com a extensão **`mega-menu`** (Advanced Menu) ativada via `blocksy-companion-pro` (v2.1.52). 
Para oferecer uma navegação responsiva de alto nível no Desktop e no Mobile sem depender de edições manuais exaustivas no painel `/wp-admin/nav-menus.php`, é necessário automatizar programmaticamente a vinculação dos itens de menu às categorias do WooCommerce e a injeção dos metadados nativos do Blocksy.

---

## Decisão de Arquitetura

1. **Estrutura de Menu Única com Dual-Location (`menu_1` + `menu_mobile`)**:
   - Manter um menu principal unificado (`slug: main-menu` / `term_id: 67`) vinculado simultaneamente às posições `menu_1` (Desktop Header) e `menu_mobile` (Mobile Offcanvas Drawer).

2. **Injeção Nativa de Metadados Blocksy (`blocksy_post_meta_options`)**:
   - Para cada item de menu raiz de Nível 1 (ex: *Cosméticos sensuais*, *Gel Deslizante*, *Vibradores*, *Saúde e bem-estar*), gravar programmaticamente o array de opções na postmeta do `nav_menu_item`:
     ```php
     update_post_meta($nav_item_id, 'blocksy_post_meta_options', array(
         'has_mega_menu'     => 'yes',
         'mega_menu_columns' => '4',         // Grid de colunas adaptado ao volume de subcategorias
         'mega_menu_width'   => 'container', // Largura do container do site
         'mega_menu_label'   => 'HOT',       // Opcional para categorias em destaque
     ));
     ```

3. **Automação via CLI / Plugin**:
   - Desenvolver um script/comando no plugin `casosex-dropshipping-sync` para construir e atualizar a árvore inteira de navegação (Nível 1 → Nível 2 → Nível 3) de forma idempotente.

4. **Navegação Responsiva Mobile via Accordion**:
   - No Mobile, o Blocksy converterá automaticamente os itens do Mega Menu em um menu lateral *Offcanvas Accordion* (gaveta deslizante com expansão de subitens por chevron).

---

## Consequências

### Positivas
- **Automação Completa**: Todo o menu de 3 níveis da INTT é montado e configurado com Mega Menu em segundos.
- **Manutenibilidade**: Mudanças nas categorias no WooCommerce refletem automaticamente no menu sem necessidade de recriar blocos complexos.
- **Performance & UX**: Navegação fluida sem peso extra de plugins terceiros de mega menu.

### Riscos / Mitigações
- **Sobrescrita de Alterações Manuais**: A execução da sincronização do menu pode sobrescrever links manuais criados via admin.
  - *Mitigação*: Preservar links customizados existentes (ex: *Home*, *Sobre*, *Contato*) no topo/rodapé do menu.

---

## Status de Aprovação
- **Decisão**: Aceito e pronto para execução.
