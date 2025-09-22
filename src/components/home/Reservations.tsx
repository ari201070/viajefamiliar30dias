import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { BookingItem, HotelData, BusData, TransferData, Price } from '../../types.ts';
import { BOOKING_DATA } from '../../constants.ts';

interface ReservationsProps {
  getFormattedPrice: (price: Price) => string;
}

const Reservations: React.FC<ReservationsProps> = ({ getFormattedPrice }) => {
    const { t, language } = useAppContext();
    const [isExpanded, setIsExpanded] = useState(false); // Start collapsed

    const getBookingDate = (item: BookingItem): Date => {
      switch (item.type) {
        case 'transfer':
          return new Date((item.data as TransferData).date);
        case 'bus':
          return new Date((item.data as BusData).departure);
        case 'hotel':
          return new Date((item.data as HotelData).checkIn);
      }
      return new Date();
    };

    const sortedReservations = useMemo(() => {
        return [...BOOKING_DATA].sort((a, b) => getBookingDate(a).getTime() - getBookingDate(b).getTime());
    }, []);

    const getIconForType = (type: BookingItem['type']): string => {
        switch (type) {
            case 'hotel': return 'fa-hotel';
            case 'bus': return 'fa-bus-alt';
            case 'transfer': return 'fa-taxi';
            default: return 'fa-file-alt';
        }
    };

    const getAccentColorForType = (type: BookingItem['type']): string => {
        switch (type) {
            case 'hotel': return 'border-blue-500';
            case 'bus': return 'border-orange-500';
            case 'transfer': return 'border-yellow-500';
            default: return 'border-gray-500';
        }
    };
    
    const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
    const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

    const renderCardContent = (item: BookingItem) => {
        const dateTimeOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
        switch(item.type) {
            case 'hotel':
                const hotelData = item.data as HotelData;
                return (
                    <div className="text-sm">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div><strong className="text-gray-600 dark:text-slate-300">{t('reservations_hotel_checkin')}:</strong> <span className="text-gray-800 dark:text-slate-100">{new Date(hotelData.checkIn).toLocaleDateString(language, {day: '2-digit', month: 'short', timeZone: 'UTC'})}</span></div>
                            <div><strong className="text-gray-600 dark:text-slate-300">{t('reservations_hotel_checkout')}:</strong> <span className="text-gray-800 dark:text-slate-100">{new Date(hotelData.checkOut).toLocaleDateString(language, {day: '2-digit', month: 'short', timeZone: 'UTC'})}</span></div>
                            <div className="col-span-2"><strong className="text-gray-600 dark:text-slate-300">{t('reservations_hotel_guests')}:</strong> <span className="text-gray-800 dark:text-slate-100">{hotelData.guests}</span></div>
                            <div><strong className="text-gray-600 dark:text-slate-300">{t('reservations_hotel_confirmation')}:</strong> <span className="font-mono text-gray-800 dark:text-slate-100">{hotelData.confirmation}</span></div>
                            <div><strong className="text-gray-600 dark:text-slate-300">PIN:</strong> <span className="font-mono text-gray-800 dark:text-slate-100">{hotelData.pin}</span></div>
                        </div>
                        <p className="text-right font-bold mt-2 text-blue-800 dark:text-blue-300">{getFormattedPrice(hotelData.price)}</p>
                    </div>
                );
            case 'bus':
                const busData = item.data as BusData;
                return (
                     <div className="text-sm">
                        <p className="mb-2"><strong className="text-gray-600 dark:text-slate-300">Compañía:</strong> <span className="text-gray-800 dark:text-slate-100">{busData.company}</span></p>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-3">
                            <div><strong className="text-gray-600 dark:text-slate-300">{t('reservations_bus_departure')}:</strong><br/><span className="text-gray-800 dark:text-slate-100">{new Date(busData.departure).toLocaleString(language, dateTimeOptions)}</span></div>
                            <div><strong className="text-gray-600 dark:text-slate-300">{t('reservations_bus_arrival')}:</strong><br/><span className="text-gray-800 dark:text-slate-100">{new Date(busData.arrival).toLocaleString(language, dateTimeOptions)}</span></div>
                            <div><strong className="text-gray-600 dark:text-slate-300">{t('reservations_bus_duration')}:</strong><br/><span className="text-gray-800 dark:text-slate-100">{busData.duration}</span></div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
                            <h5 className="font-semibold text-sm text-gray-700 dark:text-slate-200 mb-2">{t('reservations_bus_passengers')}</h5>
                            <ul className="space-y-1 text-xs">
                                {busData.passengers.map((p, i) => (
                                    <li key={i} className="flex justify-between text-gray-600 dark:text-slate-300">
                                        <span>{p.name}</span>
                                        <span className="font-mono bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">{t('reservations_bus_seat')} {p.seat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <p className="text-right font-bold mt-2 text-orange-800 dark:text-orange-300">{getFormattedPrice(busData.price)}</p>
                    </div>
                );
            case 'transfer':
                const transferData = item.data as TransferData;
                const transferDate = new Date(transferData.date);
                return (
                    <div className="space-y-2 text-sm">
                        <div>
                            <strong className="text-gray-600 dark:text-slate-300 block">{t('reservations_transfer_from')}:</strong>
                            <span className="text-gray-800 dark:text-slate-100">{transferData.from}</span>
                        </div>
                        <div>
                            <strong className="text-gray-600 dark:text-slate-300 block">{t('reservations_transfer_to')}:</strong>
                            <span className="text-gray-800 dark:text-slate-100">{transferData.to}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-slate-700">
                            <div>
                               <strong className="text-gray-600 dark:text-slate-300">{t('reservations_transfer_date')}:</strong>
                               <span className="text-gray-800 dark:text-slate-100 block">{transferDate.toLocaleDateString(language, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
                            </div>
                            <div>
                               <strong className="text-gray-600 dark:text-slate-300">{t('reservations_transfer_duration')}:</strong>
                               <span className="text-gray-800 dark:text-slate-100 block">{transferData.duration}</span>
                            </div>
                        </div>
                        <p className="text-right font-bold mt-2 text-yellow-800 dark:text-yellow-300">{getFormattedPrice(transferData.price)}</p>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <section className={cardClasses}>
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <h2 className={`${sectionTitleClasses} mb-0 pb-0 border-none flex items-center`}>
                    <i className="fas fa-file-invoice-dollar mr-3 text-indigo-600 dark:text-indigo-400"></i>
                    {t('reservations_title')}
                </h2>
                <i className={`fas fa-chevron-down text-indigo-500 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
            </div>
            {isExpanded && (
                <div className="mt-6 animate-fade-in">
                    <div className="relative pl-5 py-4 border-l-2 border-gray-200 dark:border-slate-700">
                        {sortedReservations.map((item, index) => (
                            <div key={item.id} className="relative mb-8">
                                <div className={`absolute -left-[35px] top-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full border-4 ${getAccentColorForType(item.type)} flex items-center justify-center`}>
                                    <i className={`fas ${getIconForType(item.type)} text-xs text-gray-600 dark:text-slate-300`}></i>
                                </div>
                                <div className={`ml-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-md border-l-4 ${getAccentColorForType(item.type)}`}>
                                     <h4 className="font-bold text-lg text-gray-800 dark:text-slate-200">{t(item.titleKey)}</h4>
                                     <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{t(item.descriptionKey)}</p>
                                     {renderCardContent(item)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Reservations;