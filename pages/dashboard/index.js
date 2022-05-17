import React, { useRef, useEffect } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Dashboard.module.css';
import CekOngkir from '../../components/dashboard/CekOngkir';
import Orders from '../../components/dashboard/Orders';
import { initDriver } from '../../reducers/driverReducer';
import { useDispatch, useSelector } from 'react-redux';
import { initOrder } from '../../reducers/orderReducer';
import FormOrder from '../../components/dashboard/FormOrder';

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
    dispatch(initDriver(pengguna?.token));
    dispatch(initOrder(pengguna?.token));
    // eslint-disable-next-line
  }, []);

  return (
    <Layout title='Dashboard'>
      <>
        <div className='w-max gap-2 mb-4 flex'>
          <button
            onClick={tambahHandler}
            className={`${styles.btn} bg-green-200 border-green-200 !w-max`}
          >
            Tambah Order
          </button>
          <button
            onClick={cekOngkirHandler}
            className={`${styles.btn} bg-green-200 border-green-200 !w-max`}
          >
            Cek Ongkir
          </button>
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
