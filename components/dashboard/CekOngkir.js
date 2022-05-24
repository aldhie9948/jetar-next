import React, { useImperativeHandle, useState, useRef } from 'react';

import { BiStoreAlt, BiBox } from 'react-icons/bi';
import SelectPelanggan from '../../components/dashboard/SelectPelanggan';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import CekOngkirMap from './CekOngkirMap';
import styles from '../../styles/Dashboard.module.css';
import { localCurrency } from '../../lib/currency';

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return console.log(status);
    case Status.FAILURE:
      return console.log(status);
  }
};

const CekOngkir = React.forwardRef(({}, ref) => {
  const [visible, setVisible] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [ongkir, setOngkir] = useState(0);
  const [distance, setDistance] = useState(0);

  const mapRef = useRef();

  // handler saat menekan tombol cek ongkir di form
  // handler harus menyediakan origin, destination dan callback/fn
  // dengan argument ongkir & response dari direction maps api
  const cekOngkirHandler = () => {
    const callback = (args) => {
      const { ongkir, distance } = args;
      setDistance(Math.ceil(distance.value / 1000));
      setOngkir(localCurrency(ongkir));
    };
    mapRef.current.route({ origin, destination, callback });
  };

  // update state dengan pelanggan yang terpilih
  const onChangePelanggan = (pelanggan, setter) => {
    if (pelanggan) return setter(pelanggan.obj.alamat);
    return setter('');
  };

  const onBlurInput = (e, setter) => setter(e.target.value);

  const onChangeInput = (e, setter) => {
    setter(e.target.value);
  };

  const toggle = () => {
    setOngkir(0);
    setOrigin('');
    setDestination('');
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggle,
  }));
  return (
    <>
      {visible && (
        <div className='mb-4 mx-5 bg-white rounded-lg p-5 pb-10'>
          <strong className='header-form mb-4'>Cek Ongkir</strong>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
              <div className='flex gap-2 items-center mb-4'>
                <div className='text-center'>
                  <BiStoreAlt className='text-[3rem] w-20 flex-shrink-0' />
                  <small>Pengirim</small>
                </div>
                <div className='flex-grow'>
                  <span className='font-black text-sm'>Titik Pengambilan</span>
                  <SelectPelanggan
                    className='mb-2'
                    onChange={(pelanggan) =>
                      onChangePelanggan(pelanggan, setOrigin)
                    }
                  />
                  <input
                    type='text'
                    placeholder='Masukkan alamat pengambilan...'
                    className='outline-none w-full p-2 border border-green-400 focus:shadow-lg'
                    id='alamat-pengirim-cek-ongkir'
                    value={origin}
                    onChange={(e) => onChangeInput(e, setOrigin)}
                    onBlur={(e) => onBlurInput(e, setOrigin)}
                  />
                </div>
              </div>
              <div className='flex gap-2 items-center mb-4'>
                <div className='text-center'>
                  <BiBox className='text-[3rem] w-20 flex-shrink-0' />
                  <small>Penerima</small>
                </div>
                <div className='flex-grow'>
                  <span className='font-black text-sm'>Titik Pengiriman</span>
                  <SelectPelanggan
                    className='mb-2'
                    onChange={(pelanggan) =>
                      onChangePelanggan(pelanggan, setDestination)
                    }
                  />
                  <input
                    type='text'
                    placeholder='Masukkan alamat pengambilan...'
                    className='outline-none w-full p-2 border border-green-400 focus:shadow-lg'
                    id='alamat-penerima-cek-ongkir'
                    value={destination}
                    onChange={(e) => onChangeInput(e, setDestination)}
                    onBlur={(e) => onBlurInput(e, setDestination)}
                  />
                </div>
              </div>
              <div className='flex justify-end'>
                <button
                  id='cek-ongkir-button'
                  type='button'
                  className={`${styles.btn} bg-gradient-green hover:!shadow-green-400/20`}
                  onClick={() => cekOngkirHandler()}
                >
                  Cek Ongkir - Rp. {ongkir} [{distance} KM]
                </button>
              </div>
            </div>
            <div>
              <Wrapper
                libraries={['places']}
                region='ID'
                language='id'
                apiKey={process.env.NEXT_PUBLIC_MAPS_API}
                render={render}
              >
                <CekOngkirMap ref={mapRef} />
              </Wrapper>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

CekOngkir.displayName = 'Cek Ongkir';
export default CekOngkir;
