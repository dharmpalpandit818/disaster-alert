const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleTranslations: {
    hi: String,
    bn: String,
    te: String,
    mr: String,
    ta: String,
    gu: String,
    kn: String,
    ml: String,
    pa: String,
    or: String,
    as: String,
    ur: String,
    sa: String,
    kok: String,
    es: String,
    fr: String,
    ar: String,
    zh: String,
    ru: String
  },
  type: {
    type: String,
    required: true,
    enum: ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami', 'Other']
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  description: {
    type: String,
    required: true
  },
  descriptionTranslations: {
    hi: String,
    bn: String,
    te: String,
    mr: String,
    ta: String,
    gu: String,
    kn: String,
    ml: String,
    pa: String,
    or: String,
    as: String,
    ur: String,
    sa: String,
    kok: String,
    es: String,
    fr: String,
    ar: String,
    zh: String,
    ru: String
  },
  safetyInstructions: {
    type: String,
    required: true
  },
  safetyTranslations: {
    hi: String,
    bn: String,
    te: String,
    mr: String,
    ta: String,
    gu: String,
    kn: String,
    ml: String,
    pa: String,
    or: String,
    as: String,
    ur: String,
    sa: String,
    kok: String,
    es: String,
    fr: String,
    ar: String,
    zh: String,
    ru: String
  },
  affectedAreas: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  sentNotifications: {
    email: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false }
  }
});

// Index for geospatial queries
alertSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Alert', alertSchema);