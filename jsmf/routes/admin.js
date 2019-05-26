var express = require('express');
var router = express.Router();
var userOptions = require("../controllers/UserOptControllers");
var campOptions = require("../controllers/CampanhaOptController");
var { adminAuthenticated, ensureAuthenticated } = require('../controllers/auth');


//Admin board page 
router.get('/', adminAuthenticated, function (req, res) {
    res.render("../views/AdminUsers/adminOpt");
});

//manage users

router.get('/ManageUser', adminAuthenticated, userOptions.manage);
//Get all users 
router.get('/listUsers', adminAuthenticated, userOptions.list);
//Criar utilizador
router.get('/createUser', adminAuthenticated, userOptions.create);

router.post('/save', adminAuthenticated, userOptions.save);

//Edit utilizador

router.post('/edit/:id', ensureAuthenticated, userOptions.edit);

router.get('/edit/:id', ensureAuthenticated, userOptions.showEditUser);

//Delete utilizador

router.post('/delete/:id', adminAuthenticated, userOptions.delete);


//Lista donativos/total gasto/ e campanhas de um utilizador

router.get('/showInfo/:id', adminAuthenticated, userOptions.allInfo);

router.get('/showByUsername/:username', adminAuthenticated, userOptions.findByUsername);


/*****************************************************************************
 * ALMOST DONE A PARTE EM CIMA
 ****************************************************************************/
/**
 * Comunicar com a api
 */

router.get('/ManageDonations', adminAuthenticated, campOptions.manage);

router.get('/getCampanhas', adminAuthenticated, campOptions.getAll);
/**
 * Info de uma campanha
 */
router.get('/InfoCamp/:id', adminAuthenticated, campOptions.getCampById);

router.get('/newCamp', adminAuthenticated, campOptions.newCamp);
router.post('/newCamp', adminAuthenticated, campOptions.create);

router.post('/deleteCamp/:id', adminAuthenticated, campOptions.delete);

router.get('/deleteDonation/:id', adminAuthenticated, campOptions.deleteDonation);


router.get("/editDonations/:id", adminAuthenticated, campOptions.sendEditDonation);

router.post('/CampDonate', campOptions.addDonation);

router.post('/UpdateDonate', adminAuthenticated, campOptions.updateStateDonation);

/**
 * Editar uma campanha
 */
router.get('/editCamp/:id', adminAuthenticated, campOptions.sendEditCamp);

router.post('/editCamp/:id', adminAuthenticated, campOptions.editCamp);

/**
 * Pagina para aprovar doações das campanhas
 */
router.get('/confirmDonationsCamp', adminAuthenticated, campOptions.donationsToAprove);

module.exports = router;
