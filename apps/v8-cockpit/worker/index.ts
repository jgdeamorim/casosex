import { Hono } from 'hono';

declare class HTMLRewriter {
  on(selector: string, handlers: { element?: (element: { setAttribute: (name: string, value: string) => void }) => void }): this;
  transform(response: Response): Response;
}

interface Env {
  ASSETS?: { fetch: (req: Request) => Promise<Response> };
}

const app = new Hono<{ Bindings: Env }>();

// Proxy API WooCommerce & Suppliers Healthcheck
app.get('/api/v8/health', (c) => {
  return c.json({
    status: 'online',
    engine: 'Cloudflare Worker V8',
    latency: '< 0.2ms',
    timestamp: new Date().toISOString()
  });
});

// Proxy WooCommerce REST API securely
app.all('/api/v8/wc/*', async (c) => {
  const targetUrl = `https://casosex.com.br/wp-json/wc/v3/${c.req.path.replace('/api/v8/wc/', '')}`;
  try {
    const resp = await fetch(targetUrl, {
      method: c.req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Volupia-V8-Worker-Proxy'
      }
    });
    return new Response(resp.body, {
      status: resp.status,
      headers: resp.headers
    });
  } catch (err: unknown) {
    return c.json({ error: 'Erro ao conectar ao WooCommerce na Hostgator', details: String(err) }, 502);
  }
});

// HTMLRewriter for Edge User Rules & Facet Injection
app.get('*', async (c) => {
  const assetResp = c.env?.ASSETS ? await c.env.ASSETS.fetch(c.req.raw) : await fetch(c.req.raw);
  const userRole = c.req.header('X-Volupia-Role') || 'founder';

  const rewriter = new HTMLRewriter().on('body', {
    element(element) {
      element.setAttribute('data-user-role', userRole);
      element.setAttribute('data-v8-edge', 'active');
    }
  });

  return rewriter.transform(assetResp);
});

export default app;
