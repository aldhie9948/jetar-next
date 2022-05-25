import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FcBusinessman, FcBusinesswoman } from 'react-icons/fc';
import { initOneDriver } from '../../../reducers/driverReducer';
import { initOrdersDriver } from '../../../reducers/orderReducer';
import { localCurrency } from '../../../lib/currency';
import CardOrder from '../../../components/pwa/drivers/CardOrder';
import Layout from '../../../components/pwa/drivers/Layout';
import verifyPengguna from '../../../lib/verifyLogin';
import io from 'socket.io-client';
import { initPengguna } from '../../../reducers/penggunaReducer';
const socket = io();

const CardDriver = ({ orders, driver }) => {
  return (
    <>
      <div className='rounded-lg bg-gradient-blue shadow-lg mt-10 mb-5 mx-5'>
        <div className='px-2 py-5'>
          <div className='grid grid-cols-3 gap-2'>
            <div className='place-self-center'>
              {driver.gender === 'wanita' ? (
                <FcBusinesswoman className='text-[6rem]' />
              ) : (
                <FcBusinessman className='text-[6rem]' />
              )}
            </div>
            <div className='col-span-2 grid gap-2'>
              <div>
                <div className='text-xs'>Nama :</div>
                <div className='font-black text-lg capitalize'>
                  {driver.nama}
                </div>
              </div>
              <div>
                <div className='grid grid-cols-2'>
                  <div>
                    <div className='text-xs'>Pengiriman :</div>
                    <div className='font-black text-md'>
                      {localCurrency(
                        orders.filter((f) => f.status !== 1).length || 0
                      )}
                    </div>
                  </div>
                  <div className=''>
                    <div className='text-xs'>Ongkir :</div>
                    <div className='font-black text-md'>
                      Rp.{' '}
                      {localCurrency(
                        orders
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
    </>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const driver = useSelector((s) => s.driver);
  const orders = useSelector((s) => s.order);

  const socketInitializer = async (pengguna) => {
    const { id, token } = pengguna;
    await fetch('/api/socket');
    socket.on('connect', () => {
      console.log('an user is connected');
    });
    socket.on('latest-order', () => {
      console.log(
        location.pathname,
        'receiced emit and reloading latest order'
      );
      dispatch(initOrdersDriver({ id, date: 'today' }, token));
    });
  };

  useEffect(() => {
    const callback = (user) => {
      const { token, id } = user;
      dispatch(initPengguna(user));
      dispatch(initOrdersDriver({ id, date: 'today' }, token));
      dispatch(initOneDriver(id, token));
      socketInitializer(user);
    };
    verifyPengguna(callback, 1);
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <>
        <CardDriver driver={driver} orders={orders} />
        <div>
          <strong className='header-form my-auto px-5'>
            Orderan Hari Ini..
          </strong>

          <div className='box-border overflow-y-auto'>
            {orders.map(
              (order) =>
                (order.status === 2 || order.status === 3) && (
                  <CardOrder key={order.id} order={order} pengguna={pengguna} />
                )
            )}
          </div>
        </div>
      </>
    </Layout>
  );
};

export default Dashboard;
