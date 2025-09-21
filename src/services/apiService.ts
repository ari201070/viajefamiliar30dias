import { Language, GroundingChunk, ChatMessage, Currency, WeatherData } from '../types.ts';
import { translations } from '../constants.ts';

// --- API Proxy Service ---

// Generic fetch handler for our proxy
const fetchFromProxy = async (action: string, payload: object) => {
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorData.message || `API call failed with status: ${response.status}`);
  }

  return response.json();
};

// --- Gemini AI Service (via Proxy) ---

const getApiErrorMessage = (lang: Language) => 
  lang === Language.HE 
    ? "אירעה שגיאה בתקשורת עם שרת ה-AI." 
    : "An error occurred while contacting the AI server.";


export const askGemini = async (userPrompt: string, currentLanguage: Language): Promise<string> => {
  try {
    const data = await fetchFromProxy('gemini_ask', { userPrompt, language: currentLanguage });
    return data.text;
  } catch (error) {
    console.error("Error calling proxy for askGemini:", error);
    return getApiErrorMessage(currentLanguage);
  }
};

export const sendMessageInChat = async (
  systemInstruction: string,
  history: ChatMessage[],
  newMessage: string,
  currentLanguage: Language
): Promise<string> => {
  try {
    const data = await fetchFromProxy('gemini_chat', { 
        systemInstruction, 
        history, 
        newMessage, 
        language: currentLanguage 
    });
    return data.text;
  } catch (error) {
    console.error("Error calling proxy for sendMessageInChat:", error);
    return getApiErrorMessage(currentLanguage);
  }
};

export const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
  try {
    const targetLanguageName = translations[targetLanguage][`language_name_${targetLanguage}`] || (targetLanguage === 'he' ? 'Hebrew' : 'Spanish');
    const data = await fetchFromProxy('gemini_translate', { 
        text, 
        targetLanguage,
        targetLanguageName 
    });
    return data.text;
  } catch (error) {
    console.error(`Error calling proxy for translateText to ${targetLanguage}:`, error);
    return targetLanguage === Language.HE ? "שגיאת תרגום" : "Translation error";
  }
};

export const findEventsWithGoogleSearch = async (
  prompt: string,
  currentLanguage: Language
): Promise<{ text: string; sources: GroundingChunk[] }> => {
  try {
    const data = await fetchFromProxy('gemini_search_events', { prompt, language: currentLanguage });
    return { text: data.text, sources: data.sources || [] };
  } catch (error) {
    console.error("Error calling proxy for findEventsWithGoogleSearch:", error);
    const text = currentLanguage === Language.HE 
      ? "אירעה שגיאה בחיפוש אירועים." 
      : "An error occurred while searching for events.";
    return { text, sources: [] };
  }
};


// --- Currency Conversion Service (Local Fallback) ---

export const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number | null> => {
  if (fromCurrency === toCurrency) return amount;
  
  // This function now uses a local mock/fallback implementation to ensure functionality
  // during development, bypassing the need for a running proxy server with an API key.
  console.warn(`Using fallback currency conversion for ${fromCurrency} to ${toCurrency}`);
  
  const usdToArs = 900;
  const usdToEur = 0.93;
  const usdToIls = 3.72;
  // A simple rates map for bi-directional conversion
  const rates: { [key: string]: number } = {
      'USD_ARS': usdToArs, 'ARS_USD': 1 / usdToArs,
      'USD_EUR': usdToEur, 'EUR_USD': 1 / usdToEur,
      'USD_ILS': usdToIls, 'ILS_USD': 1 / usdToIls,
      'ARS_EUR': (1 / usdToArs) * usdToEur, 'EUR_ARS': usdToArs / usdToEur,
      'ARS_ILS': (1 / usdToArs) * usdToIls, 'ILS_ARS': usdToArs / usdToIls,
      'EUR_ILS': (1 / usdToEur) * usdToIls, 'ILS_EUR': usdToEur / usdToIls,
  };
  const key = `${fromCurrency}_${toCurrency}`;
  const rate = rates[key];
  
  if (rate) {
    return Promise.resolve(amount * rate);
  }
  
  console.error(`Fallback conversion rate not found for ${key}`);
  return Promise.resolve(null);
};


const exchangeRateCache = new Map<string, { rate: number, timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const getCachedExchangeRate = async (from: string, to: string): Promise<number | null> => {
  if (from === to) return 1.0;
  const cacheKey = `${from}_${to}`;
  const cached = exchangeRateCache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return cached.rate;
  }

  const convertedOneUnit = await convertCurrency(1, from, to);
  if (convertedOneUnit !== null) {
    exchangeRateCache.set(cacheKey, { rate: convertedOneUnit, timestamp: Date.now() });
  }
  return convertedOneUnit;
};

// --- Weather Forecast Service (Local Mock) ---

// Mock data generation for weather, adapted from api/proxy.js
const getMockWeatherData = (lat: number, lang: string): WeatherData => {
    let temp_base = 20; // Default for Mendoza/Bariloche
    if (lat > -26) temp_base = 28; // Jujuy/Iguazu
    else if (lat > -33) temp_base = 24; // Rosario
    else if (lat > -35) temp_base = 22; // Buenos Aires

    const es_days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const he_days = ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'];
    const days = lang === 'he' ? he_days : es_days;
    
    const today = new Date().getDay();
    const weatherIcons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
    const weatherDescriptionsEs = ['cielo claro', 'nubes parciales', 'nublado', 'muy nublado', 'lluvia', 'lluvia ligera', 'tormenta', 'nieve', 'niebla'];
    const weatherDescriptionsHe = ['שמיים בהירים', 'מעונן חלקית', 'מעונן', 'מעונן מאוד', 'גשם', 'גשם קל', 'סערה', 'שלג', 'ערפל'];

    return {
        current: {
            temp: temp_base + Math.random() * 4 - 2,
            feels_like: temp_base + Math.random() * 4 - 1,
            humidity: 60 + Math.floor(Math.random() * 20),
            description: lang === 'he' ? 'שמיים בהירים' : 'cielo claro',
            icon: '01d',
        },
        forecast: Array.from({ length: 14 }, (_, i) => {
            const randomWeatherIndex = Math.floor(Math.random() * weatherIcons.length);
            return {
                dayOfWeek: days[(today + i + 1) % 7],
                temp_min: temp_base - 5 + Math.random() * 3,
                temp_max: temp_base + 3 + Math.random() * 3,
                description: lang === 'he' ? weatherDescriptionsHe[randomWeatherIndex] : weatherDescriptionsEs[randomWeatherIndex],
                icon: weatherIcons[randomWeatherIndex],
            }
        }),
    };
};

export const getWeatherForecast = async (coords: [number, number], lang: Language): Promise<WeatherData> => {
  // This function now uses a local mock implementation to ensure functionality
  // during development, bypassing the need for a running proxy server.
  console.warn("Using mock weather data in apiService.ts");
  try {
      const mockData = getMockWeatherData(coords[0], lang);
      return await Promise.resolve(mockData);
  } catch (error) {
      console.error("Error generating mock weather data:", error);
      throw error;
  }
};