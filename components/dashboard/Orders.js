import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from 'react-icons/bs';
import CardOrder from './CardOrder';
import { FcBarChart, FcInTransit } from 'react-icons/fc';
import { localCurrency } from '../../lib/currency';

const Orders = ({ onEdit, orders }) => {
  const orderByStatus = ({ status }) =>
    orders.filter((f) => f.status === status);

  const getPersenOrder = ({ status = 0 }) => {
    const filteredOrders = orderByStatus({ status });
    if (filteredOrders.length > 0) {
      const percentage = (filteredOrders.length / orders.length) * 100;
      return { width: `${percentage}%` };
    }
    return { width: '0%' };
  };

  const PaginatedItems = ({ itemsPerPage, items }) => {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
      setCurrentItems(items);
    }, [items]);

    useEffect(() => {
      // Fetch items from another resources.
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
      // eslint-disable-next-line
    }, [itemOffset, itemsPerPage, items]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % items.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };

    const NextButton = () => {
      return (
        <>
          <div className='m-1 p-2'>
            <BsArrowRightCircleFill className='text-xl' />
          </div>
        </>
      );
    };
    const PrevButton = () => {
      return (
        <>
          <div className='m-1 p-2'>
            <BsArrowLeftCircleFill className='text-xl' />
          </div>
        </>
      );
    };

    return (
      <>
        <div className='overflow-x-hidden overflow-y-auto mb-4'>
          {currentItems
            .filter((f) => f.status === 0)
            .map((order) => (
              <div key={order.id}>
                <CardOrder order={order} onEdit={onEdit} isFinished={true} />
              </div>
            ))}
        </div>
        <ReactPaginate
          breakLabel='...'
          nextLabel={<NextButton />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel={<PrevButton />}
          renderOnZeroPageCount={null}
          containerClassName='flex justify-center gap-2'
          activeClassName='font-black p-2 shadow bg-blue-100 m-1'
          pageClassName='font-black p-2 m-1'
        />
      </>
    );
  };

  const OrderFinished = ({ orders }) => {
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [filteredOrders, setfilteredOrders] = useState(orders);
    const [keyword, setKeyword] = useState('');

    const keywordHandler = (e) => {
      const value = e.target.value;
      setKeyword(value);
    };

    useEffect(() => {
      const data = orders.filter((order) => {
        const driver = order.driver.nama
          .toString()
          .toLowerCase()
          .includes(keyword);
        const pengirim = order.pengirim.nama
          .toString()
          .toLowerCase()
          .includes(keyword);
        const penerima = order.penerima.nama
          .toString()
          .toLowerCase()
          .includes(keyword);
        if (driver || pengirim || penerima) return true;
        return false;
      });
      setfilteredOrders(keyword === '' ? orders : data);
      // eslint-disable-next-line
    }, [keyword]);

    return (
      <>
        <div className='flex justify-between mb-2 items-center'>
          <strong className={`header-form px-5 sm:self-end self-center`}>
            Selesai
          </strong>
          <div className='flex justify-end flex-col items-end mx-5 flex-wrap'>
            <div className='mb-2 space-x-2'>
              <span className='text-sm'>Tampilkan</span>
              <select
                className='p-1 shadow-lg outline-none rounded text-sm'
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
              >
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
                <option value='200'>200</option>
                <option value={orders.length}>Semua</option>
              </select>
            </div>
            <div className='space-x-2 flex items-center'>
              <span className='text-sm'>Cari</span>
              <input
                value={keyword}
                onChange={keywordHandler}
                type='search'
                className='outline-none rounded py-1 px-2 focus:shadow-lg placeholder:text-xs w-full'
                placeholder='cari pengirim, penerima atau driver...'
              />
            </div>
          </div>
        </div>
        <div className='overflow-x-hidden pb-[5rem] overflow-y-auto px-5'>
          <PaginatedItems itemsPerPage={itemsPerPage} items={filteredOrders} />
        </div>
      </>
    );
  };

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-3 mb-5'>
        <div className='col-span-2'>
          <strong className={`header-form mb-4 px-5`}>Orderan</strong>
          <div className='overflow-x-hidden max-h-[30rem] mb-4 overflow-y-auto px-5'>
            {orders
              .filter((f) => f.status !== 0)
              .map((order) => (
                <div key={order.id}>
                  <CardOrder order={order} onEdit={onEdit} />
                </div>
              ))}
          </div>
          <OrderFinished orders={orders.filter((f) => f.status === 0)} />
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
                    <span className='font-black text-lg'>
                      Rp.{' '}
                      {localCurrency(
                        orders
                          .filter((f) => f.status === 0)
                          .reduce((a, b) => a + b.ongkir, 0)
                      )}
                    </span>
                  </div>
                  <div className='text-center'>
                    <span className='text-sm font-black'>Order</span>
                    <FcInTransit className='text-[4rem] mx-auto' />
                    <span className='font-black text-lg'>
                      {localCurrency(
                        orders.filter((f) => f.status === 0).length
                      )}
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
