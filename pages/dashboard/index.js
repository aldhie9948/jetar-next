import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import Layout from '../../components/Layout';
import { onChangeHandler, borderInputHandler } from '../../lib/handler';
import styles from '../../styles/Dashboard.module.css';
import dateFormat from '../../lib/date';
import Select from 'react-select';
import { apiKeyGoogle } from '../../utils/api';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import MapComponent from '../../components/dashboard/Map';
import { useDispatch, useSelector } from 'react-redux';
import SelectPelanggan from '../../components/dashboard/SelectPelanggan';

const driverOptions = [
  { value: 'aldi', label: 'Aldi' },
  { value: 'riski', label: 'Riski' },
  { value: 'dicky', label: 'Dicky' },
];

const selectStyles = {
  control: (styles) => ({ ...styles, borderRadius: 'none', border: 'none' }),
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const pengguna = useSelector((state) => state.pengguna);
  const selectPelangganRef = useRef();
  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return console.log(status);
      case Status.FAILURE:
        return console.log(status);
    }
  };
  const Input = ({ label = '', value, setter, isNumber = false, ...rest }) => {
    return (
      <div className='mb-2'>
        <span className='text-sm capitalize'>{label} :</span>
        <input
          className={`${styles.input} ${borderInputHandler(value)}`}
          required
          autoComplete='off'
          value={value}
          onChange={(e) => onChangeHandler(setter, e, isNumber)}
          {...rest}
        />
      </div>
    );
  };
  const Textarea = ({ label = '', value, setter, ...rest }) => {
    return (
      <div>
        <span className='text-sm capitalize'>{label} :</span>
        <textarea
          className={`${styles.input} ${borderInputHandler(value)}`}
          required
          autoComplete='off'
          value={value}
          onChange={(e) => onChangeHandler(setter, e)}
          {...rest}
        ></textarea>
      </div>
    );
  };

  const FormOrder = () => {
    const formRef = useRef();
    const mapsRef = useRef();

    const [idPengirim, setIdPengirim] = useState('');
    const [namaPengirim, setNamaPengirim] = useState('');
    const [noHPPengirim, setNoHPPengirim] = useState('');
    const [alamatPengirim, setAlamatPengirim] = useState('');
    const [keteranganPengirim, setKeteranganPengirim] = useState('');
    const [idPenerima, setIdPenerima] = useState('');
    const [namaPenerima, setNamaPenerima] = useState('');
    const [noHPPenerima, setNoHPPenerima] = useState('');
    const [alamatPenerima, setAlamatPenerima] = useState('');
    const [keteranganPenerima, setKeteranganPenerima] = useState('');
    const [tanggalOrder, setTanggalOrder] = useState(
      dateFormat(new Date(), 'yyyy-MM-dd')
    );
    const [waktuOrder, setWaktuOrder] = useState(
      dateFormat(new Date(), 'HH:mm')
    );
    const [driver, setDriver] = useState('');
    const [ongkir, setOngkir] = useState(0);
    const [talang, setTalang] = useState(0);

    const submitHandler = (e) => {
      e.preventDefault();
    };

    const onChangePengirim = (pelanggan) => {
      setterValue(pelanggan.obj);
    };
    const onChangePenerima = (pelanggan) => {
      setterValue(pelanggan.obj, false);
    };

    const setterValue = (obj, isPengirim = true) => {
      const { nama, alamat, noHP, keterangan, id } = obj;
      if (isPengirim) {
        setIdPengirim(id);
        setNamaPengirim(nama);
        setAlamatPengirim(alamat);
        setKeteranganPengirim(keterangan);
        setNoHPPengirim(noHP);
      } else {
        setIdPenerima(id);
        setNamaPenerima(nama);
        setAlamatPenerima(alamat);
        setKeteranganPenerima(keterangan);
        setNoHPPenerima(noHP);
      }
    };

    return (
      <>
        <form ref={formRef} onSubmit={submitHandler}>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
            <div className='bg-white rounded-md'>
              <div className='px-6 py-10'>
                <div className='flex justify-between gap-10 mb-4'>
                  <strong className={`${styles['header-form']} my-auto`}>
                    Pengirim
                  </strong>
                  <SelectPelanggan
                    onChange={onChangePengirim}
                    ref={selectPelangganRef}
                  />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <Input
                    value={namaPengirim}
                    setter={setNamaPengirim}
                    label='Nama Lengkap'
                    placeholder='masukkan nama pengirim'
                  />
                  <Input
                    value={noHPPengirim}
                    setter={setNoHPPengirim}
                    label='No. HP'
                    placeholder='masukkan no hp pengirim'
                  />
                </div>
                <div className='mb-2'>
                  <Input
                    value={alamatPengirim}
                    setter={setAlamatPengirim}
                    onBlur={(e) => {
                      setAlamatPengirim(e.target.value);
                    }}
                    label='Alamat Lengkap'
                    placeholder='masukkan alamat pengirim'
                    id='alamatPengirim'
                  />
                  <Textarea
                    value={keteranganPengirim}
                    setter={setKeteranganPengirim}
                    label='Keterangan'
                    placeholder='masukkan keterangan pengirim'
                    rows='3'
                  />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-md'>
              <div className='px-6 py-10'>
                <div className='flex justify-between gap-10 mb-4'>
                  <strong className={`${styles['header-form']} my-auto`}>
                    Penerima
                  </strong>
                  <SelectPelanggan
                    onChange={onChangePenerima}
                    ref={selectPelangganRef}
                  />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <Input
                    value={namaPenerima}
                    setter={setNamaPenerima}
                    label='Nama Lengkap'
                    placeholder='masukkan nama penerima'
                  />
                  <Input
                    value={noHPPenerima}
                    setter={setNoHPPenerima}
                    label='No. HP'
                    placeholder='masukkan no hp penerima'
                  />
                </div>
                <div className='mb-2'>
                  <Input
                    value={alamatPenerima}
                    setter={setAlamatPenerima}
                    label='Alamat Lengkap'
                    placeholder='masukkan alamat penerima'
                    id='alamatPenerima'
                    onBlur={(e) => {
                      setAlamatPenerima(e.target.value);
                    }}
                  />
                  <Textarea
                    value={keteranganPenerima}
                    setter={setKeteranganPenerima}
                    label='Keterangan'
                    placeholder='masukkan keterangan penerima'
                    rows='3'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-md'>
            <div className='px-6 py-10'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <div>
                  <strong className={`${styles['header-form']}`}>
                    Detail Order
                  </strong>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      label='tanggal'
                      type='date'
                      value={tanggalOrder}
                      setter={setTanggalOrder}
                    />
                    <Input
                      label='waktu'
                      type='time'
                      value={waktuOrder}
                      setter={setWaktuOrder}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <span className='block text-sm'>Driver :</span>
                      <Select
                        options={driverOptions}
                        className={`${borderInputHandler('a')}`}
                        styles={selectStyles}
                        onChange={(v) => {
                          setDriver(v.value);
                        }}
                        value={driverOptions.find((f) => f.value === 'aldi')}
                      />
                    </div>
                    <div className='box-border'>
                      <span className='block text-sm'>Ongkir :</span>
                      <button
                        type='button'
                        className='bg-green-200 border border-green-200 w-full py-[0.4rem] hover:shadow-none shadow-lg'
                        onClick={() => {
                          mapsRef.current.route({
                            origin: alamatPengirim,
                            destination: alamatPenerima,
                          });
                        }}
                      >
                        Cek Ongkir
                      </button>
                    </div>
                    <Input
                      label='Ongkir'
                      value={ongkir}
                      setter={setOngkir}
                      isNumber={true}
                      placeholder='ongkir order'
                    />
                    <Input
                      label='Dana Talang'
                      value={talang}
                      setter={setTalang}
                      isNumber={true}
                      placeholder='talangan order'
                    />
                    <div className='col-span-2 flex justify-end'>
                      <button className='bg-blue-200 border border-blue-200 w-full py-[0.4rem] hover:shadow-none shadow-lg'>
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <Wrapper
                    libraries={['places']}
                    region='ID'
                    language='id'
                    apiKey={apiKeyGoogle()}
                    render={render}
                  >
                    <MapComponent ref={mapsRef} />
                  </Wrapper>
                </div>
              </div>
            </div>
          </div>
        </form>
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
