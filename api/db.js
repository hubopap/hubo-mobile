const Sequelize =  require('sequelize');

const sequelize = new Sequelize('hubo', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  define: {
    charset: 'utf8'
  }
});

try {
    sequelize.authenticate();
    console.log('Conexão bem sucedida!');
  } catch (error) {
    console.error('Não foi possível ligar à base de dados:', error);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
