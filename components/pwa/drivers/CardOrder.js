import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dateFormat from '../../../lib/date';
import { confirm } from '../../../components/Sweetalert2';
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
import StatusBadge from '../../../components/StatusBadge';
import {
  getLinkStaticMap,
  directionLinkBuilder,
} from '../../../lib/getStaticMap';
import axios from 'axios';

const CardOrder = ({ order, token = null, open = false }) => {
  const [visibleCard, setVisibleCard] = useState(open);
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
    window.open(`whatsapp://send?phone=62${phone}`, '_top');
  };

  // fn / handler untuk mengupdate order yang digunakan di card order
  // fn harus diberikan args "updatedOrder" yang akan dikirim ke api order
  const updateOrderHandler = async ({ order, status }) => {
    try {
      const updatedOrder = { ...order, driver: order.driver.id, status };
      dispatch(updateOrder(updatedOrder, token ?? pengguna?.token));
      await axios.post('/api/pusher', { event: 'orders' });
    } catch (error) {
      console.error(error);
    }
  };

  const pickupOrderHandler = (order) => {
    updateOrderHandler({ order, status: 3 });
  };
  const finishOrderHandler = (order) => {
    confirm(async () => {
      updateOrderHandler({ order, status: 0 });
      await axios.post('/api/pusher', { event: 'orders-done', order });
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
            <div className='grid sm:grid-cols-3 grid-cols-1 gap-2 text-xs mb-2'>
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
                  <div className='whitespace-pre-wrap'>
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
                  <div className='whitespace-pre-wrap'>
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
                  <div className='whitespace-pre-wrap'>
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
                  <div className='whitespace-pre-wrap'>
                    {order.penerima.keterangan}
                  </div>
                </div>
              </div>
              {/* quickedit section */}
              <div className='sm:col-span-1 flex sm:flex-col flex-row col-span-2 capitalize text-center'>
                <div className='w-full font-black mb-2'>
                  <div className='mb-1'>Talang</div>
                  <div className='font-normal py-1 rounded-md'>
                    <span>Rp. {localCurrency(order.talang) ?? 0}</span>
                  </div>
                </div>
                <div className='w-full font-black mb-2'>
                  <div className='mb-1'>Ongkir</div>
                  <div className='font-normal py-1 rounded-md'>
                    <span>Rp. {localCurrency(order.ongkir) ?? 0}</span>
                  </div>
                </div>
                <div className='w-full font-black mb-2'>
                  <div className='mb-1'>Total</div>
                  <div className='font-normal py-1 rounded-md'>
                    <span>
                      Rp. {localCurrency(order.talang + order.ongkir) ?? 0}
                    </span>
                  </div>
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
                          Driver mengantarkan orderan
                        </div>
                        <button
                          onClick={() => pickupOrderHandler(order)}
                          className='py-[0.4rem] px-4 flex justify-center items-center gap-1 font-bold bg-green-800/90 rounded group-hover:drop-shadow-lg text-white tracking-wider'
                        >
                          <BiBox className='text-xl' />
                          <div>Pengantaran</div>
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
