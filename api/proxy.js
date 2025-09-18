const { GoogleGenAI } = require("@google/genai");
const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

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
      case 'weather_forecast':
        return await handleWeatherForecast(payload, res);
      default:
        return sendJSON(res, 400, { message: 'Invalid action' });
    }
  } catch (error) {
    return handleError(res, error, action);
  }
};

const getAiInstance = () => {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured on the server.");
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

    const languageInstruction = language === 'he' 
        ? "\n\nPlease respond exclusively in Hebrew." 
        : "\n\nPlease respond exclusively in Spanish.";

    // Format the existing history for the Gemini API
    const formattedHistory = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user', // Ensure role is either 'user' or 'model'
        parts: [{ text: msg.text }]
    }));

    // Combine history with the new message to form the full conversation context
    const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: newMessage }] }
    ];

    // Use generateContent with the full conversation history for a more robust, stateless interaction
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: { systemInstruction: systemInstruction + languageInstruction },
    });

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

// --- Weather Forecast Handler ---
const handleWeatherForecast = async (payload, res) => {
    const { lat, lon, lang } = payload;
    
    // NOTE: This uses MOCK DATA to avoid needing a real API key during development.
    // In a real scenario, you would uncomment the fetch call below.
    if (!OPENWEATHER_API_KEY) {
        console.warn("OpenWeather API key not found. Using mock weather data.");
        const mockData = getMockWeatherData(lat, lang);
        return sendJSON(res, 200, mockData);
    }
    
    // Real API call (currently unused in favor of mock data)
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${lang}`;
    try {
        const weatherResponse = await fetch(url);
        const data = await weatherResponse.json();
        if (!weatherResponse.ok) {
            throw new Error(data.message || 'Failed to fetch weather data');
        }
        const formattedData = {
            current: {
                temp: data.current.temp,
                feels_like: data.current.feels_like,
                humidity: data.current.humidity,
                description: data.current.weather[0].description,
                icon: data.current.weather[0].icon,
            },
            forecast: data.daily.slice(1, 6).map(day => ({
                dayOfWeek: new Date(day.dt * 1000).toLocaleDateString(lang === 'he' ? 'he-IL' : 'es-AR', { weekday: 'short' }),
                temp_min: day.temp.min,
                temp_max: day.temp.max,
                description: day.weather[0].description,
                icon: day.weather[0].icon,
            })),
        };
        return sendJSON(res, 200, formattedData);
    } catch(e) {
        return handleError(res, e, 'weather_forecast_fetch');
    }
};

// Mock data generation for weather
const getMockWeatherData = (lat, lang) => {
    // Determine city based on latitude to provide more "realistic" mock data
    let temp_base = 20; // Mendoza/Bariloche
    if (lat > -26) temp_base = 28; // Jujuy/Iguazu
    else if (lat > -33) temp_base = 24; // Rosario
    else if (lat > -35) temp_base = 22; // Buenos Aires

    const es_days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const he_days = ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'];
    const days = lang === 'he' ? he_days : es_days;
    
    const today = new Date().getDay();

    return {
        current: {
            temp: temp_base + Math.random() * 4 - 2,
            feels_like: temp_base + Math.random() * 4 - 1,
            humidity: 60 + Math.floor(Math.random() * 20),
            description: lang === 'he' ? 'שמיים בהירים' : 'cielo claro',
            icon: '01d',
        },
        forecast: Array.from({ length: 5 }, (_, i) => ({
            dayOfWeek: days[(today + i + 1) % 7],
            temp_min: temp_base - 5 + Math.random() * 3,
            temp_max: temp_base + 3 + Math.random() * 3,
            description: lang === 'he' ? 'מעונן חלקית' : 'nubes parciales',
            icon: i % 2 === 0 ? '02d' : '03d',
        })),
    };
};