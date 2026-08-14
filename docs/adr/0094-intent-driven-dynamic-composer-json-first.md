# ADR-0094 · Intent-Driven Dynamic Composer — Arquitetura de Composição Soberana JSON-First

- **Status**: Accepted
- **Data**: 2026-08-14
- **Autores**: Jeferson Amorim (Founder) & Antigravity (AI Pair)
- **Extends**: ADR-0036 (BLUE/GREEN), ADR-0054 (Intent-Driven Slots), ADR-0058 (Zero Hardcoded Slots), ADR-0060 (Warp Surface), ADR-0062 (BLAKE3 KV Cache), ADR-0080 (VocabFacets 7D), ADR-0084 (Paridade BLUE/GREEN)
- **Domínio**: `apps/web/src/lib/`, `packages/warp/`, `docs/spec/`, `docs/adr/`

---

## §0 · Diagnóstico & Motivação (`medido=verdade`)

### 0.1 Falha da Abordagem Tradicional (`UI/UX ──► JSON ──► HTML`)
Editores visuais e CMSs tradicionais (como Elementor, Gutenberg e abstrações acopladas estilo EmDash) utilizam a cadeia:
$$\text{Interface Visual (Drag \& Drop)} \longrightarrow \text{Estrutura JSON/AST} \longrightarrow \text{Compilação HTML}$$

Esta abordagem falha gravemente no ecossistema Adsentice por 4 razões técnicas:
1. **Incompatibilidade com Agentes Autônomos (2026+)**: Modelos LLM (Qwen 2.5 local $0 e DeepSeek cost-capped $0.0005/call) não operam por cliques visuais em interfaces drag-and-drop; operam com emissão de contratos estruturados JSON.
2. **Atrito de Manutenção & Acoplamento**: Editar código-fonte do renderizador ou dependências de rotas do admin força recompilações pesadas, gera conflitos ESM/bundling e quebra componentes do cliente.
3. **Degradação de Performance**: Motores visuais tradicionais injetam CSS inline redundante, bibliotecas de terceiros desnecessárias e lógicas de negócio dentro da camada de visualização.
4. **Violação de Brand DNA**: Permitir edição visual direta introduz inconsistências estéticas e quebra as regras de design tokens da marca do cliente.

---

## §1 · Decisão de Arquitetura: Inversão Intent-Driven (`JSON ──► UI/UX`)

Decidimos padronizar o ecossistema sob o modelo **Intent-Driven Composition (ADR-0094)**:

$$\text{Sinais do Cliente + IA (BLUE)} \longrightarrow \text{RenderContext (JSON Intenção)} \longrightarrow \text{Renderizador Cego (GREEN)} \longrightarrow \text{UI/UX Soberana}$$

---

## §2 · As 5 Doutrinas Fundamentais do Intent-Driven Composer

### 2.1 Doutrina I — O RenderContext é a Única Fonte da Verdade
O `RenderContext` (objeto JSON puro) carrega toda a semântica da página, incluindo:
- Hierarquia e ordenação estratégica dos slots.
- Intenção emocional e narrativa do copy (`semanticIntent`).
- Metadados do cliente e Brand DNA.
- Especificação técnica da faceta de layout (`layoutTechniqueFacets`).

### 2.2 Doutrina II — Renderizador GREEN Totalmente Cego (Blind Renderer)
O motor de renderização GREEN (`composer-core.ts` e renderizadores folha):
- **NÃO possui regras de negócio**: Não sabe se o produto é R$197 ou R$497, se é um sexshop ou clínica veterinária.
- **NÃO faz IO/Rede**: Zero chamadas a APIs externas, bancos de dados ou serviços Redis durante a renderização.
- **Renderização Pura e Síncrona**: Recebe o `RenderContext` e executa em tempo sub-milissegundo via TypeScript e React/Astro.

### 2.3 Doutrina III — Desacoplamento Sagrado BLUE / GREEN
- **Camada BLUE (Inteligência & IA)**:
  Responde pelo processamento pesado, chamadas LLM, cálculo do BOA score, cruzamento de dados IBGE/GMB e seleção de técnicas. Produz o `RenderContext`.
