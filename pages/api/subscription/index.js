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

      // ambil data object id dari mongo
      const pengguna = await Pengguna.findOne({
        username: data.pengguna.username,
      });

      const formattedData = {
        pengguna: pengguna._id,
        subscription: data.subscription,
      };
      const subscription = new Subscription(formattedData);
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
      // dengan menggunakan username pengguna
      const pengguna = await Pengguna.findOne({
        username: data.pengguna.username,
      });
      const oldSubscription = await Subscription.findOne({
        pengguna: pengguna._id,
      });

      // format data yang akan diupdate
      const formattedData = {
        pengguna: pengguna._id,
        subscription: data.subscription,
      };

      const updatedSubscription = await Subscription.findByIdAndUpdate(
        oldSubscription._id,
        formattedData,
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
