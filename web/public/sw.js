/**
 * Service Worker básico para cachear rutas estáticas (PWA ligera).
 * Registrado desde ClientLayout en el navegador.
 */
const CACHE_NAME = 'ruta-compartida-v1';
const urlsToCache = [
  '/',
  '/search',
  '/globals.css',
  '/manifest.json',
  '/icons/icon-192x192.png'
];

// Precarga URLs en caché al instalar el SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Estrategia cache-first: sirve desde caché si existe, si no va a red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
