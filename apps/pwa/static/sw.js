const CACHE_NAME = 'presyoani-v1';
const ASSETS = [
  '/',
  '/static/manifest.json',
  '/static/model.tflite',
  '/static/tf.min.js',
  '/static/tf-tflite.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});