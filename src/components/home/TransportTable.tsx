import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { TransportLeg, Price } from '../../types.ts';
import { TRANSPORT_DATA } from '../../constants.ts';

interface TransportTableProps {
  getFormattedPrice: (price: Price | number) => string;
}

const TransportTable: React.FC<TransportTableProps> = ({ getFormattedPrice }) => {
  const { t, language } = useAppContext();
  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";
  const tableCellClasses = `px-4 py-3 whitespace-nowrap text-sm`;

  return (
    <section className={cardClasses}>
      <h2 className={`${sectionTitleClasses} flex items-center`}><i className="fas fa-bus mr-3 text-indigo-600 dark:text-indigo-400"></i>{t('transporte')}</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-indigo-100 dark:bg-slate-700">
            <tr>
              {['desde', 'hasta', 'medio', 'tiempo', 'precio', 'compania'].map(headerKey => (
                <th key={headerKey} scope="col" 
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${language === 'he' ? 'text-right' : 'text-left'} text-indigo-700 dark:text-indigo-300`}>
                  {t(headerKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {TRANSPORT_DATA.map((leg: TransportLeg) => {
              const textAlignClass = language === 'he' ? 'text-right' : 'text-left';
              return (
                <tr key={leg.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <td className={`${tableCellClasses} font-semibold text-gray-800 dark:text-slate-200 ${textAlignClass}`}>{t(leg.fromKey)}</td>
                  <td className={`${tableCellClasses} font-semibold text-gray-800 dark:text-slate-200 ${textAlignClass}`}>{t(leg.toKey)}</td>
                  <td className={`${tableCellClasses} text-gray-600 dark:text-slate-400 ${textAlignClass}`}>{t(leg.meanKey)}</td>
                  <td className={`${tableCellClasses} text-gray-600 dark:text-slate-400 ${textAlignClass}`}>{t(leg.timeKey)}</td>
                  <td className={`${tableCellClasses} text-gray-600 dark:text-slate-400 ${textAlignClass}`}>{getFormattedPrice(leg.basePriceARS)}</td>
                  <td className={`${tableCellClasses} text-gray-600 dark:text-slate-400 ${textAlignClass}`} dangerouslySetInnerHTML={{ __html: leg.company.replace('<a ', '<a class="text-indigo-600 dark:text-indigo-400 hover:underline" ') }}></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransportTable;