# ADR-0201 · Integrador Soberano Google Workspace MCP Server para Planilhas e Documentos

- **Status:** Concluído & Homologado (Implemented & Homologated)
- **Data:** 2026-08-27
- **Decisores:** founder (Jeferson Amorim), antigravity
- **Extends:** ADR-0019, ADR-0144, ADR-0162

---

## 1. Contexto

Para o gerenciamento da **Matriz Nacional de Fornecedores** e relatórios de homologação no ecossistema (V8 Cockpit / CASOSEX / Adsentice), faz-se necessária a capacidade de criar, ler e atualizar planilhas no **Google Sheets** e documentos no **Google Docs** de forma automatizada e segura a partir do agente de inteligência artificial.

As credenciais do serviço estão armazenadas no cofre local seguro `.secrets/.evn.GOOGLE-SHEETS`, exigindo governança rigorosa para evitar qualquer exposição de segredos ou tokens no ambiente de chat ou em logs públicos.

---

## 2. Decisão

1. **Servidor MCP Python Soberano (`tools/google_workspace_mcp.py`)**:
   - Implementar um servidor MCP utilizando `FastMCP` (Python 3.11+) e a SDK oficial `google-api-python-client`.
   - Carregar de forma transparente e segura o arquivo de ambiente local `.secrets/.evn.GOOGLE-SHEETS`.

2. **Ferramentas MCP Iniciais (Tools)**:
   - `sheets_create_supplier_matrix(title, headers)`: Cria uma nova planilha formatada para a Matriz de Fornecedores com congelamento de cabeçalho.
   - `sheets_append_suppliers(spreadsheet_id, range_name, rows)`: Adiciona linhas de fornecedores homologados.
   - `sheets_read_rows(spreadsheet_id, range_name)`: Consulta linhas da planilha.

3. **Governança de Segredos (`medido=verdade`)**:
   - Chaves de API e tokens de autenticação NUNCA serão exibidos no chat ou em logs.
   - O servidor MCP opera localmente na máquina do founder e responde via protocolo stdio JSON-RPC ao Google Antigravity.

4. **Registro em `mcp_config.json`**:
   - Registrar a chave `"google-workspace"` no `/home/jeffer/.gemini/antigravity/mcp_config.json`.

5. **Modelo de Autenticação Dual (API Key vs OAuth 2.0 / User Tokens)**:
   - **Chave de API (`key=...`)**: Reservada estritamente para consultas e leitura de planilhas e dados públicos.
   - **OAuth 2.0 / User Tokens**: Requisito obrigatório para operações de criação (`POST /v4/spreadsheets`) de novos documentos no Google Drive do usuário (`https://docs.google.com/spreadsheets/u/0/`).

6. **Identificação de Workspace no V8 Cockpit (`UserProfileModal.tsx`)**:
   - O e-mail do operador admin (`userSession.email`) acessível via `RenderContext` no modal de perfil (`UserProfileModal.tsx`) é estabelecido como o **ID Interno do Workspace**.
   - As sessões de exportação e criação de planilhas no Google Drive serão vinculadas à identidade deste operador para total auditabilidade interna.

7. **Fluxo de Repasse de Token OAuth (V8 Cockpit ──► MCP Server)**:
   - O login do operador no V8 Cockpit (`apps/v8-cockpit`) obtém a sessão autorizada Google OAuth 2.0.
   - O token Bearer do usuário logado é repassado ao MCP Server (`tools/google_workspace_mcp.py`) via variável `GOOGLE_OAUTH_TOKEN` ou cabeçalho HTTP.
   - Com este repasse transparente, o MCP executa a chamada `POST https://sheets.googleapis.com/v4/spreadsheets` com o e-mail do operador logado (`u/0`) como proprietário direto da planilha no Google Drive.

---

## 3. Consequências

- **Positivas**:
  - Capacidade nativa do assistente Antigravity de manipular Google Sheets e Docs aproveitando a sessão OAuth2 do usuário logado no V8 Cockpit.
  - Rastreabilidade de workspace e vinculação direta com a conta do Operador Admin (`userSession.email`).
  - Criação de planilhas diretamente no Google Drive do usuário (`u/0`) sem necessidade de gerenciamento manual de chaves.
  - Segurança total das credenciais mantidas isoladas em `.secrets/`.
  - Conformidade com a doutrina `medido=verdade` e rastreabilidade total.

- **Mitigações**:
  - Exibição de tratamento de erro amigável (`HTTP 401 Unauthorized`) indicando a necessidade de repasse do token OAuth2 caso apenas a API Key esteja presente para operações de escrita/criação.

---

## 4. Homologação em Produção (`medido=verdade`)

- **Planilha Criada em Produção**: `V8 Cockpit - Matriz Nacional de Fornecedores 2026`
- **Spreadsheet ID**: `19LMcr3399dpQlRhf_gk6ftLJgjyChQuFJJKk76eF9Go`
- **URL do Documento no Google Drive (`u/0`)**: [https://docs.google.com/spreadsheets/d/19LMcr3399dpQlRhf_gk6ftLJgjyChQuFJJKk76eF9Go/edit](https://docs.google.com/spreadsheets/d/19LMcr3399dpQlRhf_gk6ftLJgjyChQuFJJKk76eF9Go/edit)
- **Logotipo do Branding (OAuth Consent Screen)**: `volupia_logo_120x120.png` (120x120px PNG)
- **Token OAuth2 & Refresh Token**: Gravados com sucesso em `.secrets/.evn.GOOGLE-SHEETS`
- **Redirecionamento Canônico**: `https://app.usevolupia.com.br/api/auth/google/callback` e `https://flossie-subolive-brittanie.ngrok-free.dev/api/auth/google/callback`
- **Status do Teste de Leitura/Escrita**: **100% Homologado** com injeção automática de 3 linhas de fornecedores (`SUP-001`, `SUP-002`, `SUP-003`).

