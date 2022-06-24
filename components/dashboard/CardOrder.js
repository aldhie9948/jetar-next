import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dateFormat from '../../lib/date';
import { confirm } from '../Sweetalert2';
import { currencyNumber, localCurrency } from '../../lib/currency';
import { removeOrder } from '../../reducers/orderReducer';
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
  BiShareAlt,
  BiImage,
  BiCheckDouble,
  BiReset,
} from 'react-icons/bi';
import { FaPeopleCarry } from 'react-icons/fa';
import Select from 'react-select';
import StatusBadge from '../StatusBadge';
import { getLinkStaticMap, directionLinkBuilder } from '../../lib/getStaticMap';
import { verifyUser } from '../Sweetalert2';
import axios from 'axios';
import { sendNotification } from '../../services/notification';

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
    menu: (base) => ({ ...base, textTransform: 'capitalize' }),
  },
};
const CardOrder = ({ order, onEdit, isFinished = false }) => {
  const [visibleCard, setVisibleCard] = useState(false);
  const [visibleMaps, setvisibleMaps] = useState(false);
  const pengguna = useSelector((s) => s.pengguna);
  const drivers = useSelector((s) => s.driver);
  const dispatch = useDispatch();

  // fn untuk membuka dan menutup card orders
  const openCardHandler = (e) => {
    setVisibleCard(!visibleCard);
  };

  // fn untuk membuka / memulai chat whatsapp dengan
  // nomor yang diberikan dei argument
  const whatsappHandler = (phone) => {
    window.open(`whatsapp://send?phone=62${phone}`, '_top');
  };

  // fn untuk membuat array baru dari driver redux
  // untuk diberikan ke react-select driver
  const driverOptions = drivers.map((driver) => ({
    value: driver.id,
    label: driver.nama,
    obj: driver,
  }));

  // fn untuk mengatur default option react-select driver
  // di card order sesuai dengan id driver yang diberikan di args
  const defaultDriver = (idDriver) => {
    return driverOptions?.find((driver) => driver.value === idDriver);
  };

  // fn / handler untuk mengupdate order yang digunakan di card order
  // fn harus diberikan args "updatedOrder" yang akan dikirim ke api order
  const updateOrderHandler = async ({ order, status }) => {
    try {
      const updatedOrder = { ...order, status };
      dispatch(updateOrder(updatedOrder, pengguna.token));
      await axios.post('/api/pusher', { event: 'orders' });
    } catch (error) {
      console.error(error);
    }
  };

  // fn untuk mengahapus order
  // fn harus memberikan args order sesuai dengan model Order
  const removeOrderHandler = (order) => {
    try {
      verifyUser(async () => {
        dispatch(removeOrder(order, pengguna.token));
        await axios.post('/api/pusher', { event: 'orders' });
      });
    } catch (error) {
      console.error(location.pathname, error);
    }
  };

  // fn untuk mengganti order ke driver
  // atau mengubah status order ke "2" / "jemput oleh driver"
  const kirimOrderHandler = async (order) => {
    updateOrderHandler({
      order: { ...order, driver: order.driver.id },
      status: 2,
    });
    await sendNotification({
      idPengguna: order.driver.pengguna,
      token: pengguna.token,
      title: 'Orderan Baru',
      body: `Pengambilan di ${order.pengirim.nama.toUpperCase()} dan dikirim ke ${order.penerima.nama.toUpperCase()}`,
    });
  };

  const orderSelesaiHandler = (order) =>
    confirm(async () => {
      updateOrderHandler({
        order: { ...order, driver: order.driver.id },
        status: 0,
      });
      await axios.post('/api/pusher', { event: 'orders-done', order });
    });

  const share = (order) => {
    const params = new URLSearchParams({
      id: order.id,
      token: pengguna.token,
    });
    const link = `${location.origin}/orders?${params.toString()}`;
    const content = `
*Pengirim*
Nama: *${order.pengirim.nama}*
No. HP: *https://wa.me/62${order.pengirim.noHP}*
Alamat: *${order.pengirim.alamat}*
*Keterangan*: ${order.pengirim.keterangan}
*Maps*:${directionLinkBuilder(order.pengirim.alamat)}

*Penerima*
Nama: *${order.penerima.nama}*
No. HP: *https://wa.me/62${order.penerima.noHP}*
Alamat: *${order.penerima.alamat}*
*Keterangan*: ${order.penerima.keterangan}
*Maps*: ${directionLinkBuilder(order.penerima.alamat)}

*Biaya*
Talangan: *Rp. ${localCurrency(order.talang)}*
Ongkir: *Rp. ${localCurrency(order.ongkir)}*
Total: *Rp. ${localCurrency(order.talang + order.ongkir)}*

Klik link di bawah untuk melihat detail orderan
${link}
*Generated by JETAR App*`.trim();

    window.open(
      `whatsapp://send?phone=62${order.driver.noHP}&text=${encodeURIComponent(
        content
      )}`,
      '_top'
    );
  };

  const resetStatusHandler = (order) => {
    updateOrderHandler({
      order: { ...order, driver: order.driver.id },
      status: 1,
    });
    return;
  };

  return (
    <div
      className={`card-order !shadow-lg bg-gradient-green  text-slate-600 transition-all duration-150 overflow-x-hidden`}
    >
      <div
        onClick={openCardHandler}
        className='grid grid-cols-1 sm:grid-cols-2 sm:gap-5 gap-2 items-center'
      >
        {/* section header kiri */}
        <div className='flex gap-5 items-center'>
          <div>
            <div className='font-black text-xl'>{order.waktuOrder}</div>
            <div className='text-[0.7rem] w-full'>
              <div className='truncate'>
                {dateFormat(new Date(order.tanggalOrder))}
              </div>
            </div>
          </div>
          <div className='font-bold flex flex-col gap-1'>
            <div className='flex gap-2 items-center w-full'>
              <BiStoreAlt className='flex-shrink-0' />
              <span className='block text-xs truncate w-full'>
                {order.pengirim.nama}
              </span>
            </div>
            <div className='flex gap-2 items-center w-full'>
              <FaPeopleCarry className='flex-shrink-0' />
              <span className='block text-xs truncate w-full'>
                {order.penerima.nama}
              </span>
            </div>
          </div>
        </div>
        {/* section header kanan */}
        <div className='flex gap-3 items-center sm:mb-0 mb-2'>
          <div className='px-1'>
            <StatusBadge status={order.status} />
          </div>
          <div className='flex-grow'>
            <div className='flex flex-col items-end justify-end w-full'>
              <div className='capitalize font-black truncate w-full text-right'>
                {order.driver.nama}
              </div>
              <div className='text-xs font-bold'>
                Rp. {order.ongkir.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {visibleCard && (
        <div className='mt-4'>
          <div className='grid sm:grid-cols-2 grid-cols-1 gap-2 text-xs mb-2'>
            <div className='flex gap-2 sm:flex-nowrap flex-wrap col-span-2 items-center'>
              {/* quickedit section */}
              <div className='flex capitalize w-max'>
                <div className='flex gap-2 w-full font-black mb-2'>
                  <BiCar className='flex-shrink-0 self-start text-lg' />
                  <span className='block text-xs flex-grow'>
                    <div className='mb-1'>Driver</div>
                    <div className='font-normal'>
                      <Select
                        className='w-full'
                        isDisabled={isFinished}
                        {...selectOptions}
                        options={driverOptions}
                        value={defaultDriver(order.driver.id)}
                        // ganti driver dan update order
                        onChange={async (v) => {
                          const updatedOrder = {
                            ...order,
                            driver: v.value,
                          };
                          updateOrderHandler({
                            order: updatedOrder,
                            status: order.status,
                          });
                          if (![0, 1].includes(order.status)) {
                            await sendNotification({
                              idPengguna: order.driver.pengguna,
                              token: pengguna.token,
                              title: 'Orderan Baru',
                              body: `Pengambilan di ${order.pengirim.nama.toUpperCase()} dan dikirim ke ${order.penerima.nama.toUpperCase()}`,
                            });
                          }
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
                        disabled={isFinished}
                        type='text'
                        className='w-full outline-none bg-transparent'
                        defaultValue={localCurrency(order.talang)}
                        // ganti uang talangan dan update order
                        // jika uang talangan sama atau tidak berubah
                        // maka order tidak akan diupdate
                        onBlur={(e) => {
                          const talang = currencyNumber(e.target.value);
                          const updatedOrder = {
                            ...order,
                            talang,
                            driver: order.driver.id,
                          };
                          if (talang !== order.talang)
                            updateOrderHandler({
                              order: updatedOrder,
                              status: updatedOrder.status,
                            });
                        }}
                        // saat user penginputan, form hanya akan
                        // menconvert / mengubah ke format currency
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
                        disabled={isFinished}
                        type='text'
                        className='w-full outline-none bg-transparent'
                        defaultValue={localCurrency(order.ongkir)}
                        // ganti uang ongkir dan update order
                        // jika uang ongkir sama atau tidak berubah
                        // maka order tidak akan diupdate
                        onBlur={(e) => {
                          const ongkir = currencyNumber(e.target.value);
                          const updatedOrder = {
                            ...order,
                            ongkir,
                            driver: order.driver.id,
                          };
                          if (ongkir !== order.ongkir)
                            updateOrderHandler({
                              order: updatedOrder,
                              status: updatedOrder.status,
                            });
                        }}
                        // saat user penginputan, form hanya akan
                        // menconvert / mengubah ke format currency
                        onInput={(e) => {
                          const value = e.target.value;
                          e.target.value = localCurrency(value);
                        }}
                      />
                    </div>
                  </span>
                </div>
              </div>
              {/* button section */}
              <div className='capitalize flex sm:justify-end justify-evenly sm:w-max w-full'>
                {order.status !== 1 && (
                  <>
                    <div className='group relative flex gap-1 items-center flex-col'>
                      <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                        Share
                      </div>
                      <button
                        onClick={() => share(order)}
                        className='py-[0.4rem] px-2 flex justify-center items-center'
                      >
                        <BiShareAlt className='group-hover:drop-shadow-lg text-xl text-blue-800' />
                      </button>
                    </div>
                    <div className='group relative flex gap-1 items-center flex-col'>
                      <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                        Reset Status Order
                      </div>
                      <button
                        onClick={() => resetStatusHandler(order)}
                        className='py-[0.4rem] px-2 flex justify-center items-center'
                      >
                        <BiReset className='group-hover:drop-shadow-lg text-xl text-blue-800' />
                      </button>
                    </div>
                  </>
                )}
                <div className='group relative flex gap-1 items-center flex-col'>
                  <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                    Maps Orderan
                  </div>
                  <button
                    onClick={() => setvisibleMaps(!visibleMaps)}
                    className='py-[0.4rem] px-2 flex justify-center items-center'
                  >
                    <BiImage className='group-hover:drop-shadow-lg text-xl text-blue-800' />
                  </button>
                </div>
                {(order.status !== 0 || pengguna.username === 'aldi') && (
                  <div className='group relative flex gap-1 items-center flex-col'>
                    <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                      Edit Orderan
                    </div>
                    <button
                      onClick={() => {
                        window.scroll({
                          top: 0,
                          left: 0,
                          behavior: 'smooth',
                        });
                        onEdit(order);
                      }}
                      className='py-[0.4rem] px-2 flex justify-center items-center'
                    >
                      <BiEdit className='group-hover:drop-shadow-lg text-xl text-blue-800' />
                    </button>
                  </div>
                )}
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

                {[0, 1].includes(order.status) || (
                  <div className='group relative flex gap-1 items-center flex-col'>
                    <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                      Order Selesai
                    </div>
                    <button className='py-[0.4rem] px-2 flex justify-center items-center'>
                      <BiCheckDouble
                        onClick={() => orderSelesaiHandler(order)}
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
            {/* pengirim section */}
            <div className='capitalize sm:col-span-1 col-span-3'>
              <div className='text-center text-lg uppercase font-black sm:hidden block'>
                Pengirim
              </div>
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
                <div className='break-all'>
                  <a
                    href={directionLinkBuilder(order.pengirim.alamat)}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {order.pengirim.alamat}
                  </a>
                </div>
              </div>
              <div className='flex gap-2 items-center mb-3 lowercase'>
                <BiNotepad className='flex-shrink-0 self-start text-lg' />
                <div className='break-all whitespace-pre-wrap'>
                  {order.pengirim.keterangan}
                </div>
              </div>
            </div>
            {/* penerima section */}
            <div className='capitalize sm:col-span-1 col-span-3'>
              <div className='text-center text-lg uppercase font-black sm:hidden block'>
                Penerima
              </div>
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
                <div className='break-all'>
                  <a
                    href={directionLinkBuilder(order.penerima.alamat)}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {order.penerima.alamat}
                  </a>
                </div>
              </div>
              <div className='flex gap-2 items-center mb-3 lowercase'>
                <BiNotepad className='flex-shrink-0 self-start text-lg' />
                <div className='break-all whitespace-pre-wrap'>
                  {order.penerima.keterangan}
                </div>
              </div>
            </div>
            {/* maps */}
            <div className='capitalize col-span-2'>
              {visibleMaps && (
                <>
                  <div className='relative w-full'>
                    {/* eslint-disable */}
                    <img
                      src={getLinkStaticMap({
                        origin: order.pengirim.alamat,
                        destination: order.penerima.alamat,
                      })}
                      alt={order.id}
                      className='rounded-lg border-2 border-white shadow-lg'
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardOrder;
