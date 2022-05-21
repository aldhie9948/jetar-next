import { createSlice } from '@reduxjs/toolkit';
import OrderService from '../services/order';
import dateFormat from '../lib/date';

const sort = (a, b) => {
  const x = dateFormat(`${a.tanggalOrder} ${a.waktuOrder}`, 't');
  const y = dateFormat(`${b.tanggalOrder} ${b.waktuOrder}`, 't');
  return x > y ? -1 : x < y ? 1 : 0;
};

// ascending
const sortStatus = (a, b) =>
  a.status > b.status ? 1 : a.status < b.status ? -1 : 0;

const orderSlice = createSlice({
  name: 'Order',
  initialState: [],
  reducers: {
    set: (state, action) => {
      return action.payload.sort(sort).sort(sortStatus);
    },
    create: (state, action) => {
      return [...state, action.payload].sort(sort).sort(sortStatus);
    },
    update: (state, action) => {
      const updatedOrder = action.payload;
      const newOrder = state.filter((f) => f.id !== updatedOrder.id);
      const sorted = newOrder.concat(updatedOrder).sort(sort).sort(sortStatus);
      return sorted;
    },
    remove: (state, action) => {
      const deletedOrder = action.payload;
      const newOrders = state.filter((f) => f.id !== deletedOrder.id);
      return newOrders.sort(sort).sort(sortStatus);
    },
  },
});

export default orderSlice.reducer;
export const { set, create, update, remove } = orderSlice.actions;

export const initOrder = (token) => {
  return async (dispatch) => {
    const response = await OrderService.get(token);
    response.error ?? dispatch(set(response));
  };
};

export const initOrdersToday = (token) => {
  return async (dispatch) => {
    const response = await OrderService.find('today', token);
    response.error ?? dispatch(set(response));
  };
};

export const initOrdersDriver = (id, token) => {
  return async (dispatch) => {
    const response = await OrderService.findByIdPengguna(id, token);
    response.error ?? dispatch(set(response));
  };
};

export const createOrder = (order, token) => {
  return async (dispatch) => {
    const response = await OrderService.save(order, token);
    response.error ?? dispatch(create(response));
  };
};

export const updateOrder = (order, token) => {
  return async (dispatch) => {
    const response = await OrderService.update(order, token);
    response.error ?? dispatch(update(response));
  };
};

export const removeOrder = (order, token) => {
  return async (dispatch) => {
    const response = await OrderService.remove(order.id, token);
    response.error ?? dispatch(remove(response));
  };
};
