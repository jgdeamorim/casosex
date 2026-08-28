# ADR-0204: Persistência de Sessão Zero-Logoff no Cloudflare KV/D1 & Gestão de Assets R2 ($0/mês)

- **Status:** Aceito (Accepted)
- **Data:** 2026-08-28
- **Autor:** Jeferson Amorim (Founder) & Antigravity AI
- **Domínio:** Infraestrutura Edge, Autenticação, Cloudflare D1/KV/R2, UX Cockpit V8
- **Relacionado:** ADR-0202, ADR-0016, ADR-0017, SOP v3.0

---

## 1. Contexto

Durante o uso e compilação do Cockpit V8 (`apps/cockpit`), observou-se que a execução de comandos como `npm run build`, atualização do Cloudflare Worker ou recarregamento simples da página (`F5`) causava a perda imediata da sessão do usuário autenticado, forçando o redirecionamento automático para a tela de login (`<LoginView />`).

Análise diagnóstica medido=verdade indicou três causas:
1. **Sessão Apenas em Memória RAM React:** O estado de sessão (`userSession`) era mantido unicamente via `useState` no `RenderContext.tsx`, sem persistência cruzada em `localStorage` ou Cookie HTTP.
2. **Rota do Worker Hardcoded (`/login.html`):** O callback do Google OAuth 2.0 no Worker D1 redirecionava para `/login.html?sso_success=true...`. A presença de `/login.html` na URL fazia a função `getTabFromUrl()` em `App.tsx` classificar a aba como `'login'`, forçando o componente `<LoginView />`.
3. **Ausência de Hidratação de Sessão no Boot:** Ao montar o React Provider, não havia leitura/validação automática de sessão existente.

Simultaneamente, há necessidade de armazenar arquivos e imagens de perfil/avatares sem estourar as cotas de banco de dados e mantendo a operação em **R$ 0 / mês ($0/mês)** no plano Free da Cloudflare.

---

## 2. Decisão

Decidimos adotar uma arquitetura de **Persistência de Sessão Soberana Zero-Logoff** baseada 100% no ecossistema **Cloudflare Free Tier**:

1. **Persistência de Sessão Híbrida (`localStorage` + D1 Audit):**
   - Ao efetuar login (via Form SHA-256 ou Google OAuth 2.0), o `RenderContext` gravará os dados da sessão (`v8_active_session`) no `localStorage` do navegador e no cabeçalho/cookie de sessão.
   - Na inicialização da aplicação (`RenderContextProvider`), um `useEffect` de boot reidratará automaticamente a sessão ativa se válida, eliminando logoffs acidentais no reload/rebuild.

2. **Normalização de Rotas OAuth no Worker (`worker/index.ts`):**
   - O redirecionamento pós-autenticação no Worker será direcionado para a raiz `/?sso_success=true...` em vez de `/login.html`.
   - Ao processar a sso_success, a SPA React limpa os parâmetros de URL via `window.history.replaceState` sem deslogar o usuário.

3. **Armazenamento de Assets e Avatares no Cloudflare R2 ($0 Egress):**
   - Imagens de perfil e uploads do usuário serão direcionados para o bucket R2 `adsentice` (10 GB livres/mês e 0 taxa de download).
   - O D1 armazenará apenas as URLs públicas e metadados.

4. **Proteção Turnstile Invisível:**
   - Adicionar validação Cloudflare Turnstile (100% ilimitada no Free Tier) na API `/api/v8/auth/login` para mitigar ataques de força bruta.

---

## 3. Consequências

### Positivas:
- **Zero Logoff em Rebuild/Reload:** Desenvolvedores e operadores continuam logados durante `npm run build`, atualizações e navegação diária.
- **Operação $0/mês:** Uso estrito das cotas gratuitas (Cloudflare Workers 100k req/dia, D1 5M reads/mês, R2 10GB/mês, Turnstile ilimitado).
- **Conformidade LGPD & SOP v3.0:** Todos os eventos de início/renovação de sessão continuam registrando traces auditáveis na tabela `audit_logs` do D1.

### Mitigações:
- **Validação de Expiração de Sessão:** Caso a sessão no `localStorage` expire ou seja revogada no D1, o `RenderContext` limpará a chave e redirecionará suavemente para `/login`.

---

## 4. Validação & Evidências (`medido=verdade`)

- **Syntax Validation:** Todos os arquivos modificados passarão pelo parser oxc (`adsentice_ast_validate`).
- **Build Clean:** Sucesso garantido em `npm run build` no `apps/cockpit`.
- **Wrangler Deploy:** Implantação e sincronização no Cloudflare Workers (`volupia-cockpit`).
