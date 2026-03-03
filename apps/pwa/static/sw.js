const CACHE_NAME = 'presyoani-v2';
const ASSETS = [
  '/',
  '/static/manifest.json',
  '/static/model.tflite',
  '/static/tf.min.js',
  '/static/tf-tflite.min.js',
  '/static/tflite_web_api_cc_simd.js',
  '/static/tflite_web_api_cc_simd.wasm'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// Optimized for Free Data: Serve AI from cache, ignore Messenger/External links
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // If it's one of our local assets, use Cache-First
  if (ASSETS.includes(url.pathname) || url.pathname === '/') {
    e.respondWith(
      caches.match(e.request).then((res) => res || fetch(e.request))
    );
  } else {
    // If it's an external link (m.me, facebook), don't use cache at all
    return;
  }
});