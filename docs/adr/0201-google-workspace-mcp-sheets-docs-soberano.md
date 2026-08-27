# ADR-0201 · Integrador Soberano Google Workspace MCP Server para Planilhas e Documentos

- **Status:** Accepted
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

---

## 3. Consequências

- **Positivas**:
  - Capacidade nativa do assistente Antigravity de manipular Google Sheets e Docs com comando de texto simples.
  - Segurança total das credenciais mantidas isoladas em `.secrets/`.
  - Conformidade com a doutrina `medido=verdade` e rastreabilidade total.

- **Mitigações**:
  - Fallback automático para modo de simulação em caso de ausência de rede ou erro na API do Google.
