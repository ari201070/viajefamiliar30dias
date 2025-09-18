import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import { Language, Theme } from '../types.ts';
import { LANGUAGES, CURRENCIES } from '../constants.ts';
import { authService } from '../services/authService.ts';

const TopBar: React.FC = () => {
  const { language, setLanguage, currency, setCurrency, t, theme, setTheme, currentUser } = useAppContext();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // State and refs for popovers
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [copyStatusMessage, setCopyStatusMessage] = useState('');

  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const sharePopoverRef = useRef<HTMLDivElement>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);
  
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPopoverRef = useRef<HTMLDivElement>(null);

  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuPopoverRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    await authService.signOutUser();
    setIsUserMenuOpen(false);
    // onAuthStateChanged listener in App.tsx will handle the rest.
  };

  // Effect for closing popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close Share Popover
      if (sharePopoverRef.current && !sharePopoverRef.current.contains(event.target as Node) && shareButtonRef.current && !shareButtonRef.current.contains(event.target as Node)) {
        setIsSharePopoverOpen(false);
      }
      // Close Mobile Menu
      if (menuPopoverRef.current && !menuPopoverRef.current.contains(event.target as Node) && menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      // Close User Menu
      if (userMenuPopoverRef.current && !userMenuPopoverRef.current.contains(event.target as Node) && userMenuButtonRef.current && !userMenuButtonRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commonButtonClasses = "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
  const activeLangButtonClasses = "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500";
  const inactiveLangButtonClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 focus:ring-gray-400 dark:focus:ring-slate-500";
  const activeCurrButtonClasses = "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500";
  const inactiveCurrButtonClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 focus:ring-gray-400 dark:focus:ring-slate-500";

  const renderControls = (isMobile: boolean) => (
    <>
      <div className={isMobile ? 'space-y-4' : 'flex items-center gap-2'}>
        <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{t('idioma')}:</span>
        <div className={isMobile ? 'flex gap-2' : ''}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => { setLanguage(lang.code); if (isMobile) setIsMenuOpen(false); }}
            className={`${commonButtonClasses} ${language === lang.code ? activeLangButtonClasses : inactiveLangButtonClasses}`}
          >
            {lang.name}
          </button>
        ))}
        </div>
      </div>

      <div className={isMobile ? 'space-y-2' : 'flex items-center gap-2'}>
        <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{t('moneda')}:</span>
        <div className={isMobile ? 'flex flex-wrap gap-2' : 'flex gap-2'}>
        {CURRENCIES.map(curr => (
          <button
            key={curr.code}
            onClick={() => { setCurrency(curr.code); if (isMobile) setIsMenuOpen(false); }}
            className={`${commonButtonClasses} ${currency === curr.code ? activeCurrButtonClasses : inactiveCurrButtonClasses}`}
          >
            {curr.name}
          </button>
        ))}
        </div>
      </div>
      
      <div className={isMobile ? "border-t border-gray-200 dark:border-slate-600 pt-4 flex justify-between items-center" : "flex items-center gap-2 relative"}>
        {isMobile && <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Opciones:</span>}
        <div className="flex items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-yellow-300 hover:bg-gray-300 dark:hover:bg-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <i className="fas fa-moon text-lg"></i> : <i className="fas fa-sun text-lg"></i>}
            </button>
            
            <button
              ref={shareButtonRef}
              onClick={() => setIsSharePopoverOpen(prev => !prev)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
              aria-label={t('share_app_label')}
              aria-haspopup="true"
              aria-expanded={isSharePopoverOpen}
            >
              <i className="fas fa-share-alt text-lg"></i>
            </button>
        </div>

        {isSharePopoverOpen && (
          <div
            ref={sharePopoverRef}
            className={`absolute top-full mt-2 w-72 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl z-20 p-4 ${isMobile ? 'right-0' : 'right-0'}`}
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
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md dark:shadow-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left side: Title & Back Button */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
              <i className="fas fa-route mr-1 sm:mr-2"></i>{t('tituloPrincipal')}
            </Link>
            {!isHomePage && (
              <Link
                to="/"
                className={`${commonButtonClasses} bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-400`}
              >
                <i className={`fas ${language === Language.HE ? 'fa-arrow-right' : 'fa-arrow-left'} sm:mr-2`}></i>
                <span className="hidden sm:inline">{t('volverItinerario')}</span>
              </Link>
            )}
          </div>
          
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-x-4 lg:gap-x-6">
            {renderControls(false)}
          </div>

          {/* User & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* User Menu */}
            <div className="relative">
              <button
                ref={userMenuButtonRef}
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
              >
                <img src={currentUser?.photoURL || ''} alt="User" className="w-full h-full rounded-full object-cover" />
              </button>
              {isUserMenuOpen && (
                <div 
                  ref={userMenuPopoverRef}
                  className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl z-20"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-slate-600">
                      <p className="font-semibold text-gray-800 dark:text-slate-200">{currentUser?.displayName}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-600 flex items-center gap-2"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Open menu"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Popover */}
        {isMenuOpen && (
          <div
            ref={menuPopoverRef}
            className="md:hidden absolute top-full right-4 mt-2 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl z-20 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col gap-y-4">
              {renderControls(true)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
