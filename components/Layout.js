import React, { useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import localStorageService from '../lib/localStorage';
import { initPengguna } from '../reducers/penggunaReducer';
import NavBar from '../components/NavBar';
import { registerPush } from '../lib/serviceWorker';

const Layout = ({ title = '', children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pengguna = useSelector((state) => state.pengguna);

  useEffect(() => {
    const penggunaLocal = localStorageService.get('pengguna', true);
    if (penggunaLocal) {
      dispatch(initPengguna(penggunaLocal));
      registerPush({ pengguna: penggunaLocal });
    }
    if (penggunaLocal && penggunaLocal.level !== 0) router.push('/');
    if (!penggunaLocal) router.push('/login');
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {(pengguna || pengguna?.level === 0) && (
        <>
          <Head>
            <title> {title} | Jemput Antar Kota Tegal dan Sekitarnya</title>
          </Head>
          {router.pathname !== '/login' && <NavBar />}
          <div className='mt-[6rem]'>{children}</div>
        </>
      )}
    </>
  );
};

export default Layout;
