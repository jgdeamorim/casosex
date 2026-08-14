import type { AuthProviderDescriptor } from "emdash";
import { resolve } from "node:path";

export function passwordAuth(): AuthProviderDescriptor {
	const adminEntryPath = resolve(process.cwd(), "src/auth/passwordAdminEntry.tsx");

	return {
		id: "password",
		label: "E-mail e Senha",
		adminEntry: adminEntryPath,
		routes: [
			{
				pattern: "/_emdash/api/auth/password/login",
				entrypoint: "src/auth/passwordLoginRoute.ts",
			},
		],
		publicRoutes: ["/_emdash/api/auth/password/"],
	};
}
