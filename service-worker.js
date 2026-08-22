// Dieciséis PWA service worker — offline shell caching
// Bump CACHE_VERSION when you want clients to fetch a fresh index.html
const CACHE_VERSION = "v1.0.1";
const CACHE_NAME = "dieciseis-" + CACHE_VERSION;

// Shell files to pre-cache on install
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL).catch(()=>{})));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // NEVER cache the TTS proxy — always hit the network
  if (url.pathname.startsWith("/api/")) return;

  // Network-first for HTML (so lesson updates propagate on refresh)
  if (e.request.mode === "navigate" || url.pathname === "/" || url.pathname === "/index.html") {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const clone = r.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)).catch(()=>{});
          return r;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match("/index.html")))
    );
    return;
  }

  // Cache-first for everything else (icons, manifest, external fonts)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((r) => {
        if (r.ok && (url.origin === self.location.origin || url.hostname.includes("fonts."))) {
          const clone = r.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)).catch(()=>{});
        }
        return r;
      });
    })
  );
});
