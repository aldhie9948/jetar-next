import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';
import mongooseFuzzySearching from 'mongoose-fuzzy-searching';

const driverSchema = mongoose.Schema({
  nama: { required: true, type: String, index: true },
  noHP: { required: true, type: String, index: true },
  foto: { type: String },
  softDelete: Boolean,
});

driverSchema.plugin(validator);
driverSchema.plugin(mongooseFuzzySearching, { fields: ['nama', 'noHP'] });

driverSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id;
    delete obj.nama_fuzzy;
    delete obj.noHP_fuzzy;
    delete obj._id;
    delete obj.__v;
  },
});

module.exports =
  mongoose.models.Driver || mongoose.model('Driver', driverSchema);
