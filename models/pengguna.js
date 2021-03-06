import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';

const penggunaSchema = new mongoose.Schema({
  username: { required: true, type: String, unique: true },
  nama: { required: true, type: String },
  password: { required: true, type: String },
  level: { required: true, type: Number },
  subscription: { type: String, default: null },
});

penggunaSchema.plugin(validator);
penggunaSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.password;
  },
});

module.exports =
  mongoose.models.Pengguna || mongoose.model('Pengguna', penggunaSchema);
