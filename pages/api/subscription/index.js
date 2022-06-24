import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pengguna from '../../../models/pengguna';
import { verifyToken } from '../../../lib/token';

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).get(async (req, res) => {
  await connect();
  try {
    // verifyToken(req);
    const pengguna = await Pengguna.find({});
    res.status(200).json({ status: 'OK', data: pengguna });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'FAILED', data: error });
  }
});

export default handler;
