const { request, response } = require('express');
const { hash, compareSync } = require('bcryptjs');
const uuid = require('uuid');
const alert = require('alert');
const express = require('express');
const session = require('express-session');
const router = express.Router();
const User = require('./User');
const adminAuth = require('../middlewares/adminAuth');



router.get('/admin/users', adminAuth, (request, response) => {
  User.findAll().then(users => {
    response.render('admin/users/index', { title: 'Lista de usuários', users })
  });
});

router.get('/admin/users/create', adminAuth, (request, response) => {
  response.render('admin/users/create', { title: 'Criar usuário' });
});

router.post('/users/create', adminAuth, async (request, response) => {
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

router.get('/admin/login', (request, response) => {
  return response.render('admin/users/login', { title: 'Login' });
});

router.post('/admin/authenticate', (request, response) => {
  const { email, password } = request.body;

  User.findOne({ where: { email } }).then(user => {
    if(user) {
      const isCredentialsCorrect = compareSync(password, user.password);

      if(isCredentialsCorrect) {
        request.session.user = {
          user_id: user.id,
          email: user.email
        }
        response.redirect('/admin/articles');
      } else {
        alert('Email e/ou senha incorretos!');
        response.redirect('/admin/login');
      }

    } else {
      response.redirect('/admin/login');
    }
    
  })
});

router.get('/admin/logout', (request, response) => {
  request.session.destroy().then(response.redirect('/admin/login'));
});


module.exports = router;