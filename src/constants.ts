// @ts-nocheck
// FIX: This file has been completely rebuilt from the user's latest specifications
// to correct all data inconsistencies in itinerary, transport, and bookings.

import { City, Language, Currency, Translations, TransportLeg, AIPromptContent, BudgetItem, BookingItem, HotelData, BusData, TransferData } from './types.ts';

// --- FRAMEWORK CONSTANTS ---

export const DEFAULT_CITY_IMAGE = 'https://images.unsplash.com/photo-1589924228499-8e213677e094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';

export const LANGUAGES = [
  { code: Language.ES, name: 'Español' },
  { code: Language.HE, name: 'עברית' },
];

export const CURRENCIES = [
  { code: Currency.ARS, name: 'ARS' },
  { code: Currency.USD, name: 'USD' },
  { code: Currency.EUR, name: 'EUR' },
  { code: Currency.ILS, name: 'ILS' },
];

// --- AI PROMPT CONFIGS ---

export const AI_PROMPT_CONFIGS: AIPromptContent[] = [
  {
    titleKey: 'ai_chat_title_kids_activities',
    descriptionKey: 'ai_chat_description_kids_activities',
    buttonKey: 'ai_chat_send_button',
    promptKeySuffix: '_ai_prompt_kids_activities',
    icon: 'fa-child',
    userInputPlaceholderKey: 'ai_chat_input_placeholder_kids',
  },
  {
    titleKey: 'ai_chat_title_restaurant_finder',
    descriptionKey: 'ai_chat_description_restaurant_finder',
    buttonKey: 'ai_chat_send_button',
    promptKeySuffix: '_ai_prompt_restaurant_finder',
    icon: 'fa-utensils',
    userInputPlaceholderKey: 'ai_chat_input_placeholder_restaurants',
  },
  {
    titleKey: 'ai_chat_title_budget_analysis',
    descriptionKey: 'ai_chat_description_budget_analysis',
    buttonKey: 'ai_chat_send_button',
    promptKeySuffix: '_ai_prompt_budget_analysis',
    icon: 'fa-wallet',
    userInputPlaceholderKey: 'ai_chat_input_placeholder_budget',
  },
];


// --- CITIES DATA ---

