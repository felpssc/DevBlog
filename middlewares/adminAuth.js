function adminAuth(request, response, next) {
  if(request.session.user) {
    next();
  } else {
    response.redirect('/admin/login');
  }
}

module.exports = adminAuth;