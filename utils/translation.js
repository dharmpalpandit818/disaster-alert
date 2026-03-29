const axios = require('axios');

async function translateText(text, targetLang) {
    if (!text) return text;
    if (targetLang === 'en') return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url);

        return response.data?.[0]?.[0]?.[0] || text;
    } catch (error) {
        console.error("Translation error:", error.message);
        return text;
    }
}

module.exports = { translateText };