export const CITIES: City[] = [
  {
    id: 'buenosaires',
    nameKey: 'buenosaires_name',
    coords: [-34.6037, -58.3816],
    image: '/imagenes/buenosaires/buenosaires.jpg',
    descriptionKey: 'buenosaires_description',
    activitiesKey: 'buenosaires_activities_recommended',
    accommodationKey: 'buenosaires_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '70-150', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '50-80', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '10-20', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '25-50', isPerDay: true },
    ],
    pointsOfInterest: [
      { id: 'obelisco', nameKey: 'poi_obelisco_name', coords: [-34.6037, -58.3816], descriptionKey: 'poi_obelisco_desc' },
      { id: 'caminito', nameKey: 'poi_caminito_name', coords: [-34.6383, -58.3621], descriptionKey: 'poi_caminito_desc' },
      { id: 'recoleta', nameKey: 'poi_recoleta_name', coords: [-34.5880, -58.3900], descriptionKey: 'poi_recoleta_desc' },
    ]
  },
  {
    id: 'rosario',
    nameKey: 'rosario_name',
    coords: [-32.9442, -60.6505],
    image: '/imagenes/rosario/rosario.jpg',
    descriptionKey: 'rosario_description',
    activitiesKey: 'rosario_activities_recommended',
    accommodationKey: 'rosario_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '50-100', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '40-70', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '5-15', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '20-40', isPerDay: true },
    ],
    pointsOfInterest: [
      { id: 'monumento_bandera', nameKey: 'poi_monumento_bandera_name', coords: [-32.9481, -60.6300], descriptionKey: 'poi_monumento_bandera_desc' },
    ]
  },
  {
    id: 'bariloche',
    nameKey: 'bariloche_name',
    coords: [-41.133, -71.310],
    image: '/imagenes/bariloche/bariloche.jpg',
    descriptionKey: 'bariloche_description',
    activitiesKey: 'bariloche_activities_recommended',
    accommodationKey: 'bariloche_accommodation_examples',
    budgetItems: [
        { conceptKey: 'budget_concept_accommodation', value: '80-160', isPerDay: true },
        { conceptKey: 'budget_concept_food', value: '50-90', isPerDay: true },
        { conceptKey: 'budget_concept_transport', value: '15-25', isPerDay: true },
        { conceptKey: 'budget_concept_activities', value: '40-100', isPerDay: true },
    ],
    pointsOfInterest: [
        { id: 'cerro_catedral', nameKey: 'poi_cerro_catedral_name', coords: [-41.168, -71.436] },
    ]
  },
  {
    id: 'mendoza',
    nameKey: 'mendoza_name',
    coords: [-32.889, -68.845],
    image: '/imagenes/mendoza/mendoza.jpg',
    descriptionKey: 'mendoza_description',
    activitiesKey: 'mendoza_activities_recommended',
    accommodationKey: 'mendoza_accommodation_examples',
    budgetItems: [
        { conceptKey: 'budget_concept_accommodation', value: '60-120', isPerDay: true },
        { conceptKey: 'budget_concept_food', value: '45-80', isPerDay: true },
        { conceptKey: 'budget_concept_transport', value: '10-20', isPerDay: true },
        { conceptKey: 'budget_concept_activities', value: '30-70', isPerDay: true },
    ],
    pointsOfInterest: [
        { id: 'aconcagua', nameKey: 'poi_aconcagua_name', coords: [-32.653, -70.011] },
    ]
  },
  {
    id: 'malargue',
    nameKey: 'malargue_name',
    coords: [-35.4746, -69.5881],
    image: '/imagenes/malargue/malargue.jpg',
    descriptionKey: 'malargue_description',
    activitiesKey: 'malargue_activities_recommended',
    accommodationKey: 'malargue_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '40-80', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '30-60', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '25-60', isPerDay: true },
    ],
    pointsOfInterest: [
      { id: 'caverna_brujas', nameKey: 'poi_caverna_brujas_name', coords: [-35.7833, -69.8167] },
    ]
  },
  {
    id: 'jujuy',
    nameKey: 'jujuy_name',
    coords: [-24.1856, -65.2995],
    image: '/imagenes/jujuy/jujuy.jpg',
    descriptionKey: 'jujuy_description',
    activitiesKey: 'jujuy_activities_recommended',
    accommodationKey: 'jujuy_accommodation_examples',
    budgetItems: [
        { conceptKey: 'budget_concept_accommodation', value: '40-90', isPerDay: true },
        { conceptKey: 'budget_concept_food', value: '30-60', isPerDay: true },
        { conceptKey: 'budget_concept_transport', value: '20-30', isPerDay: true },
        { conceptKey: 'budget_concept_activities', value: '25-50', isPerDay: true },
    ],
    pointsOfInterest: [
        { id: 'purmamarca', nameKey: 'poi_purmamarca_name', coords: [-23.7460, -65.4981], descriptionKey: 'poi_purmamarca_desc' },
        { id: 'humahuaca', nameKey: 'poi_humahuaca_name', coords: [-23.2033, -65.3503], descriptionKey: 'poi_humahuaca_desc' },
    ]
  },
  {
    id: 'iguazu',
    nameKey: 'iguazu_name',
    coords: [-25.6953, -54.4367],
    image: '/imagenes/iguazu/iguazu.jpg',
    descriptionKey: 'iguazu_description',
    activitiesKey: 'iguazu_activities_recommended',
    accommodationKey: 'iguazu_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '60-140', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '45-75', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '15-25', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '40-80', isPerDay: true },
      { conceptKey: 'budget_concept_park_entrance', value: '50-50', isPerDay: false },
    ],
    pointsOfInterest: [
      { id: 'garganta_diablo', nameKey: 'poi_garganta_diablo_name', coords: [-25.6925, -54.4367] },
    ]
  },
  {
    id: 'esteros_ibera',
    nameKey: 'esteros_ibera_name',
    coords: [-28.533, -57.167],
    image: '/imagenes/ibera/ibera.jpg',
    descriptionKey: 'esteros_ibera_description',
    activitiesKey: 'esteros_ibera_activities_recommended',
    accommodationKey: 'esteros_ibera_accommodation_examples',
    budgetItems: [
        { conceptKey: 'budget_concept_accommodation', value: '70-150', isPerDay: true },
        { conceptKey: 'budget_concept_food', value: '50-80', isPerDay: true },
        { conceptKey: 'budget_concept_transport', value: '25-40', isPerDay: true },
        { conceptKey: 'budget_concept_activities', value: '50-100', isPerDay: true },
    ],
  },
  {
    id: 'corrientes',
    nameKey: 'corrientes_name',
    coords: [-27.467, -58.834],
    image: '/imagenes/corrientes/corrientes.jpg',
    descriptionKey: 'corrientes_description',
    activitiesKey: 'corrientes_activities_recommended',
    accommodationKey: 'corrientes_accommodation_examples',
    budgetItems: [
        { conceptKey: 'budget_concept_accommodation', value: '50-100', isPerDay: true },
        { conceptKey: 'budget_concept_food', value: '40-70', isPerDay: true },
        { conceptKey: 'budget_concept_transport', value: '5-15', isPerDay: true },
        { conceptKey: 'budget_concept_activities', value: '20-40', isPerDay: true },
    ],
  }
];


// --- BUDGET ITEMS ---

export const TRIP_WIDE_BUDGET_ITEMS: BudgetItem[] = [
  { conceptKey: 'budget_concept_international_flights', value: '6000-7500', isPerDay: false },
  { conceptKey: 'budget_concept_internal_flights', value: '800-1200', isPerDay: false },
  { conceptKey: 'budget_concept_travel_insurance', value: '300-500', isPerDay: false },
];

// --- TRANSPORT DATA ---

