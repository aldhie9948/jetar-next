import loginService from '../services/login';
import { registerPush } from '../lib/serviceWorker';
import localStorageService from '../lib/localStorage';

const verifyPengguna = async (callback = null, level) => {
  const penggunaLocal = localStorageService.get('pengguna', true);
  if (penggunaLocal) {
    const verify = await loginService.verify(penggunaLocal);
    if (verify.status) {
      penggunaLocal.level !== level && location.replace('/logout');
      callback && callback(penggunaLocal);
      registerPush({ pengguna: penggunaLocal });
    } else {
      location.replace('/logout');
    }
  } else {
    location.replace('/logout');
  }
};

export default verifyPengguna;
