var mongoose = require("mongoose");
var path = require('path');
var http = require('http');
var campanhaOptController = {};


campanhaOptController.manage = function (req, res) {
    res.render("../views/AdminOpt/manageCamp");
};


campanhaOptController.getAll = function (req, res) {
    var campanhas = "";
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanhas'
        // method:'GET',
    };



    /*  var req=http.request(options,(res)=>{
         console.log(`statusCode:${res.statusCode}`);
         res.setEncoding('utf-8');
 
         res.on('data',(d)=>{
             campanhas+=d;
            console.log(campanhas);
         });
     });
 
     req.on('error',(error)=>{
         console.log(error);
     });
 
     req.end();
   */
    var req = http.get(options, function (res) {
        console.log(`statusCode:${res.statusCode}`);
        res.setEncoding('utf-8');
        res.on('data', function (d) {
            campanhas += d;
            console.log(campanhas);
        });
    });

    req.on('error', (error) => {
        console.log(error);
    });
    
};


campanhaOptController.getCampById = function (req, res) {

    var campanha = "";
    console.log(req.params.id);

    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanha/' + req.params.id,
    }
    var req = http.get(options, function (res) {
        console.log(`statusCode:${res.statusCode}`);
        res.setEncoding('utf-8');
        res.on('data', function (d) {
            campanha += d;
            console.log(campanha);
        });
    });

    req.on('error', (error) => {
        console.log(error);
    });

};

campanhaOptController.create = function (req, res) {

};

campanhaOptController.delete = function (req, res) {

};


campanhaOptController.addDonation = function (req, res) {

};

campanhaOptController.updateStateDonation = function (req, res) {

};


module.exports = campanhaOptController;