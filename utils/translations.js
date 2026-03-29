const { mergeDeep } = require('./i18n');

const en = {
  meta: { siteTitle: 'Disaster Alert System' },
  nav: {
    home: 'Home',
    alerts: 'Alerts',
    safety: 'Safety',
    subscribe: 'Subscribe',
    emergency: 'Emergency',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    brand: 'DisasterAlert',
    language: 'Language'
  },
  home: {
    heroTitle: 'Stay Safe from Natural Disasters',
    heroSubtitle: 'Get real-time alerts and safety instructions for floods, earthquakes, cyclones and more.',
    viewAlerts: 'View Alerts',
    latestAlerts: 'Latest Alerts',
    noAlerts: 'No alerts available',
    safetyTitle: 'Safety Guides',
    flood: 'Flood',
    earthquake: 'Earthquake',
    fire: 'Fire',
    cyclone: 'Cyclone',
    landslide: 'Landslide',
    heatwave: 'Heatwave',
    tsunami: 'Tsunami',
    subscribeTitle: 'Get Emergency Alerts',
    subscribeText: 'Subscribe to receive alerts by email',
    subscribeCta: 'Subscribe Now'
  },
  alerts: {
    title: 'Disaster Alerts',
    details: 'View Details',
    noAlerts: 'No active alerts'
  },
  safety: {
    title: 'Safety Guides',
    readMore: 'Read more',
    before: 'Before',
    during: 'During',
    after: 'After',
    allGuides: 'All safety guides',
    guideHeading: 'Safety guide'
  },
  auth: {
    loginTitle: 'Sign in',
    registerTitle: 'Create account',
    email: 'Email',
    password: 'Password',
    name: 'Full name',
    phone: 'Phone (optional)',
    confirmPassword: 'Confirm password',
    submitLogin: 'Sign in',
    submitRegister: 'Register',
    haveAccount: 'Already have an account?',
    noAccount: 'Need an account?',
    invalidCredentials: 'Invalid email or password.',
    emailInUse: 'This email is already registered.',
    passwordMismatch: 'Passwords do not match.',
    passwordShort: 'Password must be at least 8 characters.',
    errorGeneric: 'Something went wrong. Please try again.'
  },
  subscribe: {
    title: 'Subscribe to alerts',
    email: 'Email',
    phone: 'Phone',
    city: 'City',
    state: 'State',
    language: 'Preferred language',
    submit: 'Subscribe',
    success: 'You are subscribed.',
    error: 'Could not subscribe.'
  },
  emergency: {
    title: 'Emergency contacts',
    police: 'Police',
    fire: 'Fire',
    ambulance: 'Ambulance',
    disaster: 'Disaster management'
  },
  footer: {
    rights: 'Disaster Alert System',
    tagline: 'Stay safe',
    emergencyLink: 'Emergency contacts'
  },
  common: {
    location: 'Location',
    issued: 'Issued',
    description: 'Description',
    safetyInstructions: 'Safety instructions',
    backToAlerts: 'Back to alerts',
    fullGuide: 'Full safety guide'
  }
};

