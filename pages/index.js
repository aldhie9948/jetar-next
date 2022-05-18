import React, { useEffect } from 'react';
import localStorageService from '../lib/localStorage';
import { useRouter } from 'next/router';
import route from '../lib/route';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const penggunaLocal = localStorageService.get('pengguna', true);
    if (!penggunaLocal) router.push('/login');

    if (penggunaLocal) router.push(route(penggunaLocal));

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className='fixed bg-black/20 inset-0'></div>
      <div className='flex z-[9999] absolute inset-0'>
        <div className='lds-facebook m-auto'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Home;
