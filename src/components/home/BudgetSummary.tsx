import { FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { BudgetDetails } from '../../types.ts';
import BudgetChart from './BudgetChart.tsx';

interface BudgetSummaryProps {
    budgetDetails: BudgetDetails;
}

const BudgetSummary: FC<BudgetSummaryProps> = ({ budgetDetails }) => {
    const { t, currency, language } = useAppContext();
    const { total, breakdown, isCalculating, realExpenses } = budgetDetails;

    const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50";
    const titleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600 flex items-center";

    // Helper function to calculate difference
    const calculateDifference = (estimatedStr: string, realValue: number | undefined): {text: string, className: string} => {
        if (!realValue || realValue === 0) {
            return { text: '-', className: 'text-gray-400' };
        }

        // Parse estimated range (e.g., "1000 - 1500" or "1000")
        const numbers = estimatedStr.replace(/[^0-9-]/g, ' ').trim().split(/\s+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
        if (numbers.length === 0) return { text: '-', className: 'text-gray-400' };

        const estimatedAvg = numbers.length === 2 ? (numbers[0] + numbers[1]) / 2 : numbers[0];
        const diff = realValue - estimatedAvg;
        const percentDiff = ((diff / estimatedAvg) * 100);

        let className = 'text-gray-600 dark:text-gray-300';
        let icon = '';

        if (Math.abs(percentDiff) < 5) {
            // Within 5% - on budget
            className = 'text-green-600 dark:text-green-400 font-semibold';
            icon = '✓ ';
        } else if (diff < 0) {
            // Under budget
            className = 'text-emerald-600 dark:text-emerald-400 font-semibold';
            icon = '↓ ';
        } else {
            // Over budget
            className = 'text-orange-600 dark:text-orange-400 font-semibold';
            icon = '↑ ';
        }

        const formattedDiff = `${diff > 0 ? '+' : ''}${diff.toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', { maximumFractionDigits: 0 })}`;
        return {text: `${icon}${formattedDiff} (${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(1)}%)`, className};
    };

    // Helper to check if category is accommodation (family stays)
    const isFamilyAccommodation = (key: string): boolean => {
        return key === 'accommodation_budget' && !!realExpenses && (realExpenses.breakdown[key] || 0) === 0;
    };

    return (
        <section className={cardClasses}>
            <h2 className={titleClasses}>
                <i className="fas fa-wallet mr-3 text-indigo-600 dark:text-indigo-400" />
                {t('budget_summary_title')}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">{t('budget_summary_desc')}</p>

            {/* Total Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Estimated Total */}
                <div className="bg-indigo-50 dark:bg-slate-700/50 p-6 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-slate-300 mb-2">
                        {t('budget_estimated_label')}
                    </h3>
                    <p className={`text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 ${isCalculating ? 'animate-pulse' : ''}`}>
                        {total}
                    </p>
                </div>

                {/* Real Total */}
                {realExpenses && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg text-center">
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-slate-300 mb-2">
                            {t('budget_real_label')}
                        </h3>
                        <p className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">
                            {currency} {realExpenses.total.toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                )}
            </div>

            {/* Breakdown Section */}
            <div>
                <h4 className="text-xl font-bold text-gray-700 dark:text-slate-200 mb-4">
                    {realExpenses ? t('budget_comparison_title') : t('budget_summary_breakdown_title')}
                </h4>

                {/* Table with comparison */}
                {realExpenses ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('budget_category')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('budget_estimated')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('budget_real')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('budget_difference')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {Object.entries(breakdown).map(([key, value]) => {
                                        const realValue = realExpenses.breakdown[key] || 0;
                                        const diff = calculateDifference(value, realValue);
                                        const isFamilyStay = isFamilyAccommodation(key);

                                        return (
                                            <tr key={key} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {t(key)}
                                                    {isFamilyStay && (
                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300">
                                                            🏠 {t('budget_free_accommodation')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${isCalculating ? 'animate-pulse' : ''}`}>
                                                    {isCalculating ? '...' : value}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-800 dark:text-gray-200">
                                                    {realValue > 0 
                                                        ? realValue.toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', { maximumFractionDigits: 0 })
                                                        : (isFamilyStay ? '0' : '-')
                                                    }
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${diff.className}`}>
                                                    {diff.text}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Chart Visualization */}
                        <BudgetChart breakdown={breakdown} realBreakdown={realExpenses.breakdown} />
                    </>
                ) : (
                    /* Original simple breakdown */
                    <div className="space-y-3">
                        {Object.entries(breakdown).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                                <span className="font-medium text-gray-700 dark:text-slate-300">{t(key)}</span>
                                <span className={`font-semibold text-gray-800 dark:text-slate-200 ${isCalculating ? 'animate-pulse' : ''}`}>
                                    {isCalculating ? '...' : value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BudgetSummary;