const hi = {
  meta: { siteTitle: 'आपदा अलर्ट प्रणाली' },
  nav: {
    home: 'होम',
    alerts: 'अलर्ट',
    safety: 'सुरक्षा',
    subscribe: 'सदस्यता',
    emergency: 'आपातकाल',
    login: 'लॉग इन',
    register: 'रजिस्टर',
    logout: 'लॉग आउट',
    brand: 'आपदा अलर्ट',
    language: 'भाषा'
  },
  home: {
    heroTitle: 'प्राकृतिक आपदाओं से सुरक्षित रहें',
    heroSubtitle: 'बाढ़, भूकंप, चक्रवात आदि के लिए वास्तविक समय के अलर्ट और सुरक्षा निर्देश प्राप्त करें।',
    viewAlerts: 'अलर्ट देखें',
    latestAlerts: 'नवीनतम अलर्ट',
    noAlerts: 'कोई अलर्ट नहीं',
    safetyTitle: 'सुरक्षा गाइड',
    flood: 'बाढ़',
    earthquake: 'भूकंप',
    fire: 'आग',
    cyclone: 'चक्रवात',
    landslide: 'भूस्खलन',
    heatwave: 'लू',
    tsunami: 'सुनामी',
    subscribeTitle: 'आपातकालीन अलर्ट प्राप्त करें',
    subscribeText: 'ईमेल द्वारा अलर्ट के लिए सदस्यता लें',
    subscribeCta: 'अभी सदस्यता लें'
  },
  alerts: { title: 'आपदा अलर्ट', details: 'विवरण देखें', noAlerts: 'कोई सक्रिय अलर्ट नहीं' },
  safety: {
    title: 'सुरक्षा गाइड',
    readMore: 'और पढ़ें',
    before: 'पहले',
    during: 'दौरान',
    after: 'बाद में',
    allGuides: 'सभी गाइड',
    guideHeading: 'सुरक्षा गाइड'
  },
  auth: {
    loginTitle: 'साइन इन',
    registerTitle: 'खाता बनाएँ',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'पूरा नाम',
    phone: 'फ़ोन (वैकल्पिक)',
    confirmPassword: 'पासवर्ड की पुष्टि',
    submitLogin: 'साइन इन',
    submitRegister: 'रजिस्टर करें',
    haveAccount: 'पहले से खाता है?',
    noAccount: 'खाता चाहिए?',
    invalidCredentials: 'गलत ईमेल या पासवर्ड।',
    emailInUse: 'यह ईमेल पहले से पंजीकृत है।',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते।',
    passwordShort: 'पासवर्ड कम से कम 8 अक्षर का हो।',
    errorGeneric: 'त्रुटि। पुनः प्रयास करें।'
  },
  subscribe: {
    title: 'अलर्ट की सदस्यता',
    email: 'ईमेल',
    phone: 'फ़ोन',
    city: 'शहर',
    state: 'राज्य',
    language: 'पसंदीदा भाषा',
    submit: 'सदस्यता लें',
    success: 'सदस्यता सफल।',
    error: 'सदस्यता विफल।'
  },
  emergency: {
    title: 'आपात संपर्क',
    police: 'पुलिस',
    fire: 'अग्निशमन',
    ambulance: 'एम्बुलेंस',
    disaster: 'आपदा प्रबंधन'
  },
  footer: {
    rights: 'आपदा अलर्ट प्रणाली',
    tagline: 'सुरक्षित रहें',
    emergencyLink: 'आपात संपर्क'
  },
  common: {
    location: 'स्थान',
    issued: 'जारी',
    description: 'विवरण',
    safetyInstructions: 'सुरक्षा निर्देश',
    backToAlerts: 'अलर्ट पर वापस',
    fullGuide: 'पूर्ण सुरक्षा गाइड'
  }
};

// const mr = {
//   meta: { siteTitle: 'आपत्ती अलर्ट प्रणाली' },

//   nav: {
//     home: 'मुख्यपृष्ठ',
//     alerts: 'अलर्ट',
//     safety: 'सुरक्षा',
//     subscribe: 'सदस्यता',
//     emergency: 'आपत्कालीन',
//     login: 'लॉग इन',
//     register: 'नोंदणी',
//     logout: 'लॉग आउट',
//     brand: 'आपत्ती अलर्ट',
//     language: 'भाषा'
//   },

//   home: {
//     heroTitle: 'नैसर्गिक आपत्तींमधून सुरक्षित राहा',
//     heroSubtitle: 'पूर, भूकंप, चक्रीवादळ इत्यादींसाठी रिअल-टाइम अलर्ट आणि सुरक्षा सूचना मिळवा.',
//     viewAlerts: 'अलर्ट पहा',
//     latestAlerts: 'नवीनतम अलर्ट',
//     noAlerts: 'कोणतेही अलर्ट नाहीत',
//     safetyTitle: 'सुरक्षा मार्गदर्शक',
//     flood: 'पूर',
//     earthquake: 'भूकंप',
//     fire: 'आग',
//     cyclone: 'चक्रीवादळ',
//     landslide: 'भूस्खलन',
//     heatwave: 'उष्णतेची लाट',
//     tsunami: 'सुनामी',
//     subscribeTitle: 'आपत्कालीन अलर्ट मिळवा',
//     subscribeText: 'ईमेलद्वारे अलर्टसाठी सदस्यता घ्या',
//     subscribeCta: 'आता सदस्यता घ्या'
//   },

//   alerts: {
//     title: 'आपत्ती अलर्ट',
//     details: 'तपशील पहा',
//     noAlerts: 'कोणतेही सक्रिय अलर्ट नाहीत'
//   },

//   safety: {
//     title: 'सुरक्षा मार्गदर्शक',
//     readMore: 'अधिक वाचा',
//     before: 'पूर्वी',
//     during: 'दरम्यान',
//     after: 'नंतर',
//     allGuides: 'सर्व मार्गदर्शक',
//     guideHeading: 'सुरक्षा मार्गदर्शक'
//   },

