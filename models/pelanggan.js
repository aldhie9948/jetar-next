import mongoose, { mongo } from 'mongoose';
import validator from 'mongoose-unique-validator';

const pelangganSchema = mongoose.Schema({
  nama: { required: true, type: String },
  alamat: { required: true, type: String },
  noHP: { required: true, type: String },
  keterangan: { required: true, type: String },
});

pelangganSchema.plugin(validator);

pelangganSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
  },
});

module.exports =
  mongoose.models.Pelanggan || mongoose.model('Pelanggan', pelangganSchema);