export const TRANSPORT_DATA: TransportLeg[] = [
  { id: '1', fromKey: 'buenosaires_name', toKey: 'rosario_name', meanKey: 'medio_bus', timeKey: 'tiempo_4h_20m', company: '<a href="https://www.flechabus.com.ar/" target="_blank" rel="noopener noreferrer">Flecha Bus</a>', basePriceARS: 96000 },
  { id: '2', fromKey: 'rosario_name', toKey: 'bariloche_name', meanKey: 'medio_bus_nocturno', timeKey: 'tiempo_25h_45m', company: '<a href="https://www.viabariloche.com.ar/" target="_blank" rel="noopener noreferrer">Via Bariloche</a>', basePriceARS: 347200 },
  { id: '3', fromKey: 'bariloche_name', toKey: 'mendoza_name', meanKey: 'medio_avion', timeKey: 'tiempo_1_5h', company: '<a href="https://www.aerolineas.com.ar/" target="_blank" rel="noopener noreferrer">Aerolíneas Argentinas</a>', basePriceARS: 75000 },
  { id: '4', fromKey: 'mendoza_name', toKey: 'jujuy_name', meanKey: 'medio_bus', timeKey: 'tiempo_20h', company: '<a href="https://www.andesmar.com/" target="_blank" rel="noopener noreferrer">Andesmar</a>', basePriceARS: 45000 },
  { id: '5', fromKey: 'jujuy_name', toKey: 'iguazu_name', meanKey: 'medio_avion', timeKey: 'tiempo_2h', company: '<a href="https://www.aerolineas.com.ar/" target="_blank" rel="noopener noreferrer">Aerolíneas Argentinas</a>', basePriceARS: 95000 },
  { id: '6', fromKey: 'iguazu_name', toKey: 'esteros_ibera_name', meanKey: 'medio_transfer', timeKey: 'tiempo_5h', company: 'Transfers Privados', basePriceARS: 70000 },
  { id: '7', fromKey: 'esteros_ibera_name', toKey: 'corrientes_name', meanKey: 'medio_transfer', timeKey: 'tiempo_4h', company: 'Transfers Locales', basePriceARS: 60000 },
  { id: '8', fromKey: 'corrientes_name', toKey: 'buenosaires_name', meanKey: 'medio_avion', timeKey: 'tiempo_1_5h', company: '<a href="https://www.aerolineas.com.ar/" target="_blank" rel="noopener noreferrer">Aerolíneas Argentinas</a>', basePriceARS: 65000 },
];

// --- BOOKING DATA ---
export const BOOKING_DATA: BookingItem[] = [
    {
        id: 'transfer_eze_20250926',
        type: 'transfer',
        titleKey: 'booking_title_transfer_eze',
        descriptionKey: 'booking_desc_transfer_eze',
        data: {
            from: 'Aeropuerto Ministro Pistarini (EZE)',
            to: 'Av. Pueyrredón 1161, CABA',
            date: '2025-09-26',
            duration: 'Aprox. 43 min',
            price: { value: 45000, currency: Currency.ARS },
        } as TransferData,
    },
    {
        id: 'bus_bue_ros_20250930',
        type: 'bus',
        titleKey: 'booking_title_bus_bue_ros',
        descriptionKey: 'booking_desc_bus_bue_ros',
        data: {
            from: 'Buenos Aires',
            to: 'Rosario',
            departure: '2025-09-30T13:30:00Z',
            arrival: '2025-09-30T17:50:00Z',
            duration: '4hs 20min',
            passengers: [
                { name: 'Adulto 1', seat: '21', type: 'Cama' },
                { name: 'Adulto 2', seat: '22', type: 'Cama' },
                { name: 'Adulto 3', seat: '23', type: 'Cama' },
                { name: 'Adolescente 1', seat: '24', type: 'Cama' },
            ],
            price: { value: 96000, currency: Currency.ARS },
            company: 'Flecha Bus',
        } as BusData,
    },
    {
        id: 'bus_ros_bar_20251004',
        type: 'bus',
        titleKey: 'booking_title_bus_ros_bar',
        descriptionKey: 'booking_desc_bus_ros_bar',
        data: {
            from: 'Rosario',
            to: 'Bariloche',
            departure: '2025-10-04T11:30:00Z',
            arrival: '2025-10-05T13:15:00Z',
            duration: '25hs 45min',
            passengers: [
                { name: 'Adulto 1', seat: '25', type: 'Cama' },
                { name: 'Adulto 2', seat: '26', type: 'Cama' },
                { name: 'Adulto 3', seat: '27', type: 'Cama' },
                { name: 'Adolescente 1', seat: '28', type: 'Cama' },
            ],
            price: { value: 347200, currency: Currency.ARS },
            company: 'Via Bariloche',
        } as BusData,
    },
    {
        id: 'hotel_bariloche_20251005',
        type: 'hotel',
        titleKey: 'booking_title_hotel_bar',
        descriptionKey: 'booking_desc_hotel_bar',
        data: {
            confirmation: '6112.798.624',
            pin: '1077',
            checkIn: '2025-10-05',
            checkOut: '2025-10-10',
            nights: 5,
            guests: '3 adultos, 1 niño (13 años)',
            price: { value: 1160697, currency: Currency.ARS },
            address: 'San Martín 127, San Carlos de Bariloche', // Placeholder address
            phone: '+54 294 442-2621', // Placeholder phone
        } as HotelData,
    },
];


// --- TRANSLATIONS ---

