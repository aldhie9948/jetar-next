import React, { useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import localStorageService from '../lib/localStorage';
import { initPengguna } from '../reducers/penggunaReducer';
import NavBar from '../components/NavBar';

const Layout = ({ title = '', children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pengguna = useSelector((state) => state.pengguna);

  useEffect(() => {
    const penggunaLocal = localStorageService.get('pengguna', true);
    if (penggunaLocal) {
      if (!pengguna) {
        dispatch(initPengguna(penggunaLocal));
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    !pengguna && router.push('/login');
    // eslint-disable-next-line
  }, [pengguna]);

  return (
    <>
      <Head>
        <title> {title} | Jemput Antar Kota Tegal dan Sekitarnya</title>
      </Head>
      {router.pathname !== '/login' && <NavBar />}
      <div className='mt-[6rem] px-5'>{children}</div>
    </>
  );
};

export default Layout;
