import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';

const CloudSyncInfo: React.FC = () => {
  const { t } = useAppContext();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  return (
    <section className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Status Header */}
        <div className="flex items-center gap-3">
          {isOnline ? (
            <>
              <i className="fas fa-cloud-check text-green-500 dark:text-green-400 text-xl"></i>
              <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                {t('app_status_modal_online')} - {t('app_status_modal_synced')}
              </span>
            </>
          ) : (
            <>
              <i className="fas fa-cloud-slash text-yellow-500 dark:text-yellow-400 text-xl"></i>
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm">
                {t('app_status_modal_offline')} - {t('app_status_modal_pending_items').replace('{{count}}', '')}
              </span>
            </>
          )}
        </div>

        <p className="text-xs text-center sm:text-left text-gray-500 dark:text-slate-500 mt-1">
          {t('app_status_modal_explanation')}
        </p>
      </div>
    </section>
  );
};

export default CloudSyncInfo;