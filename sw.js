var CACHE_NAME = 'for-my-gf-v16';
var CORE = [
  'lovepage.html',
  'finale.html',
  'hidden.html',
  'story.html',
  'diary.html',
  'scratch.html',
  'visitors.html',
  'reasons.html',
  'letters.html',
  'stars.html',
  'aurora.html',
  'chikoy-room.html',
  'lovejar.html',
  'chickenhouse.html',
  'chickenhouse.css',
  'chickenhouse.js',
  'manifest.json',
  'app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/favicon.png',
  'og-preview.png',
  'finale-bg.webp'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin !== location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(function(resp) {
        var copy = resp.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(request, copy); });
        return resp;
      }).catch(function() {
        return caches.match(request).then(function(hit) {
          return hit || caches.match('lovepage.html');
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function(hit) {
      if (hit) return hit;
      return fetch(request).then(function(resp) {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(request, copy); });
        }
        return resp;
      }).catch(function() {
        return caches.match(request);
      });
    })
  );
});
