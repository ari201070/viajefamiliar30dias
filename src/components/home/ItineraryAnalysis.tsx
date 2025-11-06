import React, { FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { CITIES } from '../../constants.ts';

const ItineraryAnalysis: FC = () => {
    const { t } = useAppContext();

    const optimizationTips = [
        t('itinerary_optimization_tip_1'),
        t('itinerary_optimization_tip_2'),
        t('itinerary_optimization_tip_3'),
        t('itinerary_optimization_tip_4'),
        t('itinerary_optimization_tip_5'),
        t('itinerary_optimization_tip_6'),
    ];

    const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50";
    const titleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600 flex items-center";

    return (
        <section className={cardClasses}>
            <h2 className={titleClasses}>
                 <i className="fas fa-route mr-3 text-indigo-600 dark:text-indigo-400" />
                {t('itinerary_program_title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-slate-300">{t('itinerary_program_current_plan_title')}</h3>
                    <ol className="relative border-l border-gray-200 dark:border-slate-600">
                        {CITIES.map((city, index) => (
                             <li key={city.id} className="mb-6 ml-6">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-800 dark:bg-blue-900">
                                    <i className="fas fa-map-marker-alt text-blue-800 dark:text-blue-300 text-xs"></i>
                                </span>
                                <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{t(city.nameKey)}</h4>
                                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-slate-500">{t(`${city.id}_dates_duration`).split('\n')[1].replace(/- \*\*Fechas\*\*:\s*/, '').trim()}</time>
                            </li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-slate-300">{t('itinerary_program_optimization_tips_title')}</h3>
                    <ul className="space-y-3">
                        {optimizationTips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                                <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                                <span className="text-gray-600 dark:text-slate-400">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ItineraryAnalysis;