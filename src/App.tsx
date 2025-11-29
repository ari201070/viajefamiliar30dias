import { useState, useEffect, useMemo, FC, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import locale files
import es from './locales/es.json';
import he from './locales/he.json';

// Import components
import TopBar from './components/TopBar.tsx';
import Footer from './components/Footer.tsx';
import Login from './components/Login.tsx';

// Import context and types
import { AppContext } from './context/AppContext.tsx';
import { Language, Theme, Currency, User, PhotoItem } from './types.ts';

// Import services and utils
import { authService } from './services/authService.ts';
import { auth, isFirebaseConfigured } from './services/firebaseConfig.ts';
import { consoleInterceptor } from './utils/consoleInterceptor.ts';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const CityDetailPage = lazy(() => import('./pages/CityDetailPage.tsx'));

// --- Utility Components ---
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

// --- Scroll to Top Button Component ---
const ScrollToTopButton: FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-indigo-600 dark:bg-indigo-500 text-white p-0 w-14 h-14 rounded-full shadow-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all duration-300 ease-in-out flex items-center justify-center"
          aria-label="Volver arriba"
        >
          <i className="fas fa-chevron-up text-2xl"></i>
        </button>
      )}
    </>
  );
};

// --- Main App Layout ---
const MainAppLayout: FC = () => (
  <div className="app-container bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-slate-100 min-h-screen flex flex-col font-sans">
    <TopBar />
    <main className="grow container mx-auto p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet /> {/* Pages render here */}
      </Suspense>
    </main>
    <Footer />
    <ScrollToTopButton />
  </div>
);

// --- Root App Component ---
const App: FC = () => {
  // --- State Management ---
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
  const [hasPendingPackingListChanges, setHasPendingPackingListChanges] = useState<boolean>(false);
  const [pendingPhotos, setPendingPhotos] = useState<PhotoItem[]>([]);

  // --- Effects ---
  useEffect(() => {
    i18n
      .use(initReactI18next)
      .init({
        resources: { es: { translation: es }, he: { translation: he } },
        lng: localStorage.getItem('language') || 'es',
        fallbackLng: 'es',
        interpolation: { escapeValue: false },
      }, (err) => {
        if (err) console.error('i18next init error:', err);
        setI18nInitialized(true);
      });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.DARK);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (i18nInitialized) {
      i18n.changeLanguage(language);
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === Language.HE ? 'rtl' : 'ltr';
    }
  }, [language, i18nInitialized]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

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

  useEffect(() => {
    consoleInterceptor.start();
    const protocol = window.location.protocol;
    const isSupportedAuthEnvironment = ['http:', 'https:', 'chrome-extension:'].includes(protocol);
    if (isFirebaseConfigured && isSupportedAuthEnvironment) {
      auth?.getRedirectResult().catch((error) => {
        console.error("Error getting redirect result:", error);
      });
      const unsubscribe = authService.onAuthChange(firebaseUser => {
        setUser(firebaseUser);
        setIsAuthLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Fallback for unsupported environments or if Firebase is not configured
      setUser({ uid: 'local-user-mode', displayName: 'Ariel Flier (Modo Local)' } as User);
      setIsAuthLoading(false);
    }
  }, []);

  const t = useCallback((key: string, options?: any): string => {
    return String(i18n.t(key, options));
  }, []);

  const appContextValue = useMemo(() => ({
    language, setLanguage, currency, setCurrency, theme, setTheme, isOnline, user, setUser,
    t,
    hasPendingPackingListChanges, setHasPendingPackingListChanges, pendingPhotos, setPendingPhotos,
  }), [language, currency, theme, isOnline, user, hasPendingPackingListChanges, pendingPhotos, t]);

  // --- Render Logic ---
  if (isAuthLoading || !i18nInitialized) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-100 dark:bg-slate-900">
        <i className="fas fa-spinner fa-spin text-5xl text-indigo-500" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* RUTA PRINCIPAL Y SECUNDARIAS - TODO ES ABIERTO */}
          <Route element={<MainAppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/city/:cityId" element={<CityDetailPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;