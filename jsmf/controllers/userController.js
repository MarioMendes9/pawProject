var mongoose = require("mongoose");
var path = require('path');
var http = require('http');
var User = require("../models/User");

var userController = {};

userController.sendHome = function (req, res) {

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
        console.log(campanhas.length);
        res.render("../views/All/home", { name: "Mario", campanha: JSON.parse(campanhas) });
    });







};



userController.register = function (req, res) {
    var user = new User(req.body);

    let errors = [];

    //check tamanha do password

    if (user.username.indexOf(' ') >= 0) {
        errors.push({ msg: "O nome de utilizador nao pode conter espaços" });
    }

    

    if (user.password.length < 6) {
        errors.push({ msg: "Password demasiado curta, pelo menos 6 caracteres!" });
    }

    if (user.NIF <= 99999999 || user.NIF>999999999) {
        errors.push({ msg: "Insira um NIF valido por favor!" });
    }

    if (errors.length > 0) {
        res.render('../views/Registo', { errors: errors, user: user });
    } else {
        

        user.save(function (err,createUser) {
            if (err) {
                console.log(err);
                errors.push({msg:'Este utilizador ja existe!'});
                res.render('../views/Registo', { errors: errors, user: user });
            } else {
                req.flash('success_msg','Registo efetuado com sucesso');
                res.redirect("/login");
            }
        });
    }


};

module.exports = userController;