const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { translateText } = require('../utils/translation');

router.get('/', async (req, res) => {
  const lang = res.locals.lang;
  try {
    const alerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 });
    const translatedAlerts = await Promise.all(
      alerts.map(async (alert) => ({
        ...alert.toObject(),
        title: await translateText(alert.title, lang),
        description: await translateText(alert.description, lang),
        location: await translateText(alert.location, lang)
      }))
    );
    res.render('alerts/index', { alerts: translatedAlerts });
  } catch (error) {
    console.error(error);
    res.render('alerts/index', { alerts: [], error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const lang = res.locals.lang;
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.redirect('/alerts');

    const translatedAlert = {
      ...alert.toObject(),
      title: await translateText(alert.title, lang),
      description: await translateText(alert.description, lang),
      location: await translateText(alert.location, lang),
      safetyInstructions: await translateText(alert.safetyInstructions, lang)
    };

    res.render('alerts/detail', { alert: translatedAlert });
  } catch (error) {
    res.redirect('/alerts');
  }
});

module.exports = router;
