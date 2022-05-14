import axios from 'axios';
const base = '/api/login';

const login = async (obj) => {
  const res = await axios.post(base, obj);
  return res.data;
};

// eslint-disable-next-line
export default { login };
