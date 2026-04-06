/**
 * Service Worker for Veus music app.
 * - App shell caching for offline
 * - Push notifications for new releases
 * - Audio cached separately in IndexedDB by app code
 */

const CACHE_NAME = "veus-v4";

const APP_SHELL = [
  "/",
  "/library",
  "/search",
  "/inspira",
  "/top",
  "/login",
  "/registar",
  "/offline",
  "/manifest.json",
  "/veus_music_favicon-192.png",
  "/veus_music_favicon-512.png",
  "/poses/loranne-hero.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ── Push notifications ──
self.addEventListener("push", (event) => {
  let data = { title: "VÉUS", body: "Nova musica disponivel.", url: "/" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/veus_music_favicon-192.png",
      badge: "/veus_music_favicon-192.png",
      data: { url: data.url },
      vibrate: [100, 50, 100],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((list) => {
      for (const client of list) {
        if (client.url.includes("music.seteveus.space") && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// ── Fetch handling ──
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Don't intercept API calls
  if (url.pathname.startsWith("/api/")) return;

  // Network first for navigation
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match("/offline") || caches.match("/")))
    );
    return;
  }

  // Cache first for our static assets
  if (
    url.origin === self.location.origin &&
    (
      url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2?|ttf|css|js)$/) ||
      url.pathname.startsWith("/poses/")
    )
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached || new Response("Offline", { status: 503 }));
      })
    );
    return;
  }

  // Stale-while-revalidate for Google Fonts
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }
});
