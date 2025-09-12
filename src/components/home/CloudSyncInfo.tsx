import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';

const CloudSyncInfo: React.FC = () => {
  const { t, language } = useAppContext();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [lastSynced, setLastSynced] = useState<string | null>(() => localStorage.getItem('lastSyncedTime'));

  useEffect(() => {
    const triggerSync = () => {
      setSyncStatus('syncing');
      setTimeout(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString(language === 'he' ? 'he-IL' : 'es-AR', { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem('lastSyncedTime', timeString);
        setLastSynced(timeString);
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 2500); // Revert to idle after 2.5 seconds
      }, 1500); // Simulate sync for 1.5 seconds
    };

    const handleDataChange = () => {
      // Avoid triggering sync repeatedly in a short time
      if (syncStatus !== 'syncing') {
          triggerSync();
      }
    };
    
    // Listen for the custom 'storage' event dispatched by other components
    window.addEventListener('storage', handleDataChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleDataChange);
    };
  }, [language, syncStatus]);

  const getStatusInfo = () => {
    switch (syncStatus) {
      case 'syncing':
        return { icon: 'fa-sync fa-spin', text: t('sync_status_syncing'), color: 'text-blue-500 dark:text-blue-400' };
      case 'synced':
        return { icon: 'fa-check-circle', text: t('sync_status_synced'), color: 'text-green-500 dark:text-green-400' };
      case 'idle':
      default:
        return { icon: 'fa-cloud', text: lastSynced ? `${t('sync_status_last_sync')} ${lastSynced}` : t('sync_status_ready'), color: 'text-gray-500 dark:text-slate-400' };
    }
  };
  
  const { icon, text, color } = getStatusInfo();

  return (
    <div className="flex items-center justify-center gap-2 p-2 mb-8 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 text-sm shadow-inner">
      <i className={`fas ${icon} ${color}`}></i>
      <span className={`${color} font-medium`}>{text}</span>
    </div>
  );
};

export default CloudSyncInfo;
