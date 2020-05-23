
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.routing.registerRoute(
    /\.(html|js)/ig,
    new workbox.strategies.StaleWhileRevalidate(),
  );
  workbox.routing.registerRoute(
    /\.(png|jpg|css|svg|mp4|gif|json|mtn)/ig,
    new workbox.strategies.CacheFirst(),
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}