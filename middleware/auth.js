// Check if user is logged in as admin
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  req.session.error = 'Please login to access this page';
  res.redirect('/admin/login');
}

// Check if already logged in (for login page)
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  next();
}

module.exports = {
  requireAuth,
  redirectIfAuth
};