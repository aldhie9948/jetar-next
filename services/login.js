import axios from 'axios';
const base = '/api/login';
import { axiosError } from '../utils/errorHandler';

const login = async (obj) => {
  try {
    const res = await axios.post(base, obj);
    return res.data;
  } catch (error) {
    return axiosError(error);
  }
};

const verify = async (pengguna) => {
  try {
    const res = await axios.post(`${base}/verify`, pengguna);
    return res.data;
  } catch (error) {
    return axiosError(error);
  }
};

// eslint-disable-next-line
export default { login, verify };
