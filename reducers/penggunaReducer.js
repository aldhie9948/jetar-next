import { createSlice } from '@reduxjs/toolkit';

const penggunaSlice = createSlice({
  name: 'Pengguna',
  initialState: null,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
  },
});

export default penggunaSlice.reducer;
export const { set } = penggunaSlice.actions;

export const initPengguna = (obj) => {
  return async (dispatch) => {
    dispatch(set(obj));
  };
};
