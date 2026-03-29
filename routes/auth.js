const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const translations = require('../utils/translations');
const { SUPPORTED_LANGUAGES, isSupportedCode } = require('../constants/languages');

const router = express.Router();

function authLocals(req) {
  const lang = req.session.lang || 'en';
  const code = translations[lang] ? lang : 'en';
  return {
    lang: code,
    t: translations[code] || translations.en,
    supportedLangs: SUPPORTED_LANGUAGES
  };
}

router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  const err = req.session.authError;
  delete req.session.authError;
  res.render('auth/login', {
    ...authLocals(req),
    error: err,
    returnTo: req.query.returnTo || '/'
  });
});

router.post('/login', async (req, res) => {
  if (req.session.userId) return res.redirect('/');
  const { t } = authLocals(req);
  const { email, password } = req.body;
  const returnTo = req.body.returnTo || '/';

  try {
    const user = await User.findOne({ email: (email || '').toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      req.session.authError = t.auth.invalidCredentials;
      return res.redirect('/auth/login?returnTo=' + encodeURIComponent(returnTo));
    }
    if (!user.isActive) {
      req.session.authError = t.auth.invalidCredentials;
      return res.redirect('/auth/login?returnTo=' + encodeURIComponent(returnTo));
    }
    req.session.userId = user._id.toString();
    req.session.lang = user.preferredLanguage || 'en';
    const safe = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
    res.redirect(safe);
  } catch (e) {
    console.error(e);
    req.session.authError = t.auth.errorGeneric;
    res.redirect('/auth/login');
  }
});

router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/register', {
    ...authLocals(req),
    error: null,
    values: {}
  });
});

router.post('/register', async (req, res) => {
  if (req.session.userId) return res.redirect('/');
  const { t } = authLocals(req);
  const { name, email, password, confirmPassword, phone, preferredLanguage } = req.body;

  const renderErr = (msg, values = req.body) => {
    res.render('auth/register', {
      ...authLocals(req),
      error: msg,
      values
    });
  };

  if (!name || !email || !password) {
    return renderErr(t.auth.errorGeneric);
  }
  if (password.length < 8) {
    return renderErr(t.auth.passwordShort);
  }
  if (password !== confirmPassword) {
    return renderErr(t.auth.passwordMismatch);
  }

  const plang = isSupportedCode(preferredLanguage) ? preferredLanguage : 'en';

  try {
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return renderErr(t.auth.emailInUse);

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      phone: (phone || '').trim(),
      preferredLanguage: plang
    });
    req.session.userId = user._id.toString();
    req.session.lang = plang;
    res.redirect('/');
  } catch (e) {
    console.error(e);
    renderErr(t.auth.errorGeneric);
  }
});

router.get('/logout', (req, res) => {
  delete req.session.userId;
  res.redirect('/');
});

module.exports = router;
