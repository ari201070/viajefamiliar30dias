
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Currency } from '../types';

// --- Firebase Configuration ---
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA81InS4O_wKnFGmKAUg-2DL63UXyyQEKs",
  authDomain: "viajes-argentina-en-30-dias.firebaseapp.com",
  projectId: "viajes-argentina-en-30-dias",
  storageBucket: "viajes-argentina-en-30-dias.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:52421464497:web:5b48fe7b53783a087bad90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// --- Cloud Functions ---

export const sendMessageInChat = async (systemInstruction: string, history: any[], userText: string): Promise<string> => {
  const sendMessage = httpsCallable(functions, 'sendMessageInChat');
  try {
    const result = await sendMessage({ systemInstruction, history, userText });
    return result.data as string;
  } catch (error) { 
    console.error("Firebase function call failed:", error);
    throw new Error("Failed to get response from AI model.");
  }
};

// --- Exchange Rate API ---
const exchangeRateCache: Record<string, { rate: number, timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getCachedExchangeRate = async (from: Currency | 'USD', to: Currency): Promise<number | null> => {
  const cacheKey = `${from}-${to}`;
  const cached = exchangeRateCache[cacheKey];

  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return cached.rate;
  }

  try {
    // Note: Using a free API. In a real app, use a more reliable, paid service.
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    if (!response.ok) throw new Error('Network response was not ok.');
    const data = await response.json();
    const rate = data.rates[to];
    
    if (rate) {
      exchangeRateCache[cacheKey] = { rate, timestamp: Date.now() };
      return rate;
    }
    return null;
  } catch (error) {
    console.error("Could not fetch exchange rate:", error);
    return null;
  }
};
