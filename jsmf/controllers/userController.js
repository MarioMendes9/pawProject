var mongoose = require("mongoose");
var path = require('path');
var http = require('http');


var userController = {};

userController.sendHome=function(req,res){

    var campanhas = "";
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/v1/getCampanhas'
    };

    var p1=new Promise(function(resolve,reject){
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
    
    p1.then(function(){
        console.log(campanhas.length);
        res.render("../views/All/home.ejs",{name:"Mario",campanha:JSON.parse(campanhas)});
    });

    



        

};



module.exports = userController;