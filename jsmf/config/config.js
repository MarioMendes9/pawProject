const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// Load User model
const User = require('../models/User');



module.exports = function (passport) {

    passport.use(new LocalStrategy(
        { usernameField: 'username' },
        (username, password, done) => {
            
            User.findOne({ username: username }).then(user => {
                
                if (!user) {
                    return done(null, false, { message: 'Este utilizador nao existe' });
                }
                else if (username == user.username && password == user.password) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorreta' });
                }
            });
        })
    );

    // tell passport how to serialize the user
    passport.serializeUser((user, done) => {
        var id=user._id;
        done(null, id);
    });

    passport.deserializeUser((id, done)=> {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


};