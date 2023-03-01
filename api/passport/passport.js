module.exports = function(passport, user) {
    const bcrypt = require("bcrypt");
    const passport = require("passport");
    const User = require("../models/user");
    var LocalStrategy = require("passport-local").Strategy;

    const Auth=User;

    passport.use("local-signup", new LocalStrategy(
        {
            usernameField: username,
            passwordField: password,
            passReqToCallback: true
        },
        function (req, username, password, done) {
            console.log("SignUp for - ", username);
            const generatehash = function(password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            }
            Auth.findOne({
                where: {
                    username: username
                }
            }).then(function(user){
                if(user){
                    return done(null, false, {
                        message: "Username já está em uso."
                    })
                } else {
                    const userPassword = generatehash(password);
                    const data = {
                        username:username,
                        password: password,
                        email:req.body.email
                    }

                    Auth.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    passport.use("local-signin", new LocalStrategy(
        {
            usernameField: username,
            passwordField: password,
            passReqToCallback: true
        },
        function(req, username, password, done) {
            const Auth = User;

            const isValidPassword = function(userpass, password) {
                return bcrypt.compareSync(password, userpass);
            }

            Auth.findOne({
                where: {
                    username: username
                }
            }).then(function(user) {
                console.log(user);
                if (!user) {
                    return done(null, false, {
                        message: "Username não existe!"
                    })
                }
                if(!isValidPassword(user.password, password)){
                    return done(null, false, {
                        message: "Palavra-passe errada!"
                    })
                }
                const userInfo = user.get();
                return done(null, userInfo);
            }).catch(function(err) {
                console.log("Error: ", err);
                return done(null, false,  {
                    message: "Algo correu mal!"
                });
            });
        }
    ));

    //Serialize

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Auth.findById(id).then(function(user) {
            if (user) {
                done(null, user.get());
            }else{
                done(user.errors, null);
            }
        });
    });
}