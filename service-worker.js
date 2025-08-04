const CACHE_NAME = 'rgs-voucher-shell-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Precache the html5-qrcode script to reduce CORS errors
  'https://unpkg.com/html5-qrcode@2.3.7/minified/html5-qrcode.min.js'
];

self.addEventListener('install', evt => {
  console.log('[SW] install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(ASSETS)
    )
  );
});

self.addEventListener('activate', evt => {
  console.log('[SW] activate');
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp =>
      resp || fetch(evt.request)
    )
  );
});

