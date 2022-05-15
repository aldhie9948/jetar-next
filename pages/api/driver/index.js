import connect from '../../../lib/connect';
import nc from 'next-connect';
import Driver from '../../../models/driver';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';

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
      const driver = await Driver.find({});
      res.status(200).json(driver);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    await connect();
    const data = req.body;
    try {
      const body = {
        ...data,
        nama: trimmer(data.nama),
      };

      const driver = new Driver(body);
      const savedDriver = await driver.save();
      res.status(201).json(savedDriver);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
