module.exports = function (req, res, next) {
  if (!req.session.user && req.path !== '/login') {
    return res.redirect('/login');
  }
  next();
};
