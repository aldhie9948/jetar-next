import React, { useImperativeHandle, useState, useRef } from 'react';

import { BiStoreAlt, BiBox } from 'react-icons/bi';
import SelectPelanggan from '../../components/dashboard/SelectPelanggan';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import CekOngkirMap from './CekOngkirMap';
import config from '../../utils/config';
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

  const mapRef = useRef();

  // handler saat menekan tombol cek ongkir di form
  // handler harus menyediakan origin, destination dan callback/fn
  // dengan argument ongkir & response dari direction maps api
  const cekOngkirHandler = () => {
    const callback = (args) => {
      const { ongkir } = args;
      setOngkir(localCurrency(ongkir));
    };
    mapRef.current.route({ origin, destination, callback });
  };

  // update state dengan pelanggan yang terpilih
  const onChangePelanggan = (pelanggan, setter) => {
    console.log(pelanggan);
    setter(pelanggan.obj.alamat);
  };

  const onChangeInput = (e, setter) => {
    setter(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    toggle: () => setVisible(!visible),
  }));
  return (
    <>
      {visible && (
        <div className='mb-4 mx-5 bg-blue-100/40 shadow-md rounded-lg p-5 pb-10'>
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
                    className='outline-none w-full py-2 bg-transparent'
                    id='alamat-pengirim-cek-ongkir'
                    value={origin}
                    onChange={(e) => onChangeInput(e, setOrigin)}
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
                    className='outline-none w-full py-2 bg-transparent'
                    id='alamat-penerima-cek-ongkir'
                    value={destination}
                    onChange={(e) => onChangeInput(e, setDestination)}
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
                  Cek Ongkir - Rp. {ongkir}
                </button>
              </div>
            </div>
            <div>
              <Wrapper
                libraries={['places']}
                region='ID'
                language='id'
                apiKey={config.MAP_API}
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
