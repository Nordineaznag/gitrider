// Advanced Service Worker for 3G Optimization and Offline Support
const CACHE_VERSION = "v2.0.0";
const CACHE_NAME = `ride-app-${CACHE_VERSION}`;
const RUNTIME_CACHE = `ride-app-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `ride-app-images-${CACHE_VERSION}`;
const API_CACHE = `ride-app-api-${CACHE_VERSION}`;

// Cache Strategy Configuration
const CACHE_DURATION = {
  static: 7 * 24 * 60 * 60 * 1000, // 7 days
  api: 5 * 60 * 1000, // 5 minutes
  images: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Essential resources to cache immediately (App Shell)
const PRECACHE_URLS = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

// Routes that should be cached
const CACHEABLE_ROUTES = ["/", "/dashboard", "/rides"];

// API endpoints to cache
const CACHEABLE_API_PATTERNS = [/\/api\/rides/, /\/api\/profile/];

// Install Event - Precache essential resources
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);

        // Add essential resources
        await cache.addAll(PRECACHE_URLS);

        console.log("[SW] Precached essential resources");

        // Skip waiting to activate immediately
        await self.skipWaiting();
      } catch (error) {
        console.error("[SW] Precaching failed:", error);
      }
    })(),
  );
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const cachesToDelete = cacheNames.filter((cacheName) => {
        return (
          cacheName.startsWith("ride-app-") &&
          cacheName !== CACHE_NAME &&
          cacheName !== RUNTIME_CACHE &&
          cacheName !== IMAGE_CACHE &&
          cacheName !== API_CACHE
        );
      });

      await Promise.all(
        cachesToDelete.map((cacheName) => {
          console.log("[SW] Deleting old cache:", cacheName);
          return caches.delete(cacheName);
        }),
      );

      // Take control of all clients
      await self.clients.claim();

      console.log("[SW] Service worker activated");
    })(),
  );
});

// Fetch Event - Intelligent caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions and dev tools
  if (url.protocol === "chrome-extension:" || url.protocol === "devtools:") {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Strategy 1: Network First for API calls (with cache fallback)
        if (url.pathname.includes("/api/") || url.origin.includes("supabase")) {
          return await networkFirstStrategy(request, API_CACHE);
        }

        // Strategy 2: Cache First for images (with network fallback)
        if (
          request.destination === "image" ||
          url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)
        ) {
          return await cacheFirstStrategy(request, IMAGE_CACHE);
        }

        // Strategy 3: Stale While Revalidate for pages and scripts
        if (
          request.destination === "document" ||
          request.destination === "script" ||
          request.destination === "style"
        ) {
          return await staleWhileRevalidateStrategy(request, CACHE_NAME);
        }

        // Strategy 4: Cache First for fonts and static assets
        if (
          request.destination === "font" ||
          url.pathname.match(/\.(woff|woff2|ttf|eot)$/i)
        ) {
          return await cacheFirstStrategy(request, CACHE_NAME);
        }

        // Default: Network First with cache fallback
        return await networkFirstStrategy(request, RUNTIME_CACHE);
      } catch (error) {
        console.error("[SW] Fetch failed:", error);

        // Return offline fallback if available
        return await getOfflineFallback(request);
      }
    })(),
  );
});

// Strategy 1: Network First (good for API calls)
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first with timeout for 3G
    const networkResponse = await fetchWithTimeout(request, 5000);

    // Cache successful responses
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log("[SW] Network failed, trying cache:", request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Strategy 2: Cache First (good for images and static assets)
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Return cached version immediately
    // Update cache in background if stale
    const cacheDate = new Date(cachedResponse.headers.get("date"));
    const now = Date.now();

    if (now - cacheDate.getTime() > CACHE_DURATION.images) {
      // Update in background
      updateCache(request, cacheName);
    }

    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("[SW] Cache first strategy failed:", error);
    throw error;
  }
}

// Strategy 3: Stale While Revalidate (good for pages)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  // Fetch from network in parallel
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch((error) => {
      console.log("[SW] Network update failed:", error);
      return cachedResponse;
    });

  // Return cached version immediately if available
  return cachedResponse || networkPromise;
}

// Fetch with timeout (important for 3G)
function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout),
    ),
  ]);
}

// Update cache in background
async function updateCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response);
    }
  } catch (error) {
    console.log("[SW] Background update failed:", error);
  }
}

// Offline fallback
async function getOfflineFallback(request) {
  // For navigation requests, return cached homepage
  if (request.destination === "document") {
    const homeCache = await caches.match("/");
    if (homeCache) {
      return homeCache;
    }
  }

  // For images, return a placeholder if available
  if (request.destination === "image") {
    const iconCache = await caches.match("/icon-192.png");
    if (iconCache) {
      return iconCache;
    }
  }

  // Return generic error response
  return new Response(
    JSON.stringify({
      error: "Offline",
      message: "No network connection available",
    }),
    {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "application/json" },
    },
  );
}

// Background Sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "sync-rides") {
    event.waitUntil(syncRides());
  }
});

async function syncRides() {
  try {
    console.log("[SW] Syncing rides data...");
    // Implement sync logic here
    return Promise.resolve();
  } catch (error) {
    console.error("[SW] Sync failed:", error);
    return Promise.reject(error);
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New notification",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View",
        icon: "/icon-192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Ride App", options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handler for cache management
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        );
      }),
    );
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Performance monitoring
self.addEventListener("fetch", (event) => {
  const start = Date.now();

  event.respondWith(
    (async () => {
      const response = await handleFetch(event);
      const duration = Date.now() - start;

      // Log slow requests (>3s on 3G)
      if (duration > 3000) {
        console.warn("[SW] Slow request:", event.request.url, `${duration}ms`);
      }

      return response;
    })(),
  );
});

async function handleFetch(event) {
  // This is handled by the main fetch handler above
  return fetch(event.request);
}

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-rides") {
    event.waitUntil(updateRidesData());
  }
});

async function updateRidesData() {
  try {
    console.log("[SW] Periodic sync: updating rides data");
    // Implement periodic sync logic
    return Promise.resolve();
  } catch (error) {
    console.error("[SW] Periodic sync failed:", error);
    return Promise.reject(error);
  }
}

console.log("[SW] Service Worker loaded successfully");
