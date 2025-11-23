import { useState, useRef, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import { LANGUAGES, CURRENCIES } from '../constants.ts';
import { Language, Theme } from '../types.ts';
import { authService } from '../services/authService.ts';
import CloudSyncInfo from './home/CloudSyncInfo.tsx';

const TopBar: FC = () => {
  const {
    language, setLanguage,
    currency, setCurrency,
    t,
    theme, setTheme,
    user
  } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as Language);
    setIsMenuOpen(false);
  };

  const handleThemeChange = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              <i className="fas fa-plane-departure"></i>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
            </div>
          </div>
          <div className="flex items-center">
            {user && <span className="hidden sm:inline-block text-sm text-gray-600 dark:text-slate-300 mr-4">{user.displayName || 'User'}</span>}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
              >
                <i className="fas fa-cog text-xl"></i>
              </button>
              {isMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-700 dark:text-slate-200">{t('idioma')}</p>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-700 dark:text-slate-200">{t('moneda')}</p>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {CURRENCIES.map(curr => <option key={curr.code} value={curr.code}>{curr.name}</option>)}
                    </select>
                  </div>
                  <div className="border-t border-gray-200 dark:border-slate-600"></div>
                  <button
                    onClick={handleThemeChange}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 flex items-center justify-between"
                  >
                    <span>
                      <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} mr-2`}></i>
                      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <div className="relative">
                      <div className={`w-12 h-6 rounded-full shadow-inner ${theme === 'light' ? 'bg-gray-300' : 'bg-indigo-500'}`}></div>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'light' ? 'left-0.5' : 'left-6'}`}></div>
                    </div>
                  </button>
                  <div className="border-t border-gray-200 dark:border-slate-600"></div>
                  <button
                    onClick={() => authService.signOutUser()}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="py-2 border-t border-gray-200 dark:border-slate-700">
          <CloudSyncInfo />
        </div>
      </nav>
    </header>
  );
};

export default TopBar;
