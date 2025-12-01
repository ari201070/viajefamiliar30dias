import { City, Currency, Language, AIPromptContent, TransportLeg, BookingItem, BudgetItem } from './types';

// --- LANGUAGE AND CURRENCY CONFIG ---
export const LANGUAGES = [
  { code: Language.ES, name: 'Español' },
  { code: Language.HE, name: 'עברית' },
];

export const CURRENCIES = [
  { code: Currency.USD, name: 'USD' },
  { code: Currency.ARS, name: 'ARS' },
  { code: Currency.EUR, name: 'EUR' },
  { code: Currency.ILS, name: 'ILS' },
];

// --- IMAGE CONSTANTS ---
export const DEFAULT_CITY_IMAGE = '/docs/imagenes/argentina_default.jpg';

// --- CITIES DATA ---
// This is the core data structure for the cities in the itinerary.
export const CITIES: City[] = [
  {
    id: 'buenosaires',
    nameKey: 'buenosaires_name',
    descriptionKey: 'buenosaires_description',
    image: '/docs/imagenes/buenosaires/buenosaires.jpg',
    detailImage: '/docs/imagenes/buenosaires/Cabildo.jpg',
    coords: [-34.6037, -58.3816],
    activitiesKey: 'buenosaires_activities_recommended',
    accommodationKey: 'buenosaires_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '', isPerDay: true },
      { conceptKey: 'food_budget', value: '25', isPerDay: true },
      { conceptKey: 'transport_budget', value: '10', isPerDay: true },
      { conceptKey: 'activities_budget', value: '45', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_obelisco', descriptionKey: 'poi_obelisco_desc', coords: [-34.6037, -58.3816] },
      { nameKey: 'poi_caminito', descriptionKey: 'poi_caminito_desc', coords: [-34.6383, -58.3623] },
    ],
    startDate: '2025-09-26',
    endDate: '2025-09-30'
  },
  {
    id: 'rosario',
    nameKey: 'rosario_name',
    descriptionKey: 'rosario_description',
    image: '/docs/imagenes/rosario/rosario.jpg',
    detailImage: '/docs/imagenes/rosario/DSCN1016.jpg',
    coords: [-32.9442, -60.6505],
    activitiesKey: 'rosario_activities_recommended',
    accommodationKey: 'rosario_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '', isPerDay: true },
      { conceptKey: 'food_budget', value: '20', isPerDay: true },
      { conceptKey: 'transport_budget', value: '8', isPerDay: true },
      { conceptKey: 'activities_budget', value: '30', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_monumento_bandera', descriptionKey: 'poi_monumento_bandera_desc', coords: [-32.9477, -60.6305] },
      { nameKey: 'poi_parque_independencia', descriptionKey: 'poi_parque_independencia_desc', coords: [-32.9556, -60.6569] },
    ],
    startDate: '2025-09-30',
    endDate: '2025-10-04'
  },
  {
    id: 'bariloche',
    nameKey: 'bariloche_name',
    descriptionKey: 'bariloche_description',
    image: '/docs/imagenes/bariloche/bariloche.jpg',
    detailImage: '/docs/imagenes/bariloche/DSCN1094.jpg',
    coords: [-41.1335, -71.3103],
    activitiesKey: 'bariloche_activities_recommended',
    accommodationKey: 'bariloche_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '', isPerDay: true },
      { conceptKey: 'food_budget', value: '30', isPerDay: true },
      { conceptKey: 'transport_budget', value: '15', isPerDay: true },
      { conceptKey: 'activities_budget', value: '60', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_centro_civico', descriptionKey: 'poi_centro_civico_desc', coords: [-41.1335, -71.3103] },
      { nameKey: 'poi_cerro_catedral', descriptionKey: 'poi_cerro_catedral_desc', coords: [-41.1700, -71.4383] },
    ],
    startDate: '2025-10-05',
    endDate: '2025-10-10'
  },
  {
    id: 'mendoza',
    nameKey: 'mendoza_name',
    descriptionKey: 'mendoza_description',
    image: '/docs/imagenes/mendoza/mendoza.jpg',
    detailImage: '/docs/imagenes/mendoza/DSCN1345.jpg',
    coords: [-32.8895, -68.8458],
    activitiesKey: 'mendoza_activities_recommended',
    accommodationKey: 'mendoza_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '', isPerDay: true },
      { conceptKey: 'food_budget', value: '28', isPerDay: true },
      { conceptKey: 'transport_budget', value: '12', isPerDay: true },
      { conceptKey: 'activities_budget', value: '50', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_parque_san_martin', descriptionKey: 'poi_parque_san_martin_desc', coords: [-32.8908, -68.8783] },
      { nameKey: 'poi_cerro_gloria', descriptionKey: 'poi_cerro_gloria_desc', coords: [-32.8933, -68.8950] },
    ],
    startDate: '2025-10-11',
    endDate: '2025-10-14'
  },
  {
    id: 'jujuy',
    nameKey: 'jujuy_name',
    descriptionKey: 'jujuy_description',
    image: '/docs/imagenes/jujuy/jujuy.jpg',
    detailImage: '/docs/imagenes/jujuy/DSCN1615.jpg',
    coords: [-24.1858, -65.2995],
    activitiesKey: 'jujuy_activities_recommended',
    accommodationKey: 'jujuy_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '84', isPerDay: true },
      { conceptKey: 'food_budget', value: '18', isPerDay: true },
      { conceptKey: 'transport_budget', value: '10', isPerDay: true },
      { conceptKey: 'activities_budget', value: '35', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_quebrada_humahuaca', descriptionKey: 'poi_quebrada_humahuaca_desc', coords: [-23.5833, -65.3500] },
      { nameKey: 'poi_cerro_siete_colores', descriptionKey: 'poi_cerro_siete_colores_desc', coords: [-23.7433, -65.4933] },
    ],
    startDate: '2025-10-15',
    endDate: '2025-10-19'
  },
  {
    id: 'iguazu',
    nameKey: 'iguazu_name',
    descriptionKey: 'iguazu_description',
    image: '/docs/imagenes/iguazu/iguazu.jpg',
    detailImage: '/docs/imagenes/iguazu/DSCN1753.jpg',
    coords: [-25.5972, -54.5766],
    activitiesKey: 'iguazu_activities_recommended',
    accommodationKey: 'iguazu_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '', isPerDay: true },
      { conceptKey: 'food_budget', value: '25', isPerDay: true },
      { conceptKey: 'transport_budget', value: '15', isPerDay: true },
      { conceptKey: 'activities_budget', value: '55', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_cataratas', descriptionKey: 'poi_cataratas_desc', coords: [-25.6953, -54.4367] },
      { nameKey: 'poi_hito_tres_fronteras', descriptionKey: 'poi_hito_tres_fronteras_desc', coords: [-25.5992, -54.5736] },
    ],
    startDate: '2025-10-19',
    endDate: '2025-10-22'
  },
  {
    id: 'esteros_ibera',
    nameKey: 'esteros_ibera_name',
    descriptionKey: 'esteros_ibera_description',
    image: '/docs/imagenes/esteros_ibera/ibera.jpg',
    detailImage: '/docs/imagenes/esteros_ibera/DSCN1851.jpg',
    coords: [-28.5433, -57.1550],
    activitiesKey: 'esteros_ibera_activities_recommended',
    accommodationKey: 'esteros_ibera_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '920', isPerDay: true },
      { conceptKey: 'food_budget', value: '0', isPerDay: true },
      { conceptKey: 'transport_budget', value: '12', isPerDay: true },
      { conceptKey: 'activities_budget', value: '46', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_portal_cambyreta', descriptionKey: 'poi_portal_cambyreta_desc', coords: [-27.8500, -56.8833] },
      { nameKey: 'poi_colonia_carlos_pellegrini', descriptionKey: 'poi_colonia_carlos_pellegrini_desc', coords: [-28.5333, -57.1667] },
    ],
    startDate: '2025-10-22',
    endDate: '2025-10-24'
  },
  {
    id: 'corrientes',
    nameKey: 'corrientes_name',
    descriptionKey: 'corrientes_description',
    image: '/docs/imagenes/corrientes/corrientes.jpg',
    detailImage: '/docs/imagenes/corrientes/casa.jpg',
    coords: [-27.4692, -58.8306],
    activitiesKey: 'corrientes_activities_recommended',
    accommodationKey: 'corrientes_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '76', isPerDay: true },
      { conceptKey: 'food_budget', value: '20', isPerDay: true },
      { conceptKey: 'transport_budget', value: '0', isPerDay: true },
      { conceptKey: 'activities_budget', value: '', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_costanera', descriptionKey: 'poi_costanera_desc', coords: [-27.4633, -58.8367] },
      { nameKey: 'poi_teatro_vera', descriptionKey: 'poi_teatro_vera_desc', coords: [-27.4667, -58.8333] },
    ],
    startDate: '2025-10-24',
    endDate: '2025-10-26'
  },
  {
    id: 'buenosaires_final',
    nameKey: 'buenosaires_name',
    descriptionKey: 'buenosaires_description',
    image: '/docs/imagenes/buenosaires/buenosaires.jpg',
    detailImage: '/docs/imagenes/buenosaires/Cabildo.jpg',
    coords: [-34.6037, -58.3816],
    activitiesKey: 'buenosaires_activities_recommended',
    accommodationKey: 'buenosaires_accommodation_examples',
    budgetItems: [
      { conceptKey: 'accommodation_budget', value: '', isPerDay: true },
      { conceptKey: 'food_budget', value: '25', isPerDay: true },
      { conceptKey: 'transport_budget', value: '10', isPerDay: true },
      { conceptKey: 'activities_budget', value: '45', isPerDay: true },
    ],
    pointsOfInterest: [
      { nameKey: 'poi_obelisco', descriptionKey: 'poi_obelisco_desc', coords: [-34.6037, -58.3816] },
      { nameKey: 'poi_caminito', descriptionKey: 'poi_caminito_desc', coords: [-34.6383, -58.3623] },
    ],
    startDate: '2025-10-26',
    endDate: '2025-10-28'
  }
];


