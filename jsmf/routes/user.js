var express = require('express');
var router = express.Router();
var path = require('path');
var userOptions = require("../controllers/userController");




/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/html', 'firstPage.html'));
});

//normal board page 
router.get('/home', userOptions.sendHome);

//Register page 

router.get('/register',function(req,res){
  res.render("../views/Registo");
})

router.post('/register',userOptions.register);

router.get('/login',function(req,res){
  res.render("../views/login");
});
module.exports = router;
