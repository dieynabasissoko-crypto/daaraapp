// sw.js — Service Worker Daara PWA
const VERSION   = "daara-v1";
const STATIC    = `${VERSION}-static`;
const AUDIO     = `${VERSION}-audio`;

// Fichiers à mettre en cache immédiatement
const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  // Fonts Google (sera mis en cache au premier chargement)
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC && k !== AUDIO)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // 1. Audio Coran (cdn.islamic.network) → Cache First
  //    On garde les versets audio pour une écoute offline
  if (url.hostname === "cdn.islamic.network") {
    e.respondWith(audioCache(e.request));
    return;
  }

  // 2. API alquran.cloud (texte versets) → Network First, fallback cache
  if (url.hostname === "api.alquran.cloud") {
    e.respondWith(networkFirst(e.request, STATIC));
    return;
  }

  // 3. Fonts Google → Cache First (évite les requêtes répétées)
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    e.respondWith(cacheFirst(e.request, STATIC));
    return;
  }

  // 4. App shell (HTML/JS/CSS) → Network First, fallback cache
  e.respondWith(networkFirst(e.request, STATIC));
});

// ── Stratégies ────────────────────────────────────────────────────────────────

// Cache First — retourne le cache, sinon réseau + mise en cache
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

// Network First — réseau d'abord, cache en fallback
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Fallback offline — renvoie l'index.html pour SPA
    if (request.mode === "navigate") {
      const fallback = await caches.match("/index.html");
      if (fallback) return fallback;
    }
    return new Response("Offline", { status: 503 });
  }
}

// Audio Cache — cache dédié pour les MP3 (limité en taille)
const MAX_AUDIO_ENTRIES = 80; // ~80 versets max en cache

async function audioCache(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(AUDIO);
      // Nettoyage si trop de fichiers
      const keys = await cache.keys();
      if (keys.length >= MAX_AUDIO_ENTRIES) {
        await cache.delete(keys[0]); // supprime le plus ancien
      }
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Audio non disponible offline", { status: 503 });
  }
}
