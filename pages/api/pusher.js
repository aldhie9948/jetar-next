import nc from 'next-connect';
import Pusher from 'pusher';

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(error.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).post(async (req, res) => {
  const { event } = req.body;
  const options = {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  };
  const pusher = new Pusher(options);
  if (event === 'save-order') {
    console.log('event', event);
    pusher.trigger('jetar-channel', event, {
      message: 'order saved...',
    });
  }
  res.end();
});

export default handler;
