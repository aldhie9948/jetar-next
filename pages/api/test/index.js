import connect from '../../../lib/connect';
import nc from 'next-connect';
import Pelanggan from '../../../models/pelanggan';
import fs from 'fs';

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(error.stack);
    res.status(500).end('Terjadi kendala error di server');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Halaman tidak ditemukan');
  },
}).get(async (req, res) => {
  await connect();

  try {
    const rawData = fs.readFileSync(`assets/pelanggan.json`);
    const pelanggans = JSON.parse(rawData);
    const formattedPelanggans = pelanggans.map((p) => {
      return {
        nama: String(p.nama),
        alamat: String(p.alamat),
        keterangan: String(p.keterangan),
        noHP: String(p.noHP) || '0',
        softDelete: false,
      };
    });
    console.log(typeof pelanggans[0].softDelete);
    await Pelanggan.insertMany(formattedPelanggans);
    res.status(201).json([]);
  } catch (error) {
    console.error(error.toString());
    res.status(500).json({ error: error.message });
  }
});

export default handler;
