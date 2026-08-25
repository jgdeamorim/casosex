# Decisões de Arquitetura - Migração MCP

## Refatoração para MCP SDK v2 (FastMCP / MCPServer)
**Data:** 2026-08-15
**Motivo:** O SDK Python `mcp` foi atualizado para a versão 2.0.0, introduzindo breaking changes (remoção dos decoradores manuais `@server.list_tools()` e `@server.call_tool()`).

**Arquivos Refatorados:**
- `adsentice/tools/adsentice_kg_server.py`
- `adsentice/tools/adsentice_qdrant_server.py`
- `adsentice/tools/adsentice_conversation.py`

### Principais Ganhos:
1. **Fim da Duplicação de Schemas:** Os esquemas JSON (inputSchema) agora são gerados dinamicamente via inspeção do Pydantic (Type Hints) pela API `MCPServer`, eliminando erros manuais.
2. **Stateless:** A estrutura do MCP v2.0 é stateless, aumentando drásticamente a estabilidade (fim dos timeouts no Claude) e permitindo paralelismo seguro nas invocações.
3. **Código Limpo:** Remoção de boilerplate pesado (roteamento via if/else). Cada ferramenta agora é declarada de forma autônoma: `@mcp.tool()`.

**Ação Padrão para Novos MCPs:**
- Utilizar sempre `mcp>=2.0.0`
- Utilizar `from mcp.server.mcpserver import MCPServer`
- Decorar com `@mcp.tool()`
- Rodar o servidor usando `mcp.run(transport='stdio')`