//   auth: {
//     loginTitle: 'साइन इन',
//     registerTitle: 'खाते तयार करा',
//     email: 'ईमेल',
//     password: 'पासवर्ड',
//     name: 'पूर्ण नाव',
//     phone: 'फोन (पर्यायी)',
//     confirmPassword: 'पासवर्डची पुष्टी करा',
//     submitLogin: 'साइन इन',
//     submitRegister: 'नोंदणी करा',
//     haveAccount: 'आधीच खाते आहे?',
//     noAccount: 'खाते हवे आहे?',
//     invalidCredentials: 'चुकीचा ईमेल किंवा पासवर्ड.',
//     emailInUse: 'हा ईमेल आधीच नोंदणीकृत आहे.',
//     passwordMismatch: 'पासवर्ड जुळत नाहीत.',
//     passwordShort: 'पासवर्ड किमान 8 अक्षरांचा असावा.',
//     errorGeneric: 'त्रुटी. पुन्हा प्रयत्न करा.'
//   },

//   subscribe: {
//     title: 'अलर्टची सदस्यता',
//     email: 'ईमेल',
//     phone: 'फोन',
//     city: 'शहर',
//     state: 'राज्य',
//     language: 'प्राधान्य भाषा',
//     submit: 'सदस्यता घ्या',
//     success: 'सदस्यता यशस्वी.',
//     error: 'सदस्यता अयशस्वी.'
//   },

//   emergency: {
//     title: 'आपत्कालीन संपर्क',
//     police: 'पोलीस',
//     fire: 'अग्निशमन',
//     ambulance: 'रुग्णवाहिका',
//     disaster: 'आपत्ती व्यवस्थापन'
//   },

//   footer: {
//     rights: 'आपत्ती अलर्ट प्रणाली',
//     tagline: 'सुरक्षित राहा',
//     emergencyLink: 'आपत्कालीन संपर्क'
//   },

//   common: {
//     location: 'स्थान',
//     issued: 'जारी केले',
//     description: 'वर्णन',
//     safetyInstructions: 'सुरक्षा सूचना',
//     backToAlerts: 'अलर्टकडे परत',
//     fullGuide: 'पूर्ण सुरक्षा मार्गदर्शक'
//   }
// };

const mr = mergeDeep(hi, {
  nav: { brand: 'आपत्ती अलर्ट', home: 'मुख्यपृष्ठ' },
  home: { heroTitle: 'नैसर्गिक आपत्तींपासून सुरक्षित रहा' }
});

const gu = mergeDeep(hi, {
  nav: { brand: 'આપત્તિ ચેતવણી', home: 'હોમ' },
  home: { heroTitle: 'કુદરતી આપત્તિઓથી સુરક્ષિત રહો' }
});

// const gu = {
//   meta: { siteTitle: 'આપત્તિ એલર્ટ સિસ્ટમ' },

//   nav: {
//     home: 'હોમ',
//     alerts: 'એલર્ટ',
//     safety: 'સુરક્ષા',
//     subscribe: 'સબ્સ્ક્રાઇબ',
//     emergency: 'આપાતકાલીન',
//     login: 'લૉગિન',
//     register: 'નોંધણી',
//     logout: 'લૉગઆઉટ',
//     brand: 'આપત્તિ એલર્ટ',
//     language: 'ભાષા'
//   },

//   home: {
//     heroTitle: 'પ્રાકૃતિક આપત્તિઓથી સુરક્ષિત રહો',
//     heroSubtitle: 'પૂર, ભૂકંપ, ચક્રવાત વગેરે માટે રિયલ-ટાઇમ એલર્ટ અને સુરક્ષા સૂચનાઓ મેળવો.',
//     viewAlerts: 'એલર્ટ જુઓ',
//     latestAlerts: 'તાજેતરના એલર્ટ',
//     noAlerts: 'કોઈ એલર્ટ નથી',
//     safetyTitle: 'સુરક્ષા માર્ગદર્શિકા',
//     flood: 'પૂર',
//     earthquake: 'ભૂકંપ',
//     fire: 'આગ',
//     cyclone: 'ચક્રવાત',
//     landslide: 'ભૂસ્ખલન',
//     heatwave: 'ગરમીની લહેર',
//     tsunami: 'સુનામી',
//     subscribeTitle: 'આપાતકાલીન એલર્ટ મેળવો',
//     subscribeText: 'ઈમેલ દ્વારા એલર્ટ મેળવવા માટે સબ્સ્ક્રાઇબ કરો',
//     subscribeCta: 'હવે સબ્સ્ક્રાઇબ કરો'
//   },

