import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FcBusinessman, FcBusinesswoman } from 'react-icons/fc';
import { initOneDriver } from '../../../reducers/driverReducer';
import { initOrdersToday } from '../../../reducers/orderReducer';
import { localCurrency } from '../../../lib/currency';
import CardOrder from '../../../components/pwa/drivers/CardOrder';
import Layout from '../../../components/pwa/drivers/Layout';
import io from 'socket.io-client';
const socket = io();

const CardDriver = ({ driverOrders }) => {
  const driver = useSelector((s) => s.driver);
  return (
    <>
      {driverOrders && (
        <div className='rounded-lg bg-gradient-blue shadow-lg mt-10 mb-5 mx-5'>
          <div className='px-2 py-5'>
            <div className='grid grid-cols-3 gap-2'>
              <div className='place-self-center'>
                {driver?.gender === 'wanita' ? (
                  <FcBusinesswoman className='text-[6rem]' />
                ) : (
                  <FcBusinessman className='text-[6rem]' />
                )}
              </div>
              <div className='col-span-2 grid gap-2'>
                <div>
                  <div className='text-xs'>Nama :</div>
                  <div className='font-black text-lg capitalize'>
                    {driver?.nama}
                  </div>
                </div>
                <div>
                  <div className='grid grid-cols-2'>
                    <div>
                      <div className='text-xs'>Pengiriman :</div>
                      <div className='font-black text-md'>
                        {localCurrency(
                          driverOrders.filter((f) => f.status !== 1).length || 0
                        )}
                      </div>
                    </div>
                    <div className=''>
                      <div className='text-xs'>Ongkir :</div>
                      <div className='font-black text-md'>
                        Rp.{' '}
                        {localCurrency(
                          driverOrders
                            .filter((f) => f.status === 0)
                            .reduce((prev, curr) => prev + curr.ongkir, 0)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const pengguna = useSelector((s) => s.pengguna);
  const driver = useSelector((s) => s.driver);
  const orders = useSelector((s) => s.order);
  const [driverOrders, setDriverOrders] = React.useState([]);

  const socketInitializer = async (token) => {
    await fetch('/api/socket');
    socket.on('connect', () => {
      console.log('an user is connected');
    });
    socket.on('latest-order', () => {
      dispatch(initOrdersToday(token));
    });
  };

  useEffect(() => {
    if (pengguna) {
      const { token, id } = pengguna;
      dispatch(initOrdersToday(token));
      dispatch(initOneDriver(id, token));
      socketInitializer(token);
    }
    // eslint-disable-next-line
  }, [pengguna]);

  useEffect(() => {
    if (orders && driver) {
      const selectedOrder = orders.filter((f) => f.driver.id === driver.id);
      setDriverOrders(selectedOrder);
    }
  }, [orders, driver]);

  return (
    <Layout>
      <>
        <CardDriver driverOrders={driverOrders} />
        <div>
          <strong className='header-form my-auto px-5'>
            Orderan Hari Ini..
          </strong>
          <div className='max-h-[65vh] overflow-y-auto'>
            {driverOrders &&
              driverOrders.map(
                (order) =>
                  (order.status === 2 || order.status === 3) && (
                    <CardOrder key={order.id} order={order} />
                  )
              )}
          </div>
        </div>
      </>
    </Layout>
  );
};

export default Dashboard;
