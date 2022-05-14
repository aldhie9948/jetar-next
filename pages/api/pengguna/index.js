import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pengguna from '../../../models/pengguna';
import bcrypt from 'bcrypt';

const saltRounds = 10;

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
      const pengguna = await Pengguna.find({});
      res.status(200).json(pengguna);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error });
    }
  })
  .post(async (req, res) => {
    await connect();
    const body = req.body;
    try {
      const password = await bcrypt.hash(body.password, saltRounds);
      console.log(password);
      const pengguna = new Pengguna({ ...body, password });
      const save = await pengguna.save();
      res.status(201).json(save);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error });
    }
  });

export default handler;
