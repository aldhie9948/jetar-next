import { configureStore } from '@reduxjs/toolkit';
import penggunaReducer from './reducers/penggunaReducer';

const store = configureStore({
  reducer: {
    pengguna: penggunaReducer,
  },
});

export default store;
