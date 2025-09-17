import { Language, GroundingChunk, ChatMessage, Currency } from '../types.ts';
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


// --- Currency Conversion Service (via Proxy) ---

export const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number | null> => {
  if (fromCurrency === toCurrency) return amount;
  try {
    const data = await fetchFromProxy('polygon_convert', { amount, fromCurrency, toCurrency });
    return data.convertedAmount;
  } catch (error) {
    console.error(`Error calling proxy for convertCurrency from ${fromCurrency} to ${toCurrency}:`, error);
    return null;
  }
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
