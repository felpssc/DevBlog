const { request, response } = require('express');
const express = require('express');
const router = express.Router();

router.get('/articles', (request, response) => {
  response.send('Artigos');
});

router.get('/admin/articles', (request, response) => {
  response.send('Novo Artigo');
});

module.exports = router;