var mongoose=require("mongoose");
var Campanha=require("../models/campanha");

var campanhaController={};

/**
 * Criar uma camapanha 
 */
campanhaController.createCampanha=function(req,res,next){
    console.log(req.body);
    var campanha=new Campanha(req.body);

    campanha.save(function(err){
        if(err){
            next(err);
        }
        else{
            res.json(campanha);
        }
    });
};

/**
 * Apagar uma camapanha
 */

 campanhaController.deleteCampanha=function(req,res){
     console.log("id: "+req.params.id);
    Campanha.deleteOne({_id:req.params.id},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            console.log("Doaçao deleted!");
            res.json(result);
        }
    });
};
 

/**
 * Pedir todas as campanhas
 */

 campanhaController.getAllCampanhas=function(req,res,next){
     Campanha.find(function(err,campanhas){
        if(err){
            next(err);
        }else{
            res.json(campanhas);
        }
     });
 };

 /**
  * Pedir uma campanha 
  */

  campanhaController.getByIdCampanha=function(req,res,next){
      Campanha.findOne({_id:req.params.id},function(err,campanha){
        if(err){
            next(err);
        } else{
            res.json(campanha);
        }
      });
  };


  /**
   * Update numa doaçao na campanha (done)
   */

   campanhaController.updateDonation=function(req,res,next){
       console.log(req.body.id);
       Campanha.findOneAndUpdate(
           {_id:req.body.id},
           {$push:{donations:req.body.donation}},{new:true}
           ,function(err,campanha){
               if(err){
                   next(err);
               }else{
                   res.json(campanha);
               }
           });
   };


  /**
   * Update numa info da campanha 
   */

   campanhaController.updateStateCampanha=function(req,res,next){
        Campanha.findOneAndUpdate({"donations._id":req.body.donateId},
            {$set:{'donations.$.estado':req.body.estado}},{new:true},function(err,donation){
                if(err){
                    next(err);
                }
                else{
                    res.json(donation);
                }
            }
            );
   };
module.exports=campanhaController;


