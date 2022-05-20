import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';

const orderSchema = new mongoose.Schema({
  pengirim: {
    id: { type: String },
    nama: { type: String, required: true },
    noHP: { type: String, required: true },
    alamat: { type: String, required: true },
    keterangan: { type: String, required: true },
  },
  penerima: {
    id: { type: String },
    nama: { type: String, required: true },
    noHP: { type: String, required: true },
    alamat: { type: String, required: true },
    keterangan: { type: String, required: true },
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  softDelete: Boolean,
  tanggalOrder: { type: String, required: true },
  waktuOrder: { type: String, required: true },
  ongkir: { type: Number, required: true },
  talang: { type: Number, required: true },
  status: { type: Number, required: true },
});

orderSchema.plugin(validator);
orderSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
  },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
