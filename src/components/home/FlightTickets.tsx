import { FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Price, Currency, FlightData } from '../../types';
import { BOOKING_DATA } from '../../constants';

interface FlightTicketsProps {
    getFormattedPrice: (price: Price | number) => string;
}

const FlightTickets: FC<FlightTicketsProps> = ({ getFormattedPrice }) => {
    const { t, language } = useAppContext();

    const flightBooking = BOOKING_DATA.find(b => b.id === 'intl_flight');
    const bookingData = flightBooking?.data as FlightData;

    const flightData = {
        airline: bookingData?.airline || "Ethiopian Airlines",
        confirmation: bookingData?.confirmation || "QTAJPJ",
        price: bookingData?.price || { value: 6850, currency: Currency.USD },
        passengers: bookingData?.passengers?.map((p: any) => p.name) || [],
        outbound: {
            flightNo: "ET 405/506",
            from: "Tel Aviv (TLV)",
            to: "Buenos Aires (EZE)",
            departure: bookingData?.departure || "2025-09-26T01:00:00Z",
            arrival: bookingData?.arrival || "2025-09-26T20:25:00Z",
            duration: "19h 25m",
        },
        inbound: {
            flightNo: "ET 507/404",
            from: "Buenos Aires (EZE)",
            to: "Tel Aviv (TLV)",
            departure: bookingData?.returnDeparture || "2025-10-28T21:30:00Z",
            arrival: bookingData?.returnArrival || "2025-10-30T03:00:00Z",
            duration: "29h 30m",
        }
    };

    const formatFlightDateTime = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleString(language === 'he' ? 'he-IL' : 'es-AR', options);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200">{flightData.airline}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{t('flight_tickets_confirmation')}: <span className="font-mono">{flightData.confirmation}</span></p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                    <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{getFormattedPrice(flightData.price)}</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{t('flight_tickets_total_price')}</p>
                </div>
            </div>

            {/* Outbound Flight */}
            <div>
                <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center"><i className="fas fa-plane-departure mr-2 text-blue-500"></i> {t('flight_tickets_outbound')}</h4>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-inner border dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="text-center md:text-left">
                            <p className="font-bold text-lg">{flightData.outbound.from}</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{formatFlightDateTime(flightData.outbound.departure)}</p>
                        </div>
                        <div className="text-center">
                            <i className="fas fa-long-arrow-alt-right text-2xl text-gray-400 dark:text-slate-500"></i>
                            <p className="text-xs font-mono">{flightData.outbound.flightNo}</p>
                            <p className="text-xs">{flightData.outbound.duration}</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="font-bold text-lg">{flightData.outbound.to}</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{formatFlightDateTime(flightData.outbound.arrival)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inbound Flight */}
            <div>
                <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center"><i className="fas fa-plane-arrival mr-2 text-green-500"></i> {t('flight_tickets_inbound')}</h4>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-inner border dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="text-center md:text-left">
                            <p className="font-bold text-lg">{flightData.inbound.from}</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{formatFlightDateTime(flightData.inbound.departure)}</p>
                        </div>
                        <div className="text-center">
                            <i className="fas fa-long-arrow-alt-right text-2xl text-gray-400 dark:text-slate-500"></i>
                            <p className="text-xs font-mono">{flightData.inbound.flightNo}</p>
                            <p className="text-xs">{flightData.inbound.duration}</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="font-bold text-lg">{flightData.inbound.to}</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{formatFlightDateTime(flightData.inbound.arrival)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">{t('reservations_bus_passengers')}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    {flightData.passengers.map((name: string) => (
                        <div key={name} className="p-2 bg-gray-100 dark:bg-slate-700 rounded text-center">{name}</div>
                    ))}
                </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <i className="fas fa-ticket-alt mr-2"></i>
                {t('flight_tickets_view_button')}
            </button>
        </div>
    );
};

export default FlightTickets;