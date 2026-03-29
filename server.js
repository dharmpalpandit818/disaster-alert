require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const User = require('./models/User');
const translations = require('./utils/translations');
const { getAlertIcon, getAlertFaIcon } = require('./utils/icons');
const { SUPPORTED_LANGUAGES, isSupportedCode } = require('./constants/languages');

const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const alertRoutes = require('./routes/alerts');
const safetyRoutes = require('./routes/safety');
const authRoutes = require('./routes/auth');

const app = express();

const requiredDeployVars = [
  'MONGODB_URI',
  'SESSION_SECRET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER'
];

const missingDeployVars = requiredDeployVars.filter((k) => !process.env[k]);
if (missingDeployVars.length) {
  console.warn('Missing env vars:', missingDeployVars.join(', '));
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster_alerts')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster_alerts'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(async (req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.currentUser = null;

  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password').lean();
      if (user) {
        res.locals.currentUser = user;
      } else {
        delete req.session.userId;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const sessionLang = req.session.lang;
  const profileLang = res.locals.currentUser && res.locals.currentUser.preferredLanguage;
  const rawLang = sessionLang || profileLang || 'en';
  const lang = translations[rawLang] ? rawLang : 'en';
  res.locals.lang = lang;
  res.locals.t = translations[lang] || translations.en;
  res.locals.supportedLangs = SUPPORTED_LANGUAGES;
  res.locals.getAlertIcon = getAlertIcon;
  res.locals.getAlertFaIcon = getAlertFaIcon;
  next();
});

app.get('/lang/:code', async (req, res) => {
  const code = req.params.code;
  if (!isSupportedCode(code)) {
    return res.redirect(req.get('Referrer') || '/');
  }
  req.session.lang = code;
  if (req.session.userId) {
    try {
      await User.findByIdAndUpdate(req.session.userId, { preferredLanguage: code });
      if (res.locals.currentUser) res.locals.currentUser.preferredLanguage = code;
    } catch (e) {
      console.error(e);
    }
  }
  const back = req.get('Referrer') || '/';
  res.redirect(back);
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/home');
  }
  return res.redirect('/auth/login');
});
app.use('/', indexRoutes);
app.use('/alerts', alertRoutes);
app.use('/safety', safetyRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`<h1>Error</h1><p>${err.message}</p><a href="/">Go Home</a>`);
});

app.use((req, res) => {
  res.status(404).send(`<h1>Page Not Found</h1><a href="/">Go Home</a>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
