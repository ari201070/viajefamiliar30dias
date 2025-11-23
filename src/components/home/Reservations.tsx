import { FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { BOOKING_DATA } from '../../constants';
import { Price, HotelData, BusData } from '../../types';

interface ReservationsProps {
    getFormattedPrice: (price: Price | number) => string;
}

const Reservations: FC<ReservationsProps> = ({ getFormattedPrice }) => {
    const { t, language } = useAppContext();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'he' ? 'he-IL' : 'es-AR', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', {
            dateStyle: 'short', timeStyle: 'short'
        });
    };

    const renderBookingCard = (booking: typeof BOOKING_DATA[0]) => {
        const data = booking.data;
        let details;

        if (booking.type === 'hotel') {
            const hotelData = data as HotelData;
            details = (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <span><i className="fas fa-sign-in-alt mr-2 text-green-500"></i>{t('reservations_hotel_checkin')}:</span> <span className="font-semibold">{formatDate(hotelData.checkIn)}</span>
                    <span><i className="fas fa-sign-out-alt mr-2 text-red-500"></i>{t('reservations_hotel_checkout')}:</span> <span className="font-semibold">{formatDate(hotelData.checkOut)}</span>
                    <span><i className="fas fa-users mr-2 text-gray-500"></i>{t('reservations_hotel_guests')}:</span> <span className="font-semibold">{hotelData.guests}</span>
                    <span><i className="fas fa-hashtag mr-2 text-gray-500"></i>{t('reservations_hotel_confirmation')}:</span> <span className="font-semibold">{hotelData.confirmation}</span>
                </div>
            );
        } else if (booking.type === 'bus') {
            const busData = data as BusData;
            details = (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <span><i className="fas fa-arrow-up mr-2 text-blue-500"></i>{t('reservations_bus_departure')}:</span> <span className="font-semibold">{formatDateTime(busData.departure)}</span>
                    <span><i className="fas fa-arrow-down mr-2 text-green-500"></i>{t('reservations_bus_arrival')}:</span> <span className="font-semibold">{formatDateTime(busData.arrival)}</span>
                    <span><i className="fas fa-clock mr-2 text-gray-500"></i>{t('reservations_bus_duration')}:</span> <span className="font-semibold">{busData.duration}</span>
                    <span><i className="fas fa-user-friends mr-2 text-gray-500"></i>{t('reservations_bus_passengers')}:</span> <span className="font-semibold">{busData.passengers[0].name}</span>
                </div>
            );
        }

        return (
            <div key={booking.id} className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-slate-200">{t(booking.titleKey)}</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">{t(booking.descriptionKey)}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{getFormattedPrice(data.price)}</span>
                    </div>
                </div>
                {details}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {BOOKING_DATA.map(renderBookingCard)}
        </div>
    );
};

export default Reservations;