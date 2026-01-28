const CACHE_NAME = 'habit-tracker-v1';
const ASSETS = [
    '/',
    '/static/css/style.css',
    '/static/js/scripts.js',
    '/static/img/mylogo.png',
    '/static/manifest.json'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests or external API calls (e.g., ipify, aladhan)
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Update cache with new response
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            });

            // Return cached response immediately if available, otherwise fetch
            return cachedResponse || fetchPromise;
        })
    );
});

// Push Event Placeholder (Backend required for actual functionality)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Habit Tracker';
    const options = {
        body: data.body || 'New notification',
        icon: '/static/img/mylogo.png',
        badge: '/static/img/mylogo.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
