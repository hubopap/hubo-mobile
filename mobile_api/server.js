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
app.use(express.json());
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
});

app.post("/register", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const findUser = await User.findOne({where: {username: username}}, (err, result) => {

    }); 
        if(findUser===null) {
            bcrypt.hash(password, 10, async (err, hash) => {
                if(err) console.log(err);
                try{
                    const user = await User.create({
                        username: req.body.username,
                        password: hash,
                        email_user: req.body.email,
                    });
                    res.send({message: "User criado com sucesso"});
                }catch(err){
                    if(err) {
                        console.log(err);
                    }
                }
            });
        }
})

app.get("/", (req, res) => {
    res.json({message: "ola 123"});
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = await User.findOne({where: {username: username}});
    if(findUser===null) {
        console.log("null");
        res.send({message: "User does not exist!"});
    }else if(findUser){
        result = findUser;
        console.log(result);
        const compare = await bcrypt.compare(password, findUser.password);
        if(compare == true){
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
        }
    }
})
