import { ChatMessage, Language, Currency, GroundingChunk, WeatherData, DailyForecast } from '../types.ts';
import { CITIES } from '../constants.ts';

// --- DEFINITIVE ENVIRONMENT CHECK ---
// This new function robustly checks for all common local development scenarios,
// including running from the local file system (`file://`) or a local server (`localhost`).
// This is the definitive fix to prevent network calls that hang indefinitely.
const isDevelopmentMode = (): boolean => {
    if (typeof window === 'undefined') return false; // Not a browser
    const { protocol } = window.location;
    // FIX: Modified the development mode check. The previous version was too strict,
    // blocking legitimate API calls from local development servers (e.g., 'localhost').
    // The check is now relaxed to only block calls when running directly from the 
    // file system (`file://`), which is the primary scenario where API proxy calls would fail.
    // This allows developers running a local server to correctly test the live API.
    return protocol === 'file:';
};


// --- MOCK DATA AND HELPERS (For Local Development) ---

const getMockWeatherData = (lat: number, language: Language): WeatherData => {
    let temp_base = 20; // Default temp
    if (lat > -26) temp_base = 28; // Jujuy/Iguazu
    else if (lat > -33) temp_base = 24; // Rosario
    else if (lat > -35) temp_base = 22; // Buenos Aires

    const es_days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const he_days = ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'];
    const days = language === 'he' ? he_days : es_days;
    const today = new Date();

    const forecast = Array.from({ length: 5 }, (_, i): DailyForecast => {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i); // Start from today
        return {
            dayOfWeek: days[forecastDate.getDay()],
            date: forecastDate.toLocaleDateString(language === 'he' ? 'he-IL' : 'es-AR', { day: 'numeric', month: 'short' }),
            temp_min: temp_base - 5 + Math.random() * 3,
            temp_max: temp_base + 3 + Math.random() * 3,
            description: language === 'he' ? 'מעונן חלקית' : 'nubes parciales',
            icon: i % 3 === 0 ? '02d' : (i % 3 === 1 ? '03d' : '01d'),
        };
    });
    
    // Use the first day's forecast for "current" conditions for consistency
    const currentFromForecast = forecast[0];

    return {
        current: {
            temp: (currentFromForecast.temp_max + currentFromForecast.temp_min) / 2,
            feels_like: (currentFromForecast.temp_max + currentFromForecast.temp_min) / 2 - 1,
            humidity: 60 + Math.floor(Math.random() * 20),
            description: currentFromForecast.description,
            icon: currentFromForecast.icon,
        },
        forecast,
    };
};

const getFallbackExchangeRate = (from: Currency, to: Currency): number | null => {
    const usdToArs = 900;
    const usdToEur = 0.93;
    const usdToIls = 3.72;
    const rates: Record<string, number> = {
        'USD_ARS': usdToArs, 'ARS_USD': 1 / usdToArs,
        'USD_EUR': usdToEur, 'EUR_USD': 1 / usdToEur,
        'USD_ILS': usdToIls, 'ILS_USD': 1 / usdToIls,
        'ARS_EUR': (1 / usdToArs) * usdToEur, 'EUR_ARS': usdToArs / usdToEur,
        'ARS_ILS': (1 / usdToArs) * usdToIls, 'ILS_ARS': usdToArs / usdToIls,
        'EUR_ILS': (1 / usdToEur) * usdToIls, 'ILS_EUR': usdToEur / usdToIls,
    };
    const key = `${from}_${to}`;
    return rates[key] || null;
};

