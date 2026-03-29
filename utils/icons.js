const FA_BY_TYPE = {
  Flood: 'water',
  Earthquake: 'house-damage',
  Cyclone: 'wind',
  Fire: 'fire',
  Landslide: 'mountain',
  Heatwave: 'sun',
  Tsunami: 'water',
  Other: 'exclamation-circle'
};

function getAlertFaIcon(type) {
  if (type == null || type === '') return 'exclamation-circle';
  return FA_BY_TYPE[type] || 'exclamation-circle';
}

function getAlertIcon(type) {
  if (type == null || type === '') return '⚠️';
  const key = String(type).toLowerCase().trim();
  const map = {
    earthquake: '🌍',
    flood: '🌊',
    cyclone: '🌪️',
    fire: '🔥'
  };
  return map[key] || '⚠️';
}

module.exports = { getAlertIcon, getAlertFaIcon };
