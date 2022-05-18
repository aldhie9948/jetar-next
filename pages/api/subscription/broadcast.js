import connect from '../../../lib/connect';
import nc from 'next-connect';
import { verifyToken } from '../../../lib/token';
import Subscription from '../../../models/subscription';
import webpush from 'web-push';
import Order from '../../../models/order';

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(error.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).post(async (req, res) => {
  await connect();
  try {
    verifyToken(req);
    // data structure {pengguna:ObjectID, subscription: subscription obj from push manager}
    const { target, title, body } = req.body;

    let targetArray = [];

    // cek target broadcast
    console.log('cari subscription target...');
    const subscriptionList = await Subscription.find({}).populate('pengguna');
    if (target === 'admin')
      targetArray = subscriptionList.filter((f) => f.pengguna.level === 0);

    if (target === 'driver')
      targetArray = subscriptionList.filter((f) => f.pengguna.level === 1);

    if (!target) throw new Error('harap isi data target broadcast');

    // ambil data subscription dari mongo dengan id pengguna
    const payload = JSON.stringify({
      title,
      body,
    });

    targetArray.forEach((target) => {
      console.log('kirim web push...');
      webpush
        .sendNotification(target.subscription, payload)
        .catch((err) => console.error(err));
    });

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message, status: 'FAILED' });
  }
});

export default handler;
