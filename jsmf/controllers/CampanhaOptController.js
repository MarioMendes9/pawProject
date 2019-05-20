var mongoose = require("mongoose");
var path = require('path');
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var multiparty = require('multiparty');
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
    };



    var req = http.get(options, function (res) {
        console.log(`statusCode:${res.statusCode}`);
        res.setEncoding('utf-8');
        res.on('data', function (d) {
            campanhas += d;
            return campanhas;
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



campanhaOptController.delete = function (req, res) {
    var campanha = "";
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/deleteCampanha/' + req.params.id,
        method: 'DELETE',
    };


    var req = http.request(options, (res) => {
        console.log(`statusCode:${res.statusCode}`);
        res.setEncoding('utf-8');

        res.on('data', (d) => {
            campanha += d;
            console.log(campanha);
        });
    });

    req.on('error', (error) => {
        console.log(error);
    });
    console.log("aqui");
    req.end();



};

campanhaOptController.newCamp = function (req, res) {
    res.sendFile(path.join(__dirname, '../public/html', 'CriarCampanha.html'));
};


campanhaOptController.create = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.logo[0].path;
        const newPath = path.join(__dirname, "../public/images/logoCamp/" + files.logo[0].originalFilename);
        fs.rename(oldpath, newPath, function (err) {
            if (err) throw err;
            console.log("done file saved");
        });



        var creatCamp = {
            description: fields.description[0],
            targetValue: parseInt(fields.targetValue[0]),
            logoName: files.logo[0].originalFilename,
            IBAN: fields.IBAN[0],
            responsaveis: fields["responsaveis[]"]

        };


        console.log(creatCamp);
        var details = JSON.stringify(creatCamp);
        var options = {
            hostname: 'localhost',
            port: 8080,
            path: '/api/v1/newCampanha',
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Content-Length': details.length
            }
        };
        // console.log(details);
        var campanha = "";
        var req = http.request(options, (res) => {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');

            res.on('data', (d) => {
                campanha += d;
                console.log(campanha);
            });
        });

        req.on('error', (error) => {
            console.log(error);
        });
        console.log(details);

        req.write(details);
        req.end();



    });

};
campanhaOptController.addDonation = function (req, res) {
    var campanha = "";
    
    console.log(req.body);

    var tempDonation = {
        donation: {
            user: req.body.username,
            montante: req.body.montante
        },
        id:"5ce1d067ae338220802d9675"
    }

    var details= JSON.stringify(tempDonation);
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/addDonation',
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Content-Length': details.length
        }
    };


    var req = http.request(options, (res) => {
        console.log(`statusCode:${res.statusCode}`);
        res.setEncoding('utf-8');

        res.on('data', (d) => {
            campanha += d;
            console.log(campanha);
        });
    });

    req.on('error', (error) => {
        console.log(error);
    });
    console.log(details);
    req.write(details);
    req.end();
    


};

campanhaOptController.updateStateDonation = function (req, res) {

};


module.exports = campanhaOptController;