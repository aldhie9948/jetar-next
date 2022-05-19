import '../styles/globals.css';
import { Provider } from 'react-redux';
import store from '../store';
import webpush from 'web-push';
import config from '../utils/config';
import Head from 'next/head';

webpush.setVapidDetails(
  'mailto:it.aldigunawan@gmail.com',
  config.PUBLIC_VAPID_KEY,
  config.PRIVATE_VAPID_KEY
);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
