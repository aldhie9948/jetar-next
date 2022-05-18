importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js'
);

console.log('hello from service worker');

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst()
);

self.addEventListener('activate', (event) => {
  console.log('V1 now ready to handle fetches!');
});
