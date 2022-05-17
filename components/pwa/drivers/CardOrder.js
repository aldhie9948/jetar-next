import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dateFormat from '../../../lib/date';
import { toast, confirm } from '../../../components/Sweetalert2';
import { currencyNumber, localCurrency } from '../../../lib/currency';
import {
  BiStoreAlt,
  BiPhoneCall,
  BiMap,
  BiNotepad,
  BiInfoCircle,
  BiCar,
  BiDollarCircle,
  BiImage,
} from 'react-icons/bi';
import { FaPeopleCarry } from 'react-icons/fa';
import Select from 'react-select';

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
      textBadge = 'pick up';
      break;

    default:
      break;
  }

  return (
    <div className={`sm:w-full w-24 text-xs rounded ${classBadge}`}>
      <div className='sm:px-5 px-0 py-1 text-center font-bold lowercase truncate-2'>
        {textBadge}
      </div>
    </div>
  );
};

const CardOrder = ({ order }) => {
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
    window.open(`whatsapp://send?phone=${phone}`, '_top');
  };

  // fn untuk membuat array baru dari driver redux
  // untuk diberikan ke react-select driver
  const driverOptions = drivers?.map((driver) => ({
    value: driver.id,
    label: driver.nama,
    obj: driver,
  }));

  // fn untuk mengatur default option react-select driver
  // di card order sesuai dengan id driver yang diberikan di args
  const defaultDriver = (idDriver) => {
    return driverOptions?.find((driver) => driver.value === idDriver);
  };

  return (
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
                      src={`/assets/image/map-orderan/${order.id}.png`}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardOrder;
