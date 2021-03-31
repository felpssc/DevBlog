const { request, response } = require('express');
const { hash } = require('bcryptjs');
const uuid = require('uuid');
const alert = require('alert');
const express = require('express');
const router = express.Router();
const User = require('./User');



router.get('/admin/users', (request, response) => {
  User.findAll().then(users => {
    response.render('admin/users/index', { title: 'Lista de usuários', users })
  });
});

router.get('/admin/users/create', (request, response) => {
  response.render('admin/users/create', { title: 'Criar usuário' });
});

router.post('/users/create', async (request, response) => {
  const { email, password } = request.body;


  User.findOne({
    where: {
      email: email
    }
  }).then(async user => {
    if(user) {
      alert(`O usuário "${email}" já existe!`);
      response.redirect('/admin/users/create');
    } else {
      const passwordHash = await hash(password, 8);
  
      User.create({
        id: uuid.v1(),
        email,
        password: passwordHash
      }).then( response.redirect('/admin/users') ).catch(error => {
        alert('Ocorreu um erro na criação do usuário, tente novamente.');
        response.redirect('/admin/users/create');
      });
    }
  });

});


module.exports = router;