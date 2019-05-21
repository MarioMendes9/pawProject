var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  IBAN: { type: String ,unique:true},
  localizacao: { type: String,default:"cona"},
  nomeCompleto: { type: String },
  NIF: { type: Number,unique:true },
  tipoU:{type:String,
        default:'User'}
});

module.exports = mongoose.model('User', UserSchema);