import Pelanggan from '../../../models/pelanggan';
import connect from '../../../lib/connect';
import nc from 'next-connect';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';
import { numberOnly } from '../../../lib/currency';

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
      const pelanggan = await Pelanggan.find({});
      res.status(200).json(pelanggan);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    await connect();
    const data = req.body;
    try {
      const body = {
        ...data,
        nama: trimmer(data.nama),
        noHP: numberOnly({ value: data.noHP, isPhone: true }),
      };

      const pelanggan = new Pelanggan(body);
      const savedPelanggan = await pelanggan.save();
      res.status(201).json(savedPelanggan);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
