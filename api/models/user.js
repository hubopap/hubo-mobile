const db = require('../db');

const User = db.sequelize.define('User', {
    id_user:{
        type: db.Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username:{
        type: db.Sequelize.STRING(45),
        allowNull: false,
        unique: true
    },
    password:{
        type: db.Sequelize.STRING(255),
        allowNull: false
    },
    bio_user:{
        type: db.Sequelize.STRING(255)
    },
    email_user:{
        type: db.Sequelize.STRING(255),
         allowNull: false
    }
});

module.exports = User;