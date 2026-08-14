import React, { useState } from "react";

/**
 * 1:1 WordPress Famous 5-Minute Installer UI (wp-admin/install.php)
 * Styled for EmDash Sovereign Auth Setup Step
 */
export function SetupStep({ onComplete }: { onComplete: () => void }) {
	const [username, setUsername] = useState("admin");
	const [email, setEmail] = useState("admin@adsentice.com");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("As senhas não coincidem. Por favor, redigite a senha.");
			return;
		}
		if (password.length < 6) {
			setError("A senha deve ter no mínimo 6 caracteres.");
			return;
		}

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
				throw new Error(data.error || "Falha ao registrar credenciais de administração.");
			}

			onComplete();
		} catch (err: any) {
			setError(err.message || "Erro ao salvar credenciais.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-[560px] mx-auto py-6">
			{/* WordPress Setup Header (Text only, no logo icon as requested) */}
			<div className="text-center mb-6">
				<h1 className="text-3xl font-normal text-[#1d2327] tracking-tight">EmDash</h1>
				<p className="text-xs text-[#50575e] mt-1 font-medium">Assistente de Instalação Soberana (Estilo WordPress)</p>
			</div>

			{/* WordPress Installer Card Box */}
			<div className="bg-white border border-[#c3c4c7] rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
				<div>
					<h2 className="text-lg font-normal text-[#1d2327] border-b border-[#dcdcde] pb-3 mb-3">
						Informações necessárias de administração
					</h2>
					<p className="text-xs text-[#50575e] leading-relaxed">
						Por favor, defina os dados de acesso para a conta principal de administração do site. 
						Guarde estas credenciais em local seguro.
					</p>
				</div>

				{error && (
					<div className="p-3 text-xs text-[#1d2327] bg-[#fcf0f1] border-l-4 border-[#d63638] rounded-sm">
						<strong>ERRO:</strong> {error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold text-[#1d2327]">
							Nome de usuário
						</label>
						<input
							type="text"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full h-10 px-3 text-sm bg-[#fcfcfc] border border-[#8c8f94] rounded-sm text-[#2c3338] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
						/>
						<p className="text-[11px] text-[#646970]">
							Os nomes de usuário não podem ser alterados posteriormente.
						</p>
					</div>

					<div className="space-y-1.5">
						<label className="block text-xs font-semibold text-[#1d2327]">
							Endereço de e-mail
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full h-10 px-3 text-sm bg-[#fcfcfc] border border-[#8c8f94] rounded-sm text-[#2c3338] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
						/>
						<p className="text-[11px] text-[#646970]">
							Verifique novamente o seu endereço de e-mail antes de continuar.
						</p>
					</div>

					<div className="space-y-1.5">
						<label className="block text-xs font-semibold text-[#1d2327]">
							Senha do Administrador
						</label>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••••••"
							className="w-full h-10 px-3 text-sm bg-[#fcfcfc] border border-[#8c8f94] rounded-sm text-[#2c3338] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="block text-xs font-semibold text-[#1d2327]">
							Confirmar Senha
						</label>
						<input
							type="password"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••••••"
							className="w-full h-10 px-3 text-sm bg-[#fcfcfc] border border-[#8c8f94] rounded-sm text-[#2c3338] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
						/>
						<p className="text-[11px] text-[#646970]">
							Importante: Você precisará desta senha para acessar o painel administrativo.
						</p>
					</div>

					<div className="pt-4 border-t border-[#dcdcde] flex items-center justify-between">
						<span className="text-xs text-[#50575e]">Passo 3 de 3 — Conclusão</span>
						<button
							type="submit"
							disabled={loading}
							className="h-10 px-5 text-sm font-medium text-white bg-[#2271b1] hover:bg-[#135e96] active:bg-[#0a4b78] disabled:opacity-50 rounded-sm transition-colors cursor-pointer shadow-sm flex items-center gap-2"
						>
							{loading ? "Instalando..." : "Instalar o EmDash →"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

/**
 * 1:1 WordPress Classic Login UI Component (wp-login.php)
 */
export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(true);
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
				throw new Error(data.error || "<strong>ERRO:</strong> O nome de usuário ou a senha estão incorretos.");
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
		<div className="w-full max-w-[320px] mx-auto py-8">
			{/* WordPress Header Title (Clean text, no logo image as requested) */}
			<div className="text-center mb-6">
				<h1 className="text-2xl font-normal text-[#1d2327] tracking-tight hover:text-[#2271b1] transition-colors cursor-pointer">
					EmDash
				</h1>
			</div>

			{/* WordPress Style Error Alert */}
			{error && (
				<div
					className="mb-4 p-3 text-xs text-[#1d2327] bg-white border-l-4 border-[#d63638] shadow-sm rounded-sm"
					dangerouslySetInnerHTML={{ __html: error }}
				/>
			)}

			{/* WordPress Classic Form Card */}
			<form onSubmit={handleSubmit} className="bg-white border border-[#c3c4c7] rounded-sm p-6 shadow-sm space-y-4">
				<div>
					<label className="block text-xs font-normal text-[#1d2327] mb-1.5">
						Nome de usuário ou endereço de e-mail
					</label>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="admin@adsentice.com"
						className="w-full h-10 px-3 text-sm bg-[#fcfcfc] border border-[#8c8f94] rounded-sm text-[#2c3338] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] transition-all"
					/>
				</div>

				<div>
					<label className="block text-xs font-normal text-[#1d2327] mb-1.5">
						Senha
					</label>
					<input
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••••••"
						className="w-full h-10 px-3 text-sm bg-[#fcfcfc] border border-[#8c8f94] rounded-sm text-[#2c3338] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] transition-all"
					/>
				</div>

				<div className="flex items-center justify-between pt-1">
					<label className="flex items-center gap-2 text-xs text-[#50575e] cursor-pointer select-none">
						<input
							type="checkbox"
							checked={rememberMe}
							onChange={(e) => setRememberMe(e.target.checked)}
							className="w-4 h-4 border-[#8c8f94] rounded-sm text-[#2271b1] focus:ring-0 cursor-pointer"
						/>
						<span>Lembrar-me</span>
					</label>

					<button
						type="submit"
						disabled={loading}
						className="h-9 px-4 text-xs font-medium text-white bg-[#2271b1] hover:bg-[#135e96] active:bg-[#0a4b78] disabled:opacity-50 rounded-sm transition-colors cursor-pointer shadow-sm"
					>
						{loading ? "Acessando..." : "Acessar"}
					</button>
				</div>
			</form>

			{/* WordPress Classic Footer Navigation Links */}
			<div className="mt-6 flex flex-col gap-2 text-center text-xs text-[#2271b1]">
				<a href="/" className="hover:text-[#135e96] hover:underline">
					← Voltar para o site
				</a>
				<a href="#" onClick={(e) => { e.preventDefault(); alert("Entre em contato com o suporte para redefinir sua senha."); }} className="hover:text-[#135e96] hover:underline">
					Perdeu a senha?
				</a>
			</div>
		</div>
	);
}

export function LoginButton() {
	return (
		<div className="w-full py-2.5 px-4 text-xs font-medium border border-[#8c8f94] text-[#1d2327] bg-[#f6f7f7] hover:bg-[#f0f0f1] rounded-sm transition-colors text-center cursor-pointer">
			🔑 Entrar com Nome de Usuário e Senha (Estilo WordPress)
		</div>
	);
}
