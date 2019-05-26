var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  IBAN: { type: String},
  localizacao: { type: String},
  nomeCompleto: { type: String },
  NIF: { type: Number},
  tipoU:{type:String,
        default:'User'}
});

module.exports = mongoose.model('User', UserSchema);