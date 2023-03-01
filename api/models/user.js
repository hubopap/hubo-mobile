const db = require('../db');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;

const User = sequelize.define('User', {
    id_user:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username:{
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING(255),
        allowNull: false
    },
    bio_user:{
        type: Sequelize.STRING(255)
    },
    email_user:{
        type: Sequelize.STRING(255),
         allowNull: false
    }
});

module.exports = User;