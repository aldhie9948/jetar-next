import Pengguna from '../../../models/pengguna';
import connect from '../../../lib/connect';
import nc from 'next-connect';
import jwt from 'jsonwebtoken';
import config from '../../../utils/config';

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
    const pengguna = await Pengguna.findById(body.id);
    if (pengguna) {
      const verify = jwt.verify(body.token, config.SECRET_KEY);
      verify && res.status(200).json({ status: true, message: 'token cocok' });
      !verify &&
        res.status(400).json({ status: false, message: 'token tidak cocok' });
    } else {
      res
        .status(404)
        .json({ status: false, message: 'pengguna tidak ditemukan ' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default handler;
