import { createSlice } from '@reduxjs/toolkit';
import DriverService from '../services/driver';

const driverSlice = createSlice({
  name: 'Driver Reducer',
  initialState: null,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
  },
});

export default driverSlice.reducer;
export const { set } = driverSlice.actions;

export const initDriver = (token) => {
  return async (dispatch) => {
    const driver = await DriverService.get(token);
    dispatch(set(driver));
  };
};
