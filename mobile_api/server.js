const expressSession = require("express-session");
const SessionStore = require("express-session-sequelize")(expressSession.Store);
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");



const Sequelize = require("sequelize");
const { urlencoded } = require("body-parser");
const myDB = new Sequelize("teste", "root", "", {
    host: 'localhost',
    dialect: 'mysql'
});

const sequelizeSessionStore = new SessionStore({
    db: myDB
});

app = express();

app.use(cookieParser());
app.use(expressSession({
    key: "id_user",
    secret: "secredomaissecretodomundo",
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60*60*24
    }
}));

app.use(urlencoded({extended: true}));

app.use(cors({
    methods: ["GET", "POST"],
    credentials: true
}));


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


})
