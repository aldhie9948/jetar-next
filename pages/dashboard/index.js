import React, { useRef, useEffect } from 'react';
import Layout from '../../components/Layout';
import CekOngkir from '../../components/dashboard/CekOngkir';
import Orders from '../../components/dashboard/Orders';
import { initDriver } from '../../reducers/driverReducer';
import { useDispatch, useSelector } from 'react-redux';
import { initOrdersToday } from '../../reducers/orderReducer';
import FormOrder from '../../components/dashboard/FormOrder';

import { FaTruck, FaRoute } from 'react-icons/fa';

const Dashboard = () => {
  const formOrderRef = useRef();
  const cekOngkirRef = useRef();
  const dispatch = useDispatch();
  const pengguna = useSelector((s) => s.pengguna);

  const tambahHandler = () => {
    formOrderRef.current.toggle();
  };
  const cekOngkirHandler = () => {
    cekOngkirRef.current.toggle();
  };

  useEffect(() => {
    if (pengguna) {
      dispatch(initDriver(pengguna.token));
      dispatch(initOrdersToday(pengguna.token));
    }
    // eslint-disable-next-line
  }, [pengguna]);

  return (
    <Layout title='Dashboard'>
      <>
        <div className='w-max mb-4 flex gap-2 items-center mx-5'>
          <div className='bg-gradient-blue rounded hover:shadow-lg hover:shadow-blue-400/20'>
            <button
              onClick={tambahHandler}
              className='flex items-center gap-2 px-4 py-2'
            >
              <FaTruck />
              <div className='text-sm font-light lowercase'>Tambah Order</div>
            </button>
          </div>
          <div className='bg-gradient-blue rounded hover:shadow-lg hover:shadow-blue-400/20'>
            <button
              onClick={cekOngkirHandler}
              className='flex items-center gap-2 px-4 py-2'
            >
              <FaRoute />
              <div className='text-sm font-light lowercase'>cek ongkir</div>
            </button>
          </div>
        </div>
        <CekOngkir ref={cekOngkirRef} />
        <FormOrder ref={formOrderRef} />
        <Orders
          onEdit={(order) => {
            formOrderRef.current.edit(order);
          }}
        />
      </>
    </Layout>
  );
};

export default Dashboard;
