const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('categories', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },

  slug: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Category.sync({ force: false })
  .then(() => console.log('🔃 categories table synchronized'))
  .catch((error) => console.log(error));

module.exports = Category;