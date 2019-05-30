var mongoose = require("mongoose");
var path = require('path');
var http = require('http');
var fs = require('fs');
var multiparty = require('multiparty');
var campanhaOptController = {};
var User = require("../models/User");
var paypal = require('paypal-rest-sdk');

paypal.configure({
    mode: 'sandbox', // Sandbox or live
    client_id: 'Aeb-2J__sCU-tFm7Of4iOksS6nPFEMktZBcuOR0_-yOgxoCt4zRcyaUU1444hXiDY-FmK-51evl7fgIY',
    client_secret: 'EI5zyBlDNkS5d9c35REI15uBowRo8_mevJ0hxtZwX6eJzmJd0wWwIsSsH8_-IYiXvV4ta_ywyOt7Qz1g'
});

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
        var newReq = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanhas += d;
                resolve();

            });
        });

        newReq.on('error', (error) => {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");
        });

    });
    p1.then(function () {

        User.find({}).distinct('localizacao').exec(function (err, loca) {
            if (err) {
                req.flash('error_msg', 'Ocorreu um erro');
                res.redirect("/admin");
            } else {
                for (var i = 0; i < loca.length; i++) {
                    loca[i] = JSON.parse(loca[i]);
                }
                res.render("../views/AdminDonation/listCampanha", { campanhas: JSON.parse(campanhas), loca: loca });
            }
        });
    });

};


campanhaOptController.getCampById = function (req, res) {

    var campanha = "";

    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanha/' + req.params.id,
    }

    var p1 = new Promise(function (resolve, reject) {
        var newReq = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanha += d;
                resolve();
            });
        });

        newReq.on('error', (error) => {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");
        });
    });


    p1.then(function () {

        if (JSON.parse(campanha) == null) {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");
        } else {

            res.render("../views/AdminDonation/showCampanha", { campanha: JSON.parse(campanha) });
        }
    });
};



campanhaOptController.delete = function (req, res) {

    var filen = req.body.logoName;

    var campanha;
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/deleteCampanha/' + req.params.id,
        method: 'DELETE',
    };

    var p1 = new Promise(function (resolve, reject) {
        var newReq = http.request(options, (res) => {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', (d) => {
                campanha = JSON.parse(d);
                if (campanha.n == 1) {
                    const filePath = path.join(__dirname, "../public/images/logoCamp/" + filen);
                    fs.unlinkSync(filePath);
                }
                resolve();
            });
        });

        newReq.on('error', (error) => {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");
        });
        newReq.end();

    })

    p1.then(function () {

        if (campanha.deletedCount != 0) {
            req.flash('success_msg', 'Campanha apagada com sucesso');
            res.redirect("/admin");

        }
        else {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");
        }
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
        var campanha;
        var p1 = new Promise(function (resolve, reject) {
            var newReq = http.request(options, (res) => {
                console.log(`statusCode:${res.statusCode}`);
                res.setEncoding('utf-8');

                res.on('data', (d) => {
                    campanha = d;
                    resolve();
                });
            });

            newReq.on('error', (error) => {

                req.flash('error_msg', 'Ocorreu um erro');
                res.redirect("/admins");
            });


            newReq.write(details);
            newReq.end();
        });

        p1.then(function () {
            req.flash('success_msg', 'Campanha criada com sucesso');
            res.redirect("/admin");

        });

    });




};


campanhaOptController.addDonation = function (req, res) {
    var campanha;
    var pro = new Promise(function (resolve, reject) {


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


        var newReq = http.request(options, (res) => {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');

            res.on('data', (d) => {
                campanha = d;

                if (campanha == 'null') {
                    reject();
                } else {
                    resolve();
                }


            });
        });

        newReq.on('error', (error) => {
            reject();
        });
        newReq.write(details);
        newReq.end();

    });

    pro.then(function () {
        req.flash('success_msg', 'Obrigado pela donation!');
        res.redirect("/home");
    }, function () {
        req.flash('error_msg', 'Pedimos desculpa mas ocorreu um erro, tente mais tarde!');
        res.redirect("/home");
    });

};

campanhaOptController.sendEditCamp = function (req, res) {
    var campanha = "";

    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanha/' + req.params.id,
    }

    var p1 = new Promise(function (resolve, reject) {
        var newReq = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanha += d;
                resolve();
            });
        });

        newReq.on('error', (error) => {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");
        });
    });


    p1.then(function () {
        if (campanha == "null") {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");
        } else {
            res.render("../views/AdminDonation/editCampanhas", { campanha: JSON.parse(campanha) });
        }

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
            var newReq = http.request(options, (res) => {
                console.log(`statusCode:${res.statusCode}`);
                res.setEncoding('utf-8');

                res.on('data', (d) => {
                    campanha += d;
                    resolve();
                });
            });

            newReq.on('error', (error) => {
                console.log(error);
                reject();
            });


            newReq.write(details);
            newReq.end();
        });

        p1.then(function () {
            campanha = JSON.parse(campanha);
            if (campanha == null) {
                req.flash('error_msg', 'Ocorreu um erro');
                res.redirect("/admin");

            }
            else {
                res.redirect("/admin/InfoCamp/" + req.params.id);

            }
        });
    });


};
/*********************************************************************** */

