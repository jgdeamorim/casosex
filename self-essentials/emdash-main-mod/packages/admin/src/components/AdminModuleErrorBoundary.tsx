import { Button } from "@cloudflare/kumo";
import { Trans } from "@lingui/react/macro";
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react";
import * as React from "react";

interface Props {
	children: React.ReactNode;
	/** Human-readable module name to display in fallback header */
	moduleName?: string;
}

interface State {
	hasError: boolean;
	error?: Error;
}

/**
 * Module-level Error Boundary for EmDash Admin SPA.
 * Catches runtime rendering exceptions inside sub-pages/plugins and presents
 * a subtle Kumo UI inline fallback instead of crashing the entire Admin Shell.
 */
export class AdminModuleErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error(
			`[EMDASH MODULE ERROR] [${this.props.moduleName || "Module"}]:`,
			error,
			errorInfo,
		);

		// Push error telemetry to Chrome DevTools Bridge if online
		if (typeof window !== "undefined") {
			fetch("http://localhost:9091/push-log", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "MODULE_ERROR",
					message: error.message,
					url: window.location.href,
					details: {
						moduleName: this.props.moduleName,
						stack: error.stack,
					},
				}),
			}).catch(() => {});
		}
	}

	handleReset = () => {
		this.setState({ hasError: false, error: undefined });
	};

	override render() {
		if (this.state.hasError) {
			return (
				<div className="mx-auto max-w-4xl p-6">
					<div className="rounded-xl border border-kumo-danger/30 bg-kumo-tint p-6 shadow-sm">
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-kumo-danger/10 text-kumo-danger">
									<WarningCircle className="h-6 w-6" />
								</span>
								<div>
									<h3 className="text-base font-semibold leading-5 text-kumo-default">
										<Trans>Module Error</Trans>: {this.props.moduleName || <Trans>Plugin Component</Trans>}
									</h3>
									<p className="mt-0.5 text-sm text-kumo-subtle">
										<Trans>An unexpected error occurred while rendering this section. Navigation remains fully operational.</Trans>
									</p>
								</div>
							</div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-kumo-danger/10 px-3 py-1 text-xs font-medium text-kumo-danger border border-kumo-danger/20 shrink-0">
								<span className="h-2 w-2 rounded-full bg-kumo-danger animate-pulse"></span>
								<Trans>Isolated Fallback</Trans>
							</span>
						</div>

						<div className="mt-4 rounded-lg border border-kumo-line bg-kumo-base p-3 font-mono text-xs text-kumo-danger">
							{this.state.error?.message || <Trans>Unknown rendering exception</Trans>}
						</div>

						<div className="mt-4 flex items-center gap-3">
							<Button icon={<ArrowClockwise className="h-4 w-4" />} onClick={this.handleReset}>
								<Trans>Retry Component</Trans>
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
export default AdminModuleErrorBoundary;
