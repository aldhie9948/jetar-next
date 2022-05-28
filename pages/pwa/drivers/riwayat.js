import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../../components/pwa/drivers/Layout';
import CardOrder from '../../../components/pwa/drivers/CardOrder';
import ReactPaginate from 'react-paginate';
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from 'react-icons/bs';
import dateFormat from '../../../lib/date';
import verifyLogin from '../../../lib/verifyLogin';
import { initPengguna } from '../../../reducers/penggunaReducer';
import { initOrdersByDriver } from '../../../reducers/orderReducer';
import { initDriver } from '../../../reducers/driverReducer';
import orderService from '../../../services/order';

const Riwayat = () => {
  const orders = useSelector((s) => s.order.filter((f) => f.status === 0));
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [itemsCount, setItemsCount] = useState(5);
  const [startDate, setStartDate] = useState(
    dateFormat(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(dateFormat(new Date(), 'yyyy-MM-dd'));

  const dispatch = useDispatch();

  useEffect(() => {
    const callback = (user) => {
      const { id, token } = user;
      dispatch(initPengguna(user));
      dispatch(initOrdersByDriver({ id, date: 'all' }, token));
      dispatch(initDriver(id, token));
      orderService.findByIdPengguna({ id }, token).then((res) => {
        setFilteredOrders(res.filter((f) => f.status === 0));
      });
    };
    verifyLogin(callback, 1);
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line

  useEffect(() => {
    const data = orders.filter((d) => {
      const orderTimeStamp = new Date(d.tanggalOrder);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        orderTimeStamp.getTime() >= start.getTime() &&
        orderTimeStamp.getTime() <= end.getTime()
      );
    });
    setFilteredOrders(data);
    // eslint-disable-next-line
  }, [startDate, endDate]);

  const filterOrdersHandler = (e) => {
    const keyword = e.target.value;
    const data = orders.filter((d) => {
      const pengirim = d.pengirim.nama
        .toString()
        .toLowerCase()
        .includes(keyword);
      const penerima = d.penerima.nama
        .toString()
        .toLowerCase()
        .includes(keyword);
      if (pengirim || penerima) return true;
    });
    setFilteredOrders(keyword !== '' ? data : orders);
  };

  const PaginatedItems = ({ itemsPerPage, items }) => {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
      // Fetch items from another resources.
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
      // eslint-disable-next-line
    }, [itemOffset, itemsPerPage]);

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
          {currentItems?.map((o) => (
            <CardOrder key={o.id} order={o} />
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

  return (
    <>
      <Layout>
        <div className='my-4'>
          <div className='mx-5 mb-4'>
            <div className='grid grid-cols-2 gap-x-2 mb-2'>
              <div>
                <span className='block font-medium text-xs'>Mulai</span>
                <input
                  type='date'
                  className='p-2 w-full outline-none focus:shadow-lg rounded border placeholder:text-xs'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <span className='block font-medium text-xs'>Selesai</span>
                <input
                  type='date'
                  className='p-2 w-full outline-none focus:shadow-lg rounded border placeholder:text-xs'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-x-2 mb-2'>
              <div>
                <span className='block font-medium text-xs'>Tampilkan</span>
                <select
                  className='outline-none p-2 border rounded'
                  value={itemsCount}
                  onChange={(e) => setItemsCount(Number(e.target.value))}
                >
                  <option value='5'>5</option>
                  <option value='10'>10</option>
                  <option value='50'>50</option>
                  <option value='100'>100</option>
                  <option value='250'>250</option>
                </select>
              </div>
              <div>
                <span className='block font-medium text-xs'>Cari</span>
                <input
                  type='search'
                  className='p-2 w-full outline-none focus:shadow-lg rounded border placeholder:text-xs'
                  placeholder='masukkan nama pengirim atau penerima...'
                  onChange={filterOrdersHandler}
                />
              </div>
            </div>
          </div>
          {filteredOrders.length > 0 && (
            <PaginatedItems itemsPerPage={itemsCount} items={filteredOrders} />
          )}
        </div>
      </Layout>
    </>
  );
};

export default Riwayat;
