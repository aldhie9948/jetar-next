import { createSlice } from '@reduxjs/toolkit';
import PelangganService from '../services/pelanggan';

const driverSlice = createSlice({
  name: 'Pelanggan Reducer',
  initialState: [],
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
  },
});

export default driverSlice.reducer;
export const { set } = driverSlice.actions;

export const initPelanggan = (token) => {
  return async (dispatch) => {
    const pelanggan = await PelangganService.get(token);
    pelanggan.error ?? dispatch(set(pelanggan));
  };
};
