import connect from '../../../lib/connect';
import nc from 'next-connect';
import Order from '../../../models/order';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';
import getStaticMap, { removeMaps } from '../../../lib/getStaticMap';
import Pelanggan from '../../../models/pelanggan';

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
    const {
      query: { id },
    } = req;
    try {
      verifyToken(req);
      const order = await Order.findById(id).populate('driver');
      res.status(200).json(order);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    await connect();
    const data = req.body;
    const {
      query: { id },
    } = req;
    try {
      // verifikasi token
      verifyToken(req);

      // master data orderan yang akan diupdate
      let body = { ...data };

      // format data pengirim
      const dataPengirim = {
        ...data.pengirim,
        nama: trimmer(data.pengirim.nama),
      };

      // format data penerima
      const dataPenerima = {
        ...data.penerima,
        nama: trimmer(data.penerima.nama),
      };

      // sama seperti yang ada di method request POST
      // di /api/order/index
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

      // sama juga
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

      // update data, status akan tetap sama
      // tidak seperti yang ada di method POST
      const updatedOrder = await Order.findByIdAndUpdate(id, body, {
        new: true,
      });

      // ambil atau fetch gambar static maps dari maps api google
      getStaticMap({
        name: updatedOrder.id,
        origin: updatedOrder.pengirim.alamat,
        destination: updatedOrder.penerima.alamat,
        polyline: body.polyline,
      });

      // ambil data yang baru saja disimpan
      // populate data driver dan kirim sebagai response
      const order = await Order.findById(updatedOrder.id).populate('driver');
      res.status(201).json(order);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    const {
      query: { id },
    } = req;
    try {
      // verifikasi token
      verifyToken(req);
      // hapus data orderan berdasarkan id yang diberikan
      // saat request
      const order = await Order.findByIdAndRemove(id).populate('driver');

      // hapus gambar static image yang disimpan dengan
      // nama id order diatas
      removeMaps({ name: order.id });

      // kirim response data orderan yang dihapus
      res.status(200).json(order);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
