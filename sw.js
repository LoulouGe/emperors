// service worker simple pour cache du jeu
const CACHE_NAME = 'emperors-cache-v1';
const FILES_TO_CACHE = [
  './',
  'index.html',
  'style.css',
  'game.js',
  'manifest.json',
  'emperors.json',
  // quelques images et sons clefs (le cache ajoute les autres dynamiquement)
  'images/landing.webp',
  'images/roman_emperor_game.webp',
  'images/IMG_3725.PNG'
];

self.addEventListener('install', event => {
  // installer et pré-cacher les fichiers nécessaires
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // nettoyer les anciennes versions de cache
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // essaie de répondre depuis le cache, sinon va chercher sur le réseau et met en cache
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then(response => {
        // on met en cache le résultat du réseau pour la prochaine fois
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        // si tout échoue, on pourrait retourner un asset de secours
        return caches.match('/index.html');
      });
    })
  );
});