import React from 'react';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import { useRouter } from 'next/router';

const Layout = ({ title = '', children }) => {
  const router = useRouter();
  return (
    <>
      <>
        <Head>
          <title> {title} | Jemput Antar Kota Tegal dan Sekitarnya</title>
        </Head>
        {router.pathname !== '/login' && <NavBar />}
        <div className='mt-[6rem]'>{children}</div>
      </>
    </>
  );
};

export default Layout;
//