export const translations_es: { [key: string]: string } = {
  // General
  tituloPrincipal: 'Itinerario de Viaje Familiar por Argentina',
  bienvenidaPrincipal: 'Un plan detallado para nuestra aventura de un mes.',
  footerText: 'Plan de Viaje Familiar. Todos los derechos reservados.',
  explore_btn: 'Explorar Ciudad',
  idioma: 'Idioma',
  moneda: 'Moneda',
  volverItinerario: 'Volver al Itinerario',
  loading: 'Cargando...',
  error: 'Error',
  generating: 'Generando...',
  any_city_placeholder: 'una ciudad de nuestro viaje',
  
  // TopBar Share
  share_app_label: 'Compartir aplicación',
  share_popover_title: 'Compartir este itinerario',
  share_popover_copy_button: 'Copiar',
  share_popover_copied_message: '¡Enlace copiado!',
  share_popover_copy_failed_message: 'Error al copiar',
  scroll_to_top_label: 'Volver arriba',

  // Cities
  buenosaires_name: 'Buenos Aires',
  buenosaires_description: 'La vibrante capital de Argentina, llena de cultura, historia y tango.',
  buenosaires_dates_duration: '🗓️ 26/09 al 30/09\n🚌 Nota: Viaje al mediodía a Rosario.',
  rosario_name: 'Rosario',
  rosario_description: 'Una importante ciudad portuaria y lugar de nacimiento de la bandera argentina.',
  rosario_dates_duration: '🗓️ 30/09 al 04/10\n🚌 Nota: Viaje al mediodía a Bariloche.',
  bariloche_name: 'Bariloche',
  bariloche_description: 'Famosa por su arquitectura de estilo suizo y sus chocolates, ubicada en la Patagonia.',
  bariloche_dates_duration: '🗓️ 05/10 al 10/10\n✈️ Nota: Viaje al mediodía a Mendoza.',
  mendoza_name: 'Mendoza',
  mendoza_description: 'El corazón de la región vinícola de Argentina, famosa por sus Malbecs.',
  mendoza_dates_duration: '🗓️ 11/10 al 15/10 (4 días)\n📝 Nota: Visitar Malargüe como excursión.',
  malargue_name: 'Malargüe',
  malargue_description: 'Un destino de aventura conocido por sus paisajes volcánicos, cuevas y cielos estrellados.',
  jujuy_name: 'Jujuy',
  jujuy_description: 'Una región de paisajes montañosos espectaculares y cultura andina.',
  jujuy_dates_duration: '🗓️ 16/10 al 20/10\n✈️ Nota: Vuelo a Iguazú.',
  iguazu_name: 'Puerto Iguazú',
  iguazu_description: 'Hogar de las impresionantes Cataratas del Iguazú, una de las siete maravillas naturales del mundo.',
  iguazu_dates_duration: '🗓️ 20/10 al 22/10 (4 días)',
  esteros_ibera_name: 'Esteros del Iberá',
  esteros_ibera_description: 'Uno de los humedales más grandes del mundo, con una increíble biodiversidad.',
  esteros_ibera_dates_duration: '🗓️ 22/10 al 24/10\n📝 Nota: Dejar valijas en Corrientes.',
  corrientes_name: 'Corrientes',
  corrientes_description: 'Capital de la provincia homónima, a orillas del río Paraná.',
  corrientes_dates_duration: '🗓️ 24/10 al 26/10\n✈️ Nota: Vuelo a Buenos Aires.',
  buenosaires_final_stay_dates_duration: '🗓️ 26/10 al 28/10\n✈️ Nota: Vuelo a Addis Ababa (ADD).',

  // HomePage components
  mapaInteractivoTitulo: 'Mapa Interactivo del Viaje',
  mapaInteractivoBienvenida: 'Haz clic en una ciudad para explorar más detalles o simplemente visualiza nuestro recorrido completo.',
  conversorTitulo: 'Conversor de Moneda',
  montoPlaceholder: 'Monto',
  desde: 'Desde',
  hasta: 'Hasta',
  convertirBtn: 'Convertir',
  iaTitulo: 'Asistente de Viaje IA',
  iaDescription: 'Utiliza esta IA general para hacer preguntas sobre Argentina, la cultura, el clima o cualquier otra cosa relacionada con nuestro viaje.',
  iaPlaceholder: 'Ej: ¿Qué ropa debo empacar para el clima de Buenos Aires en octubre?',
  consultarBtn: 'Consultar IA',
  iaProcessing: 'Procesando...',
  iaError: 'Lo siento, ocurrió un error al contactar a la IA. Por favor, intenta de nuevo más tarde.',
  transporte: 'Transporte Entre Ciudades',
  medio: 'Medio',
  tiempo: 'Tiempo Est.',
  precio: 'Precio Est.',
  compania: 'Compañía',
  medio_bus: 'Bus',
  medio_bus_nocturno: 'Bus Nocturno',
  medio_avion: 'Vuelo',
  medio_transfer: 'Transfer',
  tiempo_4h_20m: '4h 20m',
  tiempo_25h_45m: '25h 45m',
  tiempo_1_5h: '1.5h',
  tiempo_20h: '20h',
  tiempo_2h: '2h',
  tiempo_5h: '5h',
  tiempo_4h: '4h',

  // Budget
  budget_summary_title: 'Resumen de Presupuesto del Viaje',
  budget_summary_desc: 'Estimación total del costo para 4 personas, basado en valores personalizables por ciudad.',
  budget_summary_calculating: 'Calculando...',
  budget_summary_total_label: 'Costo Total Estimado',
  budget_summary_breakdown_title: 'Desglose por Categoría (Total)',
  budget_concept_international_flights: 'Vuelos Internacionales',
  budget_concept_internal_flights: 'Vuelos Internos',
  budget_concept_travel_insurance: 'Seguro de Viaje',
  budget_concept_accommodation: 'Alojamiento',
  budget_concept_food: 'Comida',
  budget_concept_transport: 'Transporte Local',
  budget_concept_activities: 'Actividades',
  budget_concept_park_entrance: 'Entrada al Parque Nacional',
  budget_per_day_suffix: 'por día',

  // Packing List
  packing_title: 'Lista de Equipaje',
  packing_placeholder: 'Añadir nuevo ítem...',
  packing_essential: 'Esencial',
  packing_optional: 'Opcional',
  packing_add: 'Añadir',
  packing_list_empty: 'La lista está vacía. ¡Añade tu primer ítem!',
  
  // AI Chat Box
  ai_chat_title_kids_activities: "Actividades para Niños",
  ai_chat_description_kids_activities: "Pregúntale a la IA por recomendaciones de actividades, parques y lugares divertidos para los niños en {cityName}.",
  ai_chat_input_placeholder_kids: "Ej: ¿Cuáles son los mejores museos para niños?",
  ai_chat_title_restaurant_finder: "Buscador de Restaurantes",
  ai_chat_description_restaurant_finder: "Pídele a la IA que encuentre restaurantes en {cityName} que se ajusten a nuestras preferencias (ej. con opciones sin gluten, para familias, etc.).",
  ai_chat_input_placeholder_restaurants: "Ej: Encuentra un restaurante con pelotero.",
  ai_chat_title_budget_analysis: "Análisis de Presupuesto",
  ai_chat_description_budget_analysis: "Consulta a la IA sobre cómo optimizar nuestro presupuesto en {cityName}, basado en los costos estimados.",
  ai_chat_input_placeholder_budget: "Ej: ¿En qué podemos ahorrar más dinero aquí?",
  ai_chat_new_conversation: 'Nueva Conversación',
  ai_chat_input_placeholder: 'Escribe tu mensaje...',
  ai_chat_send_button: 'Enviar',
  ai_translated_from_label: 'Traducido de {lang}',
  ai_translate_button_text: 'Traducir a {lang}',
  language_name_es: 'Español',
  language_name_he: 'Hebreo',

  // Budget Table
  budget_table_concept: 'Concepto',
  budget_table_estimated_price_usd: 'Precio Estimado (USD)',
  budget_table_restore_defaults: 'Restaurar Valores',

  // City Detail
  section_title_dates_duration: 'Fechas y Duración',
  section_title_must_see: 'Imperdibles',
  section_title_activities_recommended: 'Actividades Recomendadas',
  section_title_ai_event_finder: 'Buscador de Eventos Locales (IA)',
  ai_event_finder_description: 'Usa la IA para buscar eventos y mercados locales en {cityName} durante nuestra estadía.',
  ai_event_finder_button: 'Buscar Eventos Ahora',
  ai_event_finder_error: 'No se pudieron encontrar eventos. La IA puede estar ocupada o no hay eventos relevantes.',
  ai_event_finder_sources_title: 'Fuentes (de Google Search)',
  section_title_gastronomy_highlight: 'Gastronomía Destacada',
  section_title_accommodation_examples: 'Ejemplos de Alojamiento',
  section_title_coordinates: 'Coordenadas',
  section_title_family_tips: 'Consejos para Familias',
  section_title_cultural_tips: 'Consejos Culturales',
  section_title_budget_table: 'Presupuesto Detallado',
  section_title_city_map: 'Mapa de la Ciudad',

  // Itinerary Analysis
  itinerary_program_title: "Análisis y Sugerencias del Itinerario",
  itinerary_program_current_plan_title: "Resumen de tu Plan Actual",
  duration_not_specified: "Duración no especificada",
  itinerary_program_optimization_tips_title: "Consejos de Optimización",
  itinerary_optimization_tip_1: "Considera volar de Buenos Aires a Iguazú para ahorrar tiempo.",
  itinerary_optimization_tip_2: "El bus de Rosario a Buenos Aires es una opción económica y cómoda.",
  itinerary_optimization_tip_3: "Reserva los vuelos internos con anticipación para mejores precios.",
  itinerary_optimization_tip_4: "Verifica el clima en Jujuy; las noches pueden ser frías.",
  itinerary_optimization_tip_5: "Asigna al menos dos días completos para las cataratas de Iguazú.",
  itinerary_optimization_tip_6: "El transporte público en Buenos Aires es eficiente con la tarjeta SUBE.",
  
  // Flight tickets
  flight_tickets_title: 'Tickets de Vuelo Internacional',
  flight_tickets_departure: 'Salida',
  flight_tickets_arrival: 'Llegada',
  flight_tickets_reservation: 'Reserva',
  flight_tickets_airline_ref: 'Ref. Aerolínea',
  flight_tickets_status: 'Estado',
  flight_tickets_approved: 'Aprobado',
  flight_tickets_passengers: 'Pasajeros',
  flight_tickets_flights: 'Vuelos',
  flight_tickets_connection_time: 'Tiempo de conexión',
  flight_tickets_baggage_allowance: 'Equipaje permitido',
  flight_tickets_carry_on: '1 pieza de equipaje de mano (7kg)',
  flight_tickets_checked_bags: '2 piezas de equipaje facturado (23kg cada una)',

  // Weather
  weather_title: 'Pronóstico del Tiempo',
  weather_select_city_label: 'Seleccionar ciudad para el pronóstico',
  weather_error_city_not_found: 'Ciudad no encontrada.',
  weather_error_fetching: 'Error al obtener el pronóstico.',
  weather_feels_like: 'Sensación térmica',
  weather_humidity: 'Humedad',

  // Reservations
  reservations_title: 'Reservas y Documentos',
  booking_title_transfer_eze: 'Transfer Aeropuerto EZE',
  booking_desc_transfer_eze: 'Traslado al llegar a Buenos Aires.',
  booking_title_bus_bue_ros: 'Bus: Buenos Aires → Rosario',
  booking_desc_bus_bue_ros: 'Pasajes de bus de ida.',
  booking_title_bus_ros_bar: 'Bus: Rosario → Bariloche',
  booking_desc_bus_ros_bar: 'Pasajes de bus nocturno.',
  booking_title_hotel_bar: 'Hotel Concorde, Bariloche',
  booking_desc_hotel_bar: 'Confirmación de reserva de alojamiento.',
  reservations_hotel_checkin: 'Entrada',
  reservations_hotel_checkout: 'Salida',
  reservations_hotel_guests: 'Huéspedes',
  reservations_hotel_confirmation: 'Confirmación',
  reservations_bus_departure: 'Salida',
  reservations_bus_arrival: 'Llegada',
  reservations_bus_duration: 'Duración',
  reservations_bus_passengers: 'Pasajeros',
  reservations_bus_seat: 'Asiento',
  reservations_transfer_from: 'Origen',
  reservations_transfer_to: 'Destino',
  reservations_transfer_date: 'Fecha',
  reservations_transfer_duration: 'Duración',

  // Photo Album
  photo_album_title: 'Álbum de Fotos Familiar',
  photo_album_add_button: 'Añadir Foto',
  photo_album_description: 'Un lugar para guardar nuestros recuerdos del viaje. Las fotos se guardan en tu dispositivo.',
  photo_album_empty: 'Aún no hay fotos. ¡Sube la primera!',
  photo_album_unclassified: 'Sin clasificar',
  photo_album_trip_day: 'Día',
  photo_album_date_taken: 'Fecha',
  photo_album_caption: 'Descripción',
  photo_album_city: 'Ciudad',
  photo_album_edit_caption_label: 'Editar descripción',
  photo_album_delete_photo_label: 'Eliminar foto',
  photo_album_confirm_delete: '¿Estás seguro de que quieres eliminar esta foto?',
  photo_album_add_details_title: 'Añadir detalles a la foto',
  photo_album_save_button: 'Guardar',
  photo_album_cancel_button: 'Cancelar',

};

