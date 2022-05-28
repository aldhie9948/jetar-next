import nc from 'next-connect';
import axios from 'axios';

const baseUrlFcm = 'https://fcm.googleapis.com/fcm/send';

const config = {
  headers: {
    authorization: `key=${process.env.FCM_SERVER_KEY}`,
  },
};

const handler = nc({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).post(async (req, res) => {
  try {
    const data = req.body;
    await axios.post(baseUrlFcm, data, config);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: error });
  }
});

export default handler;
