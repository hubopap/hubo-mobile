const Sequelize = require('sequelize');
const sequelize = require('../db');

const Grupo = sequelize.define('Group', {
    id_grupo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nome_grupo:{
        type: Sequelize.STRING(45),
        allowNull: false
    },
    desc_grupo:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Grupo;