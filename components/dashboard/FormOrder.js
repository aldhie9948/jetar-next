import React, { useImperativeHandle, useRef, useState, useEffect } from 'react';
import dateFormat from '../../lib/date';
import { toast, confirm } from '../Sweetalert2';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import SelectPelanggan from './SelectPelanggan';
import SelectDriver from './SelectDriver';
import MapComponent from './Map';
import { onChangeHandler, borderInputHandler } from '../../lib/handler';
import { currencyNumber, localCurrency } from '../../lib/currency';
import { createOrder, initOrdersToday } from '../../reducers/orderReducer';
import styles from '../../styles/Dashboard.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrder } from '../../reducers/orderReducer';
import axios from 'axios';

const Input = ({
  label = '',
  value,
  setter,
  isNumber = false,
  isPhone = false,
  ...rest
}) => {
  return (
    <div className='mb-2'>
      <span className='text-sm capitalize'>{label} :</span>
      <input
        className={`${styles.input} ${borderInputHandler(value)}`}
        required
        autoComplete='off'
        value={value}
        onChange={(e) => onChangeHandler(setter, e, isNumber, isPhone)}
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

const FormOrder = React.forwardRef(({ drivers }, ref) => {
  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return console.log(status);
      case Status.FAILURE:
        return console.log(status);
    }
  };

  const dispatch = useDispatch();

  const formRef = useRef();
  const mapsRef = useRef();
  const selectPelangganRef = useRef();
  const selectDriverRef = useRef();
  const pengguna = useSelector((s) => s.pengguna);

  const [idOrder, setIdOrder] = useState(null);
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
  const [waktuOrder, setWaktuOrder] = useState(dateFormat(new Date(), 'HH:mm'));
  const [driver, setDriver] = useState('');
  const [ongkir, setOngkir] = useState(0);
  const [talang, setTalang] = useState(0);
  const [visible, setVisible] = useState(false);
  const [defaultDriver, setDefaultDriver] = useState({});
  const [distance, setDistance] = useState(0);

  // handle saat form di submit
  const submitHandler = (e) => {
    e.preventDefault();

    if (!driver)
      return toast({ title: 'Pilih kurir terlebih dahulu', icon: 'error' });

    const data = {
      pengirim: {
        id: idPengirim || '',
        nama: namaPengirim,
        alamat: alamatPengirim,
        noHP: noHPPengirim,
        keterangan: keteranganPengirim,
      },
      penerima: {
        id: idPenerima || '',
        nama: namaPenerima,
        alamat: alamatPenerima,
        noHP: noHPPenerima,
        keterangan: keteranganPenerima,
      },
      driver,
      tanggalOrder,
      waktuOrder,
      ongkir: currencyNumber(ongkir),
      talang: currencyNumber(talang),
    };
    confirm(async () => {
      if (idOrder) {
        data.id = idOrder;
        dispatch(updateOrder(data, pengguna?.token));
      } else {
        dispatch(createOrder(data, pengguna?.token));
      }
      toggle();
      await axios.post('/api/pusher', { event: 'orders' });
    });
  };

  // isi form pengirim saat pilih pelanggan
  const onChangePengirim = (pelanggan) => {
    if (pelanggan?.obj) {
      setterValue({ obj: pelanggan.obj });
      return;
    }
    setterValue({ isPengirim: true });
  };

  // isi form penerima saat pilih pelanggan
  const onChangePenerima = (pelanggan) => {
    if (pelanggan?.obj) {
      setterValue({ obj: pelanggan.obj, isPengirim: false });
      return;
    }
    setterValue({ isPengirim: false });
  };

  // handle ganti driver saat select
  const onChangeDriver = (value) => {
    setDriver(value.id);
  };

  // handle yang mengisi form pengirim / penerima
  // jika obj = {} atau kosong, form akan diisi string kosong
  // isPengirim di atur true untuk menargetkan form pengirim
  // sebalik jika false maka akan menargetkan form penerima
  const setterValue = ({ obj = {}, isPengirim = true }) => {
    if (isPengirim) {
      setIdPengirim(obj?.id || '');
      setNamaPengirim(obj?.nama || '');
      setAlamatPengirim(obj?.alamat || '');
      setKeteranganPengirim(obj?.keterangan || '');
      setNoHPPengirim(obj?.noHP || '');
    } else {
      setIdPenerima(obj?.id || '');
      setNamaPenerima(obj?.nama || '');
      setAlamatPenerima(obj?.alamat || '');
      setKeteranganPenerima(obj?.keterangan || '');
      setNoHPPenerima(obj?.noHP || '');
    }
  };

  // handler saat menekan tombol cek ongkir di form
  // handler harus menyediakan origin, destination dan callback/fn
  // dengan argument ongkir & response dari direction maps api
  const cekOngkirHandler = () => {
    const origin = alamatPengirim;
    const destination = alamatPenerima;
    const callback = (args) => {
      const { ongkir, distance } = args;
      setDistance(Math.ceil(distance.value / 1000));
      setOngkir(localCurrency(ongkir));
    };
    mapsRef.current.route({ origin, destination, callback });
  };

  // fn yang akan menampilkan / menutup form order
  // fn juga akan mereset semua form
  const toggle = () => {
    setVisible(!visible);
    setterValue({ isPengirim: true });
    setterValue({ isPengirim: false });
    setIdOrder(null);
    setTalang('0');
    setOngkir('0');
    setDriver('');
    setDefaultDriver('');
    setTanggalOrder(dateFormat(new Date(), 'yyyy-MM-dd'));
    setWaktuOrder(dateFormat(new Date(), 'HH:mm'));
  };

  // fn untuk update/edit order dan mengisinya di form order
  // fn harus diberikan argument "order" seseuai dengan model order
  const edit = (order) => {
    toggle();
    setIdOrder(order?.id);
    setIdPengirim(order?.pengirim.id);
    setNamaPengirim(order?.pengirim.nama);
    setNoHPPengirim(order?.pengirim.noHP);
    setAlamatPengirim(order?.pengirim.alamat);
    setKeteranganPengirim(order?.pengirim.keterangan);
    setIdPenerima(order?.penerima.id);
    setNamaPenerima(order?.penerima.nama);
    setNoHPPenerima(order?.penerima.noHP);
    setAlamatPenerima(order?.penerima.alamat);
    setKeteranganPenerima(order?.penerima.keterangan);
    setTanggalOrder(order?.tanggalOrder);
    setWaktuOrder(order?.waktuOrder);
    setDefaultDriver({
      label: order?.driver.nama,
      value: order?.driver.id,
      obj: order?.driver,
    });
    setDriver(order?.driver.id);
    setOngkir(localCurrency(order?.ongkir));
    setTalang(localCurrency(order?.talang));
  };

  // hooks untuk component lain bisa mengakses fn toggle, edit
  useImperativeHandle(ref, () => ({
    toggle,
    edit,
  }));
  return (
    <div className='px-5'>
      {visible && (
        <form ref={formRef} className='mb-4' onSubmit={submitHandler}>
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
                    isPhone={true}
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
                    isPhone={true}
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
                      <SelectDriver
                        onChange={onChangeDriver}
                        ref={selectDriverRef}
                        defaultValue={defaultDriver}
                        placeholder='Pilih Driver'
                        drivers={drivers}
                      />
                    </div>
                    <div className='box-border'>
                      <span className='block text-sm'>Ongkir :</span>
                      <button
                        id='cek-ongkir-button'
                        type='button'
                        className={`${styles.btn} bg-gradient-green hover:!shadow-green-400/20`}
                        onClick={cekOngkirHandler}
                      >
                        Cek Ongkir [{distance} KM]
                      </button>
                    </div>
                    <Input
                      label='Ongkir'
                      value={ongkir}
                      setter={setOngkir}
                      isNumber={true}
                      placeholder='ongkir order'
                      id='ongkir'
                    />
                    <Input
                      label='Dana Talang'
                      value={talang}
                      setter={setTalang}
                      isNumber={true}
                      placeholder='talangan order'
                    />
                    <div className='col-span-2 flex justify-end'>
                      <button
                        className={`${styles.btn} bg-gradient-blue hover:!shadow-blue-400/20`}
                      >
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
                    apiKey={process.env.NEXT_PUBLIC_MAPS_API}
                    render={render}
                  >
                    <MapComponent ref={mapsRef} />
                  </Wrapper>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
});

FormOrder.displayName = 'Form Order';

export default FormOrder;
