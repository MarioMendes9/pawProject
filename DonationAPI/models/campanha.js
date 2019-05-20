var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CampanhaSchema = new Schema({
        estado: {
                type: Boolean,
                default: true
        },
        description: { type: String },
        targetValue: { type: Number },
        logoName: { type: String },
        IBAN: { type: String },
        responsaveis: [{ type: String }],
        donations: [{
                user: { type: String },
                montante: { type: Number },
                estado: { type: Boolean,
                        default: false }
        }]

});

module.exports = mongoose.model('Campanha', CampanhaSchema);