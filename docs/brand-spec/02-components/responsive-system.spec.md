# SPEC · Responsive Logo System (4 Níveis)

> **Arquivo:** `docs/brand-spec/02-components/responsive-system.spec.md`  
> **Status:** APROVADO · **Escopo:** Responsividade e Densidade de Tela

---

## 1. Matriz dos 4 Níveis Responsivos

A apresentação visual da VOLÚPIA se adapta de acordo com o espaço disponível e o dispositivo de exibição:

```
[ Nível 01: Master ]    ───> Desktop (> 1024px) / Home Hero
(Brandmark + Wordmark + Tagline)

[ Nível 02: Primary ]   ───> Mobile Header (600px - 1024px) / Documentos
(Brandmark + Wordmark)

[ Nível 03: Wordmark ]  ───> Barras Horizontais / Rodapés Limitados
(Wordmark Standalone VOLÚPIA)

[ Nível 04: Micro ]     ───> Favicon (< 48px) / Avatares / Selos
(Brandmark Monograma V Simplificado)
```

---

## 2. Regras de Breakpoint CSS (Media Queries)

```css
/* Nível 01: Master Signature */
@media (min-width: 1024px) {
  .volupia-brand-target { content: url('/assets/svg/lockup-primary-stacked.svg'); }
}

/* Nível 02: Primary Horizontal Header */
@media (max-width: 1023px) and (min-width: 600px) {
  .volupia-brand-target { content: url('/assets/svg/lockup-horizontal.svg'); }
}

/* Nível 03: Wordmark Standalone */
@media (max-width: 599px) and (min-height: 80px) {
  .volupia-brand-target { content: url('/assets/svg/wordmark-standalone.svg'); }
}

/* Nível 04: Micro Favicon / Avatar */
.volupia-avatar-target {
  content: url('/assets/favicon/icon-64.svg');
  width: 48px;
  height: 48px;
}
```
