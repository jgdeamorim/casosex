export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = context.request.headers.get("host") || "";

  if (host.includes("app.usevolupia.com.br")) {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const loginUrl = new URL("/login", context.request.url);
      return Response.redirect(loginUrl.toString(), 302);
    }
  }

  return context.next();
}
