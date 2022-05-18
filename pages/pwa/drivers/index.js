import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FcBusinessman } from 'react-icons/fc';
import { initDriver } from '../../../reducers/driverReducer';
import { initOrder } from '../../../reducers/orderReducer';
import { localCurrency } from '../../../lib/currency';
import CardOrder from '../../../components/pwa/drivers/CardOrder';
import Layout from '../../../components/pwa/drivers/Layout';
import dateFormat from '../../../lib/date';

const CardDriver = ({ driverOrders }) => {
  const pengguna = useSelector((s) => s.pengguna);
  const drivers = useSelector((s) => s.driver);
  const [currentDriver, setCurrentDriver] = React.useState(null);

  useEffect(() => {
    setCurrentDriver(
      drivers?.find((d) => d.akun.username === pengguna.username)
    );
    // eslint-disable-next-line
  }, [drivers]);

  return (
    <>
      {driverOrders && (
        <div className='rounded-lg bg-gradient-blue shadow-lg mt-10 mb-5 mx-5'>
          <div className='px-2 py-5'>
            <div className='grid grid-cols-3 gap-2'>
              <div className='place-self-center'>
                <FcBusinessman className='text-[6rem]' />
              </div>
              <div className='col-span-2 grid gap-2'>
                <div>
                  <div className='text-xs'>Nama :</div>
                  <div className='font-black text-lg'>
                    {currentDriver?.nama}
                  </div>
                </div>
                <div>
                  <div className='grid grid-cols-2'>
                    <div>
                      <div className='text-xs'>Pengiriman :</div>
                      <div className='font-black text-md'>
                        {localCurrency(
                          driverOrders?.filter((f) => f.status !== 1).length ||
                            0
                        )}
                      </div>
                    </div>
                    <div className=''>
                      <div className='text-xs'>Ongkir :</div>
                      <div className='font-black text-md'>
                        Rp.{' '}
                        {localCurrency(
                          driverOrders?.reduce(
                            (prev, curr) => prev + curr.ongkir,
                            0
                          )
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
  const drivers = useSelector((s) => s.driver);
  const orders = useSelector((s) => s.order);
  const [currentDriver, setCurrentDriver] = React.useState(null);
  const [driverOrders, setDriverOrders] = React.useState([]);

  useEffect(() => {
    dispatch(initOrder(pengguna?.token));
    dispatch(initDriver(pengguna?.token));
  }, [pengguna]);

  useEffect(() => {
    setCurrentDriver(
      drivers?.find((d) => d.akun.username === pengguna?.username)
    );
    // eslint-disable-next-line
  }, [drivers]);

  useEffect(() => {
    // sorting orderan sesuai dengan driver dan tanggal
    const selectedOrders = orders?.filter((order) => {
      if (
        order.driver.id === currentDriver?.id &&
        order.tanggalOrder === dateFormat(new Date(), 'yyyy-MM-dd')
      )
        return true;
      return false;
    });
    setDriverOrders(selectedOrders);

    // eslint-disable-next-line
  }, [currentDriver, orders]);

  return (
    <Layout>
      <>
        <CardDriver driverOrders={driverOrders} />
        <div>
          <strong className='header-form my-auto px-5'>
            Orderan Hari Ini..
          </strong>
          <div className='h-[60vh] overflow-y-auto'>
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
