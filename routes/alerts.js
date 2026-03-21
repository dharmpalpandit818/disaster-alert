const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const translations = require('../utils/translations');

// List all active alerts
router.get('/', async (req, res) => {
  const lang = req.session.lang || 'en';
  try {
    const alerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 });
    res.render('alerts/index', { 
      alerts, 
      lang,
      t: translations[lang] || translations.en
    });
  } catch (error) {
    res.render('alerts/index', { 
      alerts: [], 
      lang,
      t: translations[lang] || translations.en,
      error: error.message
    });
  }
});

// Single alert detail
router.get('/:id', async (req, res) => {
  const lang = req.session.lang || 'en';
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.redirect('/alerts');
    
    res.render('alerts/detail', { 
      alert, 
      lang,
      t: translations[lang] || translations.en
    });
  } catch (error) {
    res.redirect('/alerts');
  }
});

module.exports = router;