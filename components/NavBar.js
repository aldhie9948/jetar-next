import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const nav = [
  '/dashboard',
  '/statistik',
  '/driver',
  '/pelanggan',
  '/pengaturan',
  '/keluar',
];

const NavBar = () => {
  const router = useRouter();

  return (
    <>
      <div className='bg-green-200 shadow-md fixed right-0 left-0 top-0 z-10'>
        <div className='p-4'>
          <div className='flex gap-2 sm:justify-between justify-center flex-wrap'>
            <div className='font-black sm:block'>JETAR Tegal</div>
            <div className='flex gap-4'>
              {nav.map((n, i) => (
                <div
                  key={i}
                  className={`link ${
                    router.pathname === n && '!text-slate-50 drop-shadow'
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
};

export default NavBar;
