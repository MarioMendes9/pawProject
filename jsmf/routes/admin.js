var express = require('express');
var router = express.Router();
var userOptions=require("../controllers/UserOptControllers");
var campOptions=require("../controllers/CampanhaOptController");


//Admin board page 
router.get('/',userOptions.opt);

//manage users

router.get('/ManageUser',userOptions.manage);
//Get all users 
router.get('/listUsers',userOptions.list);
//Criar utilizador
router.get('/createUser',userOptions.create);

router.post('/save',userOptions.save);

//Edit utilizador

router.get('/edit/:id',userOptions.edit);

//Delete utilizador

router.get('/delete/:id',userOptions.delete);


//Lista donativos/total gasto/ e campanhas de um utilizador

router.get('/showInfo/:id',userOptions.allInfo);

/**
 * Comunicar com a api
 */

 router.get('/ManageDonations',campOptions.manage);

 router.get('/getCampanhas',campOptions.getAll);

 router.get('/getCampanha/:id',campOptions.getCampById);

 router.post('/newCamp',campOptions.create);

 router.delete('/deleteCamp/:id',campOptions.delete);

 router.post('/CampDonate',campOptions.addDonation);

 router.post('/UpdateDonate',campOptions.updateStateDonation);

module.exports=router;
