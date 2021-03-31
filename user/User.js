const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

User.sync({ force: false })
  .then(() => console.log('🔃 users table synchronized'))
  .catch((error) => console.log(error));

module.exports = User;