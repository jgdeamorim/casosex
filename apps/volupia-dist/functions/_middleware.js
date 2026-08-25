export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = context.request.headers.get("host") || "";

  if (host.includes("app.usevolupia.com.br")) {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const adminUrl = new URL("/admin", context.request.url);
      return Response.redirect(adminUrl.toString(), 302);
    }
  }

  if (url.pathname === "/volupia_team_dashboard" || url.pathname === "/volupia_team_dashboard.html") {
    const adminUrl = new URL("/admin", context.request.url);
    return Response.redirect(adminUrl.toString(), 301);
  }

  return context.next();
}
