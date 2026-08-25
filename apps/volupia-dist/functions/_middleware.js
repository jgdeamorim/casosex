export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = context.request.headers.get("host") || "";

  // If request comes to app.usevolupia.com.br
  if (host.includes("app.usevolupia.com.br")) {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const loginUrl = new URL("/login.html", context.request.url);
      return context.env.ASSETS.fetch(new Request(loginUrl, context.request));
    }
  }

  return context.next();
}
