import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';

const subscriptionSchema = mongoose.Schema({
  pengguna: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pengguna',
    required: true,
    unique: true,
  },
  subscription: {
    type: Object,
    required: true,
  },
});

subscriptionSchema.plugin(validator);
subscriptionSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
  },
});

module.exports =
  mongoose.models.Subscription ||
  mongoose.model('Subscription', subscriptionSchema);
