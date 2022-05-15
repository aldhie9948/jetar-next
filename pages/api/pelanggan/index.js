import connect from '../../../lib/connect';
import nc from 'next-connect';
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
    try {
      const pelanggan = await Pelanggan.find({});
      res.status(200).json(pelanggan);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error });
    }
  })
  .post(async (req, res) => {
    await connect();
    const body = req.body;
    try {
      const pelanggan = new Pelanggan(body);
      const savedPelanggan = await pelanggan.save();
      res.status(201).json(savedPelanggan);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error });
    }
  });

export default handler;
