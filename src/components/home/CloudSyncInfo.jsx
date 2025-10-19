import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';

const CloudSyncInfo = () => {
  const { t, language } = useAppContext();
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSynced, setLastSynced] = useState(() => localStorage.getItem('lastSyncedTime'));

  useEffect(() => {
    const handleDataChange = () => {
      // If idle or already synced, move to pending state. Don't interrupt if already pending or syncing.
      if (syncStatus === 'idle' || syncStatus === 'synced') {
          setSyncStatus('pending');
      }
    };
    
    // Listen for the custom 'storage' event dispatched by other components
    window.addEventListener('storage', handleDataChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleDataChange);
    };
  }, [syncStatus]);

  const handleSync = () => {
      if (syncStatus !== 'pending') return;

      setSyncStatus('syncing');
      // Simulate sync network request
      setTimeout(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString(language === 'he' ? 'he-IL' : 'es-AR', { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem('lastSyncedTime', timeString);
        setLastSynced(timeString);
        setSyncStatus('synced');
        // Revert to idle after showing success message
        setTimeout(() => setSyncStatus('idle'), 3000);
      }, 1500);
  };


  const getStatusInfo = () => {
    switch (syncStatus) {
      case 'pending':
        return { icon: 'fa-cloud-upload-alt', text: t('sync_status_pending'), color: 'text-yellow-600 dark:text-yellow-400', showButton: true };
      case 'syncing':
        return { icon: 'fa-sync fa-spin', text: t('sync_status_syncing'), color: 'text-blue-500 dark:text-blue-400', showButton: false };
      case 'synced':
        return { icon: 'fa-check-circle', text: t('sync_status_synced'), color: 'text-green-500 dark:text-green-400', showButton: false };
      case 'idle':
      default:
        return { icon: 'fa-cloud', text: lastSynced ? `${t('sync_status_last_sync')} ${lastSynced}` : t('sync_status_ready'), color: 'text-gray-500 dark:text-slate-400', showButton: false };
    }
  };
  
  const { icon, text, color, showButton } = getStatusInfo();

  return (
    <section className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <i className={`fas ${icon} ${color} text-xl`}></i>
          <span className={`${color} font-semibold text-sm`}>{text}</span>
        </div>
        {showButton && (
          <button
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            {t('sync_button_now')}
          </button>
        )}
      </div>
      <p className="text-xs text-center sm:text-left text-gray-500 dark:text-slate-500 mt-2">{t('sync_explanation_text')}</p>
    </section>
  );
};

export default CloudSyncInfo;