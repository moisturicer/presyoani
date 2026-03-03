const CACHE_NAME = 'presyoani-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/static/manifest.json',
  '/static/tf.min.js',
  '/static/tf-tflite.min.js',
  '/static/model.tflite',
  '/static/tflite_web_api_cc.js',
  '/static/tflite_web_api_cc.wasm',
  '/static/tflite_web_api_cc_simd.js',
  '/static/tflite_web_api_cc_simd.wasm'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// cache-first strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // if found in cache, return it immediately
      if (response) return response;

      // if not in cache, try network
      return fetch(e.request).catch(() => {
        // fallback to index if everything fails
        if (e.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});