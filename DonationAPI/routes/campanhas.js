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

router.post('/updateCampanha', campanhaController.updateDonation);

/**
 * update estado de uma donation
 */

router.post('/updateStateCampanha', campanhaController.updateStateCampanha);

/**
 * Delete donate
 */

router.delete('/campanha/:id', campanhaController.deleteCampanha);

/**
 * Procurar uma campanha
 */

router.get('/getCampanha/:id', campanhaController.getByIdCampanha);


module.exports = router;