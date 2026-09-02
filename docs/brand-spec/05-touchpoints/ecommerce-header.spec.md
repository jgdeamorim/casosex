# SPEC · Cabeçalho WooCommerce & Tema Blocksy Pro

> **Arquivo:** `docs/brand-spec/05-touchpoints/ecommerce-header.spec.md`  
> **Status:** APROVADO · **Escopo:** Aplicação Digital em E-commerce

---

## 1. Diretrizes de Header E-commerce

O cabeçalho do e-commerce VOLÚPIA (`localhost:8085` / `usevolupia.com.br`) deve utilizar o **Lockup Horizontal** (`04-assets/svg/lockup-horizontal.svg`):

- **Altura do Header:** $70\text{px}$ fixo com efeito de *glassmorphism* (`backdrop-filter: blur(16px); background: rgba(13, 10, 15, 0.85)`).
- **Posicionamento do Lockup:** Alinhado à esquerda no container principal de $1200\text{px}$.
- **Comportamento Sticky (Scroll):** No scroll para baixo, transitar suavemente para o **Nível 03 (Wordmark Standalone)** reduzindo a altura para $54\text{px}$.
- **Favicon Ativo:** Injetar `04-assets/favicon/favicon-32.svg` via `<link rel="icon">` no `<head>` do WordPress.
