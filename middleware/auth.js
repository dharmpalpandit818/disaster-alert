// Check if user is logged in as admin
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  req.session.error = 'Please login to access this page';
  res.redirect('/admin/login');
}

// Check if regular app user is logged in
function requireUserAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  const returnTo = encodeURIComponent(req.originalUrl || '/home');
  res.redirect(`/auth/login?returnTo=${returnTo}`);
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
  redirectIfAuth,
  requireUserAuth
};