import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../../components/pwa/drivers/Layout';
import { initOneDriver } from '../../../reducers/driverReducer';
import { initOrder } from '../../../reducers/orderReducer';
import CardOrder from '../../../components/pwa/drivers/CardOrder';

const Riwayat = () => {
  const pengguna = useSelector((s) => s.pengguna);
  const driver = useSelector((s) => s.driver);
  const orders = useSelector((s) => s.order);
  const [driverOrders, setDriverOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (pengguna) {
      const { token, id } = pengguna;
      dispatch(initOneDriver(id, token));
      dispatch(initOrder(token));
    }
    // eslint-disable-next-line
  }, [pengguna]);

  useEffect(() => {
    if (orders && driver) {
      const filteredOrder = orders.filter((f) => f.driver.id === driver.id);
      const finishedOrder = filteredOrder.filter((f) => f.status === 0);
      setDriverOrders(finishedOrder);
      setFilteredOrders(finishedOrder);
    }
  }, [orders, driver]);

  useEffect(() => {
    const data = driverOrders.filter((d) => {
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
    console.log('data:', data);
    setFilteredOrders(data);
    // eslint-disable-next-line
  }, [keyword]);

  const filterOrdersHandler = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <>
      <Layout>
        <div className='my-4'>
          <div className='mx-5 mb-4'>
            <div className='flex justify-between items-center'>
              <div>
                <span className='block font-medium text-xs'>Tampilkan</span>
                <select className='outline-none p-2 border rounded'>
                  <option value='5'>5</option>
                  <option value='10'>10</option>
                  <option value='50'>50</option>
                  <option value='100'>100</option>
                  <option value='-1'>Semua</option>
                </select>
              </div>
              <div>
                <span className='block font-medium text-xs'>Cari</span>
                <input
                  type='text'
                  className='p-2 outline-none focus:shadow-lg rounded border placeholder:text-xs'
                  placeholder='masukkan nama pengirim atau penerima...'
                  value={keyword}
                  onChange={filterOrdersHandler}
                />
              </div>
            </div>
          </div>
          {filteredOrders.map((order) => (
            <CardOrder key={order.id} order={order} />
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Riwayat;
