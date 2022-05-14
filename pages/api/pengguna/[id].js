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
    const {
      query: { id },
    } = req;
    console.log(req.query);
    try {
      const pengguna = await Pengguna.findById(id);
      res.status(200).json(pengguna);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: 'data tidak ditemukan' });
    }
  })
  .put(async (req, res) => {
    await connect();
    const body = req.body;
    const {
      query: { id },
    } = req;
    try {
      const password = await bcrypt.hash(body.password, saltRounds);
      const pengguna = { ...body, password };
      const save = await Pengguna.findByIdAndUpdate(id, pengguna, {
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
      const pengguna = await Pengguna.findByIdAndRemove(id);
      res.status(200).json(pengguna);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: 'data tidak ditemukan' });
    }
  });

export default handler;