campanhaOptController.updateStateDonation = function (req, res) {
    var campanha;
    var campID = req.body.campId;
    var p1 = new Promise(function (resolve, reject) {
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


        var newReq = http.request(options, (res) => {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');

            res.on('data', (d) => {
                campanha = d;
                resolve();

            });
        });

        newReq.on('error', (error) => {
            reject();

        });

        newReq.write(details);
        newReq.end();
    });

    p1.then(function () {
        if (campanha == 'null') {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");

        } else {
            res.redirect("/admin/InfoCamp/" + campID);
        }
    });
};


campanhaOptController.sendEditDonation = function (req, res) {
    var campanha = "";

    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanha/' + req.params.id,
    }

    var p1 = new Promise(function (resolve, reject) {
        var newReq = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanha += d;
                resolve();
            });
        });

        newReq.on('error', (error) => {
            console.log(error);
        });
    });


    p1.then(function () {
        if (campanha == 'null') {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");

        } else {
            res.render("../views/AdminDonation/listDonations", { campanha: JSON.parse(campanha) });
        }
    });


};


campanhaOptController.deleteDonation = function (req, res) {
    var campanha;
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/deleteDonation/' + req.params.id,
        method: 'DELETE',
    };


    var p1 = new Promise(function (resolve, reject) {
        var newReq = http.request(options, (res) => {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');

            res.on('data', (d) => {
                campanha = d;
                resolve();
            });
        });

        newReq.on('error', (error) => {
            console.log(error);
        });
        newReq.end();

    })

    p1.then(function () {

        campanha = JSON.parse(campanha);
        if (campanha.nModified == 0) {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin");

        } else {
            req.flash('success_msg', 'Apagado com sucesso');
            res.redirect("/admin/getCampanhas");
        }
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
        var newReq = http.get(options, function (res) {
            console.log(`statusCode:${res.statusCode}`);
            res.setEncoding('utf-8');
            res.on('data', function (d) {
                campanhas += d;
                resolve();

            });
        });

        newReq.on('error', (error) => {
            console.log(error);
            reject();
        });

    });
    p1.then(function () {
        res.render("../views/AdminDonation/aproveDonations", { campanhas: JSON.parse(campanhas) });

    });

};



campanhaOptController.donatePaypal = function (req, res) {

    var tempDonation = {
        donation: {
            user: req.body.username,
            montante: req.body.montante
        },
        id: req.body.idCampanha
    }

    // create payment obje
    var payReq = JSON.stringify({
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: 'http://localhost:3000/admin/success',
            cancel_url: 'http://localhost:3000/admin/cancel'
        },
        transactions: [{
            amount: {
                total: req.body.montante,
                currency: 'EUR'
            },
            "item_list": {
                "items": [{
                    "name": "Doaçao",
                    "sku": "Doaçao",
                    "price": req.body.montante,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },

            description: 'Obrigado pela sua doaçao.'
        }]
    });

    paypal.payment.create(payReq, function (error, payment) {
        var links = {};

        if (error) {
            console.error(JSON.stringify(error));
        } else {
            // Capture HATEOAS links
            payment.links.forEach(function (linkObj) {
                links[linkObj.rel] = {
                    href: linkObj.href,
                    method: linkObj.method
                };
            })

            // If the redirect URL is present, redirect the customer to that URL
            if (links.hasOwnProperty('approval_url')) {

                var campanha;
                var pro = new Promise(function (resolve, reject) {


                    var tempDonation = {
                        donation: {
                            estado:true,
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


                    var newReq = http.request(options, (res) => {
                        console.log(`statusCode:${res.statusCode}`);
                        res.setEncoding('utf-8');

                        res.on('data', (d) => {
                            campanha = d;

                            if (campanha == 'null') {
                                reject();
                            } else {
                                resolve();
                            }


                        });
                    });

                    newReq.on('error', (error) => {
                        reject();
                    });
                    newReq.write(details);
                    newReq.end();

                });

                pro.then(function () {
                    res.redirect(links['approval_url'].href);
                }, function () {
                    req.flash('error_msg', 'Pedimos desculpa mas ocorreu um erro, tente mais tarde!');
                    res.redirect("/home");
                });

                
            } else {
                console.error('no redirect URI present');
            }
        }
    });
}

campanhaOptController.addDonatePaypal = function (req, res) {
    var paymentId = req.query.paymentId;
    var payerId = { payer_id: req.query.PayerID };

    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        if (error) {
            console.error(JSON.stringify(error));
        } else {
            if (payment.state == 'approved') {
                req.flash('success_msg', 'Obrigado pela donation!');
                res.redirect("/home");
            } else {
                req.flash('error_msg', 'Pedimos desculpa mas ocorreu um erro, tente mais tarde!');
                res.redirect("/home");
            }
        }
    });
};
module.exports = campanhaOptController;