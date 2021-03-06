import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pelanggan from '../../../models/pelanggan';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
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
      const pelanggan = await Pelanggan.find({
        $or: [
          { nama: { $regex: `.*${id}.*`, $options: 'i' } },
          { noHP: { $regex: `.*${id}.*`, $options: 'i' } },
        ],
      })
        .sort({ nama: 1 })
        .limit(10);
      let lastName = '';
      const filterPelanggan = pelanggan.filter((f) => {
        const nama = f.nama.toLowerCase();
        if (nama === lastName) return false;
        lastName = nama;
        return true;
      });
      res.status(200).json(filterPelanggan);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    await connect();
    const data = req.body;
    const {
      query: { id },
    } = req;
    try {
      verifyToken(req);
      const body = {
        ...body,
        nama: trimmer(data.nama),
        noHP: numberOnly({ value: data.noHP, isPhone: true }),
      };
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
      const pelanggan = await Pelanggan.findByIdAndUpdate(
        id,
        {
          softDelete: true,
        },
        { new: true }
      );
      res.status(200).json(pelanggan);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
