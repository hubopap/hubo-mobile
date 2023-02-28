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


//Start Server

app.listen(3001, () => {
    console.log("Server aberto na porta 3001")
});

app.post("/register", (req, res) => {
    User.findOne({where: {username: req.body.username}}, async (err, doc) =>{
        if (err) throw err;
        if (doc) res.send("User Already Exists");
        if(!doc){
            const user = User.create({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 10),
                email_user: req.body.email,
            });
        }
    })
});

app.post("/login", (req, res) => {
    console.log(req.body)
});

app.get("/users", (req, res) => {
    console.log(req.body)
});

app.get("/groups", (req, res) => {
    console.log(req.body)
});