var express = require('express');

var router = express.Router();

var campanhaController = require("../controllers/campanhaController");

/**
 * Pedir todas as campanhas
 */
router.get('/getCampanhas', campanhaController.getAllCampanhas);

/**
 * Criar uma campanha
 */

router.post('/newCampanha', campanhaController.createCampanha);

/**
 * update numa campanha, donation
 */

router.post('/addDonation', campanhaController.addDonation);

/**
 * update estado de uma donation
 */

router.post('/updateStateDonation', campanhaController.updateStateDonation);

/**
 * Delete donate
 */

router.delete('/deleteCampanha/:id', campanhaController.deleteCampanha);

/**
 * Procurar uma campanha
 */

router.get('/getCampanha/:id', campanhaController.getByIdCampanha);

/**
 * Update numa campanha
 */


 router.post('/updateCampanha/:id',campanhaController.updateCampanha);

 router.delete('/deleteDonation/:id',campanhaController.deleteDonation);
module.exports = router;