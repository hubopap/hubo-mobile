//Import Modules
const express = require("express");
const exphbs = require("express-handlebars");
const passport = require("./passport/passport");
const session = require("express-session");
const bodyParser = require("body-parser");

//API Server Port 
const PORT = 3001;

//Import Database Models
const Grupo = require('./models/grupo');
const User = require('./models/user');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Syncing our sequelize models and then starting our Express app
db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});

//MiddleWare
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login session

app.get("/",function(req,res){
    res.render("signin_signup")
})

app.get("/logout", function (req, res) {
    console.log("Log Out Route Hit");
    req.session.destroy(function (err) {
        if (err) console.log(err)
            res.redirect('/');
    });
});


app.post('register', passport.authenticate('local-signup'), function (req, res) {
    console.log(req.user);
    res.render('homepage');
});

    
app.post("login",passport.authenticate('local-signin'),function(req,res) {
    
    console.log(req.user);
    res.render('homepage');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/signin');

}
