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

// workbox.routing.registerRoute(
//   new RegExp('/.*'),
//   new workbox.strategies.NetworkFirst()
// );

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.NetworkFirst()
);

self.addEventListener('activate', (event) => {
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log('push recieved...');
  const message = {
    icon: `${location.origin}/assets/image/JETAR.png`,
    body: data.body,
    actions: [{ action: 'ok', title: 'OK' }],
  };
  self.registration.showNotification(data.title, message);
});

self.addEventListener(
  'notificationclick',
  function (event) {
    event.notification.close();
    if (event.action === 'ok') {
      synchronizeReader();
    } else {
      clients.openWindow(location.origin);
    }
  },
  false
);
