function mergeDeep(base, override) {
  const out = JSON.parse(JSON.stringify(base));
  if (!override || typeof override !== 'object') return out;
  for (const key of Object.keys(override)) {
    const ov = override[key];
    if (ov && typeof ov === 'object' && !Array.isArray(ov)) {
      out[key] = mergeDeep(out[key] || {}, ov);
    } else {
      out[key] = ov;
    }
  }
  return out;
}

module.exports = { mergeDeep };
