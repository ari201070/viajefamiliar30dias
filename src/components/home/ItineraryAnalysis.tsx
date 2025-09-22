import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';

const ItineraryAnalysis: React.FC = () => {
  const { t } = useAppContext();
  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

  // FIX: Created a static list of itinerary legs to ensure all steps are displayed correctly.
  const itineraryLegs = [
    { nameKey: 'buenosaires_name', durationKey: 'buenosaires_dates_duration' },
    { nameKey: 'rosario_name', durationKey: 'rosario_dates_duration' },
    { nameKey: 'bariloche_name', durationKey: 'bariloche_dates_duration' },
    { nameKey: 'mendoza_name', durationKey: 'mendoza_dates_duration' },
    { nameKey: 'jujuy_name', durationKey: 'jujuy_dates_duration' },
    { nameKey: 'iguazu_name', durationKey: 'iguazu_dates_duration' },
    { nameKey: 'esteros_ibera_name', durationKey: 'esteros_ibera_dates_duration' },
    { nameKey: 'corrientes_name', durationKey: 'corrientes_dates_duration' },
    { nameKey: 'buenosaires_name', durationKey: 'buenosaires_final_stay_dates_duration' },
  ];

  return (
    <section className={cardClasses}>
      <h2 className={`${sectionTitleClasses} flex items-center`}><i className="fas fa-clipboard-list mr-3 text-indigo-600 dark:text-indigo-400"></i>{t('itinerary_program_title')}</h2>
      
      <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3">{t('itinerary_program_current_plan_title')}</h3>
          <ul className="list-disc list-inside space-y-2 pl-5">
              {itineraryLegs.map((leg, index) => (
                  <li key={`${leg.durationKey}-${index}`} className="text-gray-700 dark:text-slate-300 whitespace-pre-line">
                      <span className="font-medium text-gray-900 dark:text-slate-100">{t(leg.nameKey)}:</span> {t(leg.durationKey)}
                  </li>
              ))}
          </ul>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3">{t('itinerary_program_optimization_tips_title')}</h3>
          <ul className="list-disc list-inside space-y-2 pl-5">
              {[1, 2, 3, 4, 5, 6].map(tipNum => (
                  <li key={tipNum} className="text-gray-700 dark:text-slate-300">{t(`itinerary_optimization_tip_${tipNum}`)}</li>
              ))}
          </ul>
      </div>
    </section>
  );
};

export default ItineraryAnalysis;