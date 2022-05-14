import axios from 'axios';
const baseURL = '/api/pengguna';

const get = async () => {
  const res = await axios.get(baseURL);
  return res.data;
};

const find = async (id) => {
  const res = await axios.get(`${baseURL}/${id}`);
  return res.data;
};

const save = async (obj) => {
  const res = await axios.post(baseURL, obj);
  return res.data;
};

const update = async (obj) => {
  const res = await axios.put(`${baseURL}/${obj.id}`, obj);
  return res.data;
};

const remove = async (id) => {
  const res = await axios.delete(`${baseURL}/${id}`);
  return res.data;
};

// eslint-disable-next-line
export default { get, find, save, update, remove };
