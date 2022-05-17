import connect from '../../../lib/connect';
import nc from 'next-connect';
import Order from '../../../models/order';
import Pelanggan from '../../../models/pelanggan';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';

import getStaticMap from '../../../lib/getStaticMap';

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

      const dataPengirim = {
        ...data.pengirim,
        nama: trimmer(data.pengirim.nama),
      };

      const dataPenerima = {
        ...data.penerima,
        nama: trimmer(data.penerima.nama),
      };

      if (!data.pengirim.id) {
        const pengirim = new Pelanggan(dataPengirim);
        const savedPengirim = await pengirim.save();
        body.pengirim = { ...dataPengirim, id: savedPengirim._id };
      } else if (data.pengirim.id) {
        await Pelanggan.findByIdAndUpdate(dataPengirim.id, dataPengirim, {
          new: true,
        });
        body.pengirim = { ...dataPengirim };
      }

      if (!data.penerima.id) {
        const penerima = new Pelanggan(dataPenerima);
        const savedPenerima = await penerima.save();
        body.penerima = { ...dataPenerima, id: savedPenerima._id };
      } else if (data.penerima.id) {
        await Pelanggan.findByIdAndUpdate(dataPenerima.id, dataPenerima, {
          new: true,
        });
        body.penerima = { ...dataPenerima };
      }

      const order = new Order(body);
      const savedOrder = await order.save();
      getStaticMap({
        name: savedOrder.id,
        origin: savedOrder.pengirim.alamat,
        destination: savedOrder.penerima.alamat,
        polyline: body.polyline,
      });
      const newOrder = await Order.findById(savedOrder.id).populate('driver');
      res.status(201).json(newOrder);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
