/**
 * MCP Server Settings page
 *
 * Displays information and configuration for EmDash's native Model Context Protocol (MCP) server.
 */

import { Button } from "@cloudflare/kumo";
import { useLingui } from "@lingui/react/macro";
import { Cpu, Key, ArrowSquareOut, Check } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { SettingRow, SettingsFrame, SettingsSection } from "./SettingsLayout.js";

export function McpSettings() {
	const { t } = useLingui();
	const [copied, setCopied] = React.useState(false);

	const handleCopyEndpoint = async () => {
		try {
			const fullUrl = `${window.location.origin}/_emdash/api/mcp`;
			await navigator.clipboard.writeText(fullUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback
		}
	};

	const title = t`MCP Server`;
	const description = t`Model Context Protocol endpoint details and active tool registry`;

	return (
		<SettingsFrame title={title} description={description}>
			<div className="grid gap-8">
				<SettingsSection title={t`Server Status & Protocol`}>
					<SettingRow>
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-3">
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-kumo-brand/10 text-kumo-brand">
									<Cpu className="h-6 w-6" />
								</span>
								<div>
									<h3 className="text-base font-semibold leading-5 text-kumo-default">
										{t`Model Context Protocol (MCP)`}
									</h3>
									<p className="mt-0.5 text-sm text-kumo-subtle">
										{t`Native Streamable HTTP server exposing EmDash handlers to AI agents`}
									</p>
								</div>
							</div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
								<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
								{t`Active (52 Tools)`}
							</span>
						</div>
					</SettingRow>

					<SettingRow>
						<dl className="grid gap-3 text-sm leading-5">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-kumo-line/60">
								<dt className="font-medium text-kumo-default">{t`Endpoint URL`}</dt>
								<dd className="flex items-center gap-2">
									<code className="bg-kumo-tint px-2.5 py-1 rounded border border-kumo-line font-mono text-xs text-kumo-default select-all">
										/_emdash/api/mcp
									</code>
									<Button size="sm" variant="ghost" onClick={handleCopyEndpoint}>
										{copied ? <Check className="h-4 w-4 text-emerald-500" /> : t`Copy`}
									</Button>
								</dd>
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
								<dt className="text-kumo-subtle">{t`Transport Protocol`}</dt>
								<dd className="font-mono text-xs text-kumo-default">Streamable HTTP (JSON-RPC 2.0)</dd>
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
								<dt className="text-kumo-subtle">{t`Authentication`}</dt>
								<dd className="font-mono text-xs text-kumo-default">Bearer Token (ec_pat_... / ec_oat_...)</dd>
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
								<dt className="text-kumo-subtle">{t`Required Accept Header`}</dt>
								<dd className="font-mono text-xs text-kumo-default">
									application/json, text/event-stream
								</dd>
							</div>
						</dl>
					</SettingRow>
				</SettingsSection>

				<SettingsSection
					title={t`Authentication & Access`}
					description={t`MCP requests require a Personal Access Token (PAT) with appropriate scopes.`}
					actions={
						<Link to="/settings/api-tokens">
							<Button icon={<Key className="h-4 w-4" />}>
								{t`Manage API Tokens`}
							</Button>
						</Link>
					}
				>
					<SettingRow>
						<p className="text-sm leading-5 text-kumo-subtle">
							{t`To authenticate your AI Assistant or cursor client, generate a Personal Access Token with scope `}
							<code className="rounded bg-kumo-tint px-1.5 py-0.5 font-mono text-xs text-kumo-default">
								Admin
							</code>
							{t` or `}
							<code className="rounded bg-kumo-tint px-1.5 py-0.5 font-mono text-xs text-kumo-default">
								Plugin MCP Tools
							</code>
							{t`.`}
						</p>
					</SettingRow>
				</SettingsSection>

				<SettingsSection title={t`Exposed Tool Capabilities`}>
					<SettingRow>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-lg border border-kumo-line p-3">
								<h4 className="font-semibold text-sm text-kumo-default">{t`Content Operations`}</h4>
								<p className="mt-1 text-xs text-kumo-subtle">{t`16 tools: create, list, update, publish, unpublish, trash, duplicate, schedule content.`}</p>
							</div>
							<div className="rounded-lg border border-kumo-line p-3">
								<h4 className="font-semibold text-sm text-kumo-default">{t`Schema & Collections`}</h4>
								<p className="mt-1 text-xs text-kumo-subtle">{t`6 tools: manage collections, list schemas, add or update custom fields dynamically.`}</p>
							</div>
							<div className="rounded-lg border border-kumo-line p-3">
								<h4 className="font-semibold text-sm text-kumo-default">{t`Media & Assets`}</h4>
								<p className="mt-1 text-xs text-kumo-subtle">{t`7 tools: upload, list, retrieve, update metadata, and repair media file usages.`}</p>
							</div>
							<div className="rounded-lg border border-kumo-line p-3">
								<h4 className="font-semibold text-sm text-kumo-default">{t`Taxonomies, Menus & Settings`}</h4>
								<p className="mt-1 text-xs text-kumo-subtle">{t`23 tools: terms, categories, navigation menus, revisions, and site settings.`}</p>
							</div>
						</div>
					</SettingRow>
				</SettingsSection>
			</div>
		</SettingsFrame>
	);
}

export default McpSettings;
