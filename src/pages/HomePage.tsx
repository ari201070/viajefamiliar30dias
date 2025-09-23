import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import CityCard from '../components/CityCard.tsx';
import InteractiveMap from '../components/InteractiveMap.tsx';
// FIX: Import AI_PROMPT_CONFIGS to be used for rendering AI chat components.
import { CITIES, TRIP_WIDE_BUDGET_ITEMS, AI_PROMPT_CONFIGS, BOOKING_DATA } from '../constants.ts';
import { Currency, BudgetItem, Price, HotelData } from '../types.ts';
import { getCachedExchangeRate } from '../services/apiService.ts';
import BudgetSummary from '../components/home/BudgetSummary.tsx';
import TransportTable from '../components/home/TransportTable.tsx';
import ItineraryAnalysis from '../components/home/ItineraryAnalysis.tsx';
import PackingList from '../components/home/PackingList.tsx';
import AIChatBox from '../components/AIChatBox.tsx';
import CurrencyConverter from '../components/home/CurrencyConverter.tsx';
import FamilyPhotoAlbum from '../components/home/FamilyPhotoAlbum.tsx';
import FlightTickets from '../components/home/FlightTickets.tsx';
import WeatherForecast from '../components/home/WeatherForecast.tsx';
import Reservations from '../components/home/Reservations.tsx';
import { BudgetDetails } from '../types.ts';


