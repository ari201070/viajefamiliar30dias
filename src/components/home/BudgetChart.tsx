import { FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';

interface BudgetChartProps {
    breakdown: Record<string, string>;
    realBreakdown: Record<string, number>;
}

const BudgetChart: FC<BudgetChartProps> = ({ breakdown, realBreakdown }) => {
    const { t, language } = useAppContext();

    // Prepare data for chart
    const chartData = Object.entries(breakdown).map(([key, estimatedStr]) => {
        // Parse estimated value (get average if range)
        const numbers = estimatedStr.replace(/[^0-9-]/g, ' ').trim().split(/\s+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
        const estimated = numbers.length === 2 ? (numbers[0] + numbers[1]) / 2 : (numbers[0] || 0);
        const real = realBreakdown[key] || 0;

        return {
            key,
            label: t(key),
            estimated,
            real
        };
    });

    // Find max value for scaling
    const maxValue = Math.max(...chartData.flatMap(d => [d.estimated, d.real]));

    // Helper to calculate bar width percentage
    const getBarWidth = (value: number): number => {
        if (maxValue === 0) return 0;
        return (value / maxValue) * 100;
    };

    return (
        <div className="mt-8">
            <h4 className="text-xl font-bold text-gray-700 dark:text-slate-200 mb-6 flex items-center">
                <i className="fas fa-chart-bar mr-2 text-indigo-600 dark:text-indigo-400"></i>
                {t('budget_chart_title')}
            </h4>

            <div className="space-y-6">
                {chartData.map((item) => (
                    <div key={item.key} className="space-y-2">
                        {/* Category Label */}
                        <div className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-slate-300">
                            <span>{item.label}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {t('budget_estimated')}: {item.estimated.toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', { maximumFractionDigits: 0 })} | 
                                {' '}{t('budget_real')}: {item.real.toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', { maximumFractionDigits: 0 })}
                            </span>
                        </div>

                        {/* Bar Chart */}
                        <div className="relative h-12 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                            {/* Estimated Bar (background) */}
                            <div 
                                className="absolute top-0 left-0 h-full bg-indigo-200 dark:bg-indigo-900/40 transition-all duration-500"
                                style={{ width: `${getBarWidth(item.estimated)}%` }}
                            >
                                <div className="h-full flex items-center justify-end px-3">
                                    <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                                        {item.estimated > maxValue * 0.1 ? t('budget_estimated') : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Real Bar (foreground) */}
                            {item.real > 0 && (
                                <div 
                                    className="absolute top-1 left-0 h-10 bg-emerald-500 dark:bg-emerald-600 rounded transition-all duration-500 shadow-md"
                                    style={{ width: `${getBarWidth(item.real)}%` }}
                                >
                                    <div className="h-full flex items-center justify-end px-3">
                                        <span className="text-xs font-bold text-white">
                                            {item.real > maxValue * 0.1 ? t('budget_real') : ''}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Difference Indicator */}
                        {item.real > 0 && (
                            <div className="flex justify-end">
                                {(() => {
                                    const diff = item.real - item.estimated;
                                    const percentDiff = ((diff / item.estimated) * 100);
                                    const icon = Math.abs(percentDiff) < 5 ? '=' : (diff < 0 ? '↓' : '↑');
                                    const color = Math.abs(percentDiff) < 5 
                                        ? 'text-green-600 dark:text-green-400'
                                        : (diff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400');

                                    return (
                                        <span className={`text-xs font-semibold ${color}`}>
                                            {icon} {diff > 0 ? '+' : ''}{diff.toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', { maximumFractionDigits: 0 })} 
                                            ({percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%)
                                        </span>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-3 bg-indigo-200 dark:bg-indigo-900/40 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">{t('budget_estimated')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-3 bg-emerald-500 dark:bg-emerald-600 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">{t('budget_real')}</span>
                </div>
            </div>
        </div>
    );
};

export default BudgetChart;
