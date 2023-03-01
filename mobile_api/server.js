const expressSession = require("express-session");
const SessionStore = require("express-session-sequelize")(expressSession.Store);
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
import myDB from 'db';
import User from './models/user';
import Grupo from './models/grupo';



const { urlencoded } = require("body-parser");


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


app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = await User.findOne({where: {username: username}});
    if(findUser===null) {
        res.send({message: "User does not exist!"});
    }else if(findUser){
        bcrypt.compare(password, findUser.password, (err, res) => {
            if(res) {
                console.log(res);
            }
        })
    }
})
