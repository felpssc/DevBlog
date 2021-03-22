const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const Category = require('./Category');
const Slug = require('slugify');
const { default: slugify } = require('slugify');

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
    }).then(() => response.redirect('/admin/categories')); 
});

router.get('/admin/categories', async (request, response) => {
  const categories = await Category.findAll({ raw: true });
  response.render('admin/categories/index', {
    categories, 
    title: 'Admin - Categorias',
  });
});

router.post('/categories/delete/', (request, response) => {
  const { id } = request.body;

  if(id) { 
    if(!isNaN(id)) {
      Category.destroy({
        where: {
          id: id
        }
      }).then(() => response.redirect('/admin/categories'));
    } else {
      response.redirect('/admin/categories');
    }
  } else {
    response.redirect('/admin/categories');
  }

});

router.get('/admin/categories/edit/:id', (request, response) => {
  const { id } = request.params;

  isNaN(id) && response.redirect('/admin/categories');

  Category.findByPk(id).then(categoryToEdit => {
    categoryToEdit !== undefined 
      ? response.render('admin/categories/edit', { categoryToEdit, title: 'Editar categoria' })
      : response.redirect('/admin/categories');
  }).catch(error => response.redirect('admin/categories'));
});

router.post('/categories/edit/save', (request, response) => {
  const { title, id } = request.body;

  Category.update({title: title, slug: slugify(title)}, {
    where: {
      id: id
    }
  }).then(() => response.redirect('/admin/categories'));
});

module.exports = router;