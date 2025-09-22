import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { CITIES } from '../../constants.ts';
import { getWeatherForecast } from '../../services/apiService.ts';
import { WeatherData, DailyForecast } from '../../types.ts';

const WeatherForecast: React.FC = () => {
  const { t, language } = useAppContext();
  const [selectedCityId, setSelectedCityId] = useState(CITIES[0].id);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (cityId: string) => {
    setIsLoading(true);
    setError(null);
    const city = CITIES.find(c => c.id === cityId);
    if (!city) {
        setError(t('weather_error_city_not_found'));
        setIsLoading(false);
        return;
    }
    
    try {
      const data = await getWeatherForecast(city.coords, language);
      setWeatherData(data);
    } catch (err) {
      setError(t('weather_error_fetching'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    fetchWeather(selectedCityId);
  }, [selectedCityId, fetchWeather]);

  const getWeatherIcon = (iconCode: string): string => {
    // A simplified mapping from OpenWeatherMap icon codes to Font Awesome icons
    if (iconCode.startsWith('01')) return 'fa-sun'; // clear sky
    if (iconCode.startsWith('02')) return 'fa-cloud-sun'; // few clouds
    if (iconCode.startsWith('03') || iconCode.startsWith('04')) return 'fa-cloud'; // scattered/broken clouds
    if (iconCode.startsWith('09')) return 'fa-cloud-showers-heavy'; // shower rain
    if (iconCode.startsWith('10')) return 'fa-cloud-sun-rain'; // rain
    if (iconCode.startsWith('11')) return 'fa-bolt'; // thunderstorm
    if (iconCode.startsWith('13')) return 'fa-snowflake'; // snow
    if (iconCode.startsWith('50')) return 'fa-smog'; // mist
    return 'fa-question-circle'; // default
  };

  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";
  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  
  return (
    <section className={cardClasses}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className={`${sectionTitleClasses} mb-2 sm:mb-0 pb-0 border-none flex items-center`}>
          <i className="fas fa-cloud-sun-rain mr-3 text-indigo-600 dark:text-indigo-400"></i>
          {t('weather_title')}
        </h2>
        <select
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
          aria-label={t('weather_select_city_label')}
        >
          {CITIES.map(city => (
            <option key={city.id} value={city.id}>{t(city.nameKey)}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-3xl text-indigo-500"></i></div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 dark:text-red-400">{error}</div>
      ) : weatherData ? (
        <div>
          {/* Current Weather */}
          <div className="flex flex-col sm:flex-row items-center justify-around text-center sm:text-left bg-indigo-50 dark:bg-slate-700/50 p-6 rounded-lg mb-6">
            <div className="flex-shrink-0 mb-4 sm:mb-0">
              <i className={`fas ${getWeatherIcon(weatherData.current.icon)} text-6xl text-yellow-500 dark:text-yellow-400`}></i>
            </div>
            <div className="sm:ml-6">
              <p className="text-5xl font-bold text-gray-800 dark:text-slate-100">{Math.round(weatherData.current.temp)}°C</p>
              <p className="text-lg capitalize text-gray-600 dark:text-slate-300">{weatherData.current.description}</p>
            </div>
            <div className="sm:ml-8 mt-4 sm:mt-0 text-sm text-gray-500 dark:text-slate-400">
                <p>{t('weather_feels_like')}: {Math.round(weatherData.current.feels_like)}°C</p>
                <p>{t('weather_humidity')}: {weatherData.current.humidity}%</p>
            </div>
          </div>
          {/* 5-Day Forecast */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {weatherData.forecast.map((day: DailyForecast, index: number) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex flex-col justify-between">
                <div>
                    <p className="font-bold text-gray-800 dark:text-slate-200">{day.dayOfWeek}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{day.date}</p>
                </div>
                <i className={`fas ${getWeatherIcon(day.icon)} text-3xl my-2 text-indigo-500 dark:text-indigo-400`}></i>
                <p className="text-lg font-semibold text-gray-700 dark:text-slate-300 mt-2">{Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default WeatherForecast;