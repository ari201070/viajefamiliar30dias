import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';

const passengerData = [
  { name: 'ARIEL RUBEN FLIER', type: 'MR/ADT', ticket: '0712999441525' },
  { name: 'SHOSHANA FLIER', type: 'MS/ADT', ticket: '0712999441526' },
  { name: 'LIRAN FLIER', type: 'MR/ADT', ticket: '0712999441527' },
  { name: 'HILA FLIER', type: 'MS/ADT', ticket: '0712999441528' },
];

const outboundFlight = {
  title: 'Tel Aviv (TLV) → Buenos Aires (EZE)',
  legs: [
    { airline: 'Ethiopian Airlines', number: 'ET405', from: 'Tel Aviv (TLV)', to: 'Addis Ababa (ADD)', departure: '26/09/2025, 01:00', arrival: '26/09/2025, 05:10', duration: '4h 10m' },
    { airline: 'Ethiopian Airlines', number: 'ET506', from: 'Addis Ababa (ADD)', to: 'Buenos Aires (EZE)', departure: '26/09/2025, 09:50', arrival: '26/09/2025, 20:25', duration: '16h 35m' },
  ],
  connection: '4h 40m',
};

const returnFlight = {
  title: 'Buenos Aires (EZE) → Tel Aviv (TLV)',
  legs: [
    { airline: 'Ethiopian Airlines', number: 'ET507', from: 'Buenos Aires (EZE)', to: 'Addis Ababa (ADD)', departure: '28/10/2025, 21:30', arrival: '29/10/2025, 19:30', duration: '16h 00m' },
    { airline: 'Ethiopian Airlines', number: 'ET404', from: 'Addis Ababa (ADD)', to: 'Tel Aviv (TLV)', departure: '29/10/2025, 23:50', arrival: '30/10/2025, 03:00', duration: '4h 10m' },
  ],
  connection: '4h 20m',
};


const FlightTickets: React.FC = () => {
  const { t } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

  const FlightLeg: React.FC<{ leg: typeof outboundFlight.legs[0] }> = ({ leg }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div className="md:col-span-1">
        <p className="font-semibold text-gray-800 dark:text-slate-200">{leg.airline} {leg.number}</p>
        <p className="text-sm text-gray-500 dark:text-slate-400">{leg.from} → {leg.to}</p>
      </div>
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{t('flight_tickets_departure')}</p>
          <p className="text-gray-900 dark:text-slate-100">{leg.departure}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{t('flight_tickets_arrival')}</p>
          <p className="text-gray-900 dark:text-slate-100">{leg.arrival}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className={cardClasses}>
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <h2 className={`${sectionTitleClasses} mb-0 pb-0 border-none flex items-center`}>
          <i className="fas fa-plane-departure mr-3 text-indigo-600 dark:text-indigo-400"></i>
          {t('flight_tickets_title')}
        </h2>
        <i className={`fas fa-chevron-down text-indigo-500 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-8 animate-fade-in">
          {/* Booking Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{t('flight_tickets_reservation')}</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-slate-200">25248</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{t('flight_tickets_airline_ref')}</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-slate-200">QTAJPJ</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{t('flight_tickets_status')}</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{t('flight_tickets_approved')}</p>
            </div>
          </div>
          
          {/* Passengers */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-3">{t('flight_tickets_passengers')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {passengerData.map(p => (
                <div key={p.ticket} className="p-3 bg-gray-100 dark:bg-slate-700 rounded-md">
                  <p className="font-semibold text-gray-800 dark:text-slate-200">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Ticket: {p.ticket}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flights */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-4">{t('flight_tickets_flights')}</h3>
            <div className="space-y-6">
              {/* Outbound */}
              <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-4">{outboundFlight.title}</h4>
                <div className="space-y-4">
                  <FlightLeg leg={outboundFlight.legs[0]} />
                  <div className="text-center text-sm font-semibold text-gray-500 dark:text-slate-400 py-2 border-y border-dashed border-gray-300 dark:border-slate-600">
                    <i className="fas fa-clock mr-2"></i>{t('flight_tickets_connection_time')}: {outboundFlight.connection}
                  </div>
                  <FlightLeg leg={outboundFlight.legs[1]} />
                </div>
              </div>

              {/* Return */}
              <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                 <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-4">{returnFlight.title}</h4>
                <div className="space-y-4">
                  <FlightLeg leg={returnFlight.legs[0]} />
                   <div className="text-center text-sm font-semibold text-gray-500 dark:text-slate-400 py-2 border-y border-dashed border-gray-300 dark:border-slate-600">
                    <i className="fas fa-clock mr-2"></i>{t('flight_tickets_connection_time')}: {returnFlight.connection}
                  </div>
                  <FlightLeg leg={returnFlight.legs[1]} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Baggage */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-3">{t('flight_tickets_baggage_allowance')}</h3>
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg space-y-2">
                <p className="text-gray-800 dark:text-slate-200"><i className="fas fa-suitcase-rolling w-5 mr-2 text-indigo-500 dark:text-indigo-400"></i>{t('flight_tickets_carry_on')}</p>
                <p className="text-gray-800 dark:text-slate-200"><i className="fas fa-suitcase w-5 mr-2 text-indigo-500 dark:text-indigo-400"></i>{t('flight_tickets_checked_bags')}</p>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};

export default FlightTickets;