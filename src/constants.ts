import { Language, Currency, City, TransportLeg, AIPromptContent, Translations, PackingItem, BudgetItem } from './types.ts';

// TopBar constants
export const LANGUAGES = [
  { code: Language.ES, name: 'Español' },
  { code: Language.HE, name: 'עברית' },
];
export const CURRENCIES = [
  { code: Currency.ARS, name: 'ARS' },
  { code: Currency.USD, name: 'USD' },
  { code: Currency.ILS, name: 'ILS' },
  { code: Currency.EUR, name: 'EUR' },
];

// General App constants
export const DEFAULT_CITY_IMAGE = '/docs/imagenes/argentina_default.jpg';

// API keys from environment variables
// Using import.meta.env for Vite projects
export const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

// --- Data for Cities ---

const BUENOS_AIRES_BUDGET: BudgetItem[] = [
  { conceptKey: 'budget_concept_accommodation', value: '70-150', isPerDay: true },
  { conceptKey: 'budget_concept_food', value: '40-80', isPerDay: true },
  { conceptKey: 'budget_concept_transport', value: '10-25', isPerDay: true },
  { conceptKey: 'budget_concept_activities', value: '20-50', isPerDay: true },
  { conceptKey: 'budget_concept_flights_intl', value: '1500-2500', isPerDay: false },
];
const USHUAIA_BUDGET: BudgetItem[] = [
  { conceptKey: 'budget_concept_accommodation', value: '80-180', isPerDay: true },
  { conceptKey: 'budget_concept_food', value: '50-100', isPerDay: true },
  { conceptKey: 'budget_concept_transport', value: '15-30', isPerDay: true },
  { conceptKey: 'budget_concept_activities', value: '100-200', isPerDay: true },
  { conceptKey: 'budget_concept_flights_domestic', value: '200-400', isPerDay: false },
];
const IGUAZU_BUDGET: BudgetItem[] = [
    { conceptKey: 'budget_concept_accommodation', value: '60-140', isPerDay: true },
    { conceptKey: 'budget_concept_food', value: '35-70', isPerDay: true },
    { conceptKey: 'budget_concept_transport', value: '10-20', isPerDay: true },
    { conceptKey: 'budget_concept_activities', value: '80-150', isPerDay: true },
    { conceptKey: 'budget_concept_flights_domestic', value: '150-350', isPerDay: false },
];


export const CITIES: City[] = [
  {
    id: 'buenosaires',
    nameKey: 'buenosaires_name',
    coords: [-34.6037, -58.3816],
    image: '/docs/imagenes/buenosaires/buenosaires.jpg',
    descriptionKey: 'buenosaires_description',
    activitiesKey: 'buenosaires_activities_recommended',
    accommodationKey: 'buenosaires_accommodation_examples',
    budgetItems: BUENOS_AIRES_BUDGET,
    pointsOfInterest: [
        { id: 'obelisco', nameKey: 'poi_obelisco_name', coords: [-34.6037, -58.3816] },
        { id: 'caminito', nameKey: 'poi_caminito_name', coords: [-34.6383, -58.3622] },
    ]
  },
  {
    id: 'ushuaia',
    nameKey: 'ushuaia_name',
    coords: [-54.8019, -68.3030],
    image: '/docs/imagenes/ushuaia/ushuaia.jpg',
    descriptionKey: 'ushuaia_description',
    activitiesKey: 'ushuaia_activities_recommended',
    accommodationKey: 'ushuaia_accommodation_examples',
    budgetItems: USHUAIA_BUDGET,
    pointsOfInterest: [
        { id: 'tierradelfuego', nameKey: 'poi_tierradelfuego_name', coords: [-54.8335, -68.4947] },
    ]
  },
  {
    id: 'iguazu',
    nameKey: 'iguazu_name',
    coords: [-25.6953, -54.4368],
    image: '/docs/imagenes/iguazu/iguazu.jpg',
    descriptionKey: 'iguazu_description',
    activitiesKey: 'iguazu_activities_recommended',
    accommodationKey: 'iguazu_accommodation_examples',
    budgetItems: IGUAZU_BUDGET,
    pointsOfInterest: [
        { id: 'iguazufalls', nameKey: 'poi_iguazufalls_name', coords: [-25.6953, -54.4368] },
    ]
  },
];

// Data for transport
export const TRANSPORT_DATA: TransportLeg[] = [
    { id: 'bue-igu', fromKey: 'buenosaires_name', toKey: 'iguazu_name', meanKey: 'medio_avion', timeKey: 'tiempo_2h', priceKey: '', company: '<a href="https://www.aerolineas.com.ar/" target="_blank">Aerolíneas Argentinas</a>, <a href="https://www.flybondi.com/" target="_blank">Flybondi</a>, <a href="https://www.jetsmart.com/" target="_blank">JetSMART</a>', basePriceARS: 135000 },
    { id: 'bue-ush', fromKey: 'buenosaires_name', toKey: 'ushuaia_name', meanKey: 'medio_avion', timeKey: 'tiempo_3_5h', priceKey: '', company: '<a href="https://www.aerolineas.com.ar/" target="_blank">Aerolíneas Argentinas</a>, <a href="https://www.flybondi.com/" target="_blank">Flybondi</a>, <a href="https://www.jetsmart.com/" target="_blank">JetSMART</a>', basePriceARS: 180000 },
];

