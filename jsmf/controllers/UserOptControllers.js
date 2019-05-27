var mongoose = require("mongoose");
var User = require("../models/User");
var path = require('path');
var http = require('http');

var userOptController = {};

userOptController.manage = function (req, res) {
    res.render("../views/AdminUsers/manageUsers");
};

userOptController.list = function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            console.log("Error:", error);
        } else {
            // res.json(users);
            res.render("../views/AdminUsers/list", { users: users });
        }
    });
};

userOptController.save = function (req, res, next) {
    console.log(req.body);
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect("/");
        }
    });
};

userOptController.create = function (req, res) {
    res.sendFile(path.join(__dirname, '../public/html', 'Registo.html'));
};


userOptController.edit = function (req, res) {

    User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username, password: req.body.password,
            IBAN: req.body.IBAN, localizacao: req.body.localizacao, nomeCompleto: req.body.nomeCompleto, tipoU: req.body.tipoU
        }
    }, { new: true }, function (err, user) {
        if (err) {

            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/home");
        }
        if (user == null) {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/home");
        } else {
            req.flash('success_msg', 'Utilizador editado com sucesso');
            res.redirect("/home");
        }


    });
};

userOptController.showEditUser = function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
            next(err);
        }
        if (user == null) {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/home");
        }
        else {
            if (req.user.tipoU == "Admin") {
                res.render("../views/AdminUsers/editUser", { user: user, isAdmin: true });
            }
            else {
                res.render("../views/AdminUsers/editUser", { user: user, isAdmin: false });
            }
        }
    });
};

userOptController.delete = function (req, res) {
    User.remove({ _id: req.params.id }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("User deleted!");
            res.redirect("/admin/listUsers");
        }
    });
};

userOptController.allInfo = function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            var donates;
            var options = {
                hostname: 'localhost',
                port: 8080,
                path: '/api/v1/userDonations/' + user.username,
            }

            var p1 = new Promise(function (resolve, reject) {
                var newReq = http.get(options, function (res) {
                    console.log(`statusCode:${res.statusCode}`);
                    res.setEncoding('utf-8');
                    res.on('data', function (d) {
                        donates = d;
                        resolve();
                    });
                });

                newReq.on('error', (error) => {
                    console.log(error);
                });
            });


            p1.then(function () {

                res.render("../views/AdminUsers/showUser", { user: user, donates: JSON.parse(donates) });
            });


        }
    });
};

userOptController.findByUsername = function (req, res) {
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            next(err);
        }
        if (user == null) {
            req.flash('error_msg', 'Utilizador nao existe');
            console.log("Enviou a mensagem");
            res.redirect("/admin/ManageUser");
        }
        else {
            var donates;
            var options = {
                hostname: 'localhost',
                port: 8080,
                path: '/api/v1/userDonations/' + user.username,
            }

            var p1 = new Promise(function (resolve, reject) {
                var newReq = http.get(options, function (res) {
                    console.log(`statusCode:${res.statusCode}`);
                    res.setEncoding('utf-8');
                    res.on('data', function (d) {
                        donates = d;
                        resolve();
                    });
                });

                newReq.on('error', (error) => {
                    req.flash('error_msg', 'Utilizador nao existe');
                    res.redirect("/admin/ManageUser");
                });
            });


            p1.then(function () {


                res.render("../views/AdminUsers/showUser", { user: user, donates: JSON.parse(donates) });

            });

        }
    });
}

module.exports = userOptController;