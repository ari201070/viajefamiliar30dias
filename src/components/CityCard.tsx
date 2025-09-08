import React from 'react';
import { Link } from 'react-router-dom';
import { City } from '../types.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { DEFAULT_CITY_IMAGE } from '../constants.ts';

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const { t } = useAppContext();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_CITY_IMAGE;
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/50 overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <img 
        className="w-full h-56 object-cover" 
        src={city.image} 
        alt={t(city.nameKey)} 
        onError={handleImageError}
        loading="lazy"
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">{t(city.nameKey)}</h3>
        <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">{t(city.descriptionKey)}</p>
        <Link
          to={`/city/${city.id}`}
          className="inline-block bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150 text-sm"
        >
          {t('explore_btn')} <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default CityCard;
