const mongoose = require('mongoose');

const safetyGuideSchema = new mongoose.Schema({
  disasterType: {
    type: String,
    required: true,
    unique: true,
    enum: ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami']
  },
  content: {
    before: {
      en: String,
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
    during: {
      en: String,
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
    after: {
      en: String,
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
    }
  },
  icon: {
    type: String,
    default: 'warning'
  },
  color: {
    type: String,
    default: 'red'
  }
});

module.exports = mongoose.model('SafetyGuide', safetyGuideSchema);