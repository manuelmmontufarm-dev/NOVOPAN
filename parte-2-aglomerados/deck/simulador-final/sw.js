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
const CACHE_VERSION = 'novopan-sim-v2';

/* Shell crítico (rutas relativas al scope /simulador-final/). Se piden SIN el
   sufijo ?v=; en fetch se hace match con ignoreSearch para que las peticiones
   versionadas (…?v=20260720l) igual encuentren el archivo en caché. Los tres
   del motor viven fuera de /simulador-final/ (los importa combined-app). */
const PRECACHE = [
  './manifest.webmanifest',
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

/* ── El shell HTML se guarda SIN el redirect ────────────────────────────
   Vercel sirve /simulador-final/ con un 308 hacia /simulador-final (cleanUrls
   + trailingSlash:false). `cache.add()` sigue ese redirect y guarda una
   respuesta con `redirected: true`, y el navegador PROHÍBE contestar una
   navegación con una respuesta así: la convierte en un error de red y la
   pantalla de planta muere con «No se puede acceder a este sitio · ERR_FAILED»
   en cuanto falta la red, justo cuando el modo offline debía salvarla.
   Por eso el HTML se re-envuelve en una Response nueva y limpia. */
const SHELL_KEYS = ['./index.html', './'];

async function guardarShell(cache) {
  let html = null;
  try {
    const res = await fetch('./index.html', { cache: 'reload' });
    if (res.ok) html = await res.text();
  } catch { /* sin red: se reintenta en el próximo arranque o navegación */ }
  if (!html) return false;
  await Promise.all(SHELL_KEYS.map((k) => cache.put(k, new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  }))));
  return true;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // El shell primero: es lo único sin lo cual la app no abre.
    await guardarShell(cache);
    // add() individual con allSettled: si un archivo falta, NO se cae toda la
    // instalación (el resto queda cacheado y ese se toma luego por red).
    await Promise.allSettled(PRECACHE.map((u) => cache.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    /* El caché viejo se borra SOLO si el nuevo ya tiene el shell. Si la
       instalación corrió con la red a medias, el viejo es la única copia que
       queda: borrarlo dejaría la pantalla sin nada que mostrar sin internet. */
    const cache = await caches.open(CACHE_VERSION);
    if (await cache.match('./index.html')) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
    }
    await self.clients.claim();
  })());
});

function isData(url) {
  // datos/ (CSV servidos) y el CSV de la nube (Vercel Blob): SIEMPRE a la red,
  // nunca caché — el dato debe ser el más fresco posible.
  return url.pathname.includes('/datos/') || url.hostname.endsWith('.blob.vercel-storage.com');
}

/* Último recurso: ni red ni caché. Mejor una pantalla que se explique que el
   error crudo del navegador, que en planta se lee como «el simulador murió». */
const SIN_CACHE_HTML = `<!doctype html><html lang="es"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Simulador NOVOPAN · sin conexión</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f6f5;
color:#0f2b22;font:16px/1.55 system-ui,sans-serif;padding:24px}
.c{max-width:34rem;text-align:center}h1{font-size:1.35rem;color:#004e38;margin:0 0 .6rem}
p{margin:.5rem 0;color:#3d554c}code{background:#e4eae7;padding:.15em .4em;border-radius:4px}</style>
<div class="c"><h1>Sin conexión con el servidor</h1>
<p>Esta computadora no está alcanzando <code>novopan.vercel.app</code>, y todavía no
hay una copia guardada de la pantalla.</p>
<p>Revisa la red de la planta o pide a IT que permita ese dominio. Cuando vuelva
la conexión, abre esta página una vez y el simulador quedará disponible aunque
después se caiga internet.</p></div></html>`;

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Datos del HMI: siempre a la red, nunca caché (el dato debe ser fresco).
  if (isData(url)) return;

  // Navegación: red primero (toma la versión nueva); sin red, el shell cacheado.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        // Con red, se aprovecha para dejar el shell fresco para la próxima vez
        // que no la haya. Así el modo offline se repara solo.
        event.waitUntil(caches.open(CACHE_VERSION).then((c) => guardarShell(c)).catch(() => {}));
        return res;
      } catch { /* sin red → sigue el shell cacheado */ }
      const cached = await caches.match('./index.html', { ignoreSearch: true })
        || await caches.match('./', { ignoreSearch: true });
      /* Se re-envuelve a propósito: una respuesta con `redirected: true` o un
         `undefined` en una navegación son, para el navegador, un error de red
         (ERR_FAILED). Aquí siempre sale una Response propia y limpia. */
      if (cached) {
        return new Response(await cached.blob(), {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
      return new Response(SIN_CACHE_HTML, {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    })());
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
