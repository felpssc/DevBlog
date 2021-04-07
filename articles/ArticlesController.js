const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, async (request, response) => {
  const articles = await Article.findAll({
    include: [{ model: Category }]
  }).then(articles => { response.render('admin/articles/index', { title: 'Artigos', articles })});
});

router.get('/admin/articles/new', adminAuth, (request, response) => {
  Category.findAll().then(categories => {
    response.render('admin/articles/new', { title: 'Novo artigo', categories });
  });
});

router.post('/articles/save', adminAuth, (request, response) => {
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

router.post('/articles/delete/', adminAuth, (request, response) => {
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

router.get('/admin/articles/edit/:id', adminAuth, (request, response) => {
  const { id } = request.params;

  Article.findOne({
    where: {
      id: id
    }
  }).then(article => {
    Category.findAll().then(categories => {
      response.render('admin/articles/edit', { article, title: article.title, categories });
    });
  }).catch(error => response.redirect('/admin/articles'));

});

router.post('/articles/edit/save', adminAuth, (request, response) => {
  const { id, title, description, body, category } = request.body;

  Article.update({ title, description, body, categoryId: category, slug: slugify(title) }, {
    where: {
      id: id
    }
  }).then(() => response.redirect('/admin/articles'));

});

router.get('/articles/page/:number_page', (request, response) => {
  const { number_page } = request.params;
  let calcOffset = 0;
  const articlesLimit = 4;

  isNaN(number_page) || number_page == 1 
    ? calcOffset = 0
    : calcOffset = (parseInt(number_page) - 1) * articlesLimit;

  Article.findAndCountAll({
    limit: articlesLimit,
    offset: calcOffset,
    order: [
      ['id', 'DESC']
    ]
  }).then(articles => {

    var next;

    if(calcOffset + articlesLimit >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    const result = {
      number_page: parseInt(number_page),
      next,
      articles
    }

    Category.findAll().then(categories => {
      response.render('admin/articles/page', { title: 'Artigos', categories, result })
    });
  });
});

module.exports = router;