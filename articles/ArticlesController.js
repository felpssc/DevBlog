const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', async (request, response) => {
  const articles = await Article.findAll({
    include: [{ model: Category }]
  }).then(articles => { response.render('admin/articles/index', { title: 'Artigos', articles })});
});

router.get('/admin/articles/new', (request, response) => {
  Category.findAll().then(categories => {
    response.render('admin/articles/new', { title: 'Novo artigo', categories });
  });
});

router.post('/articles/save', (request, response) => {
  const { title, body, category, description } = request.body;

  Article.create({
    title,
    description,
    slug: slugify(title),
    body,
    categoryId: category
  }).then(() => {
    response.redirect('/admin/articles');
  });

});

router.post('/articles/delete/', (request, response) => {
  const { id } = request.body;

  if(id) {
    
    if(!isNaN(id)) {
      Article.destroy({
        where: {
          id: id
        }
      }).then(() => response.redirect('/admin/articles'));
    } else {
      response.redirect('/admin/articles');
    }
  } else {
    response.redirect('/admin/articles');
  }
});

module.exports = router;