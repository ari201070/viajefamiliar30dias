import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import TopBar from './components/TopBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CityDetailPage from './pages/CityDetailPage';
import Login from './components/Login';

import { AppContext } from './context/AppContext';
import { Language, Theme, Currency } from './constants';
import { authService } from './services/authService';
import { isFirebaseConfigured } from './services/firebaseConfig';
import { consoleInterceptor } from './utils/consoleInterceptor';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  // State management
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || Language.ES
  );
  const [currency, setCurrency] = useState(
    localStorage.getItem('currency') || Currency.USD
  );
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || Theme.LIGHT
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [i18nInitialized, setI18nInitialized] = useState(false);

  // States for cross-component status updates
  const [hasPendingPackingListChanges, setHasPendingPackingListChanges] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  
  // --- Effects for managing side-effects and listeners ---
  
  // i18next initialization effect
  useEffect(() => {
    async function initializeI18n() {
      try {
        const [esResponse, heResponse] = await Promise.all([
          fetch('./src/locales/es.json'),
          fetch('./src/locales/he.json')
        ]);

        if (!esResponse.ok || !heResponse.ok) {
          throw new Error('Failed to fetch locale files');
        }

        const es = await esResponse.json();
        const he = await heResponse.json();

        i18n
          .use(initReactI18next)
          .init({
            resources: { 
              es: { translation: es }, 
              he: { translation: he } 
            },
            lng: localStorage.getItem('language') || 'es',
            fallbackLng: 'es',
            interpolation: { escapeValue: false },
          }, (err) => {
            if (err) {
              console.error('i18next init error:', err);
            }
            setI18nInitialized(true);
          });
      } catch (error) {
        console.error('Error initializing i18next:', error);
        setI18nInitialized(true); 
      }
    }
    initializeI18n();
  }, []);

  // Theme management
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.DARK);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Language management
  useEffect(() => {
    if (i18nInitialized) {
      i18n.changeLanguage(language);
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === Language.HE ? 'rtl' : 'ltr';
    }
  }, [language, i18nInitialized]);
  
  // Currency management
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);
  
  // Network status listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Authentication state listener
  useEffect(() => {
    consoleInterceptor.start();

    const protocol = window.location.protocol;
    const isSupportedAuthEnvironment = ['http:', 'https:', 'chrome-extension:'].includes(protocol);

    if (isFirebaseConfigured && isSupportedAuthEnvironment) {
      const unsubscribe = authService.onAuthChange(firebaseUser => {
        setUser(firebaseUser);
        setIsAuthLoading(false);
      });
      return () => unsubscribe();
    } else {
      if (!isSupportedAuthEnvironment) {
          console.warn("Unsupported auth environment detected. Falling back to local user mode automatically.");
      } else { 
          console.warn("Firebase is not configured. Falling back to local user mode automatically.");
      }
      setUser({
        uid: 'local-user-mode',
        displayName: 'Ariel Flier (Modo Local)',
      });
      setIsAuthLoading(false);
    }
  }, []);
  
  // --- Context Provider Value ---
  const appContextValue = useMemo(() => ({
    language,
    setLanguage,
    currency,
    setCurrency,
    t: (key, options) => String(i18n.t(key, options)),
    theme,
    setTheme,
    isOnline,
    user,
    setUser,
    hasPendingPackingListChanges,
    setHasPendingPackingListChanges,
    pendingPhotos,
    setPendingPhotos,
  }), [language, currency, theme, isOnline, user, hasPendingPackingListChanges, pendingPhotos]);

  // --- Render Logic ---
  if (isAuthLoading || !i18nInitialized) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-100 dark:bg-slate-900">
        <i className="fas fa-spinner fa-spin text-5xl text-indigo-500" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <div className={`app-container bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-slate-100 min-h-screen flex flex-col font-sans`}>
        {!user ? (
          <Login />
        ) : (
          <Router>
            <ScrollToTop />
            <TopBar />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/city/:cityId" element={<CityDetailPage />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;