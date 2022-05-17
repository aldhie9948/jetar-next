import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';
import mongooseFuzzySearching from 'mongoose-fuzzy-searching';

const pelangganSchema = mongoose.Schema({
  nama: { required: true, type: String },
  alamat: { required: true, type: String },
  noHP: { required: true, type: String },
  keterangan: { required: true, type: String },
  softDelete: { type: Boolean },
});

pelangganSchema.plugin(validator);
pelangganSchema.plugin(mongooseFuzzySearching, { fields: ['nama', 'noHP'] });

pelangganSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id;
    delete obj.nama_fuzzy;
    delete obj.noHP_fuzzy;
    delete obj._id;
    delete obj.__v;
  },
});

module.exports =
  mongoose.models.Pelanggan || mongoose.model('Pelanggan', pelangganSchema);
