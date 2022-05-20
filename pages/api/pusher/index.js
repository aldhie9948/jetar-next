import nc from 'next-connect';
import Pusher from 'pusher';
import config from '../../../utils/config';

const configPusher = {
  appId: config.APP_ID,
  key: config.KEY,
  secret: config.SECRET,
  cluster: config.CLUSTER,
  useTLS: true,
};
const pusher = new Pusher(configPusher);

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(error.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).post(async (req, res) => {
  const { message } = req.body;
  pusher.trigger('jetar-channel', 'orderan', {
    message,
  });
  res.status(200).end();
});

export default handler;
