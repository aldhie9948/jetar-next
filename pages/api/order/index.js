import connect from '../../../lib/connect';
import Order from '../../../models/order';
import Pelanggan from '../../../models/pelanggan';
import nc from 'next-connect';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';

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
      // master data orderan
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

      // jika di master data orderan tidak ada "id pengirim"
      // maka data pengirim akan disimpan menjadi pelanggan baru
      // dan dimasukkan ke master data orderan
      if (!data.pengirim.id) {
        const pengirim = new Pelanggan(dataPengirim);
        const savedPengirim = await pengirim.save();
        body.pengirim = { ...dataPengirim, id: savedPengirim._id };
      } else if (data.pengirim.id) {
        // jika di master data orderan ada "id pengirim"
        // maka data pengirim dari master data hanya akan di update
        // di db pelanggan
        await Pelanggan.findByIdAndUpdate(dataPengirim.id, dataPengirim, {
          new: true,
        });
        body.pengirim = { ...dataPengirim };
      }

      // sama kaya yang di section atas tapi untuk data penerima
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

      // setiap pembuatan orderan baru
      // status orderan akan selalu menjadi 1 atau "masuk"
      body.status = 1;

      // init Order Model dari master data
      const order = new Order(body);

      // simpan ke mongo
      const savedOrder = await order.save();

      // ambil atau fetch data static maps dari maps api
      // dan di simpan di /public/assets/image/map-orderan
      // dengan nama id orderan png

      // ambil data orderan yang baru saja disimpan
      // dan populate data drivernya lalu kirim menjadi response
      const newOrder = await savedOrder.populate('driver');
      res.status(201).json(newOrder);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
