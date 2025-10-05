import React, { FC } from 'react';
import { useAppContext } from '../../context/AppContext.ts';
import { TRANSPORT_DATA } from '../../constants.ts';
import { Price } from '../../types.ts';

interface TransportTableProps {
    getFormattedPrice: (price: Price | number) => string;
}

const TransportTable: FC<TransportTableProps> = ({ getFormattedPrice }) => {
    const { t } = useAppContext();

    const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50";
    const titleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600 flex items-center";

    return (
        <section className={cardClasses}>
            <h2 className={titleClasses}>
                <i className="fas fa-bus mr-3 text-indigo-600 dark:text-indigo-400" />
                {t('transporte')}
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('desde')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('hasta')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('medio')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('tiempo')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('precio')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('compania')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                        {TRANSPORT_DATA.map(leg => (
                            <tr key={leg.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">{t(leg.fromKey)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">{t(leg.toKey)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{t(leg.meanKey)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{t(leg.timeKey)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{getFormattedPrice(leg.basePriceARS)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                    <a href="#" target="_blank" rel="noopener noreferrer">{leg.company}</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TransportTable;