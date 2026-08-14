import type { AuthProviderDescriptor } from "emdash";

export function passwordAuth(): AuthProviderDescriptor {
	return {
		id: "password",
		label: "E-mail e Senha",
		adminEntry: "src/auth/passwordAdminEntry.tsx",
		routes: [
			{
				pattern: "/_emdash/api/auth/password/login",
				entrypoint: "src/auth/passwordLoginRoute.ts",
			},
		],
		publicRoutes: ["/_emdash/api/auth/password/"],
	};
}
