import React, { useRef, useEffect } from 'react';
import Layout from '../../components/Layout';
import CekOngkir from '../../components/dashboard/CekOngkir';
import Orders from '../../components/dashboard/Orders';
import { initDriver } from '../../reducers/driverReducer';
import { useDispatch, useSelector } from 'react-redux';
import { initOrder } from '../../reducers/orderReducer';
import FormOrder from '../../components/dashboard/FormOrder';
import { FaTruck, FaRoute, FaUndo } from 'react-icons/fa';
import verifyPengguna from '../../lib/verifyLogin';
import { initPengguna } from '../../reducers/penggunaReducer';
import initPusher from '../../lib/pusherConfig';

const pusher = initPusher();
const channel = pusher.subscribe('jetar');

const Dashboard = () => {
  const formOrderRef = useRef();
  const cekOngkirRef = useRef();
  const dispatch = useDispatch();
  const drivers = useSelector((s) => s.driver);
  const orders = useSelector((s) => s.order);
  const pengguna = useSelector((s) => s.pengguna);

  const tambahHandler = () => {
    formOrderRef.current.toggle();
  };

  const cekOngkirHandler = () => {
    cekOngkirRef.current.toggle();
  };

  const ButtonMenu = ({ onClick, icon, label }) => {
    return (
      <>
        <div className='bg-gradient-blue rounded hover:shadow-lg hover:shadow-blue-400/20'>
          <button
            onClick={onClick}
            className='flex items-center gap-2 px-4 py-2'
          >
            {icon}
            <div className='text-sm font-light lowercase'>{label}</div>
          </button>
        </div>
      </>
    );
  };

  useEffect(() => {
    const callback = (user) => {
      const { token } = user;
      dispatch(initPengguna(user));
      dispatch(initDriver(token));
      dispatch(initOrder(token));
      channel.bind('orders', () => {
        console.log('channel bind orders emitted..');
        dispatch(initOrder(token));
      });
    };
    verifyPengguna(callback, 0);
    return () => {
      channel.unsubscribe('jetar');
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Layout title='Dashboard'>
        <>
          <div className='w-max mb-4 flex gap-2 flex-wrap items-center mx-5'>
            <ButtonMenu
              onClick={tambahHandler}
              icon={<FaTruck />}
              label='Tambah Order'
            />
            <ButtonMenu
              onClick={cekOngkirHandler}
              icon={<FaRoute />}
              label='cek ongkir'
            />
            <ButtonMenu
              onClick={() => {
                location.reload();
              }}
              icon={<FaUndo />}
              label='Refresh'
            />
          </div>
          <CekOngkir ref={cekOngkirRef} />
          <FormOrder ref={formOrderRef} drivers={drivers} />
          <Orders
            onEdit={(order) => {
              formOrderRef.current.edit(order);
            }}
            orders={orders}
            drivers={drivers}
            pengguna={pengguna}
          />
        </>
      </Layout>
    </>
  );
};

export default Dashboard;
