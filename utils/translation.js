const axios = require('axios');

const translationCache = new Map();

async function translateText(text, targetLang) {
    if (!text) return text;
    if (targetLang === 'en') return text;

    const cacheKey = `${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url);

        let translatedText = '';
        if (response.data && response.data[0]) {
            response.data[0].forEach(chunk => {
                if (chunk && chunk[0]) translatedText += chunk[0];
            });
            const finalResult = translatedText || text;
            translationCache.set(cacheKey, finalResult);
            return finalResult;
        }

        return text;
    } catch (error) {
        console.error("Translation error:", error.message);
        return text;
    }
}

module.exports = { translateText };