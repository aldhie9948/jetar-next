import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardOrder from './CardOrder';

const Orders = ({ onEdit }) => {
  const orders = useSelector((s) => s.order);
  const [filteredOrders, setFilteredOrders] = useState(null);

  // hooks akan ketrigger untuk mengupdate FilteredOrders
  // saat orders redux berubah
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

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
                      <CardOrder key={order.id} order={order} onEdit={onEdit} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae,
          eius! Provident, neque cum? Dicta dolore perferendis nam beatae
          asperiores aspernatur possimus. Nisi iste consequuntur fugiat cum
          ullam ad distinctio debitis!
        </div>
      </div>
    </>
  );
};

export default Orders;
