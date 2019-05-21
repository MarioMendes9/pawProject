var mongoose = require("mongoose");
var User = require("../models/User");
var path = require('path');


var userOptController = {};

/* userOptController.opt = function (req, res) {
    res.render("../views/AdminUsers/adminUsers");
}; */

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
            console.log("Emplooyee:" + user);
            console.log(err);
            res.render("../views/AdminUsers/editUser", { employee: req.body });
        }
        console.log("Aquiiii");
        res.redirect("/admin/showInfo/" + user.id);
    });
};

userOptController.showEditUser = function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            res.render("../views/AdminUsers/editUser", { user: user });
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
            res.render("../views/AdminUsers/showUser", { user: user });
        }
    });
};

userOptController.findByUsername=function(req,res){
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            console.log(user);
            res.render("../views/AdminUsers/showUser", { user: user });
        }
    });
}

module.exports = userOptController;






