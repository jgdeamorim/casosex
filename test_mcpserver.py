from mcp.server.mcpserver import MCPServer
server = MCPServer("test")
@server.tool()
def hello() -> str: return "world"
