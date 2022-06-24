import { createSlice } from '@reduxjs/toolkit';
import DriverService from '../services/driver';

const driverSlice = createSlice({
  name: 'Driver Reducer',
  initialState: [],
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
    create: (state, action) => {
      return [...state, action.payload];
    },
    remove: (state, action) => {
      const driver = action.payload;
      const list = state.filter((f) => f.id !== driver.id);
      return list;
    },
    update: (state, action) => {
      const driver = action.payload;
      const list = state.filter((f) => f.id !== driver.id);
      return list.concat(driver);
    },
  },
});

export default driverSlice.reducer;
export const { set, create, remove, update } = driverSlice.actions;

export const initDrivers = (token) => {
  return async (dispatch) => {
    const driver = await DriverService.get(token);
    driver.error ?? dispatch(set(driver));
  };
};

export const initDriver = (penggunaID, token) => {
  return async (dispatch) => {
    const driver = await DriverService.find(penggunaID, token);
    driver.error ?? dispatch(set(driver));
  };
};

export const createDriver = (data, token) => {
  return async (dispatch) => {
    const driver = await DriverService.save(data, token);
    driver.error ?? dispatch(create(driver));
  };
};

export const removeDriver = (data, token) => {
  return async (dispatch) => {
    const driver = await DriverService.remove(data.id, token);
    driver.error ?? dispatch(remove(driver));
  };
};

export const updateDriver = (data, token) => {
  return async (dispatch) => {
    const driver = await DriverService.update(data, token);
    driver.error ?? dispatch(update(driver));
  };
};
