import { createSlice } from '@reduxjs/toolkit';
import OrderService from '../services/order';

const orderSlice = createSlice({
  name: 'Order',
  initialState: null,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
    create: (state, action) => {
      return [...state, action.payload];
    },
  },
});

export default orderSlice.actions;
export const { set, create } = orderSlice.actions;

export const initOrder = (token) => {
  return async (dispatch) => {
    const response = await OrderService.get(token);
    dispatch(set(response));
  };
};

export const createOrder = (order, token) => {
  return async (dispatch) => {
    const response = await OrderService.save(order, token);
    dispatch(create(response));
  };
};
