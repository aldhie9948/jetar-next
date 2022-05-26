import Pusher from 'pusher';

const pusherHandler = (req, res) => {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true,
  });
  const { event } = req.body;
  if (event === 'orders') {
    pusher.trigger('jetar', event, { message: 'OK' });
  }
  res.end();
};

export default pusherHandler;
