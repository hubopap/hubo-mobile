const sequelize = require("sequelize");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");

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
    console.log(req.body)
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