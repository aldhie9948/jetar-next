importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js'
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 😁`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
// Switch debug logging on/off here. Default is on in dev and off in prod.
workbox.setConfig({ debug: false });

workbox.routing.registerRoute(
  new RegExp('/.*'),
  new workbox.strategies.NetworkFirst()
);

self.addEventListener('activate', (event) => {
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log('push recieved...');
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: `${location.origin}/assets/image/JETAR.png`,
  });
});
