import connect from '../../../lib/connect';
import nc from 'next-connect';
import Driver from '../../../models/driver';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';
import Pengguna from '../../../models/pengguna';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
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

      const driver = await Driver.find({}).populate('akun');
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
      verifyToken(req);

      const pengguna = {
        username: data.username.trim(),
        nama: trimmer(data.nama),
        level: 1,
      };

      const password = await bcrypt.hash(
        data?.password || 'jetarjaya',
        saltRounds
      );
      pengguna.password = password;

      const penggunaModel = new Pengguna(pengguna);
      const savedPengguna = await penggunaModel.save();

      const driverObj = {
        ...data,
        nama: trimmer(data.nama),
        akun: savedPengguna._id,
        softDelete: false,
      };

      const driver = new Driver(driverObj);
      const savedDriver = await driver.save();
      const populated = await savedDriver.populate('akun');
      res.status(201).json(populated);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
