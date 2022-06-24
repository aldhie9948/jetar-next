import React, { useRef, useEffect } from 'react';
import Layout from '../../components/Layout';
import CekOngkir from '../../components/dashboard/CekOngkir';
import Orders from '../../components/dashboard/Orders';
import { initDrivers } from '../../reducers/driverReducer';
import { useDispatch, useSelector } from 'react-redux';
import { initOrder } from '../../reducers/orderReducer';
import FormOrder from '../../components/dashboard/FormOrder';
import { FaTruck, FaRoute, FaUndo, FaMapMarked } from 'react-icons/fa';
import verifyPengguna from '../../lib/verifyLogin';
import { initPengguna } from '../../reducers/penggunaReducer';
import initPusher from '../../lib/pusherConfig';
import PetaOrderan from '../../components/PetaOrderan';

const pusher = initPusher();
const channel = pusher.subscribe('jetar');

const Dashboard = () => {
  const formOrderRef = useRef();
  const cekOngkirRef = useRef();
  const petaOrderanRef = useRef();
  const dispatch = useDispatch();
  const drivers = useSelector((s) => s.driver);

  const tambahHandler = () => {
    formOrderRef.current.toggle();
  };

  const cekOngkirHandler = () => {
    cekOngkirRef.current.toggle();
  };

  const petaOrderanHandler = () => {
    petaOrderanRef.current.toggle();
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
      dispatch(initDrivers(token));
      dispatch(initOrder(token));
      channel.bind('orders', () => {
        console.log('channel bind orders emitted..');
        dispatch(initOrder(token));
      });
      channel.bind('orders-done', async (data) => {
        const { order } = data;
        console.log('orders-done');
        if (typeof Notification !== 'undefined') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification('Orderan Selesai', {
              body: `Orderan oleh Driver ${order.driver.nama.toUpperCase()} dari pelanggan ${
                order.pengirim.nama
              } ke pelanggan ${order.penerima.nama} telah selesai`,
              icon: `${location.origin}/assets/image/JETAR.png`,
            });
          }
        }
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
          <div className='mb-4 flex gap-2 flex-wrap items-center mx-5'>
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
              onClick={petaOrderanHandler}
              icon={<FaMapMarked />}
              label='Peta Orderan'
            />
            <ButtonMenu
              onClick={() => {
                location.reload();
              }}
              icon={<FaUndo />}
              label='Refresh'
            />
          </div>
          <PetaOrderan ref={petaOrderanRef} />
          <CekOngkir ref={cekOngkirRef} />
          <FormOrder ref={formOrderRef} drivers={drivers} />
          <Orders
            onEdit={(order) => {
              formOrderRef.current.edit(order);
            }}
          />
        </>
      </Layout>
    </>
  );
};

export default Dashboard;
