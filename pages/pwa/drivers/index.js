import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FcBusinessman, FcBusinesswoman } from 'react-icons/fc';
import { initDriver } from '../../../reducers/driverReducer';
import { initOrdersByDriver } from '../../../reducers/orderReducer';
import { localCurrency } from '../../../lib/currency';
import CardOrder from '../../../components/pwa/drivers/CardOrder';
import Layout from '../../../components/pwa/drivers/Layout';
import verifyPengguna from '../../../lib/verifyLogin';
import { initPengguna } from '../../../reducers/penggunaReducer';
import initPusher from '../../../lib/pusherConfig';

const pusher = initPusher();
const channel = pusher.subscribe('jetar');

const CardDriver = ({ orders, driver }) => {
  return (
    <>
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

  return (
    <Layout>
      <>
        <CardDriver driver={driver[0]} orders={orders} />
        <div>
          <strong className='header-form my-auto px-5'>
            Orderan Hari Ini..
          </strong>

          <div className='box-border overflow-y-auto'>
            {orders.map(
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
