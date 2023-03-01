const User = require('./models/user');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use( 
        new localStrategy ((username, password, done) => {
            User.findOne({where: {username: username}}, (err, user ) => {
                if (err) throw err;
                if(!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) throw err;
                    if (result === true) {
                        return done(null, user);
                    }else{
                        done(null, false);
                    }
                })
            });

        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        User.findByPk(id).then(function (user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
}