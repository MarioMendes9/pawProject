var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var CampanhaSchema=new Schema({
    estado:{type:Boolean},
    description:{type:String},
    targetValue:{type:Number},
    logoName:{type: String},
    iban:{type:Number},
    responsaveis:[{name:{type:String}}],
    donations:[{user:{type:String},
            montante:{type:Number},
            estado:{type:String}}]

});

module.exports=mongoose.model('Campanha',CampanhaSchema);