import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { onChangeHandler, borderInputHandler } from '../../lib/handler';
import styles from '../../styles/Dashboard.module.css';

const Dashboard = () => {
  const FormOrder = () => {
    const [namaPengirim, setNamaPengirim] = useState('');
    const [noHPPengirim, setNoHPPengirim] = useState('');
    const [alamatPengirim, setAlamatPengirim] = useState('');
    const [keteranganPengirim, setKeteranganPengirim] = useState('');
    const [namaPenerima, setNamaPenerima] = useState('');
    const [noHPPenerima, setNoHPPenerima] = useState('');
    const [alamatPenerima, setAlamatPenerima] = useState('');
    const [keteranganPenerima, setKeteranganPenerima] = useState('');
    return (
      <>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
          <div className='bg-white rounded-md shadow-md'>
            <div className='p-4'>
              <strong className='block font-black'>Pengirim</strong>
              <div className='grid grid-cols-2 gap-2 mb-2'>
                <div>
                  <span>Nama :</span>
                  <input
                    className={`${styles.input} ${borderInputHandler(
                      namaPengirim
                    )}`}
                    required
                    autoComplete='off'
                    type='text'
                    placeholder='masukkan nama pengirim'
                    value={namaPengirim}
                    onChange={(e) => onChangeHandler(setNamaPengirim, e)}
                  />
                </div>
                <div>
                  <span>No. HP :</span>
                  <input
                    className={`${styles.input} ${borderInputHandler(
                      noHPPengirim
                    )}`}
                    type='text'
                    required
                    autoComplete='off'
                    placeholder='masukkan no hp pengirim'
                    value={noHPPengirim}
                    onChange={(e) => onChangeHandler(setNoHPPengirim, e)}
                  />
                </div>
              </div>
              <div className='mb-2'>
                <span>Alamat :</span>
                <input
                  className={`${styles.input} ${borderInputHandler(
                    alamatPengirim
                  )}`}
                  required
                  autoComplete='off'
                  type='text'
                  placeholder='masukkan alamat pengirim'
                  value={alamatPengirim}
                  onChange={(e) => onChangeHandler(setAlamatPengirim, e)}
                />
              </div>
              <div className='mb-2'>
                <span>Keterangan :</span>
                <textarea
                  className={`${styles.input} ${borderInputHandler(
                    keteranganPengirim
                  )}`}
                  required
                  autoComplete='off'
                  type='text'
                  placeholder='masukkan keterangan pengirim'
                  value={keteranganPengirim}
                  onChange={(e) => onChangeHandler(setKeteranganPengirim, e)}
                ></textarea>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-md shadow-md'>
            <div className='p-4'>
              <strong className='block font-black'>Penerima</strong>
              <div className='grid grid-cols-2 gap-2 mb-2'>
                <div>
                  <span>Nama :</span>
                  <input
                    className={`${styles.input} ${borderInputHandler(
                      namaPenerima
                    )}`}
                    required
                    autoComplete='off'
                    type='text'
                    placeholder='masukkan nama penerima'
                    value={namaPenerima}
                    onChange={(e) => onChangeHandler(setNamaPenerima, e)}
                  />
                </div>
                <div>
                  <span>No. HP :</span>
                  <input
                    className={`${styles.input} ${borderInputHandler(
                      noHPPenerima
                    )}`}
                    type='text'
                    required
                    autoComplete='off'
                    placeholder='masukkan no hp penerima'
                    value={noHPPenerima}
                    onChange={(e) => onChangeHandler(setNoHPPenerima, e)}
                  />
                </div>
              </div>
              <div className='mb-2'>
                <span>Alamat :</span>
                <input
                  className={`${styles.input} ${borderInputHandler(
                    alamatPenerima
                  )}`}
                  required
                  autoComplete='off'
                  type='text'
                  placeholder='masukkan alamat penerima'
                  value={alamatPenerima}
                  onChange={(e) => onChangeHandler(setAlamatPenerima, e)}
                />
              </div>
              <div className='mb-2'>
                <span>Keterangan :</span>
                <textarea
                  className={`${styles.input} ${borderInputHandler(
                    keteranganPenerima
                  )}`}
                  required
                  autoComplete='off'
                  type='text'
                  placeholder='masukkan keterangan penerima'
                  value={keteranganPenerima}
                  onChange={(e) => onChangeHandler(setKeteranganPenerima, e)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-md shadow-md'>
          <div className='p-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
                repellat iusto quis aliquid id, aut totam nisi quos soluta
                repellendus ipsa eligendi blanditiis voluptatem labore unde
                dolores saepe culpa ex?
              </div>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
                repellat iusto quis aliquid id, aut totam nisi quos soluta
                repellendus ipsa eligendi blanditiis voluptatem labore unde
                dolores saepe culpa ex?
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout title='Dashboard'>
      <>
        <div>
          <FormOrder />
        </div>
      </>
    </Layout>
  );
};

export default Dashboard;
