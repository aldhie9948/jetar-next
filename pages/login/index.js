import React, { useState, useRef, useEffect } from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import Button from '../../components/Button';
import LoginService from '../../services/login';
import localStorageService from '../../lib/localStorage';
import { useRouter } from 'next/router';
import { onChangeHandler } from '../../lib/handler';
import styles from '../../styles/Login.module.css';
import Head from 'next/head';
import route from '../../lib/route';
import { toast } from '../../components/Sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const formRef = useRef();
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    const pengguna = {
      username,
      password,
    };

    const penggunaLogin = await LoginService.login(pengguna);

    if (!penggunaLogin.error) {
      localStorageService.set(penggunaLogin, 'pengguna');
      router.push(route(penggunaLogin));
    }

    penggunaLogin.error &&
      toast({ title: 'Username atau Password salah', icon: 'error' });
  };

  return (
    <>
      <Head>
        <title>Login | Jasa Antar Jemput Tegal</title>
      </Head>
      <div className='grid sm:grid-cols-2 grid-cols-1  h-screen gap-2 login'>
        <div className='bg-primary/50 p-2 sm:flex hidden'>
          <div className='my-auto px-2'>
            <h1 className='text-[4rem] font-black'>JETAR</h1>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            aliquid facere, itaque rerum, nesciunt dolor blanditiis ullam quidem
            sint rem nihil exercitationem voluptas! Aspernatur unde accusantium
            ipsum reiciendis quod maiores.
          </div>
        </div>
        <div className='order-first sm:order-last flex'>
          <div className='my-auto w-full p-2'>
            {/* eslint-disable-next-line */}
            <img
              src='/assets/image/JETAR.png'
              alt='jetar logo'
              className='block sm:hidden w-3/6 mx-auto mb-10'
            />
            <form onSubmit={submitHandler} ref={formRef} className='px-5'>
              <div className='mb-4'>
                <strong className='block'>Username :</strong>
                <input
                  type='text'
                  name='username'
                  value={username}
                  onChange={(e) => {
                    onChangeHandler(setUsername, e);
                  }}
                  required
                  autoComplete='off'
                  placeholder='masukkan username'
                  className={styles.input}
                />
              </div>
              <div className='mb-4'>
                <strong className='block'>Password :</strong>
                <input
                  type='password'
                  name='password'
                  value={password}
                  onChange={(e) => {
                    onChangeHandler(setPassword, e);
                  }}
                  required
                  autoComplete='off'
                  placeholder='masukkan password'
                  className={styles.input}
                />
              </div>
              <Button type='submit' className='justify-end'>
                <div className='flex gap-2 py-2 px-5 '>
                  <BiLogInCircle className='text-xl my-auto' />
                  <h1>Masuk</h1>
                </div>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
