import axios from 'axios';
const baseURL = '/api/order';
import { config } from '../lib/service';
import { axiosError } from '../utils/errorHandler';

const get = async (token) => {
  try {
    const res = await axios.get(baseURL, config(token));
    return res.data;
  } catch (error) {
    return axiosError(error);
  }
};

const find = async (id, token) => {
  try {
    const res = await axios.get(`${baseURL}/${id}`, config(token));
    return res.data;
  } catch (error) {
    return axiosError(error);
  }
};

const findByIdPengguna = async ({ id, date = 'all' || 'today' }, token) => {
  try {
    const res = await axios.post(
      `${baseURL}/pengguna`,
      { id, date },
      config(token)
    );
    return res.data;
  } catch (error) {
    return axiosError(error);
  }
};

const save = async (obj, token) => {
  try {
    const res = await axios.post(baseURL, obj, config(token));
    return res.data;
  } catch (error) {
    return axiosError(error);
  }
};

const update = async (obj, token) => {
  try {
    const res = await axios.put(`${baseURL}/${obj.id}`, obj, config(token));
    return res.data;
  } catch (error) {
    return axiosError(error);
  }
};

const remove = async (id, token) => {
  try {
    const res = await axios.delete(`${baseURL}/${id}`, config(token));
    return res.data;
  } catch (error) {
    return axiosError(error);
  }
};

// eslint-disable-next-line
export default { get, find, save, update, remove, findByIdPengguna };
