import connect from '../../../lib/connect';
import nc from 'next-connect';
import { verifyToken } from '../../../lib/token';
import Subscription from '../../../models/subscription';
import Pengguna from '../../../models/pengguna';

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
      verifyToken(req);
      const subscriptionList = await Subscription.find({});
      res.status(200).json(subscriptionList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    await connect();
    try {
      verifyToken(req);
      // data structure {pengguna:ObjectID, subscription: subscription obj from push manager}
      const data = req.body;
      const subscription = new Subscription(data);
      const savedSubscription = await subscription.save();
      const populated = await savedSubscription.populate('pengguna');
      res.status(201).json(populated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message, status: 'FAILED' });
    }
  })
  .put(async (req, res) => {
    await connect();
    try {
      verifyToken(req);
      // data structure {pengguna:ObjectID, subscription: subscription obj from push manager}
      const data = req.body;

      // ambil data subscription lama
      // dengan menggunakan id pengguna
      const oldSubscription = await Subscription.findOne({
        pengguna: data.pengguna,
      });

      const updatedSubscription = await Subscription.findByIdAndUpdate(
        oldSubscription._id,
        data,
        { new: true }
      );
      const populated = await updatedSubscription.populate('pengguna');

      res.status(201).json(populated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message, status: 'FAILED' });
    }
  });

export default handler;
