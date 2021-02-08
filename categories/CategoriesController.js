const { request, response } = require('express');
const express = require('express');
const router = express.Router();

router.get('/categories', (request, response) => {
  response.send('Categorias');
});

router.get('/admin/categories', (request, response) => {
  response.send('Nova Categoria');
});

module.exports = router;