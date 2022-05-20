import { configureStore } from '@reduxjs/toolkit';
import penggunaReducer from './reducers/penggunaReducer';
import driverReducer from './reducers/driverReducer';
import orderReducer from './reducers/orderReducer';
import pelangganReducer from './reducers/pelangganReducer';

const store = configureStore({
  reducer: {
    pengguna: penggunaReducer,
    driver: driverReducer,
    order: orderReducer,
    pelanggan: pelangganReducer,
  },
});

export default store;
