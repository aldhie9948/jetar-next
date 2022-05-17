import connect from '../../../lib/connect';
import nc from 'next-connect';
import Driver from '../../../models/driver';
import { verifyToken } from '../../../lib/token';
import { trimmer } from '../../../lib/trimmer';
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
    const {
      query: { id },
    } = req;
    try {
      verifyToken(req);
      const driver = await Driver.findById(id).populate('akun');
      res.status(200).json(driver);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    await connect();
    const data = req.body;
    const {
      query: { id },
    } = req;
    try {
      // verifikasi token
      verifyToken(req);

      // buat object pengguna untuk di update di database
      const penggunaObj = {
        ...data.akun,
        username: data.akun.username.trim(),
        nama: trimmer(data.akun.nama),
      };

      // update pengguna dan akan mengembalikkan object pengguna yang sudah tersimpan
      const updatedPengguna = await Pengguna.findByIdAndUpdate(
        penggunaObj.id,
        penggunaObj,
        { new: true }
      );

      // buat object driver yang akan disimpan di database
      const driverObj = {
        ...data,
        akun: updatedPengguna._id,
        nama: trimmer(data.nama),
      };

      // update driver dengan data yang baru dan
      // element akun diisi dengan updatedPengguna ObjectTypeId
      await Driver.findByIdAndUpdate(id, driverObj, {
        new: true,
      });

      // ambil data driver yang baru saja disimpan
      // dan populate element akun
      const newDriver = await Driver.findById(id).populate('akun');
      res.status(201).json(newDriver);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    const {
      query: { id },
    } = req;
    try {
      // verifikasi token
      verifyToken(req);

      const oldDriver = await Driver.findById(id).populate('akun');
      // buat object yang akan diupdate
      // ganti softDelete menjadi "true" untuk indikator agar
      // order yang menggunakan driver tersebut masih ada datanya
      // ganti elemetn akun menjadi null, agar driver
      // tidak bisa melakukan login lagi
      const updatedDriver = {
        softDelete: true,
        akun: null,
      };

      const driver = await Driver.findByIdAndUpdate(id, updatedDriver, {
        new: true,
      });
      await Pengguna.findByIdAndRemove(oldDriver.akun.id);
      res.status(200).json(driver);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
