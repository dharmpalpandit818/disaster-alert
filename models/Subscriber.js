const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  whatsappEnabled: {
    type: Boolean,
    default: false
  },
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  preferredLanguage: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur', 'sa', 'kok', 'es', 'fr', 'ar', 'zh', 'ru']
  },
  alertTypes: [{
    type: String,
    enum: ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami', 'Other']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);