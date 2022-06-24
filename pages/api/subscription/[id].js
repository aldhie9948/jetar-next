import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pengguna from '../../../models/pengguna';
import { verifyToken } from '../../../lib/token';
import mongoose from 'mongoose';

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
    try {
      const {
        query: { id },
      } = req;
      verifyToken(req);
      const pengguna = await Pengguna.findById(id);
      res.status(200).json({ status: 'OK', data: pengguna });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'FAILED', data: error });
    }
  })
  .put(async (req, res) => {
    await connect();
    try {
      const {
        query: { id },
      } = req;
      const body = req.body;
      verifyToken(req);
      const save = await Pengguna.findByIdAndUpdate(id, body, { new: true });
      const checkSubscription = await Pengguna.find({
        subscription: body.subscription,
      });
      const filtered = checkSubscription.filter((f) => f._id.toString() !== id);
      filtered.forEach(async (sub) => {
        await Pengguna.findByIdAndUpdate(sub._id, { subscription: null });
      });
      res.status(201).json({ status: 'OK', data: save });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'FAILED', data: error });
    }
  });

export default handler;
