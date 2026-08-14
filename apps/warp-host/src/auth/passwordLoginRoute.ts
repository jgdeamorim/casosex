import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			return new Response(
				JSON.stringify({ ok: false, error: "E-mail e senha são obrigatórios." }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		// Basic validation for initial sovereign admin access
		// In production/next phase, this connects to Supabase Auth or hashed user store in SQLite
		const isValid = email.length > 3 && password.length >= 6;

		if (!isValid) {
			return new Response(
				JSON.stringify({ ok: false, error: "Credenciais inválidas." }),
				{ status: 401, headers: { "Content-Type": "application/json" } }
			);
		}

		// Set HTTP-only session cookie for EmDash admin
		cookies.set("emdash_session", `sess_${Date.now()}_${Math.random().toString(36).substring(2)}`, {
			path: "/",
			httpOnly: true,
			secure: false, // Set to true in HTTPS production
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return new Response(
			JSON.stringify({ ok: true, message: "Autenticado com sucesso!" }),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (err: any) {
		return new Response(
			JSON.stringify({ ok: false, error: err.message || "Erro interno de autenticação." }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
};