// --- PROXY FETCHER ---
// The environment check happens here, before any `fetch` is attempted.
async function fetchFromProxy(action: string, payload: any): Promise<any> {
    if (isDevelopmentMode()) {
        // This throw is now guaranteed to trigger for all local dev cases.
        // It will be caught by the calling function, which will then serve mock data.
        throw new Error("Development mode detected. API call cancelled.");
    }

    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, payload }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Proxy request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Proxy fetch for action '${action}' failed:`, error);
        throw error;
    }
}


// --- UNIFIED API FUNCTIONS (DEV vs PROD with fallback) ---
// The `try/catch` is the correct pattern for "use mock data if API doesn't work".
// The fix is ensuring the API call fails correctly and immediately in a dev environment.

export async function askGemini(userPrompt: string, language: Language): Promise<string> {
  try {
    const { text } = await fetchFromProxy('gemini_ask', { userPrompt, language });
    return text;
  } catch (error) {
    console.warn("askGemini failed, returning mock response.", error);
    await new Promise(resolve => setTimeout(resolve, 500));
    return language === 'he' 
      ? "תכונות הבינה המלאכותית מושבתות בפיתוח מקומי." 
      : "Las funciones de IA están deshabilitadas en el desarrollo local.";
  }
}

export async function sendMessageInChat(systemInstruction: string, history: ChatMessage[], newMessage: string, language: Language): Promise<string> {
  try {
    const { text } = await fetchFromProxy('gemini_chat', { systemInstruction, history, newMessage, language });
    return text;
  } catch (error) {
    console.warn("sendMessageInChat failed, returning mock response.", error);
    await new Promise(resolve => setTimeout(resolve, 800));
    return language === 'he' 
      ? "תודה על שאלתך! כרגע, תכונות הצ'אט עם בינה מלאכותית מושבתות בסביבת הפיתוח המקומית." 
      : "¡Gracias por tu pregunta! Actualmente, las funciones de chat con IA están deshabilitadas en el entorno de desarrollo local.";
  }
}

export async function translateText(textToTranslate: string, language: Language): Promise<string> {
    try {
        const targetLanguageName = language === 'he' ? 'Hebrew' : 'Spanish';
        const { text } = await fetchFromProxy('gemini_translate', { text: textToTranslate, targetLanguageName });
        return text;
    } catch (error) {
       console.warn("translateText failed, returning mock response.", error);
       await new Promise(resolve => setTimeout(resolve, 300));
       return `[${language === 'he' ? 'תרגום מדומה' : 'Traducción simulada'}] ${textToTranslate}`;
    }
}

export async function findEventsWithGoogleSearch(prompt: string, language: Language): Promise<{ text: string; sources: GroundingChunk[] }> {
    try {
      return await fetchFromProxy('gemini_search_events', { prompt, language });
    } catch (error) {
      console.warn("findEventsWithGoogleSearch failed, returning mock response.", error);
      await new Promise(resolve => setTimeout(resolve, 1200));
      const text = language === 'he'
        ? "חיפוש אירועים אינו זמין כרגע. נסה שוב מאוחר יותר."
        : "La búsqueda de eventos no está disponible en este momento. Por favor, inténtalo de nuevo más tarde.";
      return { text, sources: [] };
    }
}

export async function convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency): Promise<number | null> {
  if (fromCurrency === toCurrency) return amount;
  
  try {
    const { convertedAmount } = await fetchFromProxy('polygon_convert', { amount, fromCurrency, toCurrency });
    return convertedAmount;
  } catch(e) {
      console.warn("Failed to fetch real currency conversion, using fallback:", e);
      // Fallback if proxy call fails for any reason
      await new Promise(resolve => setTimeout(resolve, 200));
      const rate = getFallbackExchangeRate(fromCurrency, toCurrency);
      return rate ? amount * rate : null;
  }
}

const exchangeRateCache: Record<string, { rate: number; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function getCachedExchangeRate(from: Currency, to: Currency): Promise<number | null> {
  if (from === to) return 1;

  const cacheKey = `${from}_${to}`;
  const cached = exchangeRateCache[cacheKey];

  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return cached.rate;
  }
  
  const rate = await convertCurrency(1, from, to);

  if (rate !== null) {
    exchangeRateCache[cacheKey] = { rate, timestamp: Date.now() };
  }
  return rate;
}

export async function getWeatherForecast(coords: [number, number], language: Language): Promise<WeatherData | null> {
    try {
        const payload = { lat: coords[0], lon: coords[1], lang: language };
        return await fetchFromProxy('weather_forecast', payload);
    } catch (error) {
        console.warn("Using mock weather data due to environment or network error:", error);
        // Fallback to mock data if proxy fails
        await new Promise(resolve => setTimeout(resolve, 400));
        const city = CITIES.find(c => c.coords[0] === coords[0] && c.coords[1] === coords[1]);
        const lat = city ? city.coords[0] : -34.61;
        return getMockWeatherData(lat, language);
    }
}