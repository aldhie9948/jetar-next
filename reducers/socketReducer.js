import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const socketReducer = createSlice({
  name: 'Pengguna',
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
  },
});

export default socketReducer.reducer;
export const { set } = socketReducer.actions;

export const initSocket = (obj) => {
  return async (dispatch) => {
    dispatch(set(obj));
  };
};
