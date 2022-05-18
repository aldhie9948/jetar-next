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
    body: 'notified by aldi gunawan',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png',
  });
});
