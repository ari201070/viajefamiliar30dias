import React, { useState, useEffect, FC } from 'react';
import { useAppContext } from '../../context/AppContext.ts';
import { CITIES } from '../../constants.ts';
import { WeatherData } from '../../types.ts';
import { getWeatherForecast } from '../../services/apiService.ts';

const WeatherForecast: FC = () => {
    const { t, language } = useAppContext();
    const [selectedCityId, setSelectedCityId] = useState(CITIES[0].id);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            const city = CITIES.find(c => c.id === selectedCityId);
            if (!city) {
                setError(t('weather_error_city_not_found'));
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const data = await getWeatherForecast(city.coords, language);
                setWeatherData(data);
            } catch (err) {
                setError(t('weather_error_fetching'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchWeather();
    }, [selectedCityId, language, t]);

    return (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 flex items-center">
                    <i className="fas fa-cloud-sun-rain mr-3 text-indigo-600 dark:text-indigo-400" />
                    {t('weather_title')}
                </h2>
                <select
                    value={selectedCityId}
                    onChange={e => setSelectedCityId(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                >
                    {CITIES.map(c => <option key={c.id} value={c.id}>{t(c.nameKey)}</option>)}
                </select>
            </div>
            
            {isLoading && <div className="text-center p-4"><i className="fas fa-spinner fa-spin text-2xl text-indigo-500"></i></div>}
            {error && <div className="text-center p-4 text-red-500">{error}</div>}

            {weatherData && !isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-700/50 p-6 rounded-lg">
                        <img src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png`} alt="weather icon" className="w-24 h-24"/>
                        <p className="text-5xl font-bold text-gray-800 dark:text-slate-100">{Math.round(weatherData.current.temp)}°C</p>
                        <p className="text-lg text-gray-600 dark:text-slate-300 capitalize">{weatherData.current.description}</p>
                        <div className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                            <span>{t('weather_feels_like')}: {Math.round(weatherData.current.feels_like)}°C</span>
                            <span className="mx-2">|</span>
                            <span>{t('weather_humidity')}: {weatherData.current.humidity}%</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {weatherData.forecast.map((day, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-slate-700/50">
                                <span className="font-semibold w-1/4 text-gray-700 dark:text-slate-300">{day.dayOfWeek}</span>
                                <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="weather icon" className="w-8 h-8"/>
                                <span className="w-1/4 text-center text-sm text-gray-500 dark:text-slate-400 capitalize">{day.description}</span>
                                <span className="w-1/4 text-right font-medium text-gray-800 dark:text-slate-200">{Math.round(day.temp_min)}° / {Math.round(day.temp_max)}°</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default WeatherForecast;