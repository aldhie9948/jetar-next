import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import localStorageService from '../lib/localStorage';
import { initPengguna } from '../reducers/penggunaReducer';
import { useRouter } from 'next/router';

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
  }, []);

  useEffect(() => {
    router.push(pengguna ? '/dashboard' : '/login');
  }, [pengguna]);

  return (
    <>
      <div className='fixed inset-0 bg-black/50 flex'>
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
