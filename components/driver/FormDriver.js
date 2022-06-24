import React, { useImperativeHandle, useState } from 'react';
import { toast, confirm } from '../../components/Sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { createDriver, updateDriver } from '../../reducers/driverReducer';
import { onChangeHandler } from '../../lib/handler';
import { FaUser } from 'react-icons/fa';

const FormDriver = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [nama, setNama] = useState('');
  const [noHP, setNoHP] = useState('');
  const [gender, setGender] = useState('pria');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const pengguna = useSelector((s) => s.pengguna);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [idDriver, setIdDriver] = useState('');

  const onSubmit = ({ isUpdate = false }) => {
    const driver = {
      nama,
      noHP,
      gender,
      username,
      password,
    };

    idDriver && (driver.id = idDriver);

    confirm(() => {
      if (!isUpdate) dispatch(createDriver(driver, pengguna.token));
      if (isUpdate) {
        dispatch(updateDriver(driver, pengguna.token));
      }
    });
  };

  const toggle = ({ driver = null }) => {
    setIdDriver(driver?.id || '');
    setNama(driver?.nama || '');
    setNoHP(driver?.noHP || '');
    setGender(driver?.gender || 'pria');
    setUsername(driver?.pengguna.username || '');
    setPassword('');
    driver ? setIsUpdate(true) : setIsUpdate(false);
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggle: (driver) => toggle({ driver }),
  }));

  return (
    <>
      <button
        onClick={toggle}
        className='btn-dashboard !w-max bg-gradient-blue px-5 !font-light flex gap-2 items-center'
      >
        <FaUser />
        tambah driver
      </button>
      {visible && (
        <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-x-10 gap-x-0 items-center'>
          <div className='col-span-2 sm:order-first order-last'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ isUpdate });
              }}
            >
              <div className='mb-2'>
                <span className='capitalize font-medium text-sm block'>
                  Nama Driver
                </span>
                <input
                  type='text'
                  placeholder='masukkan nama driver..'
                  className='p-2  outline-none w-full placeholder:text-sm rounded focus:shadow-lg'
                  name='nama'
                  required
                  autoComplete='off'
                  value={nama}
                  onChange={(e) => onChangeHandler(setNama, e)}
                />
              </div>
              <div className='mb-2 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <span className='capitalize font-medium text-sm block'>
                    No. HP
                  </span>
                  <input
                    type='text'
                    placeholder='masukkan no. hp driver..'
                    className='p-2 outline-none w-full placeholder:text-sm rounded focus:shadow-lg'
                    name='noHP'
                    required
                    autoComplete='off'
                    value={noHP}
                    onChange={(e) => onChangeHandler(setNoHP, e, true, true)}
                  />
                </div>
                <div>
                  <span className='capitalize font-medium text-sm block'>
                    Jenis Kelamin
                  </span>
                  <select
                    className='w-full p-2 rounded outline-none capitalize'
                    name='gender'
                    placeholder='pilih jenis kelamin..'
                    required
                    autoComplete='off'
                    value={gender}
                    onChange={(e) => onChangeHandler(setGender, e)}
                  >
                    <option value='pria'>pria</option>
                    <option value='wanita'>wanita</option>
                  </select>
                </div>
              </div>
              <div className='mb-2 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <span className='capitalize font-medium text-sm block'>
                    Username
                  </span>
                  <input
                    type='text'
                    placeholder='masukkan username driver..'
                    className='p-2 outline-none w-full placeholder:text-sm rounded focus:shadow-lg'
                    name='username'
                    required
                    autoComplete='off'
                    value={username}
                    onChange={(e) => onChangeHandler(setUsername, e)}
                  />
                </div>
                <div>
                  <span className='capitalize font-medium text-sm block'>
                    Password
                  </span>
                  <input
                    type='password'
                    placeholder='masukkan password driver..'
                    className='p-2 outline-none w-full placeholder:text-sm rounded
              focus:shadow-lg'
                    name='password'
                    autoComplete='new-password'
                    value={password}
                    onChange={(e) => onChangeHandler(setPassword, e)}
                  />
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  className='btn-dashboard bg-gradient-green my-2 '
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
          <div>
            {/* eslint-disable-next-line */}
            <img
              src={`/assets/image/${gender || 'pria'}-avatar.png`}
              alt='profile picture'
              className='drop-shadow-lg sm:w-full w-2/3 mx-auto'
            />
          </div>
        </div>
      )}
    </>
  );
});

FormDriver.displayName = 'FormDriver';

export default FormDriver;
