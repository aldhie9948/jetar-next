import React, { useImperativeHandle } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars } from 'react-icons/fa';

const nav = [
  '/dashboard',
  // '/statistik',
  '/driver',
  // '/pelanggan',
  // '/pengaturan',
  '/logout',
];

const OverlayNav = React.forwardRef(({}, ref) => {
  const [visible, setVisible] = React.useState(false);
  const toggle = () => setVisible(!visible);
  const router = useRouter();

  React.useImperativeHandle(ref, () => ({
    toggle,
  }));
  return (
    <>
      <div
        className={`fixed right-0 bottom-0 top-0 z-[100] w-0 ${
          visible && '!w-full'
        }`}
      >
        <div className='relative w-full h-full'>
          <div
            onClick={() => toggle()}
            className='absolute inset-0 bg-black/10'
          ></div>
          <div className='absolute right-0 top-0 bottom-0 flex justify-end h-full z-[9999]'>
            <div
              className={`w-0 ${
                visible && '!w-56'
              } bg-slate-100 h-full pt-24 duration-150`}
            >
              <div>
                {/* eslint-disable-next-line */}
                <img
                  src='/assets/image/JETAR.png'
                  alt='logo jetar'
                  className='px-5 mb-10'
                />
              </div>
              {nav.map((n, i) => (
                <div
                  key={i}
                  className={`link mb-4 !ml-5 !text-lg ${
                    router.pathname === n && 'link-active !text-blue-500'
                  }`}
                >
                  <Link href={n}>
                    <a>{n.replace('/', '')}</a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

OverlayNav.displayName = 'Overlay Nav';

const NavBar = () => {
  const router = useRouter();
  const overlayNavRef = React.useRef();
  return (
    <>
      <div className='bg-gradient-green shadow-md fixed right-0 left-0 top-0 z-10'>
        <div className='p-4'>
          <div className='flex gap-2 justify-between flex-wrap'>
            <div className='flex gap-2 items-center'>
              {/* eslint-disable-next-line */}
              <img
                src='/assets/image/new-logo.png'
                alt='new logo jetar'
                className='w-5'
              />
              <div className='font-black'>
                <span className='sm:inline hidden'>
                  Jasa Jemput Antar Barang
                </span>
                <span className='sm:hidden inline'>JETAR</span> Tegal
              </div>
            </div>
            <div>
              <FaBars
                onClick={() => overlayNavRef.current.toggle()}
                className='text-xl sm:hidden block'
              />
            </div>
            <div className='sm:flex sm:flex-nowrap flex-wrap sm:gap-4 gap-2 sm:justify-start justify-center hidden'>
              {nav.map((n, i) => (
                <div
                  key={i}
                  className={`link ${
                    router.pathname === n && 'link-active !text-blue-500'
                  }`}
                >
                  <Link href={n}>
                    <a>{n.replace('/', '')}</a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <OverlayNav ref={overlayNavRef} />
    </>
  );
};

export default NavBar;
