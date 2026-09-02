# SPEC · System Lockups (Composições Fixas & Enquadramento Ótico)

> **Arquivo:** `docs/brand-spec/02-components/lockups.spec.md`  
> **Status:** APROVADO CANÔNICO · **Ativos Relacionados:** `04-assets/svg/lockup-primary-stacked.svg` e `lockup-horizontal.svg`

---

## 1. Regras Rigorosas de Enquadramento & Alinhamento Ótico

Todas as composições de marca (**Lockups**) da VOLÚPIA seguem grid matemático estrito de centralização e bissecção vertical:

### 1.1 Lockup Secundário Horizontal (Navbar & Header)
- **Grid do ViewBox:** $1100 \times 320\text{px}$ (Eixo central $Y = 160.0\text{px}$).
- **Enquadramento do Brandmark (Símbolo):**
  - Altura exata: $190.0\text{px}$ (escalado a $0.16$). Posicionado de $Y = 65.0\text{px}$ a $Y = 255.0\text{px}$.
  - Centro geométrico do símbolo coincide exatamente com o centro da marca em $Y = 160.0\text{px}$.
- **Divisor Ótico Vertical:**
  - Linha vertical em $X = 320\text{px}$, estendendo-se de $Y = 65\text{px}$ a $Y = 255\text{px}$ (Altura exata = $190\text{px}$).
  - Cor: *Champagne Gold* (`#D4A373`) com opacidade de $45\%$ e pontas arredondadas (`stroke-linecap="round"`).
  - A linha **nunca** é cortada nem ultrapassa a altura limite do símbolo.
- **Bloco Tipográfico (Direita):**
  - Posicionado em $X = 360\text{px}$.
  - **Wordmark VOLÚPIA:** Linha de base em $Y = 168\text{px}$, fonte *Playfair Display* (74px, peso 700, letter-spacing 14px).
  - **Tagline DESPERTE SEUS SENTIDOS:** Linha de base em $Y = 225\text{px}$, fonte *Plus Jakarta Sans* (20px, peso 500, letter-spacing 9px).
  - O centro gravitacional do bloco tipográfico coincide exatamente com $Y = 160.0\text{px}$.

---

## 2. Harmonia de Cores & Efeito Erotic Luxury

Para eliminar o contraste frio/agressivo de tons brancos puros soltos:
- ❌ **Proibido:** Usar texto em branco puro seco (`#FFFFFF` / `#FAF7F5`) solto sobre fundos escuros sem gradiente ou suavização visual.
- 🟢 **Harmonia Champanhe:** O Wordmark VOLÚPIA utiliza degradê sutil *Champagne Cream* (`#F7EBE1` → `#E5C3A6`) para criar profundidade e elegância sob luz fraca.
- 🟢 **Harmonia Carmim:** O Brandmark utiliza a transição contínua *Crimson Rose* → *Bordeaux Velvet* (`#FB7185` → `#E11D48` → `#9F1239` → `#580A20`) com *DropShadow* difuso sutil (`stdDeviation="8"`, opacidade $20\%$).
