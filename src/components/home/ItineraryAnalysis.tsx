import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { CITIES } from '../../constants.ts';

const ItineraryAnalysis: React.FC = () => {
  const { t } = useAppContext();
  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

  return (
    <section className={cardClasses}>
      <h2 className={`${sectionTitleClasses} flex items-center`}><i className="fas fa-clipboard-list mr-3 text-indigo-600 dark:text-indigo-400"></i>{t('itinerary_program_title')}</h2>
      
      <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3">{t('itinerary_program_current_plan_title')}</h3>
          <ul className="list-disc list-inside space-y-2 pl-5">
              {CITIES.map(city => {
                  const durationText = t(`${city.id}_dates_duration`);
                  const simplifiedDuration = durationText !== `${city.id}_dates_duration` 
                      ? durationText.split('\n')[0].replace(/.*Estadía\s*:\s*/i, '').replace(/\*\*Estadía\*\*:\s*/i,'').trim() 
                      : t('duration_not_specified');
                  return (
                      <li key={city.id} className="text-gray-700 dark:text-slate-300">
                          <span className="font-medium text-gray-900 dark:text-slate-100">{t(city.nameKey)}:</span> {simplifiedDuration}
                      </li>
                  );
              })}
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
