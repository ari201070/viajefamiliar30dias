import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import path to use the TypeScript context file consistent with the rest of the app.
import { useAppContext } from '../../context/AppContext.tsx';
import { dbService } from '../../services/dbService.ts';

type SyncStatus = 'idle' | 'pending' | 'syncing' | 'synced' | 'error';

const CloudSyncInfo: React.FC = () => {
  const { t, language } = useAppContext();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<string | null>(() => localStorage.getItem('lastSyncedTime'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleDataChange = () => {
      if (syncStatus === 'idle' || syncStatus === 'synced') {
        setSyncStatus('pending');
      }
    };

    window.addEventListener('storage', handleDataChange);
    return () => {
      window.removeEventListener('storage', handleDataChange);
    };
  }, [syncStatus]);

  const handleExport = async () => {
    try {
      const jsonData = await dbService.exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `argentina_trip_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const now = new Date();
      const timeString = now.toLocaleTimeString(language === 'he' ? 'he-IL' : 'es-AR', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('lastSyncedTime', timeString);
      setLastSynced(timeString);
      setSyncStatus('synced');
      alert(t('backup_export_success'));
    } catch (error) {
      console.error('Export error:', error);
      setSyncStatus('error');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        await dbService.importData(content);
        alert(t('backup_import_success'));
        window.location.reload(); // Reload to show new data
      } catch (error) {
        console.error('Import error:', error);
        alert(t('backup_import_error'));
      }
    };
    reader.readAsText(file);
  };

  const getStatusInfo = () => {
    switch (syncStatus) {
      case 'pending':
        return { icon: 'fa-cloud-upload-alt', text: t('sync_status_pending'), color: 'text-yellow-600 dark:text-yellow-400' };
      case 'syncing':
        return { icon: 'fa-sync fa-spin', text: t('sync_status_syncing'), color: 'text-blue-500 dark:text-blue-400' };
      case 'synced':
        return { icon: 'fa-check-circle', text: t('sync_status_synced'), color: 'text-green-500 dark:text-green-400' };
      case 'error':
        return { icon: 'fa-exclamation-triangle', text: t('error'), color: 'text-red-500 dark:text-red-400' };
      case 'idle':
      default:
        return { icon: 'fa-cloud', text: lastSynced ? `${t('sync_status_last_sync')} ${lastSynced}` : t('sync_status_ready'), color: 'text-gray-500 dark:text-slate-400' };
    }
  };

  const { icon, text, color } = getStatusInfo();

  return (
    <section className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Status Header */}
        <div className="flex items-center gap-3">
          <i className={`fas ${icon} ${color} text-xl`}></i>
          <span className={`${color} font-semibold text-sm`}>{text}</span>
        </div>

        {/* Backup Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={handleExport}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm flex items-center justify-center gap-2"
          >
            <i className="fas fa-download"></i>
            {t('backup_export')}
          </button>

          <button
            onClick={handleImportClick}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm flex items-center justify-center gap-2"
          >
            <i className="fas fa-upload"></i>
            {t('backup_import')}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>

        <p className="text-xs text-center sm:text-left text-gray-500 dark:text-slate-500 mt-1">
          {t('sync_explanation_text')}
        </p>
      </div>
    </section>
  );
};

export default CloudSyncInfo;