// --- AI PROMPT CONFIGURATIONS ---
export const AI_PROMPT_CONFIGS: AIPromptContent[] = [
  {
    icon: 'fa-lightbulb',
    titleKey: 'ai_chat_title_recommendations',
    descriptionKey: 'ai_chat_description_recommendations',
    userInputPlaceholderKey: 'ai_chat_placeholder_recommendations',
    promptKeySuffix: '_ai_prompt_recommendations',
  },
  {
    icon: 'fa-wallet',
    titleKey: 'ai_chat_title_budget_analysis',
    descriptionKey: 'ai_chat_description_budget_analysis',
    userInputPlaceholderKey: 'ai_chat_placeholder_budget_analysis',
    promptKeySuffix: '_ai_prompt_budget_analysis',
  },
];

// --- TRIP-WIDE BUDGET ITEMS ---
export const TRIP_WIDE_BUDGET_ITEMS: BudgetItem[] = [
  { conceptKey: 'international_flights_budget', value: '6850', isPerDay: false },
  { conceptKey: 'domestic_flights_budget', value: '1216', isPerDay: false },
];

// --- TRANSPORT DATA ---
export const TRANSPORT_DATA: TransportLeg[] = [
  {
    id: '1',
    fromKey: 'buenosaires_name',
    toKey: 'rosario_name',
    meanKey: 'transport_mean_bus',
    timeKey: 'transport_time_4h20m',
    basePriceARS: { value: 100000, currency: Currency.ARS },
    company: 'General Urquiza',
    link: 'https://www.generalurquiza.com.ar/',
    date: '30/09/2025',
    departure: '13:30',
    arrival: '17:50'
  },
  {
    id: '2',
    fromKey: 'rosario_name',
    toKey: 'bariloche_name',
    meanKey: 'transport_mean_bus',
    timeKey: 'transport_time_26h',
    basePriceARS: { value: 347200, currency: Currency.ARS },
    company: 'Chevallier',
    link: 'https://www.nuevachevallier.com/',
    date: '04/10/2025',
    departure: '11:30',
    arrival: '05/10/2025 13:15'
  },
  {
    id: '3',
    fromKey: 'bariloche_name',
    toKey: 'mendoza_name',
    meanKey: 'transport_mean_bus',
    timeKey: 'transport_time_18h',
    basePriceARS: { value: 321920, currency: Currency.ARS },
    company: 'Andesmar (Cama Ejecutivo)',
    link: 'https://www.andesmar.com/',
    date: '10/10/2025',
    departure: '13:00',
    arrival: '11/10/2025 07:00'
  },
  {
    id: '4',
    fromKey: 'mendoza_name',
    toKey: 'jujuy_name',
    meanKey: 'transport_mean_bus',
    timeKey: 'transport_time_18h30m',
    basePriceARS: { value: 528000, currency: Currency.ARS },
    company: 'Andesmar',
    link: 'https://www.andesmar.com/',
    date: '14/10/2025',
    departure: '13:00',
    arrival: '15/10/2025 07:25'
  },
  {
    id: '5',
    fromKey: 'jujuy_name',
    toKey: 'iguazu_name',
    meanKey: 'transport_mean_plane',
    timeKey: 'transport_time_1h45m',
    basePriceARS: { value: 351120, currency: Currency.ARS },
    company: 'Aerolíneas Argentinas',
    link: 'https://www.aerolineas.com.ar/',
    flightNumber: 'AR 1795',
    date: '19/10/2025',
    departure: '14:00',
    arrival: '15:45'
  },
  {
    id: '6',
    fromKey: 'iguazu_name',
    toKey: 'esteros_ibera_name',
    meanKey: 'transport_mean_4x4',
    timeKey: '9h',
    basePriceARS: { value: 968704, currency: Currency.ARS },
    company: 'Arasari traslados y excursionesTransfer Privado 4x4',
    link: 'https://www.instagram.com/traslados_arasari/',
    date: '22/10/2025'
  },
  {
    id: '7',
    fromKey: 'esteros_ibera_name',
    toKey: 'corrientes_name',
    meanKey: 'transport_mean_4x4',
    timeKey: '5h',
    basePriceARS: { value: 968704, currency: Currency.ARS },
    company: 'Transfer Privado 4x4',
    link: 'https://www.instagram.com/rebullgustavoprion/',
    date: '24/10/2025'
  },
  {
    id: '8',
    fromKey: 'corrientes_name',
    toKey: 'buenosaires_name',
    meanKey: 'transport_mean_plane',
    timeKey: 'transport_time_1h30m',
    basePriceARS: { value: 1380387, currency: Currency.ARS },
    company: 'Flybondi',
    link: 'https://flybondi.com/',
    flightNumber: 'FO-5151',
    date: '26/10/2025',
    departure: '16:00',
    arrival: '17:30'
  }
];

