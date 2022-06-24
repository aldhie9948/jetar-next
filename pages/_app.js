import '../styles/globals.css';
import { Provider } from 'react-redux';
import store from '../store';
import Head from 'next/head';

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
