import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dateFormat from '../../../lib/date';
import { toast, confirm } from '../../../components/Sweetalert2';
import { localCurrency } from '../../../lib/currency';
import {
  BiStoreAlt,
  BiPhoneCall,
  BiMap,
  BiNotepad,
  BiInfoCircle,
  BiCar,
  BiDollarCircle,
  BiImage,
  BiBox,
  BiCheckDouble,
} from 'react-icons/bi';
import { FaPeopleCarry } from 'react-icons/fa';
import { updateOrder } from '../../../reducers/orderReducer';
import subscriptionService from '../../../services/subscription';
import StatusBadge from '../../../components/StatusBadge';
import { getLinkStaticMap } from '../../../lib/getStaticMap';

const CardOrder = ({ order }) => {
  const [visibleCard, setVisibleCard] = useState(false);
  const [visibleMaps, setvisibleMaps] = useState(false);
  const pengguna = useSelector((s) => s.pengguna);
  const dispatch = useDispatch();

  // fn untuk membuka dan menutup card orders
  const openCardHandler = (e) => {
    setVisibleCard(!visibleCard);
    !visibleCard &&
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
      });
  };
  // fn untuk membuka / memulai chat whatsapp dengan
  // nomor yang diberikan dei argument
  const whatsappHandler = (phone) => {
    window.open(`whatsapp://send?phone=${phone}`, '_top');
  };

  // fn / handler untuk mengupdate order yang digunakan di card order
  // fn harus diberikan args "updatedOrder" yang akan dikirim ke api order
  const updateOrderHandler = ({ updatedOrder }) => {
    try {
      dispatch(updateOrder(updatedOrder, pengguna?.token));
      toast({ title: 'Update order berhasil', icon: 'success' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Update order gagal', icon: 'error' });
    }
  };

  const pickupOrderHandler = (order) => {
    const updatedOrder = { ...order, driver: order.driver.id, status: 3 };
    updateOrderHandler({ updatedOrder });
    const data = {
      title: `Orderan Driver ${order.driver.nama.toUpperCase()}`,
      body: `Barang Tn./Ny. ${order.pengirim.nama} telah diambil dan akan diantarkan ke Tn./Ny. ${order.penerima.nama}`,
      target: 'admin',
    };
    subscriptionService.broadcast(data, pengguna.token);
  };
  const finishOrderHandler = (order) => {
    confirm(() => {
      const updatedOrder = { ...order, driver: order.driver.id, status: 0 };
      updateOrderHandler({ updatedOrder });
      const data = {
        title: `Orderan Driver ${order.driver.nama.toUpperCase()}`,
        body: `Barang Tn./Ny. ${order.pengirim.nama} telah diantarkan ke Tn./Ny. ${order.penerima.nama}`,
        target: 'admin',
      };
      subscriptionService.broadcast(data, pengguna.token);
    });
  };

  return (
    <>
      <div
        className={`card-order !mx-5 !shadow-lg bg-gradient-green  text-slate-600 transition-all duration-150 overflow-x-hidden`}
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
                  {console.log(order.tanggalOrder)}
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
            <div className='grid sm:grid-cols-3 grid-cols-2 gap-2 text-xs mb-2'>
              {/* pengirim section */}
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
                <div className='flex gap-2 items-center mb-3 lowercase'>
                  <BiNotepad className='flex-shrink-0 self-start text-lg' />
                  <div className='truncate-3'>{order.pengirim.keterangan}</div>
                </div>
              </div>
              {/* penerima section */}
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
                <div className='flex gap-2 items-center mb-3 lowercase'>
                  <BiNotepad className='flex-shrink-0 self-start text-lg' />
                  <div className='truncate-3'>{order.penerima.keterangan}</div>
                </div>
              </div>
              {/* quickedit section */}
              <div className='sm:col-span-1 flex sm:flex-col flex-row col-span-2 capitalize'>
                <div className='flex gap-2 w-full font-black mb-2'>
                  <BiCar className='flex-shrink-0 self-start text-lg' />
                  <span className='block text-xs flex-grow'>
                    <div className='mb-1'>Driver</div>
                    <div className='font-normal truncate sm:w-full w-20'>
                      {order.driver.nama}
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
                        readOnly
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
                        readOnly
                      />
                    </div>
                  </span>
                </div>
              </div>
              <div className='sm:col-span-3 col-span-2 capitalize'>
                {visibleMaps && (
                  <>
                    <div className='relative w-full'>
                      {/* eslint-disable-next-line */}
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
              {/* button section */}
              <div className='sm:col-span-3 col-span-2 capitalize'>
                <div className='order-last flex justify-end gap-2'>
                  {/* button maps */}
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
                  {/* button delivery */}
                  {order.status === 2 && (
                    <>
                      <div className='group relative flex gap-1 items-center flex-col'>
                        <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                          Driver pickup orderan
                        </div>
                        <button
                          onClick={() => pickupOrderHandler(order)}
                          className='py-[0.4rem] px-4 flex justify-center items-center gap-1 font-bold bg-blue-800/90 rounded group-hover:drop-shadow-lg text-white tracking-wider'
                        >
                          <BiBox className='text-xl' />
                          <div>Pickup</div>
                        </button>
                      </div>
                    </>
                  )}
                  {/* button selesai order */}
                  {order.status === 3 && (
                    <>
                      <div className='group relative flex gap-1 items-center flex-col'>
                        <div className='group-hover:scale-100 scale-0 transition-all duration-150 absolute right-0 top-[-2rem] whitespace-nowrap z-[9999] py-1 px-2 bg-slate-800 rounded text-white'>
                          Orderan selesai
                        </div>
                        <button
                          onClick={() => finishOrderHandler(order)}
                          className='py-[0.4rem] px-4 flex justify-center items-center gap-1 font-bold bg-red-800/90 rounded group-hover:drop-shadow-lg text-white tracking-wider'
                        >
                          <BiCheckDouble className='text-xl' />
                          <div>Selesai</div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CardOrder;
