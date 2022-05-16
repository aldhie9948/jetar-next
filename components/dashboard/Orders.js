import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import dateFormat from '../../lib/date';
import { toast, confirm } from '../Sweetalert2';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import SelectPelanggan from './SelectPelanggan';
import SelectDriver from './SelectDriver';
import MapComponent from './Map';
import { apiKeyGoogle } from '../../utils/api';
import { onChangeHandler, borderInputHandler } from '../../lib/handler';
import { currencyNumber, localCurrency, numberOnly } from '../../lib/currency';
import { createOrder, removeOrder } from '../../reducers/orderReducer';
import styles from '../../styles/Dashboard.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrder } from '../../reducers/orderReducer';
import {
  BiStoreAlt,
  BiPhoneCall,
  BiMap,
  BiNotepad,
  BiInfoCircle,
  BiCar,
  BiDollarCircle,
  BiTrash,
  BiEdit,
  BiSend,
} from 'react-icons/bi';
import { FaPeopleCarry } from 'react-icons/fa';
import Select from 'react-select';

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

const StatusBadge = ({ status }) => {
  let classBadge = '';
  let textBadge = '';

  switch (status) {
    case 1:
      classBadge = 'badge-red';
      textBadge = 'masuk';
      break;
    case 2:
      classBadge = 'badge-blue';
      textBadge = 'jemput oleh driver';
      break;

    default:
      break;
  }

  return (
    <div className={`mx-auto sm:w-full w-24 text-xs rounded ${classBadge}`}>
      <div className='px-5 py-1 text-center font-bold capitalize truncate-2'>
        {textBadge}
      </div>
    </div>
  );
};

