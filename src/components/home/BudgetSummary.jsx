import React from 'react';
import { useAppContext } from '../../context/AppContext.jsx';

const BudgetSummary = ({ budgetDetails }) => {
    const { t } = useAppContext();
    const { total, breakdown, isCalculating } = budgetDetails;

    const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50";
    const titleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600 flex items-center";

    return (
        <section className={cardClasses}>
            <h2 className={titleClasses}>
                <i className="fas fa-wallet mr-3 text-indigo-600 dark:text-indigo-400" />
                {t('budget_summary_title')}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">{t('budget_summary_desc')}</p>

            <div className="bg-indigo-50 dark:bg-slate-700/50 p-6 rounded-lg text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-slate-300 mb-2">{t('budget_summary_total_label')}</h3>
                <p className={`text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 ${isCalculating ? 'animate-pulse' : ''}`}>
                    {total}
                </p>
            </div>
            
            <div>
                <h4 className="text-xl font-bold text-gray-700 dark:text-slate-200 mb-4">{t('budget_summary_breakdown_title')}</h4>
                <div className="space-y-3">
                    {Object.entries(breakdown).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                            <span className="font-medium text-gray-700 dark:text-slate-300">{t(key)}</span>
                            <span className={`font-semibold text-gray-800 dark:text-slate-200 ${isCalculating ? 'animate-pulse' : ''}`}>{isCalculating ? '...' : value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BudgetSummary;