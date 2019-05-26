var express = require('express');
var router = express.Router();
var path = require('path');
var userOptions = require("../controllers/userController");
const { ensureAuthenticated } = require('../controllers/auth');





/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  }
  else{
    res.sendFile(path.join(__dirname, '../public/html', 'firstPage.html'));
  }
  
});

//normal board page 
router.get('/home', ensureAuthenticated, userOptions.sendHome);

//Register page 

router.get('/register', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.render("../views/Registo");
  }
})

router.post('/register', userOptions.register);

router.get('/login', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.render("../views/login");
  }
});


router.post('/login', userOptions.userLogin);

router.get('/logout', userOptions.userLogout);
module.exports = router;
