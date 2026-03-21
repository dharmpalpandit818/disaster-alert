const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

const app = express();

// Import routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const alertRoutes = require('./routes/alerts');
const safetyRoutes = require('./routes/safety');

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster_alerts')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// View Engine - Simple EJS without layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster_alerts' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));


// Global variables for templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.lang = req.session.lang || 'en';
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/alerts', alertRoutes);
app.use('/safety', safetyRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`<h1>Error</h1><p>${err.message}</p><a href="/">Go Home</a>`);
});

// 404
app.use((req, res) => {
  res.status(404).send(`<h1>Page Not Found</h1><a href="/">Go Home</a>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));