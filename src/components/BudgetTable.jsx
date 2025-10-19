import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.jsx';

const BudgetTable = ({ cityId, defaultBudgetItems }) => {
    const { t } = useAppContext();
    const [budgetItems, setBudgetItems] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedBudgets = JSON.parse(localStorage.getItem('customBudgets') || '{}');
        setBudgetItems(savedBudgets[cityId] || defaultBudgetItems);
    }, [cityId, defaultBudgetItems]);

    const handleValueChange = (index, value) => {
        const updatedItems = [...budgetItems];
        updatedItems[index] = { ...updatedItems[index], value };
        setBudgetItems(updatedItems);
        setIsSaved(false); // Mark as unsaved
    };

    const saveBudget = () => {
        const savedBudgets = JSON.parse(localStorage.getItem('customBudgets') || '{}');
        savedBudgets[cityId] = budgetItems;
        localStorage.setItem('customBudgets', JSON.stringify(savedBudgets));
        // Dispatch a storage event so HomePage can recalculate the total budget
        window.dispatchEvent(new Event('storage'));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000); // Hide message after 2s
    };
    
    const restoreDefaults = () => {
        setBudgetItems(defaultBudgetItems);
        const savedBudgets = JSON.parse(localStorage.getItem('customBudgets') || '{}');
        delete savedBudgets[cityId];
        localStorage.setItem('customBudgets', JSON.stringify(savedBudgets));
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('budget_table_concept')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('budget_table_estimated_price_usd')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {budgetItems.map((item, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{t(item.conceptKey)} {item.isPerDay && `(${t('budget_per_day_suffix')})`}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => handleValueChange(index, e.target.value)}
                                    className="w-full md:w-40 p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., 100-150"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex flex-wrap gap-4 items-center">
                <button
                    onClick={saveBudget}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-150"
                >
                    <i className="fas fa-save mr-2"></i> Guardar
                </button>
                <button
                    onClick={restoreDefaults}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded transition-colors duration-150"
                >
                    {t('budget_table_restore_defaults')}
                </button>
                 {isSaved && <span className="text-green-600 dark:text-green-400 animate-fade-in"><i className="fas fa-check-circle mr-1"></i>{t('status_budget_saved')}</span>}
            </div>
        </div>
    );
};

export default BudgetTable;