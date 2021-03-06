import connect from '../../../lib/connect';
import nc from 'next-connect';
import Order from '../../../models/order';
import { verifyToken } from '../../../lib/token';
import Driver from '../../../models/driver';
import dateFormat from '../../../lib/date';

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
    const { id, date } = body;
    const driver = await Driver.findOne({ pengguna: id });
    const tanggalOrder = dateFormat(new Date(), 'yyyy-MM-dd');
    if (driver) {
      let orders = [];
      if (date === 'all')
        orders = await Order.find({ driver: driver._id }).populate('driver');
      if (date === 'today')
        orders = await Order.find({
          $and: [{ driver: driver._id }, { tanggalOrder }],
        }).populate('driver');
      res.status(200).json(orders);
    } else {
      res.status(404).json({ error: 'pengguna driver tidak ditemukan' });
    }
  } catch (error) {
    console.error(error.toString());
    res.status(500).json({ error: error.message });
  }
});

export default handler;