//   alerts: {
//     title: 'આપત્તિ એલર્ટ',
//     details: 'વિગતો જુઓ',
//     noAlerts: 'કોઈ સક્રિય એલર્ટ નથી'
//   },

//   safety: {
//     title: 'સુરક્ષા માર્ગદર્શિકા',
//     readMore: 'વધુ વાંચો',
//     before: 'પહેલાં',
//     during: 'દરમિયાન',
//     after: 'પછી',
//     allGuides: 'બધી માર્ગદર્શિકા',
//     guideHeading: 'સુરક્ષા માર્ગદર્શિકા'
//   },

//   auth: {
//     loginTitle: 'સાઇન ઇન',
//     registerTitle: 'એકાઉન્ટ બનાવો',
//     email: 'ઈમેલ',
//     password: 'પાસવર્ડ',
//     name: 'પૂર્ણ નામ',
//     phone: 'ફોન (વૈકલ્પિક)',
//     confirmPassword: 'પાસવર્ડની પુષ્ટિ કરો',
//     submitLogin: 'સાઇન ઇન',
//     submitRegister: 'નોંધણી કરો',
//     haveAccount: 'પહેલેથી એકાઉન્ટ છે?',
//     noAccount: 'એકાઉન્ટ જોઈએ છે?',
//     invalidCredentials: 'ખોટો ઈમેલ અથવા પાસવર્ડ.',
//     emailInUse: 'આ ઈમેલ પહેલેથી નોંધાયેલ છે.',
//     passwordMismatch: 'પાસવર્ડ મેળ ખાતા નથી.',
//     passwordShort: 'પાસવર્ડ ઓછામાં ઓછા 8 અક્ષરનો હોવો જોઈએ.',
//     errorGeneric: 'ભૂલ. ફરી પ્રયાસ કરો.'
//   },

//   subscribe: {
//     title: 'એલર્ટ માટે સબ્સ્ક્રિપ્શન',
//     email: 'ઈમેલ',
//     phone: 'ફોન',
//     city: 'શહેર',
//     state: 'રાજ્ય',
//     language: 'પસંદગીની ભાષા',
//     submit: 'સબ્સ્ક્રાઇબ કરો',
//     success: 'સબ્સ્ક્રિપ્શન સફળ થયું.',
//     error: 'સબ્સ્ક્રિપ્શન નિષ્ફળ થયું.'
//   },

//   emergency: {
//     title: 'આપાતકાલીન સંપર્ક',
//     police: 'પોલીસ',
//     fire: 'ફાયર બ્રિગેડ',
//     ambulance: 'એમ્બ્યુલન્સ',
//     disaster: 'આપત્તિ વ્યવસ્થાપન'
//   },

//   footer: {
//     rights: 'આપત્તિ એલર્ટ સિસ્ટમ',
//     tagline: 'સુરક્ષિત રહો',
//     emergencyLink: 'આપાતકાલીન સંપર્ક'
//   },

//   common: {
//     location: 'સ્થાન',
//     issued: 'જારી કરાયું',
//     description: 'વર્ણન',
//     safetyInstructions: 'સુરક્ષા સૂચનાઓ',
//     backToAlerts: 'એલર્ટ પર પાછા જાઓ',
//     fullGuide: 'પૂર્ણ સુરક્ષા માર્ગદર્શિકા'
//   }
// };

const ta = mergeDeep(hi, {
  nav: { brand: 'பேரிடர் எச்சரிக்கை', home: 'முகப்பு' },
  home: { heroTitle: 'இயற்கை பேரிடர்களிலிருந்து பாதுகாப்பாக இருங்கள்' }
});

const te = mergeDeep(hi, {
  nav: { brand: 'ఆపద హెచ్చరిక', home: 'హోమ్' },
  home: { heroTitle: 'ప్రకృతి విపత్తుల నుండి సురక్షితంగా ఉండండి' }
});

const patches = { hi, mr, gu, ta, te };
const translations = { en: JSON.parse(JSON.stringify(en)) };
['hi', 'mr', 'gu', 'ta', 'te'].forEach((code) => {
  translations[code] = mergeDeep(en, patches[code] || {});
});

module.exports = translations;
