import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import CityCard from '../components/CityCard';
import InteractiveMap from '../components/InteractiveMap';
import { CITIES, TRIP_WIDE_BUDGET_ITEMS, AI_PROMPT_CONFIGS, Currency } from '../constants.js';
import { getCachedExchangeRate } from '../services/apiService.js';
import BudgetSummary from '../components/home/BudgetSummary';
import TransportTable from '../components/home/TransportTable';
import ItineraryAnalysis from '../components/home/ItineraryAnalysis';
import PackingList from '../components/home/PackingList';
import AIChatBox from '../components/AIChatBox';
import CurrencyConverter from '../components/home/CurrencyConverter';
import FamilyPhotoAlbum from '../components/home/FamilyPhotoAlbum';
import WeatherForecast from '../components/home/WeatherForecast';
import Reservations from '../components/home/Reservations';
import FlightTickets from '../components/home/FlightTickets';


// --- Helper Functions for Budget Calculation ---
const parseRange = (rangeStr) => {
  if (!rangeStr || typeof rangeStr !== 'string') return [0, 0];
  const parts = rangeStr.split('-').map(s => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  if (parts.length === 1 && !isNaN(parts[0])) {
    return [parts[0], parts[0]];
  }
  return [0, 0];
};

const getDaysFromDurationString = (durationStr) => {
  if (!durationStr) return 0;
  
  let totalDays = 0;

  const regex = /(\d+)\s*(días?|ימים)/g;
  const matches = durationStr.matchAll(regex);
  
  for (const match of matches) {
    totalDays += parseInt(match[1], 10);
  }

  if (durationStr.includes('יומיים')) {
    totalDays += 2;
  }
  
  return totalDays;
};


const HomePage = () => {
  const { t, language, currency: globalCurrency } = useAppContext();

  const [exchangeRates, setExchangeRates] = useState({});
  const [budgetDetails, setBudgetDetails] = useState({
    total: t('budget_summary_calculating'),
    breakdown: {},
    isCalculating: true,
  });
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);

  // --- Price Conversion & Formatting Logic ---
  const updateAllExchangeRates = useCallback(async () => {
    const newRates = {};
    const baseCurrencies = [Currency.ARS, Currency.USD]; 
    const allCurrencies = Object.values(Currency);

    for (const base of baseCurrencies) {
        for (const target of allCurrencies) {
            if (base === target) {
                newRates[`${base}_${target}`] = 1;
                continue;
            };
            const key = `${base}_${target}`;
            if (!newRates[key]) { 
                const rate = await getCachedExchangeRate(base, target);
                newRates[key] = rate;
            }
        }
    }
    setExchangeRates(newRates);
  }, []);

  useEffect(() => {
    updateAllExchangeRates();
  }, [updateAllExchangeRates]);

  const getFormattedPrice = useCallback((priceInput) => {
    const price = typeof priceInput === 'number'
        ? { value: priceInput, currency: Currency.ARS }
        : priceInput;

    if (price.currency === globalCurrency) {
        return `${price.currency} ${price.value.toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', { maximumFractionDigits: 0 })}`;
    }

    const rateKey = `${price.currency}_${globalCurrency}`;
    const rate = exchangeRates[rateKey];

    if (rate !== null && rate !== undefined) {
        const convertedValue = price.value * rate;
        return `${globalCurrency} ${convertedValue.toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', { maximumFractionDigits: 0 })}`;
    }
    
    return t('loading');
  }, [globalCurrency, language, t, exchangeRates]);
  
  // --- Trip Budget Calculation Logic ---
  const calculateTripBudget = useCallback(async () => {
    setBudgetDetails({
        total: t('budget_summary_calculating'),
        breakdown: {},
        isCalculating: true,
    });
    
    try {
        const totalsByCategory = {};
        const oneTimeCostsAdded = new Set();
        const savedBudgets = JSON.parse(localStorage.getItem('customBudgets') || '{}');

        TRIP_WIDE_BUDGET_ITEMS.forEach(item => {
            if (!totalsByCategory[item.conceptKey]) {
                totalsByCategory[item.conceptKey] = { min: 0, max: 0 };
            }
            const [min, max] = parseRange(item.value);
            totalsByCategory[item.conceptKey].min += min;
            totalsByCategory[item.conceptKey].max += max;
            oneTimeCostsAdded.add(item.conceptKey);
        });

        for (const city of CITIES) {
            const durationStr = t(`${city.id}_dates_duration`);
            const days = getDaysFromDurationString(durationStr);
            const cityBudget = savedBudgets[city.id] || city.budgetItems;

            cityBudget.forEach((item) => {
                if (!totalsByCategory[item.conceptKey]) {
                    totalsByCategory[item.conceptKey] = { min: 0, max: 0 };
                }
                const [min, max] = parseRange(item.value);

                if (item.isPerDay) {
                    totalsByCategory[item.conceptKey].min += min * days;
                    totalsByCategory[item.conceptKey].max += max * days;
                } else {
                    if (!oneTimeCostsAdded.has(item.conceptKey)) {
                        totalsByCategory[item.conceptKey].min += min;
                        totalsByCategory[item.conceptKey].max += max;
                        oneTimeCostsAdded.add(item.conceptKey);
                    }
                }
            });
        }
        
        let totalMinUSD = 0;
        let totalMaxUSD = 0;
        Object.values(totalsByCategory).forEach(category => {
            totalMinUSD += category.min;
            totalMaxUSD += category.max;
        });

        const rate = await getCachedExchangeRate(Currency.USD, globalCurrency);

        if (rate !== null) {
            const formattedBreakdown = {};
            const locale = language === 'he' ? 'he-IL' : 'es-AR';
            const formattingOptions = { maximumFractionDigits: 0 };

            for (const conceptKey in totalsByCategory) {
                const { min, max } = totalsByCategory[conceptKey];
                const finalMin = min * rate;
                const finalMax = max * rate;
                
                if (finalMin === finalMax) {
                    formattedBreakdown[conceptKey] = `${finalMin.toLocaleString(locale, formattingOptions)}`;
                } else {
                    formattedBreakdown[conceptKey] = `${finalMin.toLocaleString(locale, formattingOptions)} - ${finalMax.toLocaleString(locale, formattingOptions)}`;
                }
            }
            
            const finalTotalMin = totalMinUSD * rate;
            const finalTotalMax = totalMaxUSD * rate;
            
            let formattedTotal;
            if (finalTotalMin === finalTotalMax) {
                formattedTotal = `${globalCurrency} ${finalTotalMin.toLocaleString(locale, formattingOptions)}`;
            } else {
                formattedTotal = `${globalCurrency} ${finalTotalMin.toLocaleString(locale, formattingOptions)} - ${finalTotalMax.toLocaleString(locale, formattingOptions)}`;
            }
            
            setBudgetDetails({
                total: formattedTotal,
                breakdown: formattedBreakdown,
                isCalculating: false,
            });

        } else {
            setBudgetDetails({
                total: t('error'),
                breakdown: {},
                isCalculating: false,
            });
        }
    } catch (error) {
        console.error("Failed to calculate trip budget:", error);
        setBudgetDetails({
            total: t('error'),
            breakdown: {},
            isCalculating: false,
        });
    }
  }, [t, globalCurrency, language]);

  useEffect(() => {
    calculateTripBudget();
    const handleStorageChange = (event) => {
      if (event.key === 'customBudgets' || event.type === 'storage') {
        calculateTripBudget();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [calculateTripBudget]);

  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";
  const collapsibleHeaderClasses = "cursor-pointer p-4 rounded-lg flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md";


  return (
    <div className="space-y-12">
      <section className="text-center py-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">{t('tituloPrincipal')}</h1>
        <p className="text-lg text-indigo-100">{t('bienvenidaPrincipal')}</p>
      </section>

      <section>
        <div onClick={() => setIsTicketsOpen(!isTicketsOpen)} className={collapsibleHeaderClasses}>
            <h2 className="text-xl font-bold flex items-center">
                <i className="fas fa-plane-departure mr-3"></i>
                {t('flight_tickets_title')}
            </h2>
            <i className={`fas fa-chevron-down transform transition-transform ${isTicketsOpen ? 'rotate-180' : ''}`}></i>
        </div>
        {isTicketsOpen && (
            <div className="animate-fade-in mt-[-10px] pt-12 p-6 bg-white dark:bg-slate-800 rounded-b-xl shadow-lg">
                 <FlightTickets getFormattedPrice={getFormattedPrice} />
            </div>
        )}
      </section>

       <section>
          <div onClick={() => setIsReservationsOpen(!isReservationsOpen)} className={collapsibleHeaderClasses}>
              <h2 className="text-xl font-bold flex items-center">
                  <i className="fas fa-concierge-bell mr-3"></i>
                  {t('reservations_title')}
              </h2>
              <i className={`fas fa-chevron-down transform transition-transform ${isReservationsOpen ? 'rotate-180' : ''}`}></i>
          </div>
          {isReservationsOpen && (
              <div className="animate-fade-in mt-[-10px] pt-12 p-6 bg-white dark:bg-slate-800 rounded-b-xl shadow-lg">
                  <Reservations getFormattedPrice={getFormattedPrice} />
              </div>
          )}
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CITIES.map(city => <CityCard key={city.id} city={city} />)}
        </div>
      </section>
      <BudgetSummary budgetDetails={budgetDetails} />
      <WeatherForecast />
      <section className={cardClasses}>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600 flex items-center">
          <i className="fas fa-map-marked-alt mr-3 text-indigo-600 dark:text-indigo-400" />
          {t('mapaInteractivoTitulo')}
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mb-6">{t('mapaInteractivoBienvenida')}</p>
        <InteractiveMap cities={CITIES} />
      </section>
      <TransportTable getFormattedPrice={getFormattedPrice} />
      <ItineraryAnalysis />
      <FamilyPhotoAlbum />
      <PackingList />
      <section className="space-y-12">
        {AI_PROMPT_CONFIGS.map(config =>
           <AIChatBox
              key={config.promptKeySuffix} 
              config={config} 
              chatId={`homepage_${config.promptKeySuffix}`}
            />
        )}
      </section>
      <CurrencyConverter />
    </div>
  );
};

export default HomePage;