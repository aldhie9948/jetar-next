import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import FormDriver from '../../components/driver/FormDriver';
import { useSelector, useDispatch } from 'react-redux';
import { initDrivers } from '../../reducers/driverReducer';
import DriverTable from '../../components/driver/DriverTable';

const Driver = () => {
  const dispatch = useDispatch();
  const driver = useSelector((s) => s.driver);
  const pengguna = useSelector((s) => s.pengguna);
  const formDriverRef = useRef();

  const updateDriverHandler = (driver) => {
    return formDriverRef.current.toggle(driver);
  };

  useEffect(() => {
    pengguna && dispatch(initDrivers(pengguna.token));
    // eslint-disable-next-line
  }, [pengguna]);

  return (
    <>
      <Layout title='Driver'>
        <div className='mx-5'>
          <FormDriver ref={formDriverRef} />
          {driver && (
            <DriverTable driver={driver} onUpdate={updateDriverHandler} />
          )}
        </div>
      </Layout>
    </>
  );
};

export default Driver;
