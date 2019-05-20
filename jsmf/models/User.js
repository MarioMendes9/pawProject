var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  IBAN: { type: String },
  localizacao: { type: String,default:"cona"},
  nomeCompleto: { type: String },
  NIF: { type: Number },
  tipoU:{type:String,
        default:'User'}
});

module.exports = mongoose.model('User', UserSchema);