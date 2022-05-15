import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pelanggan from '../../../models/pelanggan';
import { verifyToken } from '../../../lib/token';

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
      const pelanggan = await Pelanggan.findById(id);
      res.status(200).json(pelanggan);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    await connect();
    const body = req.body;
    const {
      query: { id },
    } = req;
    try {
      verifyToken(req);
      const save = await Pelanggan.findByIdAndUpdate(id, body, {
        new: true,
      });
      res.status(201).json(save);
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
      verifyToken(req);
      const pelanggan = await Pelanggan.findByIdAndRemove(id);
      res.status(200).json(pelanggan);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