export const translations_he: { [key: string]: string } = {
  // General
  tituloPrincipal: 'מסלול טיול משפחתי בארגנטינה',
  bienvenidaPrincipal: 'תוכנית מפורטת להרפתקה של חודש ימים.',
  footerText: 'תוכנית טיול משפחתית. כל הזכויות שמורות.',
  explore_btn: 'גלה את העיר',
  idioma: 'שפה',
  moneda: 'מטבע',
  volverItinerario: 'חזרה למסלול',
  loading: 'טוען...',
  error: 'שגיאה',
  generating: 'יוצר...',
  any_city_placeholder: 'עיר כלשהי בטיול שלנו',
  
  // TopBar Share
  share_app_label: 'שתף אפליקציה',
  share_popover_title: 'שתף את המסלול הזה',
  share_popover_copy_button: 'העתק',
  share_popover_copied_message: 'הקישור הועתק!',
  share_popover_copy_failed_message: 'שגיאה בהעתקה',
  scroll_to_top_label: 'חזור למעלה',

  // Cities
  buenosaires_name: 'בואנוס איירס',
  buenosaires_description: 'בירתה התוססת של ארגנטינה, מלאה בתרבות, היסטוריה וטנגו.',
  rosario_name: 'רוסאריו',
  rosario_description: 'עיר נמל חשובה ומקום הולדתו של דגל ארגנטינה.',
  bariloche_name: 'ברילוצ\'ה',
  bariloche_description: 'מפורסמת בארכיטקטורה בסגנון שוויצרי ובשוקולדים שלה, ממוקמת בפטגוניה.',
  mendoza_name: 'מנדוסה',
  mendoza_description: 'לב אזור היין של ארגנטינה, מפורסמת ביינות המלבק שלה.',
  malargue_name: 'מלרגואה',
  malargue_description: 'יעד הרפתקאות הידוע בנופיו הוולקניים, במערות ובשמיים זרועי כוכבים.',
  jujuy_name: 'חוחוי',
  jujuy_description: 'אזור של נופי הרים מרהיבים ותרבות אנדינית.',
  iguazu_name: 'פוארטו איגואסו',
  iguazu_description: 'ביתם של מפלי איגואסו המדהימים, אחד משבעת פלאי תבל הטבעיים.',
  esteros_ibera_name: 'אסטרוס דל איברה',
  esteros_ibera_description: 'אחד מאזורי הביצות הגדולים בעולם, עם מגוון ביולוגי מדהים.',
  corrientes_name: 'קוריינטס',
  corrientes_description: 'בירת המחוז באותו שם, על גדות נהר פרנה.',
  
  // Dates and durations in Hebrew (as an example, you'd fill these out)
  buenosaires_dates_duration: '🗓️ 26/09 עד 30/09\n🚌 הערה: נסיעת צהריים לרוסאריו.',
  rosario_dates_duration: '🗓️ 30/09 עד 04/10\n🚌 הערה: נסיעת צהריים לברילוצ\'ה.',
  bariloche_dates_duration: '🗓️ 05/10 עד 10/10\n✈️ הערה: נסיעת צהריים למנדוסה.',
  mendoza_dates_duration: '🗓️ 11/10 עד 15/10 (4 ימים)\n📝 הערה: ביקור במלרגואה כטיול יום.',
  jujuy_dates_duration: '🗓️ 16/10 עד 20/10\n✈️ הערה: טיסה לאיגואסו.',
  iguazu_dates_duration: '🗓️ 19/10 עד 22/10 (4 ימים)',
  esteros_ibera_dates_duration: '🗓️ 22/10 עד 24/10\n📝 הערה: השארת מזוודות בקוריינטס.',
  corrientes_dates_duration: '🗓️ 24/10 עד 26/10\n✈️ הערה: טיסה לבואנוס איירס.',
  buenosaires_final_stay_dates_duration: '🗓️ 26/10 עד 28/10\n✈️ הערה: טיסה לאדיס אבבה (ADD).',


  // HomePage components
  mapaInteractivoTitulo: 'מפה אינטראקטיבית של הטיול',
  mapaInteractivoBienvenida: 'לחץ על עיר כדי לחקור פרטים נוספים או פשוט צפה במסלול המלא שלנו.',
  conversorTitulo: 'ממיר מטבעות',
  montoPlaceholder: 'סכום',
  desde: 'מ',
  hasta: 'ל',
  convertirBtn: 'המר',
  iaTitulo: 'עוזר טיולים AI',
  iaDescription: 'השתמש בבינה המלאכותית הכללית כדי לשאול שאלות על ארגנטינה, תרבות, מזג אוויר או כל דבר אחר הקשור לטיול שלנו.',
  iaPlaceholder: 'לדוגמה: אילו בגדים לארוז למזג האוויר בבואנוס איירס באוקטובר?',
  consultarBtn: 'שאל את ה-AI',
  iaProcessing: 'מעבד...',
  iaError: 'מצטערים, אירעה שגיאה בפנייה ל-AI. אנא נסה שוב מאוחר יותר.',
  transporte: 'תחבורה בין ערים',
  medio: 'אמצעי',
  tiempo: 'זמן מוערך',
  precio: 'מחיר מוערך',
  compania: 'חברה',
  medio_bus: 'אוטובוס',
  medio_bus_nocturno: 'אוטובוס לילה',
  medio_avion: 'טיסה',
  medio_transfer: 'העברה',
  tiempo_4h_20m: '4ש 20ד',
  tiempo_25h_45m: '25ש 45ד',
  tiempo_1_5h: '1.5ש',
  tiempo_20h: '20ש',
  tiempo_2h: '2ש',
  tiempo_5h: '5ש',
  tiempo_4h: '4ש',

  // Budget
  budget_summary_title: 'סיכום תקציב הטיול',
  budget_summary_desc: 'הערכת עלות כוללת ל-4 אנשים, מבוססת על ערכים הניתנים להתאמה אישית לכל עיר.',
  budget_summary_calculating: 'מחשב...',
  budget_summary_total_label: 'עלות כוללת מוערכת',
  budget_summary_breakdown_title: 'פירוט לפי קטגוריה (סה"כ)',
  budget_concept_international_flights: 'טיסות בינלאומיות',
  budget_concept_internal_flights: 'טיסות פנים',
  budget_concept_travel_insurance: 'ביטוח נסיעות',
  budget_concept_accommodation: 'לינה',
  budget_concept_food: 'אוכל',
  budget_concept_transport: 'תחבורה מקומית',
  budget_concept_activities: 'פעילויות',
  budget_concept_park_entrance: 'כניסה לפארק הלאומי',
  budget_per_day_suffix: 'ליום',

  // Packing List
  packing_title: 'רשימת אריזה',
  packing_placeholder: 'הוסף פריט חדש...',
  packing_essential: 'חיוני',
  packing_optional: 'אופציונלי',
  packing_add: 'הוסף',
  packing_list_empty: 'הרשימה ריקה. הוסף את הפריט הראשון שלך!',
  
  // AI Chat Box
  ai_chat_title_kids_activities: "פעילויות לילדים",
  ai_chat_description_kids_activities: "שאל את הבינה המלאכותית להמלצות על פעילויות, פארקים ומקומות מהנים לילדים ב{cityName}.",
  ai_chat_input_placeholder_kids: "לדוגמה: מהם המוזיאונים הטובים ביותר לילדים?",
  ai_chat_title_restaurant_finder: "מאתר מסעדות",
  ai_chat_description_restaurant_finder: "בקש מה-AI למצוא מסעדות ב{cityName} שמתאימות להעדפות שלנו (למשל, עם אפשרויות ללא גלוטן, ידידותיות למשפחות וכו').",
  ai_chat_input_placeholder_restaurants: "לדוגמה: מצא מסעדה עם משחקייה.",
  ai_chat_title_budget_analysis: "ניתוח תקציב",
  ai_chat_description_budget_analysis: "התייעץ עם ה-AI כיצד למטב את התקציב שלנו ב{cityName}, בהתבסס על העלויות המשוערות.",
  ai_chat_input_placeholder_budget: "לדוגמה: על מה אנחנו יכולים לחסוך פה הכי הרבה כסף?",
  ai_chat_new_conversation: 'שיחה חדשה',
  ai_chat_input_placeholder: 'כתוב את הודעתך...',
  ai_chat_send_button: 'שלח',
  ai_translated_from_label: 'תורגם מ{lang}',
  ai_translate_button_text: 'תרגם ל{lang}',
  language_name_es: 'ספרדית',
  language_name_he: 'עברית',
  
  // Budget Table
  budget_table_concept: 'סעיף',
  budget_table_estimated_price_usd: 'מחיר מוערך (USD)',
  budget_table_restore_defaults: 'שחזר ברירות מחדל',
  
  // City Detail
  section_title_dates_duration: 'תאריכים ומשך',
  section_title_must_see: 'אתרי חובה',
  section_title_activities_recommended: 'פעילויות מומלצות',
  section_title_ai_event_finder: 'מאתר אירועים מקומיים (AI)',
  ai_event_finder_description: 'השתמש ב-AI כדי לחפש אירועים ושווקים מקומיים ב{cityName} במהלך שהותנו.',
  ai_event_finder_button: 'מצא אירועים עכשיו',
  ai_event_finder_error: 'לא ניתן היה למצוא אירועים. ייתכן שה-AI עסוק או שאין אירועים רלוונטיים.',
  ai_event_finder_sources_title: 'מקורות (מחיפוש גוגל)',
  section_title_gastronomy_highlight: 'גסטרונומיה מומלצת',
  section_title_accommodation_examples: 'דוגמאות ללינה',
  section_title_coordinates: 'קואורדינטות',
  section_title_family_tips: 'טיפים למשפחות',
  section_title_cultural_tips: 'טיפים תרבותיים',
  section_title_budget_table: 'תקציב מפורט',
  section_title_city_map: 'מפת העיר',

  // Itinerary Analysis
  itinerary_program_title: "ניתוח והצעות למסלול",
  itinerary_program_current_plan_title: "סיכום התוכנית הנוכחית שלך",
  duration_not_specified: "משך לא צוין",
  itinerary_program_optimization_tips_title: "טיפים לאופטימיזציה",
  itinerary_optimization_tip_1: "שקלו לטוס מבואנוס איירס לאיגואסו כדי לחסוך זמן.",
  itinerary_optimization_tip_2: "האוטובוס מרוסאריו לבואנוס איירס הוא אופציה זולה ונוחה.",
  itinerary_optimization_tip_3: "הזמינו טיסות פנים מראש למחירים טובים יותר.",
  itinerary_optimization_tip_4: "בדקו את מזג האוויר בחוחוי; הלילות יכולים להיות קרים.",
  itinerary_optimization_tip_5: "הקדישו לפחות יומיים מלאים למפלי איגואסו.",
  itinerary_optimization_tip_6: "התחבורה הציבורית בבואנוס איירס יעילה עם כרטיס SUBE.",
  
  // Flight tickets
  flight_tickets_title: 'כרטיסי טיסה בינלאומיים',
  flight_tickets_departure: 'המראה',
  flight_tickets_arrival: 'נחיתה',
  flight_tickets_reservation: 'הזמנה',
  flight_tickets_airline_ref: 'אסמכתת חברת תעופה',
  flight_tickets_status: 'סטטוס',
  flight_tickets_approved: 'מאושר',
  flight_tickets_passengers: 'נוסעים',
  flight_tickets_flights: 'טיסות',
  flight_tickets_connection_time: 'זמן קונקשן',
  flight_tickets_baggage_allowance: 'כבודה מותרת',
  flight_tickets_carry_on: 'תיק יד אחד (7 ק"ג)',
  flight_tickets_checked_bags: '2 מזוודות (23 ק"ג כל אחת)',

  // Weather
  weather_title: 'תחזית מזג אוויר',
  weather_select_city_label: 'בחר עיר לתחזית',
  weather_error_city_not_found: 'עיר לא נמצאה.',
  weather_error_fetching: 'שגיאה בקבלת התחזית.',
  weather_feels_like: 'מרגיש כמו',
  weather_humidity: 'לחות',

  // Reservations
  reservations_title: 'הזמנות ומסמכים',
  booking_title_transfer_eze: 'העברה משדה התעופה EZE',
  booking_desc_transfer_eze: 'הסעה בהגעה לבואנוס איירס.',
  booking_title_bus_bue_ros: 'אוטובוס: בואנוס איירס → רוסאריו',
  booking_desc_bus_bue_ros: 'כרטיסי אוטובוס הלוך.',
  booking_title_bus_ros_bar: 'אוטובוס: רוסאריו → ברילוצ\'ה',
  booking_desc_bus_ros_bar: 'כרטיסי אוטובוס לילה.',
  booking_title_hotel_bar: 'מלון קונקורד, ברילוצ\'ה',
  booking_desc_hotel_bar: 'אישור הזמנת לינה.',
  reservations_hotel_checkin: 'צ\'ק-אין',
  reservations_hotel_checkout: 'צ\'ק-אאוט',
  reservations_hotel_guests: 'אורחים',
  reservations_hotel_confirmation: 'אישור',
  reservations_bus_departure: 'יציאה',
  reservations_bus_arrival: 'הגעה',
  reservations_bus_duration: 'משך',
  reservations_bus_passengers: 'נוסעים',
  reservations_bus_seat: 'מושב',
  reservations_transfer_from: 'מקור',
  reservations_transfer_to: 'יעד',
  reservations_transfer_date: 'תאריך',
  reservations_transfer_duration: 'משך',

  // Photo Album
  photo_album_title: 'אלבום תמונות משפחתי',
  photo_album_add_button: 'הוסף תמונה',
  photo_album_description: 'מקום לשמור בו את הזיכרונות שלנו מהטיול. התמונות נשמרות על המכשיר שלך.',
  photo_album_empty: 'אין עדיין תמונות. העלה את התמונה הראשונה!',
  photo_album_unclassified: 'ללא סיווג',
  photo_album_trip_day: 'יום',
  photo_album_date_taken: 'תאריך',
  photo_album_caption: 'תיאור',
  photo_album_city: 'עיר',
  photo_album_edit_caption_label: 'ערוך תיאור',
  photo_album_delete_photo_label: 'מחק תמונה',
  photo_album_confirm_delete: 'האם אתה בטוח שברצונך למחוק תמונה זו?',
  photo_album_add_details_title: 'הוסף פרטים לתמונה',
  photo_album_save_button: 'שמור',
  photo_album_cancel_button: 'בטל',

};