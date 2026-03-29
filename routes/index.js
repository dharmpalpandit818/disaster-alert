const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Subscriber = require('../models/Subscriber');
const { translateText } = require('../utils/translation');
const { requireUserAuth } = require('../middleware/auth');

async function renderHome(req, res) {
  const lang = res.locals.lang || req.session.lang || 'en';
  const t = res.locals.t;

  try {
    const raw = await Alert.find({ isActive: true }).sort({ createdAt: -1 }).limit(5);
    const alerts = await Promise.all(
      raw.map(async (a) => {
        const o = a.toObject();
        if (!lang || lang === 'en') {
          return {
            ...o,
            severityClass: String(o.severity || '').toLowerCase(),
            typeKey: o.type
          };
        }
        const [title, description, location] = await Promise.all([
          translateText(o.title, lang),
          translateText(o.description, lang),
          translateText(o.location, lang)
        ]);
        return {
          ...o,
          title: title || o.title,
          description: description || o.description,
          location: location || o.location,
          severityClass: String(o.severity || '').toLowerCase(),
          typeKey: o.type
        };
      })
    );
    return res.render('index', { alerts, lang, t });
  } catch (error) {
    console.error(error);
    return res.render('index', { alerts: [], lang, t });
  }
}

router.get('/home', requireUserAuth, renderHome);

router.get('/subscribe', (req, res) => {
  res.render('subscribe', { message: null, lang: res.locals.lang, t: res.locals.t });
});

router.post('/subscribe', async (req, res) => {
  try {
    const subscriber = new Subscriber({
      email: req.body.email,
      phone: req.body.phone,
      preferredLanguage: req.body.language || 'en',
      location: { city: req.body.city, state: req.body.state }
    });
    await subscriber.save();
    res.render('subscribe', { message: 'success', lang: res.locals.lang, t: res.locals.t });
  } catch (error) {
    res.render('subscribe', {
      message: 'error',
      error: error.message,
      lang: res.locals.lang,
      t: res.locals.t
    });
  }
});

router.get('/emergency', (req, res) => {
  res.render('emergency', { lang: res.locals.lang, t: res.locals.t });
});

module.exports = router;
