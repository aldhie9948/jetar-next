import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pengguna from '../../../models/pengguna';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
      username: pengguna.username,
      id: pengguna._id,
      level: pengguna.level,
    };

    const token = jwt.sign(penggunaToken, process.env.SECRET_KEY, {
      expiresIn: 60 * 60 * 60,
    });

    res
      .status(200)
      .json({
        token,
        username: pengguna.username,
        name: pengguna.name,
        level: pengguna.level,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default handler;
