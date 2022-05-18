import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';

const subcriptionSchema = mongoose.Schema({
  pengguna: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pengguna',
    required: true,
    unique: true,
  },
  subcription: {
    type: Object,
    required: true,
  },
});

subcriptionSchema.plugin(validator);
subcriptionSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
  },
});

module.exports =
  mongoose.models.Subcription ||
  mongoose.model('Subscription', subcriptionSchema);
