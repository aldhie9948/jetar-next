import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import FormDriver from '../../components/driver/FormDriver';
import { useSelector, useDispatch } from 'react-redux';
import { initDrivers } from '../../reducers/driverReducer';
import DriverTable from '../../components/driver/DriverTable';
import verifyPengguna from '../../lib/verifyLogin';
import { initPengguna } from '../../reducers/penggunaReducer';
import { initOrder } from '../../reducers/orderReducer';

const Driver = () => {
  const dispatch = useDispatch();
  const driver = useSelector((s) => s.driver);
  const pengguna = useSelector((s) => s.pengguna);
  const formDriverRef = useRef();

  const updateDriverHandler = (driver) => {
    return formDriverRef.current.toggle(driver);
  };
  const callback = (user) => {
    const { token } = user;
    dispatch(initPengguna(user));
    dispatch(initDrivers(token));
    dispatch(initOrder(token));
  };

  useEffect(() => {
    verifyPengguna(callback, 0);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Layout title='Driver'>
        <div className='mx-5'>
          <FormDriver ref={formDriverRef} />

          <DriverTable driver={driver} onUpdate={updateDriverHandler} />
        </div>
      </Layout>
    </>
  );
};

export default Driver;
