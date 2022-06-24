import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../../components/pwa/drivers/Layout';
import CardOrder from '../../../components/pwa/drivers/CardOrder';
import { initPengguna } from '../../../reducers/penggunaReducer';
import { initOrdersByDriver } from '../../../reducers/orderReducer';
import { initDriver } from '../../../reducers/driverReducer';
import initPusher from '../../../lib/pusherConfig';
import verifyPengguna from '../../../lib/verifyLogin';

const pusher = initPusher();
const channel = pusher.subscribe('jetar');

const Riwayat = () => {
  const orders = useSelector((s) => s.order);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [itemsCount, setItemsCount] = useState(10);

  const dispatch = useDispatch();

  useEffect(() => {
    const callback = (user) => {
      const { token, id } = user;
      dispatch(initPengguna(user));
      dispatch(initOrdersByDriver({ id, date: 'today' }, token));
      dispatch(initDriver(id, token));
      channel.bind('orders', () => {
        console.log('channel bind orders emitted..');
        dispatch(initOrdersByDriver({ id, date: 'today' }, token));
      });
    };
    verifyPengguna(callback, 1);

    return () => {
      channel.unsubscribe('jetar');
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const filterOrdersHandler = (e) => {
    const keyword = e.target.value;
    const data = orders.filter((d) => {
      const pengirim = d.pengirim.nama
        .toString()
        .toLowerCase()
        .includes(keyword);
      const penerima = d.penerima.nama
        .toString()
        .toLowerCase()
        .includes(keyword);
      if (pengirim || penerima) return true;
    });
    setFilteredOrders(keyword !== '' ? data : orders);
  };

  return (
    <>
      <Layout>
        <div className='my-4'>
          <div className='mx-5 mb-4'>
            <div className='mb-2'>
              <span className='block font-medium text-xs pb-2'>
                Cari orderan:
              </span>
              <input
                type='search'
                className='p-2 w-full outline-none focus:shadow-lg rounded border placeholder:text-xs'
                placeholder='masukkan nama pengirim atau penerima...'
                onChange={filterOrdersHandler}
              />
            </div>
          </div>
          <div className='box-border overflow-y-auto max-h-[75vh]'>
            {filteredOrders.map((order) => (
              <CardOrder key={order.id} order={order} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Riwayat;