// --- Helper Functions for Budget Calculation ---
const parseRange = (rangeStr: string): [number, number] => {
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

const getDaysFromDurationString = (durationStr: string): number => {
  if (!durationStr) return 0;
  
  let totalDays = 0;

  // This regex finds all occurrences of a number followed by "día", "días", or "ימים"
  const regex = /(\d+)\s*(días?|ימים)/g;
  const matches = durationStr.matchAll(regex);
  
  for (const match of matches) {
    totalDays += parseInt(match[1], 10);
  }

  // Handle Hebrew specific word for "two days" (יומיים), which doesn't have a digit.
  if (durationStr.includes('יומיים')) {
    totalDays += 2;
  }
  
  return totalDays;
};


const HomePage: React.FC = () => {
  const { t, language, currency: globalCurrency } = useAppContext();

  // State and logic that needs to be shared or is at the page level
  const [exchangeRates, setExchangeRates] = useState<Record<string, number | null>>({});
  const [budgetDetails, setBudgetDetails] = useState<BudgetDetails>({
    total: t('budget_summary_calculating'),
    breakdown: {},
    isCalculating: true,
  });

  // --- Price Conversion & Formatting Logic ---
  const updateAllExchangeRates = useCallback(async () => {
    const newRates: Record<string, number | null> = {};
    const baseCurrencies = [Currency.ARS, Currency.USD]; // All our prices are based in these
    const allCurrencies = Object.values(Currency);

    for (const base of baseCurrencies) {
        for (const target of allCurrencies) {
            if (base === target) {
                newRates[`${base}_${target}`] = 1;
                continue;
            };
            const key = `${base}_${target}`;
            if (!newRates[key]) { // Avoid re-fetching
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

  const getFormattedPrice = useCallback((priceInput: { value: number; currency: Currency } | number) => {
    // Standardize input to be a Price object, assuming ARS for raw numbers
    const price: Price = typeof priceInput === 'number'
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
        const totalsByCategory: Record<string, { min: number, max: number }> = {};
        const savedBudgets = JSON.parse(localStorage.getItem('customBudgets') || '{}');

        // --- NEW: Process real bookings first to override estimates ---
        const bookedAccommodationCostsUSD: Record<string, number> = {};
        for (const item of BOOKING_DATA) {
            if (item.type === 'hotel' && item.cityId) {
                const price = (item.data as HotelData).price;
                let priceInUSD = 0;
                if (price.currency === Currency.USD) {
                    priceInUSD = price.value;
                } else {
                    const rate = await getCachedExchangeRate(price.currency, Currency.USD);
                    if (rate) {
                        priceInUSD = price.value * rate;
                    }
                }
                bookedAccommodationCostsUSD[item.cityId] = (bookedAccommodationCostsUSD[item.cityId] || 0) + priceInUSD;
            }
        }

        // Add trip-wide one-time costs 
        TRIP_WIDE_BUDGET_ITEMS.forEach(item => {
            if (!totalsByCategory[item.conceptKey]) {
                totalsByCategory[item.conceptKey] = { min: 0, max: 0 };
            }
            const [min, max] = parseRange(item.value);
            totalsByCategory[item.conceptKey].min += min;
            totalsByCategory[item.conceptKey].max += max;
        });

        for (const city of CITIES) {
            const durationStr = t(`${city.id}_dates_duration`);
            const days = getDaysFromDurationString(durationStr);
            const cityBudget = savedBudgets[city.id] || city.budgetItems;

            cityBudget.forEach((item: BudgetItem) => {
                // If accommodation is booked for this city, skip the estimated budget item.
                if (item.conceptKey === 'budget_concept_accommodation' && bookedAccommodationCostsUSD[city.id]) {
                    return; 
                }

                if (!totalsByCategory[item.conceptKey]) {
                    totalsByCategory[item.conceptKey] = { min: 0, max: 0 };
                }
                const [min, max] = parseRange(item.value);

                if (item.isPerDay) {
                    totalsByCategory[item.conceptKey].min += min * days;
                    totalsByCategory[item.conceptKey].max += max * days;
                } else {
                    // This logic for one-time costs per city is complex, assuming simple add for now
                    totalsByCategory[item.conceptKey].min += min;
                    totalsByCategory[item.conceptKey].max += max;
                }
            });
        }
        
        // Add the actual booked accommodation costs to the total.
        if (Object.keys(bookedAccommodationCostsUSD).length > 0) {
            if (!totalsByCategory['budget_concept_accommodation']) {
                totalsByCategory['budget_concept_accommodation'] = { min: 0, max: 0 };
            }
            for (const cityId in bookedAccommodationCostsUSD) {
                const cost = bookedAccommodationCostsUSD[cityId];
                totalsByCategory['budget_concept_accommodation'].min += cost;
                totalsByCategory['budget_concept_accommodation'].max += cost;
            }
        }

        let totalMinUSD = 0;
        let totalMaxUSD = 0;
        Object.values(totalsByCategory).forEach(category => {
            totalMinUSD += category.min;
            totalMaxUSD += category.max;
        });

        const rate = await getCachedExchangeRate(Currency.USD, globalCurrency);

        if (rate !== null) {
            const formattedBreakdown: Record<string, string> = {};
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
    const handleStorageChange = (event: StorageEvent | Event) => {
      // Listen for custom event trigger as well
      if ((event as StorageEvent).key === 'customBudgets' || event.type === 'storage') {
        calculateTripBudget();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [calculateTripBudget]);

  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover-shadow-slate-700 transition-shadow duration-300";

  return (
    <div className="space-y-12">
      <section className="text-center py-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">{t('tituloPrincipal')}</h1>
        <p className="text-lg text-indigo-100">{t('bienvenidaPrincipal')}</p>
      </section>

      <FlightTickets />

      <Reservations getFormattedPrice={getFormattedPrice} />

      {/* City Cards */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CITIES.map(city => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>
      
      <BudgetSummary budgetDetails={budgetDetails} />

      <WeatherForecast />

      {/* Interactive Map */}
      <section className={cardClasses}>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600 flex items-center">
          <i className="fas fa-map-marked-alt mr-3 text-indigo-600 dark:text-indigo-400"></i>
          {t('mapaInteractivoTitulo')}
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mb-6">{t('mapaInteractivoBienvenida')}</p>
        <InteractiveMap cities={CITIES} />
      </section>
      
      <TransportTable getFormattedPrice={getFormattedPrice} />

      <ItineraryAnalysis />
      
      <FamilyPhotoAlbum />

      <PackingList />

      {/* AI Chatbots Section */}
      <section className="space-y-12">
        {AI_PROMPT_CONFIGS.map(config => (
           <AIChatBox 
              key={config.promptKeySuffix} 
              config={config} 
              chatId={`homepage_${config.promptKeySuffix}`}
            />
        ))}
      </section>
      
      <CurrencyConverter />
    </div>
  );
};

export default HomePage;