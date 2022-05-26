import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import localStorageService from '../../lib/localStorage';
import { useRouter } from 'next/router';
import { initPengguna } from '../../reducers/penggunaReducer';

const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(initPengguna(null));
    localStorageService.clear();
    router.push('/login');
    // eslint-disable-next-line
  }, []);
};

export default Logout;
