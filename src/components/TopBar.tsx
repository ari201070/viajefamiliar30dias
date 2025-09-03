

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../App.tsx';
import { Language, Theme } from '../types.ts';
import { LANGUAGES, CURRENCIES } from '../constants.ts';

const TopBar: React.FC = () => {
  const { language, setLanguage, currency, setCurrency, t, theme, setTheme } = useAppContext();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // New state and refs for share popover
  const [showSharePopover, setShowSharePopover] = useState(false);
  const [copyStatusMessage, setCopyStatusMessage] = useState('');
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);

  const handleThemeToggle = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  
  const handleCopy = async () => {
    if (!shareInputRef.current) return;
    shareInputRef.current.select();
    shareInputRef.current.setSelectionRange(0, 99999); // For mobile browsers

    try {
      await navigator.clipboard.writeText(shareInputRef.current.value);
      setCopyStatusMessage(t('share_popover_copied_message'));
    } catch (err) {
      console.error('Clipboard API failed. Falling back to execCommand.', err);
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopyStatusMessage(t('share_popover_copied_message'));
        } else {
          setCopyStatusMessage(t('share_popover_copy_failed_message'));
        }
      } catch (execErr) {
        console.error('execCommand failed.', execErr);
        setCopyStatusMessage(t('share_popover_copy_failed_message'));
      }
    }
  };

  useEffect(() => {
    if (showSharePopover && shareInputRef.current) {
      shareInputRef.current.select();
      shareInputRef.current.setSelectionRange(0, 99999); // For mobile
      setCopyStatusMessage(''); // Reset message on open
    }
  }, [showSharePopover]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target as Node)
      ) {
        setShowSharePopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const commonButtonClasses = "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
  const activeLangButtonClasses = "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500";
  const inactiveLangButtonClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 focus:ring-gray-400 dark:focus:ring-slate-500";
  const activeCurrButtonClasses = "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500";
  const inactiveCurrButtonClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 focus:ring-gray-400 dark:focus:ring-slate-500";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md dark:shadow-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
          <i className="fas fa-route mr-2"></i>{t('tituloPrincipal')}
        </Link>
        
        <div className="flex items-center gap-x-4 sm:gap-x-6 gap-y-2 flex-wrap">
          {!isHomePage && (
            <Link
              to="/"
              className={`${commonButtonClasses} bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-400`}
            >
              <i className={`fas ${language === Language.HE ? 'fa-arrow-right' : 'fa-arrow-left'} mr-2`}></i>
              {t('volverItinerario')}
            </Link>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{t('idioma')}:</span>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`${commonButtonClasses} ${language === lang.code ? activeLangButtonClasses : inactiveLangButtonClasses}`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{t('moneda')}:</span>
            {CURRENCIES.map(curr => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code)}
                className={`${commonButtonClasses} ${currency === curr.code ? activeCurrButtonClasses : inactiveCurrButtonClasses}`}
              >
                {curr.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 relative">
            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-yellow-300 hover:bg-gray-300 dark:hover:bg-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <i className="fas fa-moon text-lg"></i> : <i className="fas fa-sun text-lg"></i>}
            </button>
            
            <button
              ref={shareButtonRef}
              onClick={() => setShowSharePopover(prev => !prev)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
              aria-label={t('share_app_label')}
              aria-haspopup="true"
              aria-expanded={showSharePopover}
            >
              <i className="fas fa-share-alt text-lg"></i>
            </button>

            {showSharePopover && (
              <div
                ref={popoverRef}
                className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl z-20 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="share-title"
              >
                <h4 id="share-title" className="text-md font-semibold text-gray-800 dark:text-slate-200 mb-2">{t('share_popover_title')}</h4>
                <div className="flex items-center gap-2">
                  <input
                    ref={shareInputRef}
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-grow p-2 text-sm border border-gray-300 dark:border-slate-500 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300"
                    aria-label="URL to share"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-700"
                  >
                    {t('share_popover_copy_button')}
                  </button>
                </div>
                {copyStatusMessage && (
                  <p className="text-xs text-center mt-2 text-gray-600 dark:text-slate-400" role="status">{copyStatusMessage}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;