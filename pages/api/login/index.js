import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pengguna from '../../../models/pengguna';
import bcrypt from 'bcrypt';
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
    const pengguna = await Pengguna.findOne({ username: body.username });
    const passwordCorrect = pengguna
      ? await bcrypt.compare(body.password, pengguna.password)
      : false;
    if (!(pengguna && passwordCorrect))
      return res.status(401).json({ error: 'username atau password salah' });

    const penggunaToken = {
      nama: pengguna.nama,
      username: pengguna.username,
      level: pengguna.level,
      id: pengguna._id,
      subscription: pengguna.subscription,
    };

    const token = jwt.sign(penggunaToken, config.SECRET_KEY, {});

    res.status(200).json({
      token,
      ...penggunaToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default handler;
