var mongoose = require("mongoose");
var Campanha = require("../models/campanha");

var campanhaController = {};

/**
 * Criar uma camapanha 
 */
campanhaController.createCampanha = function (req, res, next) {
    console.log(req.body);
    var campanha = new Campanha(req.body);

    campanha.save(function (err) {
        if (err) {
            next(err);
        }
        else {
            res.json(campanha);
        }
    });
};

/**
 * Apagar uma camapanha
 */

campanhaController.deleteCampanha = function (req, res) {
    console.log("id: " + req.params.id);
    Campanha.deleteOne({ _id: req.params.id }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Doaçao deleted!");
            res.json(result);
        }
    });
};


/**
 * Pedir todas as campanhas
 */

campanhaController.getAllCampanhas = function (req, res, next) {
    Campanha.find(function (err, campanhas) {
        if (err) {
            next(err);
        } else {
            res.json(campanhas);
        }
    });
};

/**
 * Pedir uma campanha 
 */

campanhaController.getByIdCampanha = function (req, res, next) {
    Campanha.findById(req.params.id, function (err, campanha) {
        if (err) {
            next(err);
        } else {
            //console.log(campanha);
            res.json(campanha);
        }
    });

};


/**
 * Update numa doaçao na campanha (done)
 */

campanhaController.addDonation = function (req, res, next) {
    console.log("isto" + req.body.id);
    Campanha.findOneAndUpdate(
        { _id: req.body.id },
        { $push: { donations: req.body.donation } }, { new: true }
        , function (err, campanha) {
            if (err) {
                next(err);
            } else {
                res.json(campanha);
            }
        });
};


/**
 * Update numa info da campanha 
 */

campanhaController.updateStateDonation = function (req, res, next) {
    Campanha.findOneAndUpdate({ "donations._id": req.body.donateId },
        { $set: { 'donations.$.estado': req.body.estado } }, { new: true }, function (err, donation) {
            if (err) {
                next(err);
            }
            else {
                res.json(donation);
            }
        }
    );
};


campanhaController.updateCampanha = function (req, res) {
    console.log(req.params.id);
    console.log(req.body);
    Campanha.findByIdAndUpdate(req.params.id, {
        $set: {
            estado: req.body.estado, description: req.body.description,
            targetValue: req.body.targetValue, logoName: req.body.logoName, IBAN: req.body.IBAN, responsaveis: req.body.responsaveis
        }
    },{new: true}, function (err, camp) {
        if (err) {
            res.json(err);
        }
        console.log(camp);
        res.json(camp);
    });
};


module.exports = campanhaController;


