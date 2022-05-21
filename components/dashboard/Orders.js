import React, { useEffect, useState } from 'react';
import CardOrder from './CardOrder';
import { FcBarChart, FcInTransit } from 'react-icons/fc';
import { localCurrency } from '../../lib/currency';

const Orders = ({ onEdit, orders }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);

  // hooks akan ketrigger untuk mengupdate FilteredOrders
  // saat orders redux berubah
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const orderByStatus = ({ status }) =>
    orders.filter((f) => f.status === status);

  const getPersenOrder = ({ status = 0 }) => {
    const orders = orderByStatus({ status });
    if (orders.length > 0) {
      const percentage = (orders.length / orders.length) * 100;
      return { width: `${percentage}%` };
    }
    return { width: '0%' };
  };

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-3 mb-5'>
        <div className='col-span-2'>
          <strong className={`header-form mb-4 px-5`}>Orderan</strong>
          <div className='overflow-x-hidden pb-[5rem] overflow-y-auto px-5'>
            {filteredOrders.map((order) => (
              <div key={order.id}>
                {order.status !== 0 && (
                  <CardOrder order={order} onEdit={onEdit} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className='mx-5'>
          {/* statistik section */}
          <div className='mb-4'>
            <strong className={`header-form mb-4`}>Statistik</strong>
            <div className='rounded-md shadow-lg bg-gradient-to-br from-blue-100 to-blue-200'>
              <div className='p-4'>
                <div className='grid grid-cols-2 gap-2 place-items-center'>
                  <div className='text-center'>
                    <span className='font-black text-sm'>Pendapatan</span>
                    <FcBarChart className='text-[4rem] mx-auto' />
                    <span className='font-black text-xl'>
                      Rp.{' '}
                      {localCurrency(orders.reduce((a, b) => a + b.ongkir, 0))}
                    </span>
                  </div>
                  <div className='text-center'>
                    <span className='text-sm font-black'>Order</span>
                    <FcInTransit className='text-[4rem] mx-auto' />
                    <span className='font-black text-xl'>
                      {localCurrency(orders.length)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ststus section */}
          <div className='mb-4'>
            <strong className={`header-form mb-4`}>Status</strong>
            <div className='rounded-md shadow-lg bg-gradient-to-br from-blue-100 to-blue-200'>
              <div className='p-4'>
                {/* progress bar masuk */}
                <div className='mb-2'>
                  <div className='mb-1 text-xs w-max mx-auto font-medium dark:text-white'>
                    Masuk
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-max'>
                    <div
                      className='bg-gradient-to-r from-red-400 to-red-600 h-max rounded-full'
                      style={getPersenOrder({ status: 1 })}
                    >
                      <div className='mx-auto w-max py-0.5 text-xs text-gray-200 font-medium'>
                        {orderByStatus({ status: 1 }).length}
                      </div>
                    </div>
                  </div>
                </div>
                {/* progress bar pickup */}
                <div className='mb-2'>
                  <div className='mb-1 text-xs w-max mx-auto font-medium dark:text-white'>
                    Pickup
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-max'>
                    <div
                      className='bg-gradient-to-r from-blue-400 to-blue-600 h-max rounded-full'
                      style={getPersenOrder({ status: 2 })}
                    >
                      <div className='mx-auto w-max py-0.5 text-xs text-gray-200 font-medium'>
                        {orderByStatus({ status: 2 }).length}
                      </div>
                    </div>
                  </div>
                </div>
                {/* progress bar pengantraran */}
                <div className='mb-2'>
                  <div className='mb-1 text-xs w-max mx-auto font-medium dark:text-white'>
                    Pengantaran
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-max'>
                    <div
                      className='bg-gradient-to-r from-green-400 to-green-600 h-max rounded-full'
                      style={getPersenOrder({ status: 3 })}
                    >
                      <div className='mx-auto w-max py-0.5 text-xs text-gray-200 font-medium'>
                        {orderByStatus({ status: 3 }).length}
                      </div>
                    </div>
                  </div>
                </div>
                {/* progress bar selesai */}
                <div className='mb-2'>
                  <div className='mb-1 text-xs w-max mx-auto font-medium dark:text-white'>
                    Selesai
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-max'>
                    <div
                      className='bg-gradient-to-r from-slate-400 to-slate-600 h-max rounded-full'
                      style={getPersenOrder({ status: 0 })}
                    >
                      <div className='mx-auto w-max py-0.5 text-xs text-gray-200 font-medium'>
                        {orderByStatus({ status: 0 }).length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
