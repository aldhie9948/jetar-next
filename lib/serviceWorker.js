import subscriptionService from '../services/subscription';
import urlBase64ToUint8Array from '../lib/urlbase64';
import config from '../utils/config';

export const registerPush = async ({ pengguna }) => {
  if ('serviceWorker' in navigator) {
    // register service worker
    console.log('registering service worker...');
    const register = await navigator.serviceWorker.register('/worker.js', {
      scope: '/',
    });
    console.log('service serviceWorker registered...');

    try {
      // register push
      console.log('registering push...');
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.PUBLIC_VAPID_KEY),
      });
      console.log('push registered...');

      const savedSubscription = {
        pengguna: pengguna.id,
        subscription,
      };
      try {
        // save subscription
        console.log('saving subscription...');
        await subscriptionService.save(savedSubscription, pengguna.token);
      } catch (error) {
        // update subscription when saving is error
        console.log('updating subscription...');
        await subscriptionService.update(savedSubscription, pengguna.token);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    // register service worker
    console.log('registering service worker...');
    const register = await navigator.serviceWorker.register('/worker.js', {
      scope: '/',
    });
    console.log('service serviceWorker registered...');
  }
};
