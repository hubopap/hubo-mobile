const sequelize = require("sequelize");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const Grupo = require('./models/grupo');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    credentials: true
}));

app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);



//Start Server

app.listen(3001, () => {
    console.log("Server aberto na porta 3001")
});

app.post("/register", async (req, res) => {
    const query_already_exists = await User.findOne({where: {username: req.body.username}});
    if(query_already_exists != null) {
        console.log("User already exists");
    }else{
        const user = await User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            email_user: req.body.email,
        });
        await user.save();
        res.send("User was Created");
    }
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if(!user) res.send("User does not exist");
        else{
            req.logIn(user, err => {
                if (err) throw err;
                res.send("Successfully authenticated");
                console.log(req.user);
            });
        }
    })(req, res, next);
});

app.get("/user", (req, res) => {
    res.send(req.user);    
});

app.get("/groups", (req, res) => {
    console.log(req.body)
});