const selectOptions = {
  components: { DropdownIndicator: () => null, IndicatorSeparator: () => null },
  styles: {
    control: (base) => ({
      ...base,
      backgroundColor: 'transparent',
      height: '1.5rem',
      minHeight: '1.5rem',
      border: 'none',
      boxShadow: 'none',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    clearIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    valueContainer: (base) => ({ ...base, paddingLeft: 0, paddingRight: 0 }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  },
};

const Orders = React.forwardRef(({}, ref) => {
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
    try {
      confirm(() => {
        data.status = 1;
        if (idOrder) {
          data.id = idOrder;
          dispatch(updateOrder(data, pengguna?.token));
        } else {
          dispatch(createOrder(data, pengguna?.token));
        }
        toast({ title: 'Order berhasil disimpan', icon: 'success' });
        toggle();
      });
    } catch (error) {
      console.log('error:', error);
      toast({ title: 'Order gagal disimpan', icon: 'error' });
    }
  };
  const onChangePengirim = (pelanggan) => {
    if (pelanggan?.obj) {
      setterValue({ obj: pelanggan.obj });
      return;
    }
    setterValue({ isPengirim: true });
  };
  const onChangePenerima = (pelanggan) => {
    if (pelanggan?.obj) {
      setterValue({ obj: pelanggan.obj, isPengirim: false });
      return;
    }
    setterValue({ isPengirim: false });
  };
  const onChangeDriver = (value) => {
    setDriver(value.id);
  };
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
  const cekOngkirHandler = () => {
    const origin = alamatPengirim;
    const destination = alamatPenerima;
    const callback = (args) => {
      const { ongkir } = args;
      setOngkir(localCurrency(ongkir));
    };
    mapsRef.current.route({ origin, destination, callback });
  };
  const toggle = () => {
    setVisible(!visible);
    setterValue({ isPengirim: true });
    setterValue({ isPengirim: false });
    setIdOrder(null);
    setTalang('');
    setOngkir('');
    setDriver('');
    setDefaultDriver('');
    setTanggalOrder(dateFormat(new Date(), 'yyyy-MM-dd'));
    setWaktuOrder(dateFormat(new Date(), 'HH:mm'));
  };
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
  useImperativeHandle(ref, () => ({
    toggle,
    edit,
  }));

  const ListOrder = React.forwardRef(({}, ref) => {
    const orders = useSelector((s) => s.order);
    const drivers = useSelector((s) => s.driver);
    const dispatch = useDispatch();
    const [filteredOrders, setFilteredOrders] = useState(null);

    useEffect(() => {
      setFilteredOrders(orders);
    }, [orders]);

    const CardOrder = ({ order }) => {
      const [visible, setVisible] = useState(false);
      const cardRef = useRef();
      const openCardHandler = (e) => {
        setVisible(!visible);
        visible && cardRef.current?.scrollIntoView();
      };
      const whatsappHandler = (phone) => {
        window.open(`whatsapp://send?phone=${phone}`, '_top');
      };
      const driverOptions = drivers?.map((driver) => ({
        value: driver.id,
        label: driver.nama,
        obj: driver,
      }));

      const defaultValue = (idDriver) => {
        return driverOptions?.find((driver) => driver.value === idDriver);
      };

      const updateOrderHandler = ({ updatedOrder }) => {
        try {
          dispatch(updateOrder(updatedOrder, pengguna?.token));
          toast({ title: 'Update order berhasil', icon: 'success' });
        } catch (error) {
          console.error(error);
          toast({ title: 'Update order gagal', icon: 'error' });
        }
      };

      const editOrderHandler = (order) => {
        toggle();
        edit(order);
      };

      const removeOrderHandler = (order) => {
        try {
          confirm(() => {
            dispatch(removeOrder(order, pengguna?.token));
            toast({ title: 'Hapus orderan berhasil', icon: 'success' });
          });
        } catch (error) {
          toast({ title: 'Hapus orderan gagal', icon: 'error' });
        }
      };

      const kirimOrderHandler = (order) => {
        const updatedOrder = { ...order, driver: order.driver.id, status: 2 };
        updateOrderHandler({ updatedOrder });
      };

      return (
        <div
          className={`card-order ${
            visible && '!shadow-lg !shadow-green-400/20'
          } bg-gradient-green  text-slate-600 transition-all duration-150`}
        >
          <div
            onClick={openCardHandler}
            className='grid grid-cols-2 gap-5 items-center'
          >
            <div className='flex gap-5 items-center'>
              <div>
                <div className='font-black text-xl'>{order.waktuOrder}</div>
                <div className='text-[0.7rem] w-full'>
                  <div className='text-ellipsis truncate'>
                    {dateFormat(new Date(order.tanggalOrder))}
                  </div>
                </div>
              </div>
              <div className='font-bold flex flex-col gap-1'>
                <div className='flex gap-2 items-center w-full'>
                  <BiStoreAlt className='flex-shrink-0' />
                  <span className='block text-xs truncate text-ellipsis'>
                    {order.pengirim.nama}
                  </span>
                </div>
                <div className='flex gap-2 items-center w-full'>
                  <FaPeopleCarry className='flex-shrink-0' />
                  <span className='block text-xs truncate text-ellipsis'>
                    {order.penerima.nama}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex gap-3 items-center'>
              <div className='px-1'>
                <StatusBadge status={order.status} />
              </div>
              <div className='justify-self-end flex-shrink-0 flex-grow'>
                <div className='flex flex-col justify-end'>
                  <div className='flex justify-end w-full'>
                    <div className='capitalize font-black truncate text-ellipsis'>
                      {order.driver.nama}
                    </div>
                  </div>
                  <div className='flex justify-end gap-2'>
                    <div className='text-xs font-bold'>
                      Rp. {order.ongkir.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {visible && (
            <div className='mt-4' ref={cardRef}>
              <div className='grid sm:grid-cols-3 grid-cols-2 gap-2 text-xs mb-2'>
                <div className='capitalize'>
                  <div className='flex gap-2 items-center w-full font-black mb-3'>
                    <BiStoreAlt className='flex-shrink-0 text-lg' />
                    <span className='block text-xs truncate'>
                      {order.pengirim.nama}
                    </span>
                  </div>
                  <div className='flex gap-2 items-center mb-3'>
                    <BiPhoneCall className='flex-shrink-0 text-lg' />
                    <div
                      onClick={() => whatsappHandler(order.pengirim.noHP)}
                      className='truncate'
                    >
                      {order.pengirim.noHP}
                    </div>
                  </div>
                  <div className='flex gap-2 items-center mb-3'>
                    <BiMap className='flex-shrink-0 self-start text-lg' />
                    <div className='truncate-3'>{order.pengirim.alamat}</div>
                  </div>
                  <div className='flex gap-2 items-center mb-3 '>
                    <BiNotepad className='flex-shrink-0 self-start text-lg' />
                    <div className='truncate-3'>
                      {order.pengirim.keterangan}
                    </div>
                  </div>
                </div>
                <div className='capitalize'>
                  <div className='flex gap-2 items-center w-full font-black mb-3'>
                    <FaPeopleCarry className='flex-shrink-0 text-lg' />
                    <span className='block text-xs truncate'>
                      {order.penerima.nama}
                    </span>
                  </div>
                  <div className='flex gap-2 items-center mb-3'>
                    <BiPhoneCall className='flex-shrink-0 text-lg' />
                    <div
                      onClick={() => whatsappHandler(order.penerima.noHP)}
                      className='truncate'
                    >
                      {order.penerima.noHP}
                    </div>
                  </div>
                  <div className='flex gap-2 items-center mb-3'>
                    <BiMap className='flex-shrink-0 self-start text-lg' />
                    <div className='truncate-3'>{order.penerima.alamat}</div>
                  </div>
                  <div className='flex gap-2 items-center mb-3 '>
                    <BiNotepad className='flex-shrink-0 self-start text-lg' />
                    <div className='truncate-3'>
                      {order.penerima.keterangan}
                    </div>
                  </div>
                </div>
                <div className='sm:col-span-1 flex sm:flex-col flex-row col-span-2 capitalize'>
                  <div className='flex gap-2 w-full font-black mb-2'>
                    <BiCar className='flex-shrink-0 self-start text-lg' />
                    <span className='block text-xs flex-grow'>
                      <div className='mb-1'>Driver</div>
                      <div className='font-normal'>
                        <Select
                          className='w-full'
                          {...selectOptions}
                          options={driverOptions}
                          value={defaultValue(order.driver.id)}
                          onChange={(v) => {
                            const updatedOrder = { ...order, driver: v.value };
                            updateOrderHandler({ updatedOrder });
                          }}
                        />
                      </div>
                    </span>
                  </div>
                  <div className='flex gap-2 w-full font-black mb-2'>
                    <BiInfoCircle className='flex-shrink-0 self-start text-lg' />
                    <span className='block text-xs flex-grow'>
                      <div className='mb-1'>Talang</div>
                      <div className='font-normal py-1 flex gap-4 items-center rounded-md'>
                        <div>Rp.</div>
                        <input
                          type='text'
                          className='w-full outline-none bg-transparent'
                          defaultValue={localCurrency(order.talang)}
                          onBlur={(e) => {
                            const talang = currencyNumber(e.target.value);
                            const updatedOrder = {
                              ...order,
                              talang,
                              driver: order.driver.id,
                            };
                            if (talang !== order.talang)
                              updateOrderHandler({ updatedOrder });
                          }}
                          onInput={(e) => {
                            const value = e.target.value;
                            e.target.value = localCurrency(value);
                          }}
                        />
                      </div>
                    </span>
                  </div>
                  <div className='flex gap-2 w-full font-black mb-2'>
                    <BiDollarCircle className='flex-shrink-0 self-start text-lg' />
                    <span className='block text-xs flex-grow'>
                      <div className='mb-1'>Ongkir</div>
                      <div className='font-normal py-1 flex gap-4 items-center rounded-md'>
                        <div>Rp.</div>
                        <input
                          type='text'
                          className='w-full outline-none bg-transparent'
                          defaultValue={localCurrency(order.ongkir)}
                          onBlur={(e) => {
                            const ongkir = currencyNumber(e.target.value);
                            const updatedOrder = {
                              ...order,
                              ongkir,
                              driver: order.driver.id,
                            };
                            if (ongkir !== order.ongkir)
                              updateOrderHandler({ updatedOrder });
                          }}
                          onInput={(e) => {
                            const value = e.target.value;
                            e.target.value = localCurrency(value);
                          }}
                        />
                      </div>
                    </span>
                  </div>
                </div>
                <div className='sm:col-span-3 col-span-2 capitalize'>
                  <div className='order-last flex justify-end gap-2'>
                    <div className='group relative flex gap-1 items-center flex-col'>
                      <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                        Edit Orderan
                      </div>
                      <button
                        onClick={() => editOrderHandler(order)}
                        className='py-[0.4rem] px-2 flex justify-center items-center'
                      >
                        <BiEdit className='group-hover:drop-shadow-lg text-xl text-blue-800' />
                      </button>
                    </div>
                    {order.status === 1 && (
                      <div className='group relative flex gap-1 items-center flex-col'>
                        <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                          Kirim Orderan
                        </div>
                        <button className='py-[0.4rem] px-2 flex justify-center items-center'>
                          <BiSend
                            onClick={() => kirimOrderHandler(order)}
                            className='group-hover:drop-shadow-lg text-xl text-blue-800'
                          />
                        </button>
                      </div>
                    )}

                    <div className='group relative flex gap-1 items-center flex-col'>
                      <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                        Hapus Orderan
                      </div>
                      <button
                        onClick={() => removeOrderHandler(order)}
                        className='py-[0.4rem] px-2 flex justify-center items-center'
                      >
                        <BiTrash className='group-hover:drop-shadow-lg text-xl text-red-800' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='col-span-2'>
            <div className='bg-white rounded-md'>
              <div className='p-5'>
                <div>
                  <strong className={`header-form mb-4`}>Orderan</strong>
                  <div className='max-h-[44rem] pb-[5rem] overflow-y-auto'>
                    {filteredOrders &&
                      filteredOrders.map((order) => (
                        <CardOrder key={order.id} order={order} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Repudiandae, eius! Provident, neque cum? Dicta dolore perferendis
            nam beatae asperiores aspernatur possimus. Nisi iste consequuntur
            fugiat cum ullam ad distinctio debitis!
          </div>
        </div>
      </>
    );
  });

  ListOrder.displayName = 'List Order';

  return (
    <>
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
                      />
                    </div>
                    <div className='box-border'>
                      <span className='block text-sm'>Ongkir :</span>
                      <button
                        id='cek-ongkir-button'
                        type='button'
                        className={`${styles.btn} bg-green-200 border-green-200`}
                        onClick={cekOngkirHandler}
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
                        className={`${styles.btn} bg-blue-200 border-blue-200`}
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
      )}
      <ListOrder />
    </>
  );
});

Orders.displayName = 'Orders';
export default Orders;
