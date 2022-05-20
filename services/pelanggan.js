import axios from 'axios';
import { config } from '../lib/service';
const baseURL = '/api/pelanggan';

const get = async (token) => {
  const res = await axios.get(baseURL, config(token));
  return res.data;
};

const find = async (id, token) => {
  const res = await axios.get(`${baseURL}/${id}`, config(token));
  return res.data;
};

const save = async (obj, token) => {
  const res = await axios.post(baseURL, obj, config(token));
  return res.data;
};

const update = async (obj, token) => {
  const res = await axios.put(`${baseURL}/${obj.id}`, obj, config(token));
  return res.data;
};

const remove = async (id, token) => {
  const res = await axios.delete(`${baseURL}/${id}`, config(token));
  return res.data;
};

// eslint-disable-next-line
export default { get, find, save, update, remove };
