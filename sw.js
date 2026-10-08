'use strict';

const CACHE_PREFIX = 'my-site-cache-';
const CACHE_NAME = `${CACHE_PREFIX}2026-10-08-hexo8`;
const ASSET_PATH = /\.(?:png|jpe?g|svg|mp4|gif|json|mtn|woff2?|ttf|moc|ico)$|\.min\.js$/i;

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !ASSET_PATH.test(url.pathname)) return;

  // Fetch updates online; fall back only to this release's cache when offline.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request);
      if (response.ok && response.type === 'basic') {
        await cache.put(event.request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      throw error;
    }
  })());
});
