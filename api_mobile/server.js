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
        res.send("User was created");
    }
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