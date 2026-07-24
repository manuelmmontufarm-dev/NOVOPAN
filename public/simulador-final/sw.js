/* Service worker del SIMULADOR NOVOPAN.
   Objetivo: que la app se instale y funcione SIN INTERNET después de abrirla
   una vez con conexión. NO reemplaza al CSV en vivo: los datos (datos/*.csv y
   adaptador.json) NUNCA se cachean — siempre van a la red, y si no hay red, el
   simulador usa el archivo local conectado (File System Access).

   Estrategia:
     · install → PRECACHE del shell crítico (HTML, CSS, JS, motor, vendor). Así
       offline se ve COMPLETO desde la primera vez, sin flash sin estilos.
     · datos/  → SOLO red (dato vivo, jamás cacheado).
     · navegación (HTML) → red primero; sin red, el shell cacheado.
     · resto (JS/CSS/vendor/iconos/fuentes) → cache-first (ignora el ?v=) con
       actualización en segundo plano.
   Al cambiar el simulador, sube CACHE_VERSION para invalidar el caché viejo. */
const CACHE_VERSION = 'novopan-sim-20260724111433';

/* Shell crítico (rutas relativas al scope /simulador-final/). Se piden SIN el
   sufijo ?v=; en fetch se hace match con ignoreSearch para que las peticiones
   versionadas (…?v=20260720l) igual encuentren el archivo en caché. Los tres
   del motor viven fuera de /simulador-final/ (los importa combined-app). */
const PRECACHE = [
  './', './index.html', './manifest.webmanifest',
  'css/trazabilidad-total.css', 'css/params.css',
  'vendor/fonts/fonts.css',
  'vendor/fonts/material-symbols-rounded.woff2',
  'vendor/fonts/barlow/barlow-400-latin.woff2',
  'vendor/fonts/barlow/barlow-500-latin.woff2',
  'vendor/fonts/barlow/barlow-600-latin.woff2',
  'vendor/fonts/barlow/barlow-700-latin.woff2',
  'vendor/fonts/barlow/barlow-800-latin.woff2',
  'vendor/fonts/barlow/barlowsemicondensed-600-latin.woff2',
  'vendor/fonts/barlow/barlowsemicondensed-700-latin.woff2',
  'vendor/fonts/barlow/barlowsemicondensed-800-latin.woff2',
  'vendor/katex/katex.min.css', 'vendor/katex/katex.min.js',
  'js/combined-app.js', 'js/combined-params.js', 'js/hmi-csv.js',
  'js/line-app.js', 'js/line-bridge.js', 'js/line-params.js',
  'js/onepage-layout.js', 'js/params-auth.js', 'js/report-pdf.js',
  'js/route-model.js', 'js/sound.js',
  '../trazabilidad/js/core/process-graph.js',
  '../trazabilidad/js/core/trace-engine.js',
  '../trazabilidad/js/core/simulation-clock.js',
  'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // add() individual con allSettled: si un archivo falta, NO se cae toda la
      // instalación (el resto queda cacheado y ese se toma luego por red).
      .then((cache) => Promise.allSettled(PRECACHE.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isData(url) {
  // datos/ (CSV servidos) y el CSV de la nube (Vercel Blob): SIEMPRE a la red,
  // nunca caché — el dato debe ser el más fresco posible.
  return url.pathname.includes('/datos/') || url.hostname.endsWith('.blob.vercel-storage.com');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Datos del HMI: siempre a la red, nunca caché (el dato debe ser fresco).
  if (isData(url)) return;

  // Navegación: red primero (toma la versión nueva); sin red, el shell cacheado.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html', { ignoreSearch: true })
        .then((r) => r || caches.match('./')))
    );
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  // Same-origin: ignora el ?v= para que el precache (sin query) haga match.
  event.respondWith(
    caches.match(req, sameOrigin ? { ignoreSearch: true } : undefined).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
