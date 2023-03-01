const expressSession = require("express-session");
const SessionStore = require("express-session-sequelize")(expressSession.Store);
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const myDB = require("./db");
const User = require('./models/user');
const Grupo = require('./models/grupo');

User.sync({force:true});
Grupo.sync({force:true});

const { urlencoded } = require("body-parser");


const sequelizeSessionStore = new SessionStore({
    db: myDB
});

app = express();

app.listen(3001, () => {
    console.log('api iniciada em http://localhost:3001');
});

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

app.get("/login", (req, res) => {
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({LoggedIn: false});
    }
})

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    
    const findUser = await User.findOne({where: {username: username}}, (err, result) => {
        if(findUser===null) {
            res.send({message: "User does not exist!"});
        }else if(findUser){
            bcrypt.compare(password, findUser.password, (err, res) => {
                if(err){
                    res.send(err);
                } else if(res) {
                    req.session.user = result;
                    res.send(result);
                }else{
                    res.send({message: "Wrong Username or Password"});
                }
            })
        }
    });
})
