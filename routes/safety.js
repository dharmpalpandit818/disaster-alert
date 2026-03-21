const express = require('express');
const router = express.Router();
const translations = require('../utils/translations');

// Safety data function
function getSafetyData(type) {
    const content = {
        Flood: {
            icon: 'water',
            before: [
                'Prepare emergency kit with food, water, medicines for 3 days',
                'Know your evacuation route and nearest shelter location',
                'Move valuables and furniture to higher floors',
                'Install check valves in plumbing to prevent backflow',
                'Keep important documents in waterproof bags',
                'Monitor weather forecasts and flood warnings regularly'
            ],
            during: [
                'Listen to emergency broadcasts on radio or TV',
                'Avoid walking or driving through flood waters',
                'Move to higher ground immediately if advised',
                'Stay away from power lines and electrical wires',
                'Do not touch flood water - it may be contaminated',
                'Turn off utilities at main switches if instructed'
            ],
            after: [
                'Wait for official all-clear before returning home',
                'Avoid flood waters - may contain chemicals or sewage',
                'Document all damage with photos for insurance',
                'Clean and disinfect everything that got wet',
                'Check for structural damage before entering',
                'Use bottled water until tap water is declared safe'
            ]
        },
        Earthquake: {
            icon: 'house-damage',
            before: [
                'Secure heavy furniture and appliances to walls',
                'Create family emergency communication plan',
                'Prepare emergency supply kit with water, food, first aid',
                'Know how to shut off gas, water, and electricity',
                'Identify safe spots in each room under sturdy furniture',
                'Practice "Drop, Cover, and Hold On" drills'
            ],
            during: [
                'DROP to the ground, COVER your head, HOLD ON',
                'Stay away from windows, glass, and heavy objects',
                'If outside, move to open area away from buildings',
                'If in vehicle, pull over and stay inside',
                'Do not use elevators - use stairs',
                'Protect your head and neck with your arms'
            ],
            after: [
                'Check for injuries and provide first aid',
                'Expect aftershocks - be ready to drop and cover',
                'Check for gas leaks - do not use matches',
                'Listen to battery-powered radio for updates',
                'Stay out of damaged buildings',
                'Use text messages instead of calls'
            ]
        },
        Cyclone: {
            icon: 'wind',
            before: [
                'Board up windows with plywood or storm shutters',
                'Secure outdoor furniture and loose objects',
                'Stock emergency supplies for at least 3 days',
                'Know your nearest cyclone shelter',
                'Fill vehicle fuel tanks and charge devices',
                'Trim trees near your home'
            ],
            during: [
                'Stay indoors away from windows',
                'Take shelter in interior room or basement',
                'Do not go outside during eye of cyclone',
                'Keep battery-powered radio on',
                'Stay away from coastal areas',
                'Protect yourself with mattresses'
            ],
            after: [
                'Wait for official all-clear signal',
                'Watch for downed power lines',
                'Avoid flood waters and damaged roads',
                'Check on neighbors especially elderly',
                'Document damage with photos',
                'Do not drink tap water until safe'
            ]
        },
        Fire: {
            icon: 'fire',
            before: [
                'Install smoke alarms on every floor',
                'Create and practice fire escape plan',
                'Keep fire extinguishers accessible',
                'Clear dry vegetation around property',
                'Store flammable materials safely',
                'Keep emergency ladder for upper floors'
            ],
            during: [
                'Call emergency services immediately',
                'Follow evacuation orders without delay',
                'Stay low to avoid smoke inhalation',
                'Use wet cloth over nose and mouth',
                'Do not use elevators - use stairs',
                'Feel doors before opening'
            ],
            after: [
                'Do not return until authorities say safe',
                'Check for hot embers and smoldering fires',
                'Document all damage with photos',
                'Contact insurance company immediately',
                'Seek medical attention for smoke inhalation',
                'Do not enter damaged buildings'
            ]
        },
        Landslide: {
            icon: 'mountain',
            before: [
                'Learn warning signs: cracks in ground, tilted trees',
                'Avoid building near steep slopes',
                'Direct water drainage away from slopes',
                'Watch for slope movement or cracks',
                'Plant ground cover on slopes',
                'Consult professionals for slope assessment'
            ],
            during: [
                'Move away from path of landslide quickly',
                'Curl into tight ball and protect head',
                'Move to second floor if trapped',
                'Watch for flooding and debris',
                'Listen for unusual sounds',
                'Evacuate immediately if advised'
            ],
            after: [
                'Stay away from slide area',
                'Check for injured people',
                'Report broken utility lines',
                'Watch for more landslides',
                'Replant damaged ground',
                'Consult expert before rebuilding'
            ]
        },
        Heatwave: {
            icon: 'sun',
            before: [
                'Install air conditioning or fans',
                'Stock extra water and cooling supplies',
                'Know locations of cooling centers',
                'Check on elderly neighbors',
                'Prepare light, loose clothing',
                'Learn signs of heat exhaustion'
            ],
            during: [
                'Stay in air-conditioned spaces',
                'Drink plenty of water regularly',
                'Avoid strenuous outdoor activities',
                'Never leave children in parked vehicles',
                'Wear loose, light-colored clothing',
                'Take cool showers or baths'
            ],
            after: [
                'Continue hydration after heatwave',
                'Watch for delayed heat illness',
                'Rest and recover from heat stress',
                'Check on vulnerable people',
                'Prepare for next heat wave',
                'Plant trees for shade'
            ]
        },
        Tsunami: {
            icon: 'water',
            before: [
                'Know evacuation routes to high ground',
                'Recognize natural warning signs',
                'Keep emergency kit ready',
                'Know high ground locations nearby',
                'Sign up for tsunami alerts',
                'Practice evacuation drills'
            ],
            during: [
                'Move to high ground immediately',
                'Follow evacuation routes',
                'Go to upper floors if cannot escape',
                'Stay away from shore',
                'Watch for receding water',
                'Keep listening to emergency broadcasts'
            ],
            after: [
                'Wait for official all-clear',
                'Stay away from flooded areas',
                'Help others if safe',
                'Expect multiple waves',
                'Check for injuries',
                'Do not return until safe'
            ]
        }
    };

    return content[type] || content.Flood;
}

// Safety guides index
router.get('/', (req, res) => {
  const lang = req.session.lang || 'en';
  res.render('safety/index', {
    lang,
    t: translations[lang] || translations.en
  });
});

// Specific guide
router.get('/:type', (req, res) => {
  const lang = req.session.lang || 'en';
  const type = req.params.type;
  const validTypes = ['Flood', 'Earthquake', 'Cyclone', 'Fire', 'Landslide', 'Heatwave', 'Tsunami'];
  
  if (!validTypes.includes(type)) {
    return res.redirect('/safety');
  }

  const safetyData = getSafetyData(type);

  res.render('safety/guide', {
    type,
    lang,
    t: translations[lang] || translations.en,
    safetyData: safetyData
  });
});

module.exports = router;