import React, { useState, useEffect, useMemo, FC, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import TopBar from './components/TopBar';
import Footer from './components/Footer';
import Login from './components/Login';

import { AppContext } from './context/AppContext';
import { Language, Theme, Currency, User, PhotoItem } from './types';
import { authService } from './services/authService';
import { isFirebaseConfigured } from './services/firebaseConfig';
import { consoleInterceptor } from './utils/consoleInterceptor';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const CityDetailPage = lazy(() => import('./pages/CityDetailPage'));

// Simple loading component for Suspense fallback
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center py-20">
    <i className="fas fa-spinner fa-spin text-4xl text-indigo-500" />
  </div>
);

const ScrollToTop: FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: FC = () => {
  // State management
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem('language') as Language) || Language.ES
  );
  const [currency, setCurrency] = useState<Currency>(
    (localStorage.getItem('currency') as Currency) || Currency.USD
  );
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || Theme.LIGHT
  );
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [i18nInitialized, setI18nInitialized] = useState<boolean>(false);

  // States for cross-component status updates
  const [hasPendingPackingListChanges, setHasPendingPackingListChanges] = useState<boolean>(false);
  const [pendingPhotos, setPendingPhotos] = useState<PhotoItem[]>([]);
  
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
      } as User);
      setIsAuthLoading(false);
    }
  }, []);
  
  // --- Context Provider Value ---
  const appContextValue = useMemo(() => ({
    language,
    setLanguage,
    currency,
    setCurrency,
    t: (key: string, options?: any): string => String(i18n.t(key, options)),
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
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/city/:cityId" element={<CityDetailPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </Router>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;