// Data for AI Prompts
export const AI_PROMPT_CONFIGS: AIPromptContent[] = [
    { titleKey: 'ai_prompt_title_menu', descriptionKey: 'ai_prompt_desc_menu', buttonKey: 'consultarBtn', promptKeySuffix: '_ai_prompt_menu', icon: 'fa-utensils', userInputPlaceholderKey: 'ai_prompt_placeholder_menu' },
    { titleKey: 'ai_prompt_title_activities', descriptionKey: 'ai_prompt_desc_activities', buttonKey: 'consultarBtn', promptKeySuffix: '_ai_prompt_activities', icon: 'fa-hiking', userInputPlaceholderKey: 'ai_prompt_placeholder_activities' },
];

// Data for Packing list
export const PACKING_LIST_ITEMS: Omit<PackingItem, 'id' | 'text'>[] = [
  { textKey: 'packing_passport', type: 'essential', originalLang: Language.ES },
  { textKey: 'packing_cash', type: 'essential', originalLang: Language.ES },
  { textKey: 'packing_credit_cards', type: 'essential', originalLang: Language.ES },
  { textKey: 'packing_phone_charger', type: 'essential', originalLang: Language.ES },
  { textKey: 'packing_medications', type: 'essential', originalLang: Language.ES },
  { textKey: 'packing_adapter', type: 'optional', originalLang: Language.ES },
  { textKey: 'packing_sunscreen', type: 'optional', originalLang: Language.ES },
  { textKey: 'packing_hat', type: 'optional', originalLang: Language.ES },
  { textKey: 'packing_rain_jacket', type: 'optional', originalLang: Language.ES },
];

// --- Translations ---
// This object needs to be comprehensive for a real app.
export const translations: Translations = {
  [Language.ES]: {
    tituloPrincipal: 'Familia en Argentina',
    bienvenidaPrincipal: 'Planifica tu aventura familiar soñada por Argentina.',
    footerText: 'Todos los derechos reservados.',
    explore_btn: 'Explorar Ciudad',
    // ... many other keys from the app
    buenosaires_name: 'Buenos Aires',
    buenosaires_description: 'La vibrante capital de Argentina, llena de cultura, historia y tango.',
    ushuaia_name: 'Ushuaia',
    ushuaia_description: 'Conocida como la "Ciudad del Fin del Mundo", puerta de entrada a la Antártida.',
    iguazu_name: 'Iguazú',
    iguazu_description: 'Hogar de las impresionantes Cataratas del Iguazú, una de las maravillas naturales del mundo.',
    packing_list_title: 'Lista de Equipaje',
    packing_list_desc: 'Una guía para ayudarte a empacar para tu aventura familiar. ¡Marca los artículos a medida que los empacas!',
    packing_list_essentials: 'Esenciales',
    packing_list_optionals: 'Opcionales y Recomendados',
    packing_passport: 'Pasaportes y documentos de viaje',
    packing_cash: 'Efectivo (Pesos y algo de USD)',
    packing_credit_cards: 'Tarjetas de crédito/débito',
    packing_phone_charger: 'Teléfono y cargador/batería externa',
    packing_medications: 'Medicamentos personales',
    packing_adapter: 'Adaptador de corriente (Tipo I)',
    packing_sunscreen: 'Protector solar',
    packing_hat: 'Sombrero o gorra',
    packing_rain_jacket: 'Chaqueta impermeable ligera',
    // transport table
    desde: 'Desde',
    hasta: 'Hasta',
    medio: 'Medio',
    tiempo: 'Tiempo Est.',
    precio: 'Precio Est.',
    compania: 'Compañía',
    medio_avion: 'Avión',
    tiempo_2h: '≈ 2 hs',
    tiempo_3_5h: '≈ 3.5 hs',
    // Other keys
    iaError: 'Ocurrió un error al contactar a la IA.',
  },
  [Language.HE]: {
    tituloPrincipal: 'משפחה בארגנטינה',
    bienvenidaPrincipal: 'תכננו את הרפתקאת החלומות המשפחתית שלכם בארגנטינה.',
    footerText: 'כל הזכויות שמורות.',
    explore_btn: 'גלה את העיר',
    // ...
    buenosaires_name: 'בואנוס איירס',
    buenosaires_description: 'בירתה התוססת של ארגנטינה, מלאה בתרבות, היסטוריה וטנגו.',
    ushuaia_name: 'אושואיה',
    ushuaia_description: 'ידועה כ"העיר בסוף העולם", שער הכניסה לאנטארקטיקה.',
    iguazu_name: 'איגואסו',
    iguazu_description: 'ביתם של מפלי האיגואסו המדהימים, אחד מפלאי הטבע של העולם.',
    packing_list_title: 'רשימת ציוד',
    packing_list_desc: 'מדריך שיעזור לכם לארוז להרפתקה המשפחתית. סמנו פריטים בזמן שאתם אורזים!',
    packing_list_essentials: 'ציוד חובה',
    packing_list_optionals: 'מומלץ (לא חובה)',
    packing_passport: 'דרכונים ומסמכי נסיעה',
    packing_cash: 'מזומן (פסו וקצת דולרים)',
    packing_credit_cards: 'כרטיסי אשראי',
    packing_phone_charger: 'טלפון ומטען/סוללה ניידת',
    packing_medications: 'תרופות אישיות',
    packing_adapter: 'מתאם חשמל (סוג I)',
    packing_sunscreen: 'קרם הגנה',
    packing_hat: 'כובע',
    packing_rain_jacket: 'מעיל גשם קל',
    // transport table
    desde: 'מ',
    hasta: 'ל',
    medio: 'אמצעי',
    tiempo: 'זמן מוערך',
    precio: 'מחיר מוערך',
    compania: 'חברה',
    medio_avion: 'מטוס',
    tiempo_2h: '≈ שעתיים',
    tiempo_3_5h: '≈ 3.5 שעות',
    // Other keys
    iaError: 'אירעה שגיאה בפנייה לבינה המלאכותית.',
  },
};
