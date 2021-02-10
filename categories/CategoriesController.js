const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const Category = require('./Category');
const Slug = require('slugify');

router.get('/admin/categories/new', (request, response) => {
  response.render('admin/categories/new', { title: 'Nova categoria' });
});

router.post('/categories/save', (request, response) => {
  const { title } = request.body;
  
  return !title 
    ? response.redirect('/admin/categories/new') 
    : Category.create({
      title,
      slug: Slug(title)
    }).then(() => response.redirect('/')); 
});

router.get('/admin/categories', async (request, response) => {
  const categories = await Category.findAll({ raw: true });
  response.render('admin/categories/index', {
    categories, 
    title: 'Admin - Categorias',
  });
});

module.exports = router;