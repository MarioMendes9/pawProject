var mongoose = require("mongoose");
var path = require('path');
var http = require('http');
var User = require("../models/User");
const passport = require('passport');


var userController = {};

userController.userLogin = function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};


userController.userLogout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
};
userController.sendHome = function (req, res, next) {
    var logUser = req.user;

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
                console.log("campanhas");
                console.log(campanhas);
                resolve();

            });
        });

        newReq.on('error', (error) => {
            console.log(error);
        });
    });

    p1.then(function () {
        /* User.find({}).distinct('localizacao').exec(function (err, loca) {
             if (err) {
                 console.log(err);
             } else {
 
                 for (var i = 0; i < loca.length; i++) {
                     loca[i] = JSON.parse(loca[i]);
                 }
 
                 res.render("../views/home", { user: logUser, campanha: JSON.parse(campanhas), loca: loca });
             }
         });
 
 */
        res.render("../views/home", { user: logUser, campanha: JSON.parse(campanhas) });


    });
};



userController.register = function (req, res) {
    var user = new User(req.body);
    req.body.username = req.body.username.toLowerCase();
    console.log(req.body);


    let errors = [];

    //check tamanha do password

    if (user.username.indexOf(' ') >= 0) {
        errors.push({ msg: "O nome de utilizador nao pode conter espaços" });
    }

    if (user.password.length < 6) {
        errors.push({ msg: "Password demasiado curta, pelo menos 6 caracteres!" });
    }

    if (user.NIF <= 99999999 || user.NIF > 999999999) {
        errors.push({ msg: "Insira um NIF valido por favor!" });
    }

    if (errors.length > 0) {
        res.render('../views/Registo', { errors: errors, user: user });
    } else {


        user.save(function (err, createUser) {
            if (err) {
                console.log(err);
                errors.push({ msg: 'Este utilizador ja existe!' });
                res.render('../views/Registo', { errors: errors, user: user });
            } else {
                req.flash('success_msg', 'Registo efetuado com sucesso');
                res.redirect("/login");
            }
        });
    }


};

userController.contactPage = function (req, res) {
    var logUser = req.user;

    res.render("../views/All/contactos.ejs", { user: logUser });

};

module.exports = userController;