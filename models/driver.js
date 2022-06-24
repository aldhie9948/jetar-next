import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';

const driverSchema = mongoose.Schema({
  nama: { required: true, type: String, index: true },
  noHP: { required: true, type: String, index: true },
  gender: { type: String },
  pengguna: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pengguna',
    required: true,
  },
  softDelete: Boolean,
});

driverSchema.plugin(validator);

driverSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
  },
});

module.exports =
  mongoose.models.Driver || mongoose.model('Driver', driverSchema);
