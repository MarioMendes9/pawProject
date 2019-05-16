var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  IBAN: { type: String },
  localizacao: { type: String },
  nome: { type: String },
  apelido: { type: String },
  NIF: { type: Number }
});

module.exports = mongoose.model('Users', UserSchema);