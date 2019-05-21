var express = require('express');
var router = express.Router();
var userOptions = require("../controllers/UserOptControllers");
var campOptions = require("../controllers/CampanhaOptController");


//Admin board page 
router.get('/', function (req, res) {
    res.render("../views/AdminUsers/adminOpt");
});

//manage users

router.get('/ManageUser', userOptions.manage);
//Get all users 
router.get('/listUsers', userOptions.list);
//Criar utilizador
router.get('/createUser', userOptions.create);

router.post('/save', userOptions.save);

//Edit utilizador

router.post('/edit/:id', userOptions.edit);

router.get('/edit/:id', userOptions.showEditUser);

//Delete utilizador

router.post('/delete/:id', userOptions.delete);


//Lista donativos/total gasto/ e campanhas de um utilizador

router.get('/showInfo/:id', userOptions.allInfo);


/*****************************************************************************
 * ALMOST DONE A PARTE EM CIMA
 ****************************************************************************/
/**
 * Comunicar com a api
 */

router.get('/ManageDonations', campOptions.manage);

router.get('/getCampanhas', campOptions.getAll);
/**
 * Info de uma campanha
 */
router.get('/InfoCamp/:id', campOptions.getCampById);

router.get('/newCamp', campOptions.newCamp);
router.post('/newCamp', campOptions.create);

router.post('/deleteCamp/:id', campOptions.delete);

router.post('/CampDonate', campOptions.addDonation);

router.post('/UpdateDonate', campOptions.updateStateDonation);

router.post('/editCamp/:id',campOptions.editCamp);



module.exports = router;
