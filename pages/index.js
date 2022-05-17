import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import localStorageService from '../lib/localStorage';
import { initPengguna } from '../reducers/penggunaReducer';
import { useRouter } from 'next/router';

const route = ({ level }) => {
  switch (level) {
    case 0:
      return '/dashboard';
    case 1:
      return '/pwa/drivers';
    default:
      return '/logout';
  }
};

const Home = () => {
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
    router.push(pengguna ? route(pengguna) : '/login');
    // eslint-disable-next-line
  }, [pengguna]);

  return (
    <>
      <div className='fixed bg-black/50 inset-0 blur'></div>
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
