import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { City } from '../types.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { DEFAULT_CITY_IMAGE } from '../constants.ts';

interface CityCardProps {
    city: City;
}

const CityCard: FC<CityCardProps> = ({ city }) => {
    const { t } = useAppContext();
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = DEFAULT_CITY_IMAGE;
    };

    return (
        <Link to={`/city/${city.id}`} className="block group">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <img
                    className="w-full h-48 object-cover"
                    src={city.image}
                    alt={t(city.nameKey)}
                    onError={handleImageError}
                    loading="lazy"
                />
                <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t(city.nameKey)}</h3>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">{t(city.descriptionKey)}</p>
                </div>
            </div>
        </Link>
    );
};

export default CityCard;