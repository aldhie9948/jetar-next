import { createSlice } from '@reduxjs/toolkit';
import initPusher from '../lib/pusherConfig';

const pusher = initPusher();
const channel = pusher.subscribe('jetar');

const pusherSlice = createSlice({
  name: 'Pusher',
  initialState: {
    channel,
  },
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
  },
});

export default pusherSlice.reducer;
export const { set } = pusherSlice.actions;
