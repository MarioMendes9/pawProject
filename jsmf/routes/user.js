var express = require('express');
var router = express.Router();
var path = require('path');
var userOptions=require("../controllers/userController");



/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/html', 'home.html'));
  });

//normal board page 
router.get('/home',userOptions.sendHome);


  

module.exports=router;
