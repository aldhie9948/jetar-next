import React, { useRef, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import CekOngkir from '../../components/dashboard/CekOngkir';
import Orders from '../../components/dashboard/Orders';
import { initDriver } from '../../reducers/driverReducer';
import { useDispatch, useSelector } from 'react-redux';
import { initOrdersToday } from '../../reducers/orderReducer';
import FormOrder from '../../components/dashboard/FormOrder';
import { FaTruck, FaRoute } from 'react-icons/fa';
import io from 'socket.io-client';
const socket = io();

const Dashboard = () => {
  const formOrderRef = useRef();
  const cekOngkirRef = useRef();
  const dispatch = useDispatch();
  const pengguna = useSelector((s) => s.pengguna);

  const socketInitializer = async (token) => {
    await fetch('/api/socket');
    socket.on('connect', () => {
      console.log('an user is connected');
    });
    socket.on('latest-order', () => {
      dispatch(initOrdersToday(token));
    });
  };

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
    if (pengguna) {
      const { token } = pengguna;
      dispatch(initDriver(token));
      dispatch(initOrdersToday(token));
      socketInitializer(token);
    }
    // eslint-disable-next-line
  }, [pengguna]);

  return (
    <Layout title='Dashboard'>
      <>
        <div className='w-max mb-4 flex gap-2 items-center mx-5'>
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
        </div>
        <CekOngkir ref={cekOngkirRef} />
        <FormOrder ref={formOrderRef} socket={socket} />
        <Orders
          onEdit={(order) => {
            formOrderRef.current.edit(order);
          }}
          socket={socket}
        />
      </>
    </Layout>
  );
};

export default Dashboard;
