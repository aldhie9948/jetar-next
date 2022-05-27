import React, { useEffect, useMemo, useState } from 'react';
import CardOrder from './CardOrder';
import { FcBarChart, FcInTransit } from 'react-icons/fc';
import {
  BiSearchAlt,
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
  BiEdit,
  BiTrash,
} from 'react-icons/bi';
import { localCurrency } from '../../lib/currency';
import dateFormat from '../../lib/date';
import { useTable, usePagination } from 'react-table';

const sort = (a, b) => {
  const x = dateFormat(`${a.tanggalOrder} ${a.waktuOrder}`, 't');
  const y = dateFormat(`${b.tanggalOrder} ${b.waktuOrder}`, 't');
  return x > y ? -1 : x < y ? 1 : 0;
};

const TableOrders = ({ orders, pengguna, onEdit }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [keyword, setKeyword] = useState('');

  const ActionButton = ({ order }) => {
    const edit = () => {
      onEdit(order);
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    };

    return (
      <>
        <div className='mx-4 flex gap-4 justify-center'>
          <button onClick={edit}>
            <BiEdit className='text-blue-500' />
          </button>
          <button>
            <BiTrash className='text-red-800' />
          </button>
        </div>
      </>
    );
  };

  const columns = useMemo(() => {
    return [
      {
        Header: 'No',
        accessor: 'col1',
        Cell: ({ cell: { value } }) => (
          <>
            <div className='mx-auto w-max'>{value}</div>
          </>
        ),
      },
      {
        Header: 'Aksi',
        accessor: 'col2',
        Cell: ({ cell: { value } }) => <ActionButton order={value} />,
      },
      { Header: 'Tanggal', accessor: 'col3' },
      { Header: 'Waktu', accessor: 'col4' },
      { Header: 'Driver', accessor: 'col5' },
      {
        Header: 'Ongkir',
        accessor: 'col6',
        Cell: ({ cell: { value } }) => <>Rp. {localCurrency(value)}</>,
      },
      {
        Header: 'Talangan',
        accessor: 'col7',
        Cell: ({ cell: { value } }) => <>Rp. {localCurrency(value)}</>,
      },
      { Header: 'Pengirim', accessor: 'col8' },
      { Header: 'Alamat', accessor: 'col9' },
      { Header: 'Penerima', accessor: 'col10' },
      { Header: 'Alamat', accessor: 'col11' },
    ];
  }, []);

  const data = useMemo(() => {
    return filteredOrders.map((order, i) => ({
      col1: i + 1,
      col2: order,
      col3: order.tanggalOrder,
      col4: order.waktuOrder,
      col5: order.driver.nama,
      col6: order.ongkir,
      col7: order.talang,
      col8: order.pengirim.nama,
      col9: order.pengirim.alamat,
      col10: order.penerima.nama,
      col11: order.penerima.alamat,
    }));
  }, [filteredOrders]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  useEffect(() => {
    const data = orders.filter((f) => {
      const driver = f.driver.nama.toLowerCase().includes(keyword);
      const pengirim = f.pengirim.nama.toLowerCase().includes(keyword);
      const penerima = f.penerima.nama.toLowerCase().includes(keyword);
      const tanggalOrder = f.tanggalOrder.toLowerCase().includes(keyword);
      return driver || pengirim || penerima || tanggalOrder ? true : false;
    });
    const sorted = data.sort(sort);
    setFilteredOrders(keyword === '' ? [...orders].sort(sort) : sorted);

    // eslint-disable-next-line
  }, [keyword]);

  const initialState = {
    pageSize: 10,
    pageIndex: 0,
  };

  const tableInstance = useTable(
    { columns, data, initialState },
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  return (
    <div className='mx-5'>
      <strong className={`header-form`}>Tabel Orderan</strong>
      <div className='bg-gradient-blue rounded shadow-lg p-4'>
        <div className='flex justify-between mb-2'>
          <div className='border-b-2 border-slate-500 flex gap-2 items-center'>
            <BiSearchAlt />
            <input
              type='search'
              className='bg-transparent placeholder:text-xs placeholder:italic outline-none w-full'
              placeholder='cari driver, pengirim, penerima...'
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className='bg-slate-200 p-1 rounded shadow outline-none'
          >
            {[10, 20, 30, 40, filteredOrders.length].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className='overflow-x-scroll pb-2'>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                // eslint-disable-next-line
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // eslint-disable-next-line
                    <th
                      className='border border-slate-900 bg-slate-500 text-slate-200 py-1 px-2'
                      {...column.getHeaderProps()}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, i) => (
                      // eslint-disable-next-line
                      <td
                        className={`${
                          [0, 1].includes(i) || 'pl-2 pr-10'
                        } whitespace-nowrap py-1 text-sm border border-slate-500`}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='pagination flex justify-between mt-4 items-center'>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <div className='flex gap-4 items-center'>
            <button
              className='block'
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <BiChevronsLeft className='text-2xl' />
            </button>
            <button
              className='block'
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <BiChevronLeft className='text-2xl' />
            </button>
            <button
              className='block'
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <BiChevronRight className='text-2xl' />
            </button>
            <button
              className='block'
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <BiChevronsRight className='text-2xl' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = ({ onEdit, orders, drivers, pengguna }) => {
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [finishedOrders, setFinishedOrders] = useState([]);
  useEffect(() => {
    setOngoingOrders(orders.filter((f) => f.status !== 0));
    setTodayOrders(
      orders.filter(
        (f) => f.tanggalOrder === dateFormat(new Date(), 'yyyy-MM-dd')
      )
    );
    setFinishedOrders(orders.filter((f) => f.status === 0));
  }, [orders]);

  return (
    <div className='mb-10'>
      <div className='grid grid-cols-1 sm:grid-cols-3 mb-5'>
        <div className='col-span-2'>
          <div className='flex justify-between px-5 mb-2 items-center'>
            <strong className={`header-form`}>Orderan</strong>
            <div></div>
          </div>
          <div className='overflow-x-hidden max-h-[40rem] mb-4 overflow-y-auto px-5'>
            {ongoingOrders
              .filter((f) => f.status !== 0)
              .map((order) => (
                <div key={order.id}>
                  <CardOrder order={order} onEdit={onEdit} />
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
                    <span className='font-black text-lg'>
                      Rp.{' '}
                      {localCurrency(
                        todayOrders
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
                        todayOrders.filter((f) => f.status === 0).length
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mb-4'>
            <strong className={`header-form mb-4`}>
              {dateFormat(new Date(), 'dd MMMM yyyy')}
            </strong>
            <div className='rounded-md shadow-lg bg-gradient-to-br from-blue-100 to-blue-200'>
              <div className='p-4'>
                <div className='flex justify-between text-sm font-bold'>
                  <div className='mb-1 w-5/12'>Driver</div>
                  <div className='mb-1 w-2/12 text-center'>
                    <span> </span>
                  </div>
                  <div className='mb-1 w-5/12 sm:pl-2 pl-16'>Ongkir</div>
                </div>
                <div className='w-full border-b-2 border-slate-500 my-1'></div>

                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className='flex justify-between text-sm font-bold'
                  >
                    <div className='mb-1 w-5/12'>{driver.nama}</div>
                    <div className='mb-1 w-2/12 text-center'>
                      {
                        todayOrders
                          .filter((f) => f.driver.id === driver.id)
                          .filter((f) => f.status === 0).length
                      }
                    </div>
                    <div className='mb-1 w-5/12 sm:pl-2 pl-16'>
                      Rp.{' '}
                      {localCurrency(
                        todayOrders
                          .filter((f) => f.driver.id === driver.id)
                          .filter((f) => f.status === 0)
                          .reduce((a, b) => a + b.ongkir, 0)
                      )}
                    </div>
                  </div>
                ))}
                <div className='w-full border-b-2 border-slate-500 my-1'></div>
                <div className='flex justify-between text-sm font-bold'>
                  <div className='mb-1 w-5/12'>Total</div>
                  <div className='mb-1 w-2/12 text-center'>
                    {todayOrders.filter((f) => f.status === 0).length}
                  </div>
                  <div className='mb-1 w-5/12 sm:pl-2 pl-16'>
                    Rp.{' '}
                    {localCurrency(
                      todayOrders
                        .filter((f) => f.status === 0)
                        .reduce((a, b) => a + b.ongkir, 0)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TableOrders orders={orders} pengguna={pengguna} onEdit={onEdit} />
    </div>
  );
};

export default Orders;
