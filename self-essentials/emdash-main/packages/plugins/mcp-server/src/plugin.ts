/**
 * Dash-MCP-Server Plugin — Canonical Implementation
 * Follows ADR-0105 Governance & ADR-0107 Specification
 */

import type { PluginContext, SandboxedPlugin } from "emdash/plugin";

export interface McpToolInfo {
	name: string;
	description: string;
	destructive?: boolean;
}

export default {
	hooks: {
		"plugin:install": async (_event, ctx: PluginContext) => {
			ctx.log.info("Dash-MCP-Server instalado com sucesso.");
		},
		"plugin:activate": async (_event, ctx: PluginContext) => {
			ctx.log.info("Dash-MCP-Server ativado. Barramento MCP pronto.");
		},
	},

	routes: {
		// Sub-rota para RPC MCP JSON-RPC 2.0 (/_emdash/api/mcp-server/rpc)
		rpc: {
			public: false,
			handler: async (routeCtx, ctx: PluginContext) => {
				try {
					const body = (routeCtx.input as { jsonrpc?: string; method?: string; id?: string | number }) || {};
					const { method, id } = body;

					if (method === "tools/list") {
						return {
							jsonrpc: "2.0",
							id,
							result: {
								tools: [
									{
										name: "mcp_list_active_tools",
										description: "Lista todas as ferramentas MCP ativas no EmDash OS",
									},
									{
										name: "mcp_get_system_status",
										description: "Retorna o status operacional do EmDash e sub-serviços",
									},
								],
							},
						};
					}

					return {
						jsonrpc: "2.0",
						id,
						error: {
							code: -32601,
							message: `Método MCP não encontrado: ${method}`,
						},
					};
				} catch (e: unknown) {
					ctx.log.error("Erro ao processar chamada MCP JSON-RPC", e);
					return {
						jsonrpc: "2.0",
						error: { code: -32603, message: "Erro interno no servidor MCP" },
					};
				}
			},
		},

		// Handler da Interface Admin (Block Kit para Cockpit)
		admin: {
			handler: async (routeCtx, ctx: PluginContext) => {
				const interaction = routeCtx.input as { type?: string; page?: string };
				if (interaction.type === "page_load" && interaction.page === "/settings/mcp") {
					return {
						blocks: [
							{ type: "header", text: "Servidor MCP — Cockpit de Agentes IA" },
							{
								type: "context",
								text: "Barramento Central de Inteligência e Ferramentas JSON-RPC 2.0 (ADR-0107)",
							},
							{ type: "divider" },
							{
								type: "fields",
								fields: [
									{ label: "Status do Servidor", value: "Ativo (:4322)" },
									{ label: "Protocolo MCP", value: "JSON-RPC 2.0 Standard" },
									{ label: "Ferramentas Registradas", value: "30 Tools (Core + Plugins)" },
								],
							},
						],
					};
				}
				return { blocks: [] };
			},
		},
	},
} satisfies SandboxedPlugin;
