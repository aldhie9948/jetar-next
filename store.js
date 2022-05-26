import { configureStore } from '@reduxjs/toolkit';
import penggunaReducer from './reducers/penggunaReducer';
import driverReducer from './reducers/driverReducer';
import orderReducer from './reducers/orderReducer';
import pusherReducer from './reducers/pusherReducer';

const store = configureStore({
  reducer: {
    pengguna: penggunaReducer,
    driver: driverReducer,
    order: orderReducer,
    pusher: pusherReducer,
  },
});

export default store;
