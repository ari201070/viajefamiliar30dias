import React, { useState, FC } from 'react';
import { useAppContext } from '../../context/AppContext.ts';
import { CURRENCIES } from '../../constants.ts';
import { Currency } from '../../types.ts';
import { convertCurrency } from '../../services/apiService.ts';

const CurrencyConverter: FC = () => {
    const { t } = useAppContext();
    const [amount, setAmount] = useState('100');
    const [fromCurrency, setFromCurrency] = useState<Currency>(Currency.USD);
    const [toCurrency, setToCurrency] = useState<Currency>(Currency.ARS);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleConvert = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            setResult(t('error'));
            return;
        }
        setIsLoading(true);
        setResult(null);
        const convertedAmount = await convertCurrency(numAmount, fromCurrency, toCurrency);
        if (convertedAmount !== null) {
            setResult(`${toCurrency} ${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
        } else {
            setResult(t('error'));
        }
        setIsLoading(false);
    };

    return (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600 flex items-center">
                <i className="fas fa-exchange-alt mr-3 text-indigo-600 dark:text-indigo-400" />
                {t('conversorTitulo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="flex flex-col">
                    <label htmlFor="amount" className="mb-1 text-sm font-medium text-gray-600 dark:text-slate-300">{t('montoPlaceholder')}</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={t('montoPlaceholder')}
                        className="p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                         <label htmlFor="from" className="mb-1 text-sm font-medium text-gray-600 dark:text-slate-300">{t('desde')}</label>
                         <select id="from" value={fromCurrency} onChange={e => setFromCurrency(e.target.value as Currency)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700">
                             {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                         </select>
                    </div>
                    <div>
                        <label htmlFor="to" className="mb-1 text-sm font-medium text-gray-600 dark:text-slate-300">{t('hasta')}</label>
                        <select id="to" value={toCurrency} onChange={e => setToCurrency(e.target.value as Currency)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700">
                            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
             <button
                onClick={handleConvert}
                disabled={isLoading}
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50"
            >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : t('convertirBtn')}
            </button>
            {result && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg text-center text-xl font-bold text-gray-800 dark:text-slate-100">
                    {result}
                </div>
            )}
        </section>
    );
};

export default CurrencyConverter;