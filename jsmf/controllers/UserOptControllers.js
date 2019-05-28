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
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/home");
        }
        if (users == null) {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/home");
        } else {
            res.render("../views/AdminUsers/list", { users: users });
        }
    });
};

userOptController.save = function (req, res, next) {
    var user = new User(req.body);

    user.save(function (err, user) {
        if (err) {
            req.flash('error_msg', 'Ocorreu um erro, este utilizador ja existe');
            res.redirect("/admin/listUsers");
        } else {
            req.flash('success_msg', 'Utilizador criado com sucesso');
            res.redirect("/admin/listUsers");
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
            IBAN: req.body.IBAN, localizacao: req.body.localizacao, nomeCompleto: req.body.nomeCompleto, tipoU: req.body.tipoU, NIF: req.body.NIF
        }
    }, { new: true }, function (err, user) {
        if (err) {

            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin/listUsers");
        }
        if (user == null) {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin/listUsers");
        } else {
            req.flash('success_msg', 'Utilizador editado com sucesso');
            res.redirect("/admin/listUsers");
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
            res.redirect("/admin/listUsers");
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
    User.remove({ _id: req.params.id }, function (err, user) {
        console.log("User");
        console.log(user);
        if (err) {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin/listUsers");
        }
        if (user.deletedCount == 0) {
            console.log("Aquii");
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin/listUsers");
        }
        else {
            req.flash("success_msg", "Utilizador apagado com sucesso");
            res.redirect("/admin/listUsers");
        }
    });
};

userOptController.allInfo = function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
            req.flash('error_msg', 'Ocorreu um erro');
            res.redirect("/admin/listUsers");
        }
        if (user == null) {
            req.flash('error_msg', 'Este utilizado nao existe');
            res.redirect("/admin/listUsers");
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
                    req.flash('error_msg', 'Ocorreu um erro');
                    res.redirect("/admin/listUsers");
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
            req.flash('error_msg', 'Utilizador nao existe');
            res.redirect("/admin/ManageUser");
        }
        if (user == null) {
            req.flash('error_msg', 'Utilizador nao existe');
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
};

module.exports = userOptController;