- **Camada GREEN (Apresentação & Layout)**:
  Recebe o `RenderContext` e mapeia cada nó em componentes visuais soberanos usando Tailwind CSS v4 e shadcn/ui.

### 2.4 Doutrina IV — As 7 Dimensões de `VocabFacets` (ADR-0080)
A intenção semântica de cada slot é resolvida em 7 facetas multidimensionais:
1. `intentKind`: Natureza da ação (`diagnostic_reveal`, `gap_exposure`, `value_proposition`, `social_proof`, `conversion_cta`).
2. `archetype`: Persona e tom narrativo (`authority_analyst`, `direct_challenger`, `empathetic_guide`).
3. `tone`: Tonalidade emocional (`urgent`, `analytical`, `reassuring`, `exclusive`).
4. `density`: Densidade visual (`minimal`, `compact`, `detailed`, `editorial`).
5. `emotionValence`: Valência BOA afetiva (`high_tension`, `problem_agitation`, `solution_relief`).
6. `visualCognition`: Hierarquia de leitura (`scannable_grid`, `hero_focal`, `contrast_card`).
7. `layoutTechniqueFacets`: Técnica de layout declarada para o renderizador (`bento_grid`, `split_hero`, `feature_matrix`, `interactive_calculator`).

### 2.5 Doutrina V — Estilização Estrita por Tokens (`deriveStylesheet`)
Toda estilização é resolvida dinamicamente através de variáveis CSS semânticas:
- Proibido uso de hexadecimais hardcodados em componentes visuais.
- A função `deriveStylesheet(brandDNA)` injeta o mapa de cores e tipografia no escopo do `RenderContext`.

---

## §3 · Estrutura do Contrato (`RenderContextSchema`)

```typescript
export interface RenderSlotIntent {
  slotId: string;
  intentKind: string;
  facets: {
    archetype: string;
    tone: string;
    density: string;
    emotionValence: string;
    visualCognition: string;
    layoutTechnique: string;
  };
  payload: {
    title: string;
    subtitle?: string;
    bodyText?: string;
    cta?: { label: string; actionUrl: string; variant: string };
    metrics?: Array<{ label: string; value: string; trend?: string }>;
    mediaUrl?: string;
  };
}

export interface RenderContext {
  surfaceId: "S10" | "S11" | "S12";
  tenantId: string;
  brandDnaHash: string;
  stylesheet: Record<string, string>;
  slots: RenderSlotIntent[];
  meta: {
    generatedAt: string;
    composerVersion: string;
    boaScore?: number;
  };
}
```

---

## §4 · Governança & Pipeline de Execução

1. **Geração (BLUE)**:
   O pipeline da superfície (ex: `composeS10_BLUE()`) consome os dados do cliente e a inteligência LLM para gerar o `RenderContext`.
2. **Validação de Schema**:
   O JSON é validado contra o `RenderContextSchema` antes de ser repassado ao renderizador.
3. **Renderização (GREEN)**:
   O `composer-core` consome o `RenderContext` e devolve a interface limpa em React/Tailwind v4 em sub-milissegundos.
4. **Cache Caching Determinístico (ADR-0062)**:
   O `RenderContext` gerado é indexado via hash BLAKE3 no Redis (`adsentice:kv:blake3:*`), permitindo renderização instantânea em requisições subsequentes.

---

## §5 · Consequências e Medições

- **Garantia de Zero Hardcode**: Eliminados slots e copies cravados no código-fonte.
- **Tempo de Renderização**: GREEN com execução `< 2ms` no servidor.
- **Escala SMB**: Capacidade de gerar centenas de superfícies personalizadas por minutos via orquestração de IA sem interferência manual.
- **Manutenibilidade**: Mudanças de design afetam apenas o `TechniqueRenderer` correspondente, sem risco de corrupção da lógica de negócio.
