import Head from 'next/head';
import React from 'react';
import { FaHome, FaSignOutAlt, FaUserAlt, FaRoute } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { initPengguna } from '../../../reducers/penggunaReducer';
import styles from '../../../styles/pwa/Driver.module.css';
import localStorageService from '../../../lib/localStorage';
import dateFormat from '../../../lib/date';
import { FcBusinessman } from 'react-icons/fc';
import { initDriver } from '../../../reducers/driverReducer';
import { initOrder } from '../../../reducers/orderReducer';
import { localCurrency } from '../../../lib/currency';
import Link from 'next/link';
import CardOrder from '../../../components/pwa/drivers/CardOrder';

const NavBar = () => {
  return (
    <>
      <div className='absolute left-0 right-0 bottom-0 shadow-top z-[9999] bg-green-300 rounded-tl-xl rounded-tr-xl'>
        <div className='px-2 py-3'>
          <div className='flex gap-2 justify-around items-center text-green-900'>
            <Link href='/pwa/drivers'>
              <a>
                <div
                  className={`flex flex-col justify-center items-center ${styles.iconNav}`}
                >
                  <FaHome className={``} />
                  <div className='text-xs'>Beranda</div>
                </div>
              </a>
            </Link>
            <div
              className={`flex flex-col justify-center items-center ${styles.iconNav}`}
            >
              <FaRoute className={``} />
              <div className='text-xs'>Riwayat</div>
            </div>
            <div
              className={`flex flex-col justify-center items-center ${styles.iconNav}`}
            >
              <FaUserAlt className={``} />
              <div className='text-xs'>Profile</div>
            </div>

            <Link href='/logout'>
              <a>
                <div
                  className={`flex flex-col justify-center items-center ${styles.iconNav}`}
                >
                  <FaSignOutAlt className={``} />
                  <div className='text-xs'>Keluar</div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const TopBar = () => {
  return (
    <>
      <div className='absolute top-0 left-0 right-0 text-xs h-8 bg-slate-100'>
        <div className='flex h-full justify-center items-center font-black text-lg drop-shadow-lg text-black'>
          <span className={`${styles['text-jetar']}`}>
            Jasa Antar Jemput Tegal
          </span>
        </div>
      </div>
    </>
  );
};

const CardDriver = () => {
  const pengguna = useSelector((s) => s.pengguna);
  const drivers = useSelector((s) => s.driver);
  const orders = useSelector((s) => s.order);
  const [currentDriver, setCurrentDriver] = React.useState(null);
  const [driverOrders, setDriverOrders] = React.useState([]);

  React.useEffect(() => {
    setCurrentDriver(
      drivers?.find((d) => d.akun.username === pengguna.username)
    );

    // eslint-disable-next-line
  }, [drivers]);

  React.useEffect(() => {
    const selectedOrders = orders?.filter(
      (order) => order.driver.id === currentDriver?.id
    );
    setDriverOrders(selectedOrders);

    // eslint-disable-next-line
  }, [currentDriver, orders]);

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

  React.useEffect(() => {
    const penggunaLocal = localStorageService.get('pengguna', true);
    if (penggunaLocal) {
      dispatch(initPengguna(penggunaLocal));
      dispatch(initDriver(penggunaLocal.token));
      dispatch(initOrder(penggunaLocal.token));
    }
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setCurrentDriver(
      drivers?.find((d) => d.akun.username === pengguna?.username)
    );
    // eslint-disable-next-line
  }, [drivers]);

  React.useEffect(() => {
    const selectedOrders = orders?.filter(
      (order) => order.driver.id === currentDriver?.id
    );
    setDriverOrders(selectedOrders);

    // eslint-disable-next-line
  }, [currentDriver, orders]);

  return (
    <div className='sm:max-w-screen-sm sm:mx-auto'>
      {pengguna && (
        <>
          <Head>
            <title>JETAR Driver</title>
          </Head>
          <div className='bg-slate-100 h-screen relative'>
            <TopBar />
            <NavBar />
            <div className='pt-8 pb-20 text-sm'>
              <CardDriver />
              <div>
                <strong className='header-form my-auto px-5'>
                  Orderan Hari Ini..
                </strong>
                <div className='h-[60vh] overflow-y-auto'>
                  {driverOrders &&
                    driverOrders.map(
                      (order) =>
                        order.status !== 1 && (
                          <CardOrder key={order.id} order={order} />
                        )
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
