// imports
const express = require("express");
const { request, response } = require("express");
const bodyParser = require("body-parser");
const app = express();
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const Category = require("./categories/Category");
const Article = require("./articles/Article");

// app configs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// database
connection
  .authenticate()
  .then(() => console.log("🔌 Connected do Database."))
  .catch((error) => console.log(error));

// routes

app.use("/", categoriesController);

app.use("/", articlesController);

app.get("/", async (request, response) => {
  Article.findAll({
    include: [{ model: Category}],
    order: [
      ['id', 'DESC']
    ]
  }).then((articles) => {
    Category.findAll().then(categories => {
      response.render("index", {
        title: "Home",
        articles,
        categories
      });
    });
  });
});

app.get('/:slug', (request, response) => {
  const { slug } = request.params;
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if(article) {
      Category.findAll().then(categories => {
        response.render("article", { article, title: article.title, categories });
      });
    } else {
      response.redirect('/');
    }
  }).catch(error => response.redirect('/'));
});

app.get('/categories/:slug', (request, response) => {
  const { slug } = request.params;
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  }).then(category => {
    if(category) {
      Category.findAll().then(categories => {
        response.render("index", { articles: category.articles, categories, title: category.title })
      });
    } else {
      response.redirect('/');
    }
  }).catch(error => response.redirect('/'));
});

// port
app.listen(3000, () => console.log("🔥 Back-end started! port: 3000"));
