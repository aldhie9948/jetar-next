import Pusher from 'pusher';
import nc from 'next-connect';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).post(async (req, res) => {
  const { event } = req.body;

  try {
    pusher.trigger('jetar', event, req.body);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default handler;
