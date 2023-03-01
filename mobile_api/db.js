
const Sequelize = require("sequelize");

const myDB = new Sequelize(
    "teste", 
    "root", 
    "", 
    {
        dialect: 'mariadb',
        define: {
          charset: 'utf8'
        },
        host: 'localhost',
        dialect: 'mysql'
    }
);

module.exports = myDB;