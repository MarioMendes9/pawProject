var mongoose = require("mongoose");
var User = require("../models/User");
var path = require('path');


var userOptController = {};

userOptController.opt = function (req, res) {
    res.render("../views/AdminOpt/adminOpt");
};

userOptController.manage = function (req, res) {
    res.render("../views/AdminOpt/manageUsers");
};




userOptController.list = function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            console.log("Error:", error);
        } else {
            // res.json(users);
            res.render("../views/AdminOpt/list", { users: users });
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

};

userOptController.delete = function (req, res) {

};

userOptController.allInfo = function (req, res) {
    User.findOne({_id:req.params.id},function(err,user){
        if(err){
            next(err);
        }
        else{
            res.render("../views/AdminOpt/showUser",{user:user});
        }
    });
};

module.exports = userOptController;






