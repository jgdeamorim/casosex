import { Combobox, inputVariants } from "@cloudflare/kumo";
import { useLingui } from "@lingui/react/macro";
import {
	Gear,
	ShareNetwork,
	MagnifyingGlass,
	Shield,
	Globe,
	GlobeSimple,
	Key,
	Envelope,
	DownloadSimple,
	CaretDown,
	Cpu,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { fetchManifest } from "../lib/api";
import { SUPPORTED_LOCALES } from "../locales/index.js";
import { useLocale } from "../locales/useLocale.js";
import { SettingsNavRow, SettingsSection } from "./settings/SettingsLayout.js";

/**
 * Settings hub page — links to all settings sub-pages.
 */
export function Settings() {
	const { data: manifest } = useQuery({
		queryKey: ["manifest"],
		queryFn: fetchManifest,
	});

	const { t } = useLingui();
	const { locale, setLocale } = useLocale();
	const showSecuritySettings = manifest?.authMode === "passkey";
	const selectedLocale = SUPPORTED_LOCALES.find((option) => option.code === locale) ?? null;

	return (
		<div className="max-w-4xl pb-6">
			<header>
				<h1 className="text-2xl font-semibold leading-tight text-balance">{t`Settings`}</h1>
			</header>

			<div className="mt-6 grid gap-8">
				<SettingsSection title={t`Site`}>
					<SettingsNavRow
						to="/settings/general"
						icon={<Gear className="h-5 w-5" />}
						title={t`General`}
						description={t`Site identity, logo, favicon, and reading preferences`}
					/>
					<SettingsNavRow
						to="/settings/social"
						icon={<ShareNetwork className="h-5 w-5" />}
						title={t`Social Links`}
						description={t`Social media profile links`}
					/>
					<SettingsNavRow
						to="/settings/seo"
						icon={<MagnifyingGlass className="h-5 w-5" />}
						title={t`SEO`}
						description={t`Search engine optimization and verification`}
					/>
				</SettingsSection>

				{showSecuritySettings && (
					<SettingsSection title={t`Security Settings`}>
						<SettingsNavRow
							to="/settings/security"
							icon={<Shield className="h-5 w-5" />}
							title={t`Security`}
							description={t`Manage your passkeys and authentication`}
						/>
						<SettingsNavRow
							to="/settings/allowed-domains"
							icon={<Globe className="h-5 w-5" />}
							title={t`Self-Signup Domains`}
							description={t`Allow users from specific domains to sign up`}
						/>
					</SettingsSection>
				)}

				<SettingsSection title={t`API Tokens`}>
					<SettingsNavRow
						to="/settings/api-tokens"
						icon={<Key className="h-5 w-5" />}
						title={t`API Tokens`}
						description={t`Create personal access tokens for programmatic API access`}
					/>
				</SettingsSection>

				<SettingsSection title={t`MCP Server`}>
					<div className="p-4 space-y-4">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-3">
								<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-kumo-brand/10 text-kumo-brand" aria-hidden="true">
									<Cpu className="h-5 w-5" />
								</span>
								<div>
									<h3 className="text-base font-semibold leading-5 text-kumo-default">{t`Model Context Protocol (MCP)`}</h3>
									<p className="mt-0.5 text-sm text-kumo-subtle">{t`Streamable HTTP endpoint for AI Agents and IDE integrations`}</p>
								</div>
							</div>
							<div className="flex items-center gap-2 self-start sm:self-auto">
								<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
									<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
									{t`Active (52 Tools)`}
								</span>
							</div>
						</div>

						<div className="grid gap-2.5 rounded-lg border border-kumo-line bg-kumo-tint p-4 text-xs font-mono">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-kumo-line/60">
								<span className="font-sans font-medium text-kumo-subtle">{t`Endpoint URL:`}</span>
								<code className="bg-kumo-base px-2.5 py-1 rounded border border-kumo-line text-kumo-default font-semibold text-xs select-all">
									/_emdash/api/mcp
								</code>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
								<span className="font-sans font-medium text-kumo-subtle">{t`Transport Protocol:`}</span>
								<span className="text-kumo-default font-mono">Streamable HTTP (JSON-RPC 2.0)</span>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
								<span className="font-sans font-medium text-kumo-subtle">{t`Authentication:`}</span>
								<span className="text-kumo-default font-mono">Bearer Token (ec_pat_... / ec_oat_...)</span>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
								<span className="font-sans font-medium text-kumo-subtle">{t`Required Accept Header:`}</span>
								<code className="text-kumo-default font-mono bg-kumo-base/60 px-1.5 py-0.5 rounded">application/json, text/event-stream</code>
							</div>
						</div>
					</div>
				</SettingsSection>

				<SettingsSection title={t`Email Settings`}>
					<SettingsNavRow
						to="/settings/email"
						icon={<Envelope className="h-5 w-5" />}
						title={t`Email`}
						description={t`View email provider status and send test emails`}
					/>
					<SettingsNavRow
						to="/settings/backups"
						icon={<DownloadSimple className="h-5 w-5" />}
						title={t`Backups`}
						description={t`Download backups and schedule automatic backups to storage`}
					/>
				</SettingsSection>

				{SUPPORTED_LOCALES.length > 1 && (
					<SettingsSection title={t`Language`}>
						<div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex min-w-0 items-center gap-3">
								<span
									className="flex h-5 w-5 shrink-0 items-center justify-center text-kumo-subtle"
									aria-hidden="true"
								>
									<GlobeSimple className="h-5 w-5" />
								</span>
								<div className="min-w-0">
									<p className="text-base font-medium leading-5">{t`Language`}</p>
									<p className="mt-0.5 text-sm leading-5 text-pretty text-kumo-subtle">
										{t`Choose your preferred admin language`}
									</p>
								</div>
							</div>
							<Combobox
								items={SUPPORTED_LOCALES}
								value={selectedLocale}
								isItemEqualToValue={(option, value) => option.code === value.code}
								itemToStringValue={(option) => option.label}
								onValueChange={(option) => option && setLocale(option.code)}
							>
								<Combobox.Trigger
									aria-label={t`Language`}
									className={`${inputVariants()} relative flex w-full items-center pe-8 text-start sm:w-48`}
								>
									<Combobox.Value>{(option) => option?.label ?? t`Select`}</Combobox.Value>
									<Combobox.Icon className="absolute end-2 top-1/2 flex -translate-y-1/2 items-center text-kumo-subtle">
										<CaretDown className="h-4 w-4" aria-hidden="true" />
									</Combobox.Icon>
								</Combobox.Trigger>
								<Combobox.Content>
									<Combobox.Input aria-label={t`Search`} placeholder={t`Search`} />
									<Combobox.Empty>{t`No results found`}</Combobox.Empty>
									<Combobox.List style={{ maxHeight: "16.5rem" }}>
										{(option) => (
											<Combobox.Item key={option.code} value={option}>
												{option.label}
											</Combobox.Item>
										)}
									</Combobox.List>
								</Combobox.Content>
							</Combobox>
						</div>
					</SettingsSection>
				)}
			</div>
		</div>
	);
}

export default Settings;
