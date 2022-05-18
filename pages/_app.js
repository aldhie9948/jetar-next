import '../styles/globals.css';
import { Provider } from 'react-redux';
import store from '../store';
import { useEffect } from 'react';
import webpush from 'web-push';
import urlBase64ToUint8Array from '../lib/urlbase64';

const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;

function MyApp({ Component, pageProps }) {
  const initPush = async () => {
    // register service worker
    console.log('registering service worker...');
    const register = await navigator.serviceWorker.register('/worker.js', {
      scope: '/',
    });
    console.log('service workeR registered...');

    // register push
    console.log('registering push...');
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });
    console.log('push registered...');
    localStorage.setItem('subscription', JSON.stringify(subscription));
  };

  useEffect(() => {
    webpush.setVapidDetails(
      'mailto:it.aldigunawan@gmail.com',
      PUBLIC_VAPID_KEY,
      PRIVATE_VAPID_KEY
    );

    if ('serviceWorker' in navigator) {
      initPush().catch((err) => console.error(err));
    }
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
