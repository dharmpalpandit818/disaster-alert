const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Subscriber = require('../models/Subscriber');
const { broadcastAlert } = require('../utils/notifications'); // ✅ ADD THIS
// const { sendNotifications } = require('../utils/notifications');
const { requireAuth, redirectIfAuth } = require('../middleware/auth');

// Redirect /admin to /admin/login
router.get('/', (req, res) => {
  res.redirect('/admin/login');
});

// Login page
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('admin/login', { error: req.session.error || null });
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.username = username;
    return res.redirect('/admin/dashboard');
  }
  
  req.session.error = 'Invalid credentials';
  res.redirect('/admin/login');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const stats = {
      totalAlerts: await Alert.countDocuments(),
      activeAlerts: await Alert.countDocuments({ isActive: true }),
      totalSubscribers: await Subscriber.countDocuments(),
      recentAlerts: await Alert.find().sort({ createdAt: -1 }).limit(5)
    };
    
    res.render('admin/dashboard', { stats, user: req.session.username });
  } catch (error) {
    res.render('admin/dashboard', { stats: {}, user: req.session.username, error: error.message });
  }
});

// List all alerts
router.get('/alerts', requireAuth, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.render('admin/alerts', { alerts });
  } catch (error) {
    res.render('admin/alerts', { alerts: [], error: error.message });
  }
});

// Create alert form
router.get('/alerts/create', requireAuth, (req, res) => {
  res.render('admin/alert-form', { 
    alert: null,
    types: ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami', 'Other'],
    error: null
  });
});

// 🔥 HANDLE CREATE ALERT (UPDATED)
router.post('/alerts/create', requireAuth, async (req, res) => {
  try {
    const alert = new Alert({
      title: req.body.title,
      type: req.body.type,
      location: req.body.location,
      severity: req.body.severity,
      description: req.body.description,
      safetyInstructions: req.body.safetyInstructions,
      isActive: true
    });

    await alert.save();

    // 🔥 SEND NOTIFICATIONS
    const subscribers = await Subscriber.find();
    await broadcastAlert(alert, subscribers);
    // const { sendNotifications } = require('../utils/notifications');
    // await sendNotifications(alert);

    console.log("🚀 Notifications sent to subscribers");

    res.redirect('/admin/alerts');

  } catch (error) {
    res.render('admin/alert-form', { 
      alert: req.body,
      types: ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami', 'Other'],
      error: error.message
    });
  }
});

// Edit alert form
router.get('/alerts/edit/:id', requireAuth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.redirect('/admin/alerts');
    
    res.render('admin/alert-form', { 
      alert,
      types: ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami', 'Other'],
      error: null
    });
  } catch (error) {
    res.redirect('/admin/alerts');
  }
});

// Handle update
router.post('/alerts/edit/:id', requireAuth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) throw new Error('Alert not found');

    alert.title = req.body.title;
    alert.type = req.body.type;
    alert.location = req.body.location;
    alert.severity = req.body.severity;
    alert.description = req.body.description;
    alert.safetyInstructions = req.body.safetyInstructions;
    alert.isActive = req.body.isActive === 'on';
    
    await alert.save();
    res.redirect('/admin/alerts');

  } catch (error) {
    res.render('admin/alert-form', { 
      alert: req.body,
      types: ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami', 'Other'],
      error: error.message
    });
  }
});

// Delete alert
router.post('/alerts/delete/:id', requireAuth, async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.redirect('/admin/alerts');
  } catch (error) {
    res.redirect('/admin/alerts');
  }
});

// Subscribers list
router.get('/subscribers', requireAuth, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.render('admin/subscribers', { subscribers });
  } catch (error) {
    res.render('admin/subscribers', { subscribers: [], error: error.message });
  }
});

module.exports = router;