import Head from 'next/head';
import React from 'react';
import { FaHome, FaSignOutAlt, FaUserAlt, FaRoute } from 'react-icons/fa';
import styles from '../../../styles/pwa/Driver.module.css';
import Link from 'next/link';

const NavBar = () => {
  return (
    <>
      <div
        className='fixed max-h-16 left-0 right-0 bottom-0 shadow-top z-[9999] bg-green-300 rounded-tl-xl rounded-tr-xl'
        id='navbar-bottom'
      >
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
            <Link href='/pwa/drivers/riwayat'>
              <a>
                <div
                  className={`flex flex-col justify-center items-center ${styles.iconNav}`}
                >
                  <FaRoute className={``} />
                  <div className='text-xs'>Riwayat</div>
                </div>
              </a>
            </Link>
            {/* <div
              className={`flex flex-col justify-center items-center ${styles.iconNav}`}
            >
              <FaUserAlt className={``} />
              <div className='text-xs'>Profile</div>
            </div> */}

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

const Layout = ({ children }) => {
  return (
    <>
      <>
        <div className='sm:max-w-screen-sm sm:mx-auto overflow-x-hidden'>
          <Head>
            <title>JETAR Driver</title>
          </Head>
          <div className='bg-slate-100 h-screen relative overflow-y-auto'>
            <TopBar />
            <NavBar />
            <div className='pt-8 pb-20 text-sm'>{children}</div>
          </div>
        </div>
      </>
    </>
  );
};

export default Layout;
