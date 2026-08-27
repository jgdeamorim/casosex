# ADR-0202 · Vinculação de Identidade de Workspace de Operador Admin e Fluxo OAuth2 no V8 Cockpit

- **Status:** Accepted
- **Data:** 2026-08-27
- **Decisores:** founder (Jeferson Amorim), antigravity
- **Extends:** ADR-0094, ADR-0198, ADR-0201

---

## 1. Contexto

A manipulação de planilhas de fornecedores e relatórios no Google Sheets e Google Docs via API v4 exige a presença de um escopo de autenticação **OAuth 2.0** atrelado a uma identidade de usuário/proprietário no Google Drive.

No aplicativo **V8 Cockpit** (`apps/v8-cockpit`), o operador interage através da modal de perfil `UserProfileModal.tsx` alimentada pelo `RenderContext.tsx`, que provê a sessão ativa (`userSession.email`, `userSession.name`, `userSession.role`). É necessário formalizar a ligação entre esta identidade de operador e os escopos de autorização do Google Workspace.

---

## 2. Decisão

1. **Identificador Único de Workspace**:
   - O e-mail do operador Admin ativo em `userSession.email` será utilizado como o identificador primário do Workspace para rotulagem, auditoria e propriedade das planilhas geradas.

2. **Interface do Perfil do Operador (`UserProfileModal.tsx`)**:
   - Estender a modal de perfil para incluir um card de status do **Google Workspace Integrado**.
   - Exibir a identificação interna do Workspace do operador e o status da conexão OAuth2 com a API do Google.

3. **Governança do Token OAuth2**:
   - Os tokens de acesso (`access_token` e `refresh_token`) associados ao e-mail do operador serão salvos exclusivamente de forma criptografada no cofre local `.secrets/.evn.GOOGLE-SHEETS`.
   - Nenhuma credencial ou token sensível será exposto no estado global público do React ou transmitido sem criptografia.

---

## 3. Consequências

- **Positivas**:
  - Rastreabilidade completa de qual operador/workspace gerou cada planilha no Google Sheets.
  - Experiência visual nativa no `v8-cockpit` permitindo gerenciar e revalidar o login do Google Drive diretamente no popup de perfil.
  - Separação clara entre a Chave de API (somente leitura pública) e os Tokens OAuth2 (escrita no Drive do usuário).

- **Conformidade**:
  - Alinhado com a Doutrina `medido=verdade` e o padrão Intent-Driven (ADR-0094).
