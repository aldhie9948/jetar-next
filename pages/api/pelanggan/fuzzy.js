import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pelanggan from '../../../models/pelanggan';
import { verifyToken } from '../../../lib/token';

const handler = nc({
  onError: (err, req, res, next) => {
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).post(async (req, res) => {
  await connect();
  const body = req.body;
  try {
    const { keyword } = body;
    verifyToken(req);
    const pelanggan = await Pelanggan.fuzzySearch(keyword);
    res.status(200).json(pelanggan);
  } catch (error) {
    console.error(error.toString());
    res.status(500).json({ error: error.message });
  }
});

export default handler;
