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
export const DEFAULT_CITY_IMAGE = './docs/imagenes/argentina_default.jpg';


// --- CITIES DATA ---
// This is the core data structure for the cities in the itinerary.
export const CITIES: City[] = [
  // This is a partial reconstruction. More data would be needed for full functionality.
  {
    id: 'buenosaires',
    nameKey: 'buenosaires_name',
    descriptionKey: 'buenosaires_description',
    image: './docs/imagenes/buenosaires/buenosaires.jpg',
    coords: [-34.6037, -58.3816],
    activitiesKey: 'buenosaires_activities_recommended',
    accommodationKey: 'buenosaires_accommodation_examples',
    budgetItems: [
        { conceptKey: 'accommodation_budget', value: '80-150', isPerDay: true },
        { conceptKey: 'food_budget', value: '50-80', isPerDay: true },
        { conceptKey: 'transport_budget', value: '10-20', isPerDay: true },
        { conceptKey: 'activities_budget', value: '30-60', isPerDay: true },
    ],
    pointsOfInterest: [
        { nameKey: 'poi_obelisco', descriptionKey: 'poi_obelisco_desc', coords: [-34.6037, -58.3816] },
        { nameKey: 'poi_caminito', descriptionKey: 'poi_caminito_desc', coords: [-34.6383, -58.3623] },
    ]
  },
  {
    id: 'rosario',
    nameKey: 'rosario_name',
    descriptionKey: 'rosario_description',
    image: './docs/imagenes/rosario/rosario.jpg',
    coords: [-32.9446, -60.6500],
    activitiesKey: 'rosario_activities_recommended',
    accommodationKey: 'rosario_accommodation_examples',
    budgetItems: [
        { conceptKey: 'accommodation_budget', value: '60-120', isPerDay: true },
        { conceptKey: 'food_budget', value: '40-70', isPerDay: true },
    ],
    pointsOfInterest: []
  },
  {
    id: 'bariloche',
    nameKey: 'bariloche_name',
    descriptionKey: 'bariloche_description',
    image: './docs/imagenes/bariloche/bariloche.jpg',
    coords: [-41.1335, -71.3103],
    activitiesKey: 'bariloche_activities_recommended',
    accommodationKey: 'bariloche_accommodation_examples',
    budgetItems: [
        { conceptKey: 'accommodation_budget', value: '100-200', isPerDay: true },
        { conceptKey: 'food_budget', value: '60-100', isPerDay: true },
    ],
    pointsOfInterest: []
  },
  {
    id: 'mendoza',
    nameKey: 'mendoza_name',
    descriptionKey: 'mendoza_description',
    image: './docs/imagenes/mendoza/mendoza.jpg',
    coords: [-32.8895, -68.8458],
    activitiesKey: 'mendoza_activities_recommended',
    accommodationKey: 'mendoza_accommodation_examples',
    budgetItems: [],
    pointsOfInterest: []
  },
  {
    id: 'jujuy',
    nameKey: 'jujuy_name',
    descriptionKey: 'jujuy_description',
    image: './docs/imagenes/jujuy/jujuy.jpg',
    coords: [-24.1856, -65.2995],
    activitiesKey: 'jujuy_activities_recommended',
    accommodationKey: 'jujuy_accommodation_examples',
    budgetItems: [],
    pointsOfInterest: []
  },
  {
    id: 'iguazu',
    nameKey: 'iguazu_name',
    descriptionKey: 'iguazu_description',
    image: './docs/imagenes/iguazu/iguazu.jpg',
    coords: [-25.6753, -54.4368],
    activitiesKey: 'iguazu_activities_recommended',
    accommodationKey: 'iguazu_accommodation_examples',
    budgetItems: [],
    pointsOfInterest: []
  },
  {
    id: 'esteros_ibera',
    nameKey: 'esteros_ibera_name',
    descriptionKey: 'esteros_ibera_description',
    image: './docs/imagenes/esteros_ibera/esteros_ibera.jpg',
    coords: [-28.5333, -57.1667],
    activitiesKey: 'esteros_ibera_activities_recommended',
    accommodationKey: 'esteros_ibera_accommodation_examples',
    budgetItems: [],
    pointsOfInterest: []
  },
  {
    id: 'corrientes',
    nameKey: 'corrientes_name',
    descriptionKey: 'corrientes_description',
    image: './docs/imagenes/corrientes/corrientes.jpg',
    coords: [-27.4674, -58.8341],
    activitiesKey: 'corrientes_activities_recommended',
    accommodationKey: 'corrientes_accommodation_examples',
    budgetItems: [],
    pointsOfInterest: []
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
    { conceptKey: 'international_flights_budget', value: '6000-7000', isPerDay: false },
    { conceptKey: 'domestic_flights_budget', value: '1200-1600', isPerDay: false },
];

// --- TRANSPORT DATA ---
export const TRANSPORT_DATA: TransportLeg[] = [
  // Example data
  { id: '1', fromKey: 'buenosaires_name', toKey: 'rosario_name', meanKey: 'transport_mean_bus', timeKey: 'transport_time_4h', basePriceARS: { value: 20000, currency: Currency.ARS }, company: 'Empresa A' },
  { id: '2', fromKey: 'buenosaires_name', toKey: 'bariloche_name', meanKey: 'transport_mean_plane', timeKey: 'transport_time_2h', basePriceARS: { value: 80000, currency: Currency.ARS }, company: 'Aerolíneas Argentinas' },
];

// --- BOOKING DATA ---
export const BOOKING_DATA: BookingItem[] = [
  // Example data
  {
    id: 'booking1',
    type: 'hotel',
    titleKey: 'booking_title_hotel_ba',
    descriptionKey: 'booking_desc_hotel_ba',
    data: {
      name: 'Hotel Emperador',
      checkIn: '2025-09-26',
      checkOut: '2025-09-30',
      guests: '4',
      confirmation: 'ABC-123',
      pin: '4321',
      price: { value: 500, currency: Currency.USD },
    }
  },
  {
    id: 'booking2',
    type: 'bus',
    titleKey: 'booking_title_bus_rosario',
    descriptionKey: 'booking_desc_bus_rosario',
    data: {
      company: 'Flecha Bus',
      departure: '2025-09-30T10:00:00Z',
      arrival: '2025-09-30T14:00:00Z',
      duration: '4hs',
      passengers: [{ name: 'Ariel Flier', seat: '12' }],
      price: { value: 25000, currency: Currency.ARS }
    }
  }
];