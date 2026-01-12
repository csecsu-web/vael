module.exports = function (req, res, next) {
  const openPaths = ['/login'];

  if (!req.session.user && !openPaths.includes(req.path)) {
    return res.redirect('/login');
  }

  next();
};
