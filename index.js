// imports
const express = require('express');
const { request, response } = require('express');
const bodyParser = require('body-parser');
const app = express();
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

// app configs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// database
connection
  .authenticate()
  .then(() => console.log('🔌 Connected do Database.'))
  .catch((error) => console.log(error));

// routes

app.use('/', categoriesController);

app.use('/', articlesController);

app.get('/', (request, response) => {
 response.render('index.ejs', 
 {
   title: 'Home'
 });
});


// port
app.listen(3000, () => console.log('🔥 Back-end started! port: 3000'));