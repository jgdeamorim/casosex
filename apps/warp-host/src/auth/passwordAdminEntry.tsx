import React, { useState } from "react";

export function SetupStep({ onComplete }: { onComplete: () => void }) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("As senhas não coincidem.");
			return;
		}
		if (password.length < 6) {
			setError("A senha deve ter no mínimo 6 caracteres.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Register session and mark initial setup complete
			const res = await fetch("/_emdash/api/auth/password/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: "admin@adsentice.com", password }),
			});

			const data = await res.json();
			if (!res.ok || !data.ok) {
				throw new Error(data.error || "Falha ao definir a senha inicial.");
			}

			// Execute EmDash setup completion handler
			onComplete();
		} catch (err: any) {
			setError(err.message || "Erro ao salvar credenciais.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full space-y-4">
			<div className="text-center mb-2">
				<h3 className="text-base font-semibold text-[var(--text-color-kumo-default,#0f172a)]">
					Crie a sua Senha de Administrador
				</h3>
				<p className="text-xs text-[var(--text-color-kumo-subtle,#64748b)]">
					Esta senha será usada para acessar o painel soberano do Adsentice
				</p>
			</div>

			{error && (
				<div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-xs font-semibold text-[var(--text-color-kumo-default,#334155)] mb-1.5">
						Nova Senha
					</label>
					<input
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••••••"
						className="w-full px-3.5 py-2 text-sm bg-[var(--color-kumo-surface,#f8fafc)] border border-[var(--color-kumo-line,#cbd5e1)] rounded-lg text-[var(--text-color-kumo-default,#0f172a)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-xs font-semibold text-[var(--text-color-kumo-default,#334155)] mb-1.5">
						Confirmar Senha
					</label>
					<input
						type="password"
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="••••••••••••"
						className="w-full px-3.5 py-2 text-sm bg-[var(--color-kumo-surface,#f8fafc)] border border-[var(--color-kumo-line,#cbd5e1)] rounded-lg text-[var(--text-color-kumo-default,#0f172a)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
				>
					{loading ? "Finalizando Setup..." : "Concluir Setup & Acessar Painel →"}
				</button>
			</form>
		</div>
	);
}

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/_emdash/api/auth/password/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (!res.ok || !data.ok) {
				throw new Error(data.error || "Falha na autenticação. Verifique seu e-mail e senha.");
			}

			const searchParams = new URLSearchParams(window.location.search);
			const redirectUrl = searchParams.get("redirect") || "/_emdash/admin";
			window.location.href = redirectUrl;
		} catch (err: any) {
			setError(err.message || "Erro ao conectar. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-sm mx-auto p-6 bg-[var(--color-kumo-elevated,#ffffff)] border border-[var(--color-kumo-line,#e2e8f0)] rounded-xl shadow-lg">
			<div className="text-center mb-6">
				<h2 className="text-xl font-bold text-[var(--text-color-kumo-default,#0f172a)]">
					Acesse seu Painel
				</h2>
				<p className="text-xs text-[var(--text-color-kumo-subtle,#64748b)] mt-1">
					Digite suas credenciais de administrador
				</p>
			</div>

			{error && (
				<div className="mb-4 p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div>
					<label className="block text-xs font-semibold text-[var(--text-color-kumo-default,#334155)] mb-1.5">
						E-mail ou Usuário
					</label>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="admin@adsentice.com"
						className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-kumo-surface,#f8fafc)] border border-[var(--color-kumo-line,#cbd5e1)] rounded-lg text-[var(--text-color-kumo-default,#0f172a)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
					/>
				</div>

				<div>
					<label className="block text-xs font-semibold text-[var(--text-color-kumo-default,#334155)] mb-1.5">
						Senha
					</label>
					<input
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••••••"
						className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-kumo-surface,#f8fafc)] border border-[var(--color-kumo-line,#cbd5e1)] rounded-lg text-[var(--text-color-kumo-default,#0f172a)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full mt-2 py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
				>
					{loading ? <span>Entrando...</span> : <span>Acessar Painel →</span>}
				</button>
			</form>
		</div>
	);
}

export function LoginButton() {
	return (
		<button
			type="button"
			className="w-full py-2.5 px-4 text-sm font-medium border border-[var(--color-kumo-line,#cbd5e1)] rounded-lg hover:bg-[var(--color-kumo-surface,#f8fafc)] transition-colors flex items-center justify-center gap-2"
		>
			<span>🔑 Entrar com E-mail e Senha</span>
		</button>
	);
}
