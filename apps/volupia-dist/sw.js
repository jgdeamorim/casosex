const CACHE_NAME = 'volupia-v8-v1';
const ASSETS_TO_PRECACHE = ['/', '/index.html', '/suppliers.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

const isApiRequest = (url: URL): boolean => url.pathname.startsWith('/api/');

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // API V8: nunca cachear — overrides/dossiers precisam chegar sempre frescos.
  if (isApiRequest(url)) return;

  // Catálogo estático: network-first com fallback em cache (dados frescos, offline OK).
  if (url.pathname === '/suppliers.json') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          if (resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return resp;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/suppliers.json'))
        )
    );
    return;
  }

  // App shell + assets hasheados: cache-first com fallback em rede.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((resp) => {
        if (resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return resp;
      });
    })
  );
});
