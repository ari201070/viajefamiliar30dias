const { GoogleGenAI } = require("@google/genai");
const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.VITE_API_KEY;
const POLYGON_API_KEY = process.env.VITE_POLYGON_API_KEY;

// Helper to send JSON response
const sendJSON = (res, status, data) => res.status(status).json(data);

// Helper to handle errors
const handleError = (res, error, from) => {
  console.error(`Error in proxy from ${from}:`, error);
  sendJSON(res, 500, { message: error.message || "An internal server error occurred." });
};

// Main handler
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return sendJSON(res, 405, { message: 'Method Not Allowed' });
  }

  const { action, payload } = req.body;

  try {
    switch (action) {
      case 'gemini_ask':
        return await handleGeminiAsk(payload, res);
      case 'gemini_chat':
        return await handleGeminiChat(payload, res);
      case 'gemini_translate':
        return await handleGeminiTranslate(payload, res);
      case 'gemini_search_events':
        return await handleGeminiSearchEvents(payload, res);
      case 'polygon_convert':
        return await handlePolygonConvert(payload, res);
      default:
        return sendJSON(res, 400, { message: 'Invalid action' });
    }
  } catch (error) {
    return handleError(res, error, action);
  }
};

const getAiInstance = () => {
    if (!GEMINI_API_KEY) {
        throw new Error("VITE_API_KEY is not configured on the server.");
    }
    return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
};


const handleGeminiAsk = async (payload, res) => {
  const ai = getAiInstance();
  const { userPrompt, language } = payload;
  const languageInstruction = language === 'he' ? "Respond in Hebrew." : "Respond in Spanish.";
  const fullPrompt = `${userPrompt}\n\n${languageInstruction}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullPrompt,
  });
  sendJSON(res, 200, { text: response.text });
};

const handleGeminiChat = async (payload, res) => {
    const ai = getAiInstance();
    const { systemInstruction, history, newMessage, language } = payload;

    const languageInstruction = language === 'he' ? "\n\nPlease respond exclusively in Hebrew." : "\n\nPlease respond exclusively in Spanish.";
    
    const formattedHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: systemInstruction + languageInstruction },
        history: formattedHistory,
    });

    const response = await chat.sendMessage({ message: newMessage });
    sendJSON(res, 200, { text: response.text });
};

const handleGeminiTranslate = async (payload, res) => {
    const ai = getAiInstance();
    const { text, targetLanguageName } = payload;
    const systemInstruction = `You are a machine translation service. Your entire response must consist ONLY of the translated text, and nothing else. Do not add any extra words, explanations, apologies, or preambles like "Translated from...". Just the translation. The target language is ${targetLanguageName}.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: text,
        config: { systemInstruction }
    });
    sendJSON(res, 200, { text: response.text.trim() });
};

const handleGeminiSearchEvents = async (payload, res) => {
    const ai = getAiInstance();
    const { prompt, language } = payload;
    const languageInstruction = language === 'he' ? "Respond in Hebrew." : "Respond in Spanish.";
    const fullPrompt = `${prompt}\n\n${languageInstruction}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    sendJSON(res, 200, { text: response.text, sources });
};

const handlePolygonConvert = async (payload, res) => {
    const { amount, fromCurrency, toCurrency } = payload;
    
    if (fromCurrency === toCurrency) {
        return sendJSON(res, 200, { convertedAmount: amount });
    }

    if (!POLYGON_API_KEY) {
        console.warn("Polygon.io API key not found. Using approximate fallback conversion rates.");
        // Fallback for missing Polygon key
        const usdToArs = 900;
        const usdToEur = 0.93;
        const usdToIls = 3.72;
        const rates = {
            'USD_ARS': usdToArs, 'ARS_USD': 1 / usdToArs,
            'USD_EUR': usdToEur, 'EUR_USD': 1 / usdToEur,
            'USD_ILS': usdToIls, 'ILS_USD': 1 / usdToIls,
            'ARS_EUR': (1 / usdToArs) * usdToEur, 'EUR_ARS': usdToArs * (1 / usdToEur),
            'ARS_ILS': (1 / usdToArs) * usdToIls, 'ILS_ARS': usdToArs * (1 / usdToIls),
            'EUR_ILS': (1 / usdToEur) * usdToIls, 'ILS_EUR': usdToEur * (1 / usdToIls),
        };
        const key = `${fromCurrency}_${toCurrency}`;
        const rate = rates[key];
        if (rate) {
            return sendJSON(res, 200, { convertedAmount: amount * rate });
        }
        return sendJSON(res, 500, { message: 'Fallback conversion rate not found' });
    }

    const url = `https://api.polygon.io/v2/aggs/ticker/C:${fromCurrency}${toCurrency}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
    
    try {
        const polygonResponse = await fetch(url);
        const data = await polygonResponse.json();

        if (!polygonResponse.ok || data.status === "ERROR" || !data.results || data.results.length === 0) {
            console.error(`Polygon error for ${fromCurrency}/${toCurrency}: ${data.error || polygonResponse.statusText}`);
            return sendJSON(res, 500, { message: 'Failed to fetch conversion rate' });
        }
        const rate = data.results[0].c;
        sendJSON(res, 200, { convertedAmount: amount * rate });

    } catch(e) {
         return handleError(res, e, 'polygon_convert_fetch');
    }
};
