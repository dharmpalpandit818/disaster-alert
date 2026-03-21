const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Subscriber = require('../models/Subscriber');
const translations = require('../utils/translations');

// Home page
router.get('/', async (req, res) => {
  const lang = req.session.lang || 'en';
  try {
    const alerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 }).limit(5);
    res.render('index', { 
      alerts, 
      lang,
      t: translations[lang] || translations.en,
      translations: translations
    });
  } catch (error) {
    res.render('index', { 
      alerts: [], 
      lang,
      t: translations[lang] || translations.en,
      translations: translations
    });
  }
});

// Language change
router.get('/lang/:code', (req, res) => {
  req.session.lang = req.params.code;
  res.redirect('back');
});

// Subscribe page
router.get('/subscribe', (req, res) => {
  const lang = req.session.lang || 'en';
  res.render('subscribe', { 
    lang, 
    t: translations[lang] || translations.en,
    message: null 
  });
});

// Handle subscribe
router.post('/subscribe', async (req, res) => {
  const lang = req.session.lang || 'en';
  try {
    const subscriber = new Subscriber({
      email: req.body.email,
      phone: req.body.phone,
      preferredLanguage: req.body.language || 'en',
      location: { city: req.body.city, state: req.body.state }
    });
    await subscriber.save();
    res.render('subscribe', { 
      lang, 
      t: translations[lang] || translations.en,
      message: 'success' 
    });
  } catch (error) {
    res.render('subscribe', { 
      lang, 
      t: translations[lang] || translations.en,
      message: 'error', 
      error: error.message 
    });
  }
});

// Emergency page
router.get('/emergency', (req, res) => {
  const lang = req.session.lang || 'en';
  res.render('emergency', { 
    lang, 
    t: translations[lang] || translations.en 
  });
});

module.exports = router;