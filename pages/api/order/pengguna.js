import connect from '../../../lib/connect';
import nc from 'next-connect';
import Order from '../../../models/order';
import { verifyToken } from '../../../lib/token';
import Driver from '../../../models/driver';

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).post(async (req, res) => {
  await connect();
  const body = req.body;
  try {
    verifyToken(req);
    let order = {};
    const { id } = body;
    const driver = await Driver.findOne({ akun: id });
    if (driver) {
      const orders = await Order.find({ akun: driver._id }).populate('driver');
      res.status(200).json(orders);
    } else {
      res.status(404).json({ error: 'akun pengguna driver tidak ditemukan' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error.toString());
    res.status(500).json({ error: error.message });
  }
});

export default handler;
