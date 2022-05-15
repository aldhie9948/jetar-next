import connect from '../../../lib/connect';
import nc from 'next-connect';
import Order from '../../../models/order';
import Pelanggan from '../../../models/pelanggan';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';
import pelanggan from '../../../services/pelanggan';

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(error.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
})
  .get(async (req, res) => {
    await connect();
    try {
      verifyToken(req);
      const order = await Order.find({}).populate('driver');
      res.status(200).json(order);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    await connect();
    const data = req.body;
    try {
      let body = { ...data };

      if (!data.pengirim.id) {
        const dataPengirim = {
          ...data.pengirim,
          nama: trimmer(data.pengirim.nama),
        };
        const pengirim = new Pelanggan(dataPengirim);
        const savedPengirim = await pengirim.save();
        body.pengirim = savedPengirim;
      } else {
        const dataPengirim = {
          ...data.pengirim,
          nama: trimmer(data.pengirim.nama),
        };
        const pengirim = await Pelanggan.findByIdAndUpdate(
          dataPengirim.id,
          dataPengirim,
          { new: true }
        );
        body.pengirim = pengirim;
      }

      if (!data.penerima.id) {
        const dataPenerima = {
          ...data.penerima,
          nama: trimmer(data.penerima.nama),
        };
        const penerima = new Pelanggan(dataPenerima);
        const savePenerima = await penerima.save();
        body.penerima = savePenerima;
      } else {
        const dataPenerima = {
          ...data.penerima,
          nama: trimmer(data.penerima.nama),
        };
        const penerima = await Pelanggan.findByIdAndUpdate(
          dataPenerima.id,
          dataPenerima,
          { new: true }
        );
        body.penerima = penerima;
      }

      const order = new Order(body);
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
