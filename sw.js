var CACHE_NAME = 'dental-guide-v2';
var urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/config.js',
  'js/translations.js',
  'js/utils.js',
  'js/api.js',
  'js/auth.js',
  'js/student.js',
  'js/admin.js',
  'js/main.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&display=swap',
  'https://unpkg.com/@phosphor-icons/web@2.1.2',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});
