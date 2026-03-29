const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' }
];

const SUPPORTED_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

function isSupportedCode(code) {
  return SUPPORTED_CODES.includes(code);
}

module.exports = { SUPPORTED_LANGUAGES, SUPPORTED_CODES, isSupportedCode };
