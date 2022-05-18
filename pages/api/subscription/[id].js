import connect from '../../../lib/connect';
import nc from 'next-connect';
import { verifyToken } from '../../../lib/token';
import Subscription from '../../../models/subscription';
import webpush from 'web-push';

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
    try {
      verifyToken(req);
      const subscriptionList = await Subscription.findOne({ pengguna: id });
      res.status(200).json(subscriptionList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    await connect();
    const {
      query: { id },
    } = req;
    try {
      verifyToken(req);
      // data structure {pengguna:ObjectID, subscription: subscription obj from push manager}
      const data = req.body;

      // ambil data subscription dari mongo dengan id pengguna
      const subscriptionObj = await Subscription.findOne({ pengguna: id });
      const payload = JSON.stringify({
        title: 'Orderan baru JETAR',
      });
      webpush
        .sendNotification(subscriptionObj.subscription, payload)
        .catch((err) => console.error(err));
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message, status: 'FAILED' });
    }
  });

export default handler;