// --- BOOKING DATA ---
export const BOOKING_DATA: BookingItem[] = [
  {
    id: 'intl_flight',
    type: 'flight',
    titleKey: 'booking_title_intl_flight',
    descriptionKey: 'booking_desc_intl_flight',
    data: {
      airline: 'Ethiopian Airlines',
      flightNumber: 'ET 405/506 (IDA), ET 507/404 (VUELTA)',
      departure: '2025-09-26T01:00:00Z',
      arrival: '2025-09-26T20:25:00Z',
      returnDeparture: '2025-10-28T21:30:00Z',
      returnArrival: '2025-10-30T03:00:00Z',
      passengers: [
        { name: 'Ariel Flier', ticketNumber: '0712999441525' },
        { name: 'Shoshana Flier', ticketNumber: '0712999441526' },
        { name: 'Liran Flier', ticketNumber: '0712999441527' },
        { name: 'Hila Flier', ticketNumber: '0712999441528' }
      ],
      confirmation: 'QTAJPJ',
      price: { value: 6850, currency: Currency.USD }
    }
  },
  {
    id: 'hotel_bariloche',
    type: 'hotel',
    titleKey: 'booking_title_hotel_bariloche',
    descriptionKey: 'booking_desc_hotel_bariloche',
    data: {
      name: 'Hotel Concorde',
      checkIn: '2025-10-05',
      checkOut: '2025-10-10',
      guests: '4',
      confirmation: '6112798624',
      address: 'Libertad 131, 8400 San Carlos de Bariloche',
      phone: '+54 294 442-4500',
      price: { value: 787.05, currency: Currency.USD }
    }
  },
  {
    id: 'hotel_mendoza',
    type: 'hotel',
    titleKey: 'booking_title_hotel_mendoza',
    descriptionKey: 'booking_desc_hotel_mendoza',
    data: {
      name: 'Fuente Mayor Hotel Centro',
      checkIn: '2025-10-11',
      checkOut: '2025-10-14',
      guests: '4',
      confirmation: '6400815558',
      address: '565 General Espejo, 5502 Mendoza',
      phone: '+54 261 274 8280',
      price: { value: 390.48, currency: Currency.USD }
    }
  },
  {
    id: 'hotel_salta',
    type: 'hotel',
    titleKey: 'booking_title_hotel_salta',
    descriptionKey: 'booking_desc_hotel_salta',
    data: {
      name: 'Urquiza Suites Salta',
      checkIn: '2025-10-15',
      checkOut: '2025-10-18',
      guests: '4',
      confirmation: '5377526290',
      address: '1045 Urquiza, 4400 Salta',
      phone: '+54 387 422-9258',
      price: { value: 251.49, currency: Currency.USD }
    }
  },
  {
    id: 'hotel_iguazu',
    type: 'hotel',
    titleKey: 'booking_title_hotel_iguazu',
    descriptionKey: 'booking_desc_hotel_iguazu',
    data: {
      name: 'City Falls Iguazú',
      checkIn: '2025-10-19',
      checkOut: '2025-10-22',
      guests: '4',
      confirmation: '5173150124',
      address: '88 Yapeyú Villa 14, 3370 Puerto Iguazú',
      phone: '+54 3757 42-2096',
      price: { value: 482, currency: Currency.USD }
    }
  },
  {
    id: 'hotel_ibera',
    type: 'hotel',
    titleKey: 'booking_title_hotel_ibera',
    descriptionKey: 'booking_desc_hotel_ibera',
    data: {
      name: 'Irupe Lodge',
      checkIn: '2025-10-22',
      checkOut: '2025-10-24',
      guests: '4',
      confirmation: 'Reserva 21/10/2025',
      address: 'Esteros del Iberá, Corrientes',
      price: { value: 1932, currency: Currency.USD }
    }
  },
  {
    id: 'hotel_corrientes',
    type: 'hotel',
    titleKey: 'booking_title_hotel_corrientes',
    descriptionKey: 'booking_desc_hotel_corrientes',
    data: {
      name: 'Casa céntrica, cómoda y amplia',
      checkIn: '2025-10-24',
      checkOut: '2025-10-26',
      guests: '4',
      confirmation: '5903075421',
      address: 'Hipólito Yrigoyen 1787, 3400 Corrientes',
      phone: '+543794605524',
      price: { value: 152.46, currency: Currency.USD }
    }
  },
  {
    id: 'transfer_eze_ba',
    type: 'transfer',
    titleKey: 'booking_title_transfer_eze_ba',
    descriptionKey: 'booking_desc_transfer_eze_ba',
    data: {
      from: 'Ministro Pistarini International Airport (EZE)',
      to: 'Av. Pueyrredón 1161',
      date: '2025-09-26',
      duration: '45 min',
      price: { value: 38, currency: Currency.USD }
    }
  }
];

// Default export to improve interoperability with bundlers that may resolve .ts -> .js
export default {
  LANGUAGES,
  CURRENCIES,
  DEFAULT_CITY_IMAGE,
  CITIES,
  AI_PROMPT_CONFIGS,
  TRIP_WIDE_BUDGET_ITEMS,
  TRANSPORT_DATA,
  BOOKING_DATA,
};
