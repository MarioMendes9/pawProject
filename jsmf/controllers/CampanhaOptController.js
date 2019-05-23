var mongoose = require("mongoose");
var path = require('path');
var http = require('http');
var fs = require('fs');
var multiparty = require('multiparty');
var campanhaOptController = {};


campanhaOptController.manage = function (req, res) {
    res.render("../views/AdminDonation/manageCamp");
};


campanhaOptController.getAll = function (req, res) {
    var campanhas = "";
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanhas'
    };


    var p1 = new Promise(function (resolve, reject) {
        var req = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanhas += d;
                console.log(campanhas);
                resolve();

            });
        });

        req.on('error', (error) => {
            console.log(error);
        });

    });
    p1.then(function () {
        res.render("../views/AdminDonation/listCampanha", { campanhas: JSON.parse(campanhas) });

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

    var p1 = new Promise(function (resolve, reject) {
        var req = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanha += d;
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log(error);
        });
    });


    p1.then(function () {

        res.render("../views/AdminDonation/showCampanha", { campanha: JSON.parse(campanha) });
    });
};



campanhaOptController.delete = function (req, res) {

    var filen = req.params.id;


    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/deleteCampanha/' + req.params.id,
        method: 'DELETE',
    };

    var p1 = new Promise(function (resolve, reject) {
        var req = http.request(options, (res) => {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', (d) => {
                var campanha = JSON.parse(d);
                //Se conseguir apagar a campanha
                if (campanha.n == 1) {
                    const filePath = path.join(__dirname, "../public/images/logoCamp/" + filen);
                    fs.unlinkSync(filePath);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log(error);
        });
        req.end();

    })

    p1.then(function () {
        res.redirect("/admin/getCampanhas");
    });

};

campanhaOptController.newCamp = function (req, res) {
    res.sendFile(path.join(__dirname, '../public/html', 'CriarCampanha.html'));
};


campanhaOptController.create = function (req, res) {
    var newFileName;
    var form = new multiparty.Form();

    var p2 = new Promise(function (resolve, reject) {
        form.parse(req, function (err, fields, files) {
            const dir = path.join(__dirname, "../public/images/logoCamp");
            var oldpath = files.logo[0].path;
            var originalFile = files.logo[0].originalFilename;
            fs.readdir(dir, function (err, files) {
                newFileName = "log" + (files.length) + originalFile.substr(originalFile.length - 4);
                var newPath = path.join(__dirname, "../public/images/logoCamp/" + newFileName);
                fs.rename(oldpath, newPath, function (err) {
                    if (err) throw err;
                    console.log("done file saved");
                    resolve(fields);
                });
            });
        });

    });

    p2.then(function (fields) {

        var creatCamp = {
            description: fields.description[0],
            targetValue: parseInt(fields.targetValue[0]),
            logoName: newFileName,
            IBAN: fields.IBAN[0],
            responsaveis: fields["responsaveis[]"]

        };

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
        var p1 = new Promise(function (resolve, reject) {
            var req = http.request(options, (res) => {
                console.log(`statusCode:${res.statusCode}`);
                res.setEncoding('utf-8');

                res.on('data', (d) => {
                    campanha += d;
                    resolve();
                });
            });

            req.on('error', (error) => {
                console.log(error);
            });


            req.write(details);
            req.end();
        });

        p1.then(function () {
            res.redirect("/admin/ManageDonations");
        });

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
        id: req.body.idCampanha
    }

    var details = JSON.stringify(tempDonation);
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

    res.redirect("/home");




};

campanhaOptController.sendEditCamp = function (req, res) {
    var campanha = "";

    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanha/' + req.params.id,
    }

    var p1 = new Promise(function (resolve, reject) {
        var req = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanha += d;
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log(error);
        });
    });


    p1.then(function () {
        console.log(campanha);
        res.render("../views/AdminDonation/editCampanhas", { campanha: JSON.parse(campanha) });
    });




};

campanhaOptController.editCamp = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var upCamp;
        if (files.logo[0].originalFilename != "") {
            fields.logoName = files.logo[0].originalFilename;
            var oldpath = files.logo[0].path;
            const newPath = path.join(__dirname, "../public/images/logoCamp/" + files.logo[0].originalFilename);
            fs.rename(oldpath, newPath, function (err) {
                if (err) throw err;
                console.log("done file saved");
            });

            console.log(fields);
            upCamp = {
                estado: fields.estado[0],
                description: fields.description[0],
                targetValue: parseInt(fields.targetValue[0]),
                logoName: files.logo[0].originalFilename,
                IBAN: fields.IBAN[0],
                responsaveis: fields.responsaveis

            };

        }
        else {
            var tempName = fields.oldLog[0];
            delete fields["LogoName"];
            fields.logoName = tempName;

            upCamp = {
                estado: fields.estado[0],
                description: fields.description[0],
                targetValue: parseInt(fields.targetValue[0]),
                logoName: fields.oldLog[0],
                IBAN: fields.IBAN[0],
                responsaveis: fields.responsaveis

            };
        }
        console.log(upCamp);
        var details = JSON.stringify(upCamp);
        var options = {
            hostname: 'localhost',
            port: 8080,
            path: '/api/v1/updateCampanha/' + req.params.id,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Content-Length': details.length
            }
        };
        // console.log(details);
        var campanha = "";
        var p1 = new Promise(function (resolve, reject) {
            var req = http.request(options, (res) => {
                console.log(`statusCode:${res.statusCode}`);
                res.setEncoding('utf-8');

                res.on('data', (d) => {
                    campanha += d;
                    resolve();
                });
            });

            req.on('error', (error) => {
                console.log(error);
                reject();
            });
            console.log(details);

            req.write(details);
            req.end();
        });

        p1.then(function () {
            res.redirect("/admin/InfoCamp/" + req.params.id);
        });





    });


};

campanhaOptController.updateStateDonation = function (req, res) {
    var campanha = "";
    var campID = req.body.campId;
    var details = JSON.stringify(req.body);
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/updateStateDonation',
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
    res.redirect("/admin/InfoCamp/" + campID);
};


campanhaOptController.sendEditDonation = function (req, res) {
    var campanha = "";

    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanha/' + req.params.id,
    }

    var p1 = new Promise(function (resolve, reject) {
        var req = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanha += d;
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log(error);
        });
    });


    p1.then(function () {
        console.log(campanha);
        res.render("../views/AdminDonation/listDonations", { campanha: JSON.parse(campanha) });
    });


};


campanhaOptController.deleteDonation = function (req, res) {
    var campanha = "";
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/deleteDonation/' + req.params.id,
        method: 'DELETE',
    };
    console.log(options);

    var p1 = new Promise(function (resolve, reject) {
        var req = http.request(options, (res) => {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');

            res.on('data', (d) => {
                campanha += d;
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log(error);
        });
        req.end();

    })

    p1.then(function () {
        res.redirect("/admin/getCampanhas");
    });

};


campanhaOptController.donationsToAprove = function (req, res) {
    var campanhas = "";
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanhas'
    };


    var p1 = new Promise(function (resolve, reject) {
        var req = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanhas += d;
                resolve();

            });
        });

        req.on('error', (error) => {
            console.log(error);
        });

    });
    p1.then(function () {
        res.render("../views/AdminDonation/aproveDonations", { campanhas: JSON.parse(campanhas) });

    });

};

module.exports = campanhaOptController;