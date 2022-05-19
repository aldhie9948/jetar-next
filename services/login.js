import axios from 'axios';
const base = '/api/login';

const login = async (obj) => {
  const res = await axios.post(base, obj);
  return res.data;
};

const verify = async (pengguna) => {
  try {
    const res = await axios.post(`${base}/verify`, pengguna);
    return res.data;
  } catch (error) {
    return { status: false, message: 'Verifikasi login gagal' };
  }
};

// eslint-disable-next-line
export default { login, verify };
