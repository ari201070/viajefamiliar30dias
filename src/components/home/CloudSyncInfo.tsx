import React from 'react';
import { useAppContext } from '../../App.tsx';

const CloudSyncInfo: React.FC = () => {
  const { t } = useAppContext();

  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

  return (
    <section className={cardClasses}>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-indigo-500 flex items-center">
        <i className="fas fa-cloud-upload-alt mr-3 text-indigo-600 dark:text-indigo-400"></i>
        {t('cloud_sync_title')}
      </h2>
      <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
        {t('cloud_sync_intro')}
      </p>

      <div className="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-r-lg my-6">
        <p className="text-yellow-800 dark:text-yellow-300">
          {t('cloud_sync_warning')}
        </p>
      </div>

      <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-6">
        {t('cloud_sync_explanation')}
      </p>

      <ul className="space-y-6 my-6">
        <li className="flex items-start">
          <div className="flex-shrink-0">
            <i className="fas fa-sign-in-alt text-2xl text-green-500 mr-4 mt-1"></i>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-200">{t('cloud_sync_auth_title')}</h4>
            <p className="text-gray-600 dark:text-slate-400">{t('cloud_sync_auth_desc')}</p>
          </div>
        </li>
        <li className="flex items-start">
          <div className="flex-shrink-0">
            <i className="fas fa-database text-2xl text-blue-500 mr-4 mt-1"></i>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-200">{t('cloud_sync_db_title')}</h4>
            <p className="text-gray-600 dark:text-slate-400">{t('cloud_sync_db_desc')}</p>
          </div>
        </li>
        <li className="flex items-start">
          <div className="flex-shrink-0">
            <i className="fas fa-hdd text-2xl text-purple-500 mr-4 mt-1"></i>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-200">{t('cloud_sync_storage_title')}</h4>
            <p className="text-gray-600 dark:text-slate-400">{t('cloud_sync_storage_desc')}</p>
          </div>
        </li>
      </ul>
      
      <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg mt-8">
        <p className="text-blue-800 dark:text-blue-300 font-medium">
          {t('cloud_sync_cta')}
        </p>
      </div>

    </section>
  );
};

export default CloudSyncInfo;