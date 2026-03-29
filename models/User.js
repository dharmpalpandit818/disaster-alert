const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  preferredLanguage: {
    type: String,
    default: 'en',
    trim: true
  },
  whatsappEnabled: {
    type: Boolean,
    default: true
  },
  alertTypes: [{
    type: String,
    enum: ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami', 'Other']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
