module.exports = {
  ensureAuthenticated: function (req, res, next) {
    
    if (req.isAuthenticated()) {
      return next();
    } else {
     // res.render('../views/login',{error:'Tem de fazer login para aceder a pagina'});
      
      req.flash('error_msg', 'Tem de fazer login para aceder a pagina');
      res.redirect('/login');
    }
  },
  adminAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.tipoU == 'Admin') {
        next();
      } else {
        req.flash('error_msg', 'Nao tem permissao para aceder a esta pagina');
        res.redirect('/home');
      }

    } else {
      req.flash('error_msg', 'Tem de fazer login para aceder a pagina');
      res.redirect('/login');
    }
  }
};