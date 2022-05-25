import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OrderService from '../../services/order';
import CardOrder from '../../components/pwa/drivers/CardOrder';
import Head from 'next/head';

const Orders = () => {
  const [order, setOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { id, token } = router.query;
    OrderService.find(id, token).then((res) => {
      setOrder(res[0]);
    });
  });

  return (
    <>
      <Head>
        <title>Orderan JETAR</title>
      </Head>
      <div className='sm:p-10 py-5'>
        {order && <CardOrder order={order} open={true} />}
      </div>
    </>
  );
};

export default Orders;
