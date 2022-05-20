import { configureStore } from '@reduxjs/toolkit';
import penggunaReducer from './reducers/penggunaReducer';
import driverReducer from './reducers/driverReducer';
import orderReducer from './reducers/orderReducer';
import socketReducer from './reducers/socketReducer';

const store = configureStore({
  reducer: {
    pengguna: penggunaReducer,
    driver: driverReducer,
    order: orderReducer,
    socket: socketReducer,
  },
});

export default store;
