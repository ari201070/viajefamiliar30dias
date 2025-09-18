import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { Language, Currency, Theme } from './types.ts';
import { translations } from './constants.ts';
import HomePage from './pages/HomePage.tsx';
import CityDetailPage from './pages/CityDetailPage.tsx';
import TopBar from './components/TopBar.tsx';
import Footer from './components/Footer.tsx';
import { AppContext, useAppContext } from './context/AppContext.tsx';
import { isFirebaseConfigured, firebaseConfigError } from './services/firebaseConfig.ts';
import { authService } from './services/authService.ts';
import Login from './components/Login.tsx';


// --- Scroll to Top Button Component ---
const ScrollToTopButton: React.FC = () => {
  const { t } = useAppContext();
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
          className="fixed bottom-8 right-8 z-50 bg-white/80 dark:bg-slate-700/80 backdrop-blur-md text-indigo-600 dark:text-indigo-400 p-0 w-14 h-14 rounded-full shadow-lg border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all duration-300 ease-in-out flex items-center justify-center"
          aria-label={t('scroll_to_top_label')}
        >
          <i className="fas fa-chevron-up text-2xl"></i>
        </button>
      )}
    </>
  );
};

const App: React.FC = () => {
  // App-wide state
  const [language, setLanguage] = useState<Language>(Language.ES);
  const [currency, setCurrency] = useState<Currency>(Currency.ARS);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme && Object.values(Theme).includes(storedTheme)) {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return Theme.DARK;
      }
    }
    return Theme.LIGHT;
  });

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [needsFirebaseSetup] = useState(!isFirebaseConfigured);
  const [firebaseErrorDetails] = useState(firebaseConfigError);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = authService.onAuthChange(user => {
        setCurrentUser(user);
        setIsAuthLoading(false);
      });
      return () => unsubscribe(); // Cleanup subscription on unmount
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // Language
    root.dir = language === Language.HE ? 'rtl' : 'ltr';
    root.lang = language;
    
    // Theme
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [language, theme]);

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    const langSet = translations[language] as any;
    let translatedString = langSet[key] || key; // Fallback to key if translation not found
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translatedString = translatedString.replace(`{${placeholder}}`, replacements[placeholder]);
      });
    }
    return translatedString;
  }, [language]);
  
  const appContextValue = {
    language, setLanguage,
    currency, setCurrency,
    t,
    theme, setTheme,
    currentUser
  };

  const renderContent = () => {
    if (needsFirebaseSetup) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              <i className="fas fa-exclamation-triangle mr-3"></i>
              Error de Configuración de Firebase
            </h2>
            <p className="text-gray-700 dark:text-slate-300">
              La aplicación no pudo inicializar Firebase. Por favor, asegúrate de que la variable de entorno `VITE_FIREBASE_CONFIG` esté correctamente configurada en tu archivo `.env` o en la configuración de despliegue.
            </p>
            {firebaseErrorDetails && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded-md text-left">
                <p className="font-semibold text-red-800 dark:text-red-200">Detalles del Error:</p>
                <code className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap break-all">{firebaseErrorDetails}</code>
              </div>
            )}
          </div>
        </div>
      );
    }
    if (isAuthLoading) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-100 dark:bg-slate-900">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
        </div>
      );
    }
    if (!currentUser) {
      return <Login />;
    }
    return (
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-300">
          <TopBar />
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/city/:cityId" element={<CityDetailPage />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTopButton />
        </div>
      </HashRouter>
    );
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {renderContent()}
    </AppContext.Provider>
  );
};

export default App;