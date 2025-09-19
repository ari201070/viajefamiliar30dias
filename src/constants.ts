import { City, Translations, Language, TransportLeg, Currency, PointOfInterest, AIPromptContent, BudgetItem } from './types.ts';

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

const buenosAiresPois: PointOfInterest[] = [
  { id: 'ba_poi_obelisco', nameKey: 'buenosaires_poi_obelisco_name', coords: [-34.6037, -58.3816], descriptionKey: 'buenosaires_poi_obelisco_desc' },
  { id: 'ba_poi_teatrocolon', nameKey: 'buenosaires_poi_teatrocolon_name', coords: [-34.6010, -58.3830], descriptionKey: 'buenosaires_poi_teatrocolon_desc' },
  { id: 'ba_poi_caminito', nameKey: 'buenosaires_poi_caminito_name', coords: [-34.6383, -58.3625], descriptionKey: 'buenosaires_poi_caminito_desc' },
  { id: 'ba_poi_palermo', nameKey: 'buenosaires_poi_palermo_name', coords: [-34.5729, -58.4204], descriptionKey: 'buenosaires_poi_palermo_desc' }, // General Palermo, near Rose Garden
  { id: 'ba_poi_planetario', nameKey: 'buenosaires_poi_planetario_name', coords: [-34.5700, -58.4121], descriptionKey: 'buenosaires_poi_planetario_desc' },
  { id: 'ba_poi_puertomadero', nameKey: 'buenosaires_poi_puertomadero_name', coords: [-34.6105, -58.3647], descriptionKey: 'buenosaires_poi_puertomadero_desc' }, // Puente de la Mujer
  { id: 'ba_poi_bellasartes', nameKey: 'buenosaires_poi_bellasartes_name', coords: [-34.5820, -58.3929], descriptionKey: 'buenosaires_poi_bellasartes_desc' },
  { id: 'ba_poi_recoleta', nameKey: 'buenosaires_poi_recoleta_name', coords: [-34.5887, -58.3906], descriptionKey: 'buenosaires_poi_recoleta_desc' }, // Recoleta Cemetery
  { id: 'ba_poi_plazamayo', nameKey: 'buenosaires_poi_plazamayo_name', coords: [-34.6083, -58.3722], descriptionKey: 'buenosaires_poi_plazamayo_desc' },
];

export const TRIP_WIDE_BUDGET_ITEMS: BudgetItem[] = [
  { conceptKey: 'budget_concept_international_flights', value: '7000-9000', isPerDay: false },
];

export const CITIES: City[] = [
  { 
    id: 'buenosaires', 
    nameKey: 'buenosaires_title', 
    coords: [-34.6118, -58.3960], 
    image: 'https://plus.unsplash.com/premium_photo-1754211851708-019956b12300?q=80&w=627&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    descriptionKey: 'buenosaires_desc_main',
    activitiesKey: 'buenosaires_activities_recommended', 
    accommodationKey: 'buenosaires_accommodation_examples', 
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '0', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '30-70', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '15-40', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '50-120', isPerDay: true },
      { conceptKey: 'budget_concept_museums', value: '0-15', isPerDay: true },
    ],
    pointsOfInterest: buenosAiresPois,
  },
  { 
    id: 'rosario', 
    nameKey: 'rosario_title', 
    coords: [-32.9442, -60.6505], 
    image: 'https://images.unsplash.com/photo-1663851753121-abd417bfb0b3?q=80&w=1632&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    descriptionKey: 'rosario_desc_main',
    activitiesKey: 'rosario_activities_recommended',
    accommodationKey: 'rosario_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '0', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '30-70', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '3-5', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '20-50', isPerDay: true },
      { conceptKey: 'budget_concept_museums', value: '0-15', isPerDay: true },
    ]
  },
  { 
    id: 'bariloche', 
    nameKey: 'bariloche_title', 
    coords: [-41.1335, -71.3103], 
    image: 'https://images.unsplash.com/photo-1598162480222-b2c3d92548d5?q=80&w=1170&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    descriptionKey: 'bariloche_desc_main',
    activitiesKey: 'bariloche_activities_recommended',
    accommodationKey: 'bariloche_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '70-180', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '40-90', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '5-15', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '30-80', isPerDay: true },
      { conceptKey: 'budget_concept_museums', value: '0-20', isPerDay: true },
    ]
  },
  { 
    id: 'mendoza', 
    nameKey: 'mendoza_title', 
    coords: [-32.8908, -68.8272], 
    image: 'https://images.unsplash.com/photo-1665254369274-4b459f3ce48c?q=80&w=1932&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    descriptionKey: 'mendoza_desc_main',
    activitiesKey: 'mendoza_activities_recommended',
    accommodationKey: 'mendoza_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '60-160', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '40-80', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '5-20', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '25-70', isPerDay: true },
      { conceptKey: 'budget_concept_museums', value: '0-20', isPerDay: true },
    ]
  },
  { 
    id: 'malargue', 
    nameKey: 'malargue_title', 
    coords: [-35.4769, -69.5894], 
    image: 'https://live.staticflickr.com/5598/15633439821_9764cac7c9_k.jpg', 
    descriptionKey: 'malargue_desc_main',
    activitiesKey: 'malargue_activities_recommended',
    accommodationKey: 'malargue_accommodation_examples',
    budgetItems: [ 
      { conceptKey: 'budget_concept_accommodation', value: '0', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '35-70', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '10-25', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '30-80', isPerDay: true },
      { conceptKey: 'budget_concept_museums', value: '0-25', isPerDay: true },
    ]
  },
  { 
    id: 'jujuy', 
    nameKey: 'jujuy_title', 
    coords: [-24.1858, -65.2995],
    image: 'https://images.unsplash.com/photo-1599094792743-7df3e8870800?q=80&w=1458&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    descriptionKey: 'jujuy_desc_main',
    activitiesKey: 'jujuy_activities_recommended',
    accommodationKey: 'jujuy_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '40-110', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '25-65', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '5-20', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '15-50', isPerDay: true },
      { conceptKey: 'budget_concept_museums', value: '0-10', isPerDay: true },
    ]
  },
  { 
    id: 'iguazu', 
    nameKey: 'iguazu_title', 
    coords: [-25.5952, -54.5732],
    image: 'https://images.unsplash.com/photo-1679771651554-df7430ada73f?q=80&w=1170&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    descriptionKey: 'iguazu_desc_main',
    activitiesKey: 'iguazu_activities_recommended',
    accommodationKey: 'iguazu_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '60-150', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '30-75', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '5-20', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '30-80', isPerDay: true },
      { conceptKey: 'budget_concept_museums', value: '25-40', isPerDay: true },
    ]
  },
  { 
    id: 'ibera', 
    nameKey: 'ibera_title', 
    coords: [-28.539, -57.16], 
    image: 'https://plus.unsplash.com/premium_photo-1694475403770-a84bc706ebc3?q=80&w=1170&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    descriptionKey: 'ibera_desc_main',
    activitiesKey: 'ibera_activities_recommended',
    accommodationKey: 'ibera_accommodation_examples',
    budgetItems: [
        { conceptKey: 'budget_concept_accommodation_full', value: '70-200', isPerDay: true },
        { conceptKey: 'budget_concept_food_included', value: '0-0', isPerDay: true },
        { conceptKey: 'budget_concept_transport_local', value: '0-10', isPerDay: true },
        { conceptKey: 'budget_concept_activities_included', value: '50-100', isPerDay: true },
        { conceptKey: 'budget_concept_museums', value: '0-10', isPerDay: true },
    ]
  },
  { 
    id: 'corrientes', 
    nameKey: 'corrientes_title', 
    coords: [-27.4691, -58.8309], 
    image: 'https://images.unsplash.com/photo-1727529532198-1a5e6fb88927?q=80&w=1470&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    descriptionKey: 'corrientes_desc_main',
    activitiesKey: 'corrientes_activities_recommended',
    accommodationKey: 'corrientes_accommodation_examples',
    budgetItems: [
      { conceptKey: 'budget_concept_accommodation', value: '40-100', isPerDay: true },
      { conceptKey: 'budget_concept_food', value: '25-60', isPerDay: true },
      { conceptKey: 'budget_concept_transport', value: '3-10', isPerDay: true },
      { conceptKey: 'budget_concept_activities', value: '10-40', isPerDay: true },
      { conceptKey: 'budget_concept_museums', value: '0-10', isPerDay: true },
    ]
  },
];

export const AI_PROMPT_CONFIGS: AIPromptContent[] = [
  { titleKey: 'ai_menu_title', descriptionKey: 'ai_menu_description', buttonKey: 'ai_menu_button', promptKeySuffix: '_ai_prompt_menu', icon: 'fa-utensils', userInputPlaceholderKey: 'ai_menu_input_placeholder' },
  { titleKey: 'ai_accommodation_title', descriptionKey: 'ai_accommodation_description', buttonKey: 'ai_accommodation_button', promptKeySuffix: '_ai_prompt_accommodation', icon: 'fa-hotel', userInputPlaceholderKey: 'ai_accommodation_input_placeholder' },
  { titleKey: 'ai_family_tips_title', descriptionKey: 'ai_family_tips_description', buttonKey: 'ai_family_tips_button', promptKeySuffix: '_ai_prompt_family_tips', icon: 'fa-users-cog', userInputPlaceholderKey: 'ai_family_tips_input_placeholder' },
  { titleKey: 'ai_budget_analysis_title', descriptionKey: 'ai_budget_analysis_description', buttonKey: 'ai_budget_analysis_button', promptKeySuffix: '_ai_prompt_budget_analysis', icon: 'fa-piggy-bank', userInputPlaceholderKey: 'ai_budget_analysis_input_placeholder' },
];


export const translations: Translations = {
  [Language.ES]: {
    // General
    tituloPrincipal: "Itinerario Familiar por Argentina",
    idioma: "Idioma:",
    moneda: "Moneda:",
    explore_btn: "Explorar más detalles",
    volverItinerario: "Volver al Itinerario",
    loading: "Cargando...",
    error: "Error",
    generating: "Generando...",
    duration_not_specified: "Duración no especificada",
    scroll_to_top_label: "Volver arriba",
    share_app_label: "Compartir aplicación",
    share_popover_title: "Compartir Enlace",
    share_popover_copy_button: "Copiar",
    share_popover_copied_message: "¡Copiado!",
    share_popover_copy_failed_message: "Presiona Ctrl+C para copiar",
    link_copied: "¡Enlace copiado al portapapeles!",
    // Top Bar
    // Home Page
    bienvenidaPrincipal: "¡Bienvenidos! Haz clic en cada ciudad para ver información, mapas y recomendaciones.",
    transporte: "Transporte entre ciudades",
    desde: "Desde",
    hasta: "Hasta",
    medio: "Medio",
    tiempo: "Tiempo",
    precio: "Precio aprox.",
    compania: "Compañía",
    mapaInteractivoTitulo: "Mapa Interactivo del Viaje",
    mapaInteractivoBienvenida: "Recorre el itinerario familiar por Argentina. Haz clic en cada ciudad para detalles.",
    // Packing List
    packing_title: "Lista de equipaje",
    packing_add: "Agregar",
    packing_essential: "Esenciales",
    packing_optional: "Opcionales",
    packing_placeholder: "¿Qué más llevás?",
    packing_list_empty: "Esta lista está vacía. ¡Empieza a añadir artículos!",
    // AI Consultation (Homepage)
    iaTitulo: "Consulta a IA General",
    iaPlaceholder: "Haz tu pregunta sobre el viaje...",
    consultarBtn: "Consultar",
    iaError: "Error al contactar la IA. Intenta de nuevo más tarde.",
    iaProcessing: "Procesando tu consulta...",
    iaDescription: "Utiliza este asistente para hacer preguntas generales sobre Argentina, el clima, costumbres, o cualquier otra duda que tengas sobre el viaje.",
    ai_prompt_general: "Eres un asistente de viajes experto en Argentina. Responde a las preguntas del usuario sobre el país, su cultura, clima, consejos de viaje y cualquier otra duda general. Proporciona respuestas útiles, concisas y amigables para una familia que está planificando un viaje.",
    // Currency Converter
    conversorTitulo: "Conversor de moneda",
    convertirBtn: "Convertir",
    montoPlaceholder: "Monto",
    // Photo Album
    photo_album_title: "Álbum de Fotos Familiar",
    photo_album_description: "Un lugar para guardar los recuerdos de nuestro viaje. Haz clic en el botón '+' para añadir una nueva foto.",
    photo_album_add_button: "Añadir Foto",
    photo_album_placeholder_caption: "Recuerdo de {cityName}",
    photo_album_empty: "El álbum está vacío. ¡Añade la primera foto de la aventura!",
    photo_album_unclassified: "Sin clasificar",
    photo_album_trip_day: "Día",
    photo_album_edit_caption_label: "Editar leyenda",
    photo_album_delete_photo_label: "Eliminar foto",
    photo_album_confirm_delete: "¿Estás seguro de que quieres eliminar esta foto?",
    photo_album_add_details_title: "Añadir Detalles de la Foto",
    photo_album_city: "Ciudad",
    photo_album_date_taken: "Fecha de captura",
    photo_album_caption: "Leyenda",
    photo_album_cancel_button: "Cancelar",
    photo_album_save_button: "Guardar",
    // Flight Tickets
    flight_tickets_title: "Pasajes Aéreos Internacionales",
    flight_tickets_reservation: "Reserva",
    flight_tickets_airline_ref: "Ref. Aerolínea",
    flight_tickets_status: "Estado",
    flight_tickets_approved: "Aprobado",
    flight_tickets_passengers: "Pasajeros",
    flight_tickets_flights: "Detalles de Vuelos",
    flight_tickets_leg: "Tramo",
    flight_tickets_departure: "Salida",
    flight_tickets_arrival: "Llegada",
    flight_tickets_duration: "Duración",
    flight_tickets_connection_time: "Tiempo de Conexión",
    flight_tickets_baggage_allowance: "Equipaje Permitido (por pasajero)",
    flight_tickets_carry_on: "1 equipaje de mano (hasta 7kg)",
    flight_tickets_checked_bags: "2 maletas documentadas (hasta 23kg cada una)",
    // Weather Forecast
    weather_title: "Pronóstico del Clima",
    weather_select_city_label: "Seleccionar ciudad para ver el clima",
    weather_feels_like: "Sensación térmica",
    weather_humidity: "Humedad",
    weather_error_fetching: "No se pudo obtener el pronóstico. Inténtelo de nuevo más tarde.",
    weather_error_city_not_found: "Ciudad no encontrada.",

    // Section Titles for Detail Page
    section_title_dates_duration: "Fechas y Duración",
    section_title_must_see: "Lugares Imperdibles",
    section_title_activities_recommended: "Actividades Recomendadas",
    section_title_gastronomy_highlight: "Gastronomía Destacada",
    section_title_accommodation_examples: "Alojamiento (Ejemplos)",
    section_title_coordinates: "Coordenadas",
    section_title_family_tips: "Consejos para Familias",
    section_title_cultural_tips: "Tips Culturales",
    section_title_budget_table: "Presupuesto Orientativo",
    section_title_city_map: "Mapa de la Ciudad",
    gastronomy_restaurants_subtitle: "Restaurantes recomendados",
    gastronomy_cafes_subtitle: "Confiterías y cafés",
    table_header_restaurant: "Restaurante",
    table_header_cafe: "Confitería",
    table_header_type: "Tipo",
    table_header_gluten_free: "Sin Gluten",
    table_header_sugar_free: "Sin Azúcar",
    section_title_ai_event_finder: "Buscador de Eventos con IA",
    ai_event_finder_description: "Usa IA y Búsqueda de Google para encontrar eventos, festivales y mercados locales durante tu estadía en {cityName}. Las fechas se toman automáticamente del itinerario.",
    ai_event_finder_button: "Buscar Eventos",
    ai_event_finder_sources_title: "Fuentes:",
    ai_event_finder_no_sources: "No se encontraron fuentes.",
    ai_event_finder_error: "No se pudieron buscar eventos. Intenta de nuevo.",

    // Footer
    footerText: "Viaje Familiar Argentina. Todos los derechos reservados.",
    // City Detail Page (generic titles, specific content comes from city_id + key)
    activities: "Actividades Sugeridas", 
    accommodation: "Opciones de Alojamiento",
    budget: "Presupuesto Estimado", 

    // City Titles (used as keys in CITIES array)
    buenosaires_title: "Buenos Aires",
    rosario_title: "Rosario",
    bariloche_title: "Bariloche",
    mendoza_title: "Mendoza",
    malargue_title: "Malargüe",
    jujuy_title: "Jujuy",
    iguazu_title: "Puerto Iguazú",
    corrientes_title: "Corrientes",
    ibera_title: "Esteros del Iberá",

    // MAIN DESCRIPTIONS FOR CITY CARDS - Ensuring all cities have one
    buenosaires_desc_main: "Buenos Aires es la capital de la República Argentina, una ciudad cosmopolita, vibrante y con muchísimas propuestas para disfrutar en familia.",
    rosario_desc_main: "Rosario, la ciudad de la bandera, ofrece una rica historia, parques extensos y una vibrante vida cultural a orillas del río Paraná.",
    bariloche_desc_main: "San Carlos de Bariloche, la capital de los Lagos, es un destino de montaña en la Patagonia argentina, famoso por sus paisajes de bosques, lagos y montañas nevadas.",
    mendoza_desc_main: "Mendoza, la tierra del sol y del buen vino, se encuentra al pie de la Cordillera de los Andes, ofreciendo cultura vitivinícola y aventuras.",
    malargue_desc_main: "Malargüe, en el sur de Mendoza, es un destino de aventura y ciencia, conocido por sus paisajes volcánicos, cavernas y observatorios.",
    jujuy_desc_main: "La provincia de Jujuy, en el noroeste argentino, es una explosión de colores y cultura andina, famosa por sus montañas multicolores y pueblos ancestrales.",
    iguazu_desc_main: "Puerto Iguazú es la puerta de entrada a las majestuosas Cataratas del Iguazú, una de las Siete Maravillas Naturales del Mundo.",
    corrientes_desc_main: "Corrientes, a orillas del río Paraná, es un centro cultural vibrante, conocido por su carnaval, chamamé y rica historia.",
    ibera_desc_main: "Los Esteros del Iberá son uno de los humedales más importantes del mundo, un paraíso de biodiversidad ideal para el ecoturismo familiar.",

    // --- DATES & DURATIONS (from itinerario_detallado.md) ---
    buenosaires_dates_duration: "- **Estadía**: 26/09 al 29/09 (4 días)\n- **Llegada a Arg.**: 26/09/2025 de noche (EZE)\n- **Partida de Arg.**: 28/10/2025 (EZE)",
    rosario_dates_duration: "- **Estadía**: 30/09 al 03/10 (4 días)\n- **Cómo llegar**: Bus desde Buenos Aires.",
    bariloche_dates_duration: "- **Estadía**: 05/10 al 09/10 (5 días)\n- **Cómo llegar**: Bus nocturno desde Rosario.",
    mendoza_dates_duration: "- **Estadía**: 10/10 al 13/10 (4 días)\n- **Cómo llegar**: Vuelo desde Bariloche (BRC).",
    jujuy_dates_duration: "- **Estadía**: 14/10 al 18/10 (5 días)\n- **Cómo llegar**: Bus desde Mendoza.",
    iguazu_dates_duration: "- **Estadía**: 19/10 al 22/10 (4 días)\n- **Cómo llegar**: Vuelo desde Jujuy (JUJ).",
    ibera_dates_duration: "- **Estadía**: 23/10 al 24/10 (2 días)\n- **Cómo llegar**: Transfer desde Iguazú (IGR).",
    corrientes_dates_duration: "- **Estadía**: 25/10 al 27/10 (3 días)\n- **Cómo llegar**: Transfer desde Esteros del Iberá.",
    malargue_dates_duration: "- **Nota**: Visitar como excursión desde Mendoza.",

    // BUENOS AIRES (Detailed content)
    buenosaires_must_see: "- [Obelisco y Avenida 9 de Julio](https://es.wikipedia.org/wiki/Obelisco_de_Buenos_Aires)\n- [Teatro Colón (visitas guiadas)](https://teatrocolon.org.ar/es)\n- [Caminito y el colorido barrio de La Boca](https://es.wikipedia.org/wiki/Caminito)\n- [Palermo: bosques, Jardín Japonés, Planetario, museos, cafés y tiendas](https://es.wikipedia.org/wiki/Palermo_(Buenos_Aires))\n- [Puerto Madero y Reserva Ecológica](https://es.wikipedia.org/wiki/Puerto_Madero)\n- [Museo Nacional de Bellas Artes](https://www.bellasartes.gob.ar/)\n- [Recoleta: Cementerio histórico, feria de artesanos y cafés](https://turismo.buenosaires.gob.ar/es/otros-lugares/cementerio-de-la-recoleta)\n- [Plaza de Mayo y Casa Rosada](https://es.wikipedia.org/wiki/Plaza_de_Mayo)\n- **Excursión de día:** [Paseo por el Delta del Tigre](https://www.vivitigre.gob.ar/)\n- **Excursión de día:** [Campanópolis, la aldea medieval](https://www.campanopolis.com.ar/)",
    buenosaires_activities_recommended: "- Tango y espectáculos típicos (San Telmo o La Boca)\n- Tours guiados a pie o en bicicleta\n- Picnic en los bosques de Palermo\n- Visita a museos y ferias artesanales\n- Paseo en barco por el Río de la Plata (Puerto Madero)",
    buenosaires_gastronomy_highlight: "La ciudad ofrece desde parrillas tradicionales hasta restaurantes gourmet, opciones vegetarianas/veganas y cafeterías históricas.\n\n### Restaurantes recomendados\n| Restaurante | Tipo | Sin Gluten | Sin Azúcar |\n|---|---|---|---|\n| [Don Julio](https://www.parrilladonjulio.com/) | Parrilla clásica | check | cross |\n| [Sacro](https://www.sacro.restaurant/) | Vegano gourmet | check | check |\n| [Bio Restaurante](https://www.biorestaurante.com/) | Orgánico | check | check |\n| [Paru Inkas Sushi & Grill](https://parurestaurant.com/) | Fusión Peruano-Japonesa | check | cross |\n\n### Confiterías y cafés\n| Confitería | Tipo | Sin Gluten | Sin Azúcar |\n|---|---|---|---|\n| [Café Tortoni](https://www.cafetortoni.com.ar/) | Histórico / Clásico | cross | cross |\n| [Havanna](https://www.havanna.com.ar/) | Alfajores / Café | check | check |\n| [Confitería Ideal](https://www.confiteriaideal.com/) | Repostería Tradicional | cross | cross |",
    buenosaires_accommodation_examples: "- [Loi Suites Esmeralda](https://www.loisuites.com.ar/es/hotel-esmeralda-buenos-aires)\n- Alvear Palace\n- Madero\n- Ibis\n- Airbnb Palermo",
    buenosaires_coordinates: "- 34° 36' S 58° 22' 48\" W",
    buenosaires_family_tips: "- Las zonas turísticas son seguras y están bien conectadas por transporte público (tarjeta SUBE).\n- Hay muchas actividades gratuitas y para todas las edades.\n- Los fines de semana suelen haber espectáculos callejeros y ferias.\n- Se recomienda reservar alojamiento con anticipación en Palermo o Recoleta.",
    buenosaires_cultural_tips: "- El idioma oficial es español (rioplatense, muy amigable).\n- Es común saludar con un beso en la mejilla.\n- Los horarios de comida suelen ser más tarde que en otros países (cena desde las 21:00).\n- El mate es la infusión nacional.",
    buenosaires_map_link_text: "Ver mapa más grande de Buenos Aires",
    buenosaires_map_link_url: "https://www.openstreetmap.org/#map=12/-34.60/-58.45",
    buenosaires_poi_obelisco_name: "Obelisco",
    buenosaires_poi_obelisco_desc: "Monumento histórico en la Av. 9 de Julio.",
    buenosaires_poi_teatrocolon_name: "Teatro Colón",
    buenosaires_poi_teatrocolon_desc: "Uno de los teatros de ópera más importantes del mundo.",
    buenosaires_poi_caminito_name: "Caminito",
    buenosaires_poi_caminito_desc: "Calle museo colorida en La Boca.",
    buenosaires_poi_palermo_name: "Bosques de Palermo",
    buenosaires_poi_palermo_desc: "Gran parque urbano con lagos y rosedal.",
    buenosaires_poi_planetario_name: "Planetario Galileo Galilei",
    buenosaires_poi_planetario_desc: "Centro de divulgación astronómica.",
    buenosaires_poi_puertomadero_name: "Puerto Madero",
    buenosaires_poi_puertomadero_desc: "Moderno barrio portuario con restaurantes y el Puente de la Mujer.",
    buenosaires_poi_bellasartes_name: "Museo Nacional de Bellas Artes",
    buenosaires_poi_bellasartes_desc: "Principal museo de arte de Argentina.",
    buenosaires_poi_recoleta_name: "Cementerio de la Recoleta",
    buenosaires_poi_recoleta_desc: "Cementerio histórico con mausoleos imponentes.",
    buenosaires_poi_plazamayo_name: "Plaza de Mayo",
    buenosaires_poi_plazamayo_desc: "Centro histórico y político de la ciudad, frente a la Casa Rosada.",

    // AI Section Titles, Descriptions, Prompts, Placeholders (ES)
    ai_menu_title: "Generador de Menú Saludable",
    ai_menu_description: "Chatea con un experto en nutrición para crear un menú diario (desayuno, almuerzo, cena) adaptado a tus necesidades (bajo en carbohidratos, para diabéticos, sin gluten) con el sabor de {cityName}.",
    ai_menu_button: "Generar Menú",
    ai_menu_input_placeholder: "Pide un menú vegano, sin pescado...",
    buenosaires_ai_prompt_menu: "Eres un experto en gastronomía argentina y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Buenos Aires. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten. Incorpora platos típicos argentinos adaptados.",
    rosario_ai_prompt_menu: "Eres un experto en gastronomía argentina y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Rosario. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos, sin gluten si es posible, e inspiradas en la cocina local (ej. pescado de río).",
    bariloche_ai_prompt_menu: "Eres un experto en gastronomía patagónica y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Bariloche. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten. Incluye ejemplos de platos locales como trucha o cordero adaptados.",
    mendoza_ai_prompt_menu: "Eres un experto en gastronomía cuyana y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Mendoza. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten, destacando ingredientes locales y maridajes con vino (para adultos, claro).",
    malargue_ai_prompt_menu: "Eres un experto en gastronomía cuyana y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Malargüe. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten, destacando el chivito local adaptado.",
    jujuy_ai_prompt_menu: "Eres un experto en gastronomía andina y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Jujuy. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten, utilizando ingredientes como quinoa, llama (adaptada) o maíz.",
    iguazu_ai_prompt_menu: "Eres un experto en gastronomía misionera y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Puerto Iguazú. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten, incluyendo pescados de río o frutas tropicales.",
    corrientes_ai_prompt_menu: "Eres un experto en gastronomía litoraleña y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Corrientes. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten, con pescados de río como dorado o surubí.",
    ibera_ai_prompt_menu: "Eres un experto en gastronomía regional de los Esteros del Iberá y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita Iberá. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten, basadas en cocina casera y productos locales.",
    generic_ai_prompt_menu: "Eres un experto en gastronomía argentina y nutrición. Tu misión es generar un plan de menú de un día (desayuno, almuerzo, cena) para una familia que visita {cityName}. Las opciones deben ser aptas para diabéticos, bajas en carbohidratos y, si es posible, sin gluten. Incorpora platos típicos locales adaptados.",
    
    ai_accommodation_title: "Sugerencias de Alojamiento con IA",
    ai_accommodation_description: "Chatea con un asistente de viajes para obtener recomendaciones de alojamiento en {cityName}, considerando opciones familiares, seguras y bien ubicadas.",
    ai_accommodation_button: "Generar Sugerencias",
    ai_accommodation_input_placeholder: "Pide opciones con piscina, cerca del centro...",
    buenosaires_ai_prompt_accommodation: "Eres un asistente de viajes experto en Buenos Aires. Tu misión es generar 3-5 sugerencias de alojamiento en Buenos Aires, ideales para una familia con 2 hijos. Considera opciones seguras, bien ubicadas y con servicios adecuados para familias. Incluye diferentes tipos (hoteles, apartamentos, Airbnb).",
    malargue_ai_prompt_accommodation: "Eres un asistente de viajes experto. Tu misión es generar 3-5 sugerencias de alojamiento en Malargüe, ideales para una familia con 2 hijos. Considera opciones seguras y adecuadas para familias que buscan aventura. Incluye diferentes tipos (hoteles, cabañas).",
    generic_ai_prompt_accommodation: "Eres un asistente de viajes experto. Tu misión es generar 3-5 sugerencias de alojamiento en {cityName}, ideales para una familia con 2 hijos. Considera opciones seguras, bien ubicadas y con servicios adecuados para familias. Incluye diferentes tipos (hoteles, apartamentos, Airbnb).",
    
    ai_family_tips_title: "Consejos Adicionales para Familias con IA",
    ai_family_tips_description: "Chatea con un guía turístico experto para recibir consejos personalizados para disfrutar {cityName} en familia, incluyendo actividades, seguridad y logística.",
    ai_family_tips_button: "Generar Consejos",
    ai_family_tips_input_placeholder: "Indica edades de los niños o intereses...",
    buenosaires_ai_prompt_family_tips: "Eres un guía turístico experto en Buenos Aires para familias. Tu misión es proporcionar 5 consejos prácticos y personalizados para una familia con niños que visita Buenos Aires. Cubre actividades para niños, seguridad, transporte familiar y cómo maximizar la estadía.",
    malargue_ai_prompt_family_tips: "Eres un guía turístico experto para familias. Tu misión es proporcionar 5 consejos prácticos y personalizados para una familia con niños que visita Malargüe. Cubre actividades de aventura (con precauciones), ciencia y logística.",
    generic_ai_prompt_family_tips: "Eres un guía turístico experto para familias. Tu misión es proporcionar 5 consejos prácticos y personalizados para una familia con niños que visita {cityName}. Cubre actividades para niños, seguridad, transporte familiar y cómo maximizar la estadía.",
    
    ai_budget_analysis_title: "Análisis de Presupuesto con IA",
    ai_budget_analysis_description: "Chatea con un asesor financiero para obtener un análisis del presupuesto orientativo para tu estadía en {cityName}, con posibles optimizaciones.",
    ai_budget_analysis_button: "Analizar Presupuesto",
    ai_budget_analysis_input_placeholder: "Menciona tu presupuesto total o prioridades...",
    buenosaires_ai_prompt_budget_analysis: "Eres un asesor financiero de viajes. Tu misión es analizar el presupuesto orientativo para una familia en Buenos Aires (USD): Alojamiento (noche): 50-120, Comida (día): 30-70, Transporte (día): 3-5, Actividades (día): 20-50, Entradas: 0-15. Proporciona un desglose estimado por día y categoría, y sugiere 2-3 formas de optimizar este presupuesto sin sacrificar la experiencia.",
    malargue_ai_prompt_budget_analysis: "Eres un asesor financiero de viajes. Tu misión es analizar el presupuesto orientativo para una familia en Malargüe. Consulta el presupuesto detallado de la ciudad, proporciona un desglose estimado por día y categoría, y sugiere 2-3 formas de optimizar este presupuesto.",
    generic_ai_prompt_budget_analysis: "Eres un asesor financiero de viajes. Tu misión es analizar el presupuesto orientativo para una familia en {cityName}. Consulta el presupuesto detallado de la ciudad, proporciona un desglose estimado por día y categoría, y sugiere 2-3 formas de optimizar este presupuesto sin sacrificar la experiencia.",
    
    // AI Chat and Translation
    ai_chat_send_button: "Enviar",
    ai_chat_input_placeholder: "Escribe tu mensaje...",
    ai_translate_button_text: "Traducir a {lang}",
    ai_translated_from_label: "Traducido de {lang}:",
    language_name_es: "Español",
    language_name_he: "Hebreo",

    // ROSARIO (Detailed content)
    rosario_must_see: "- [Monumento Nacional a la Bandera](https://www.monumentoalabandera.gob.ar/)\n- [Parque de la Independencia](https://www.rosario.gob.ar/web/ciudad/parques-y-plazas/parque-de-la-independencia)\n- Costanera del Río Paraná\n- [Isla de los Inventos](https://www.rosario.gob.ar/web/ciudad/cultura/infancia-y-juventud/isla-de-los-inventos)\n- Museo de Ciencias Naturales \"Dr. Ángel Gallardo\"\n- Boulevard Oroño",
    rosario_activities_recommended: "- Visitar el Monumento a la Bandera y subir a su mirador.\n- Paseos en barco por el Río Paraná y sus islas.\n- Alquilar bicicletas para recorrer la Costanera y los parques.\n- Actividades recreativas en la Isla de los Inventos o la Granja de la Infancia.\n- Disfrutar de un picnic en los grandes parques de la ciudad.\n- Visitas a museos adaptados para niños.",
    rosario_gastronomy_highlight: "Rosario es conocida por su gastronomía variada, con opciones que van desde las tradicionales parrillas y la carne a la estaca, hasta platos de pescado de río fresco y una creciente oferta de cocina moderna y saludable.\n\n### Restaurantes recomendados\n| Restaurante | Tipo | Sin Gluten | Sin Azúcar |\n|---|---|---|---|\n| Don Ferro | Parrilla con vista al río | check | cross |\n| Rock & Feller's | Americano / Familiar | check | cross |\n| Chinchibira | Cocina de autor / Fusión | check | check |\n| El Viejo Balcón | Pescados de río | check | cross |\n\n### Confiterías y cafés\n| Confitería | Tipo | Sin Gluten | Sin Azúcar |\n|---|---|---|---|\n| El Cairo | Histórico / Literario | cross | cross |\n| Gofre | Waffles y pastelería | check | check |\n| Sunderland | Tradicional / Clásico | cross | cross |",
    rosario_accommodation_examples: "- Estadía en casa de familiares\n- Ros Tower Hotel\n- Esplendor by Wyndham Savoy Rosario\n- Apartamentos en el centro o cerca de la Costanera\n- Airbnb en barrios residenciales como Fisherton o Pichincha",
    rosario_coordinates: "- 32° 57' S 60° 38' O",
    rosario_family_tips: "- Aprovechen los amplios espacios verdes y la costanera para actividades al aire libre.\n- El transporte público es eficiente (tarjeta MOVI).\n- La ciudad es segura en las zonas turísticas y céntricas.\n- Consideren un paseo en barco para ver la ciudad desde el río.\n- En la Costanera hay muchas opciones de restaurantes con juegos para niños.",
    rosario_cultural_tips: "- El \"Che\" Guevara nació cerca de Rosario.\n- Rosario es cuna de grandes futbolistas (Messi, Di María) y artistas.\n- La siesta es común en las horas centrales del día, afectando horarios comerciales.\n- Los rosarinos son conocidos por su hospitalidad.",
    rosario_map_link_text: "Ver mapa más grande de Rosario",
    rosario_map_link_url: "https://www.openstreetmap.org/#map=12/-32.944/-60.655",
    
    // BARILOCHE (Detailed content)
    bariloche_must_see: "- **Centro Cívico**: Corazón de la ciudad con arquitectura alpina.\n- **Lago Nahuel Huapi**: Para paseos en barco y actividades acuáticas.\n- **Circuito Chico**: Recorrido panorámico con vistas espectaculares.\n- **Cerro Catedral**: Centro de esquí en invierno, trekking y vistas en verano.\n- **Cerro Campanario**: Votado entre las mejores vistas del mundo, con aerosilla.\n- **Bosque de Arrayanes**: Un bosque único al que se llega en barco.\n- **Puerto Blest y Cascada de los Cántaros**: Excursión en barco por el lago.",
    bariloche_activities_recommended: "- Degustación de chocolates y cervezas artesanales.\n- Navegación por el Lago Nahuel Huapi.\n- Trekking y senderismo (adaptados para familias).\n- Deportes de nieve en invierno (esquí, snowboard, culipatin).\n- Cabalgatas o canopy en los alrededores.\n- Visita a la Colonia Suiza para probar el curanto.\n- Recorrer el Circuito Chico en auto o bicicleta.",
    bariloche_gastronomy_highlight: "La gastronomía de Bariloche es famosa por sus chocolates, carnes de caza (ciervo, jabalí), truchas y ahumados. También hay opciones saludables y para dietas especiales.\n\n### Restaurantes recomendados\n| Restaurante             | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| El Boliche de Alberto   | Parrilla / Carnes          | check        | cross         |\n| La Fonda del Tío        | Comida patagónica casera   | check        | check         |\n| Butterfly               | Alta cocina / Trucha       | check        | check         |\n| Rapa Nui                | Chocolatería / Cafetería   | check        | check         |\n\n### Confiterías y cafés\n| Confitería              | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| Mamuschka               | Chocolatería / Pastelería  | check        | check         |\n| Abuela Goye             | Chocolatería / Cafetería   | check        | check         |\n| El Almacén de Flores    | Café de especialidad       | check        | check         |",
    bariloche_accommodation_examples: "- [Villa Huinid Hotel Bustillo](https://www.villahuinid.com.ar/hotel-bustillo)\n- Hotel Llao Llao (lujo)\n- Hotel Panamericano Bariloche\n- Cabañas y complejos turísticos con actividades para niños\n- Airbnb en el centro o cerca del Circuito Chico",
    bariloche_coordinates: "- 41° 08' S 71° 18' O",
    bariloche_family_tips: "- Vístanse en capas (la temperatura puede variar mucho).\n- Reserven excursiones y alojamiento con anticipación, especialmente en temporada alta.\n- Hay muchas actividades para niños: parques de nieve, senderos fáciles, paseos en barco.\n- La zona es muy segura para explorar en familia.\n- Prueben los chocolates locales, pero con moderación si hay restricciones.",
    bariloche_cultural_tips: "- Bariloche tiene una fuerte influencia de inmigrantes suizos y alemanes, visible en su arquitectura y gastronomía.\n- Es un destino popular para viajes de egresados, por lo que puede haber muchos jóvenes en ciertas épocas.\n- La cultura de montaña es muy arraigada: respeto por la naturaleza, deportes al aire libre.",
    bariloche_map_link_text: "Ver mapa más grande de Bariloche",
    bariloche_map_link_url: "https://www.openstreetmap.org/#map=12/-41.133/-71.328",

    // MENDOZA (Detailed content)
    mendoza_must_see: "- **Parque General San Martín**: Uno de los parques urbanos más grandes de Sudamérica, con lago y rosedal.\n- **Cerro de la Gloria**: Mirador con vistas panorámicas de la ciudad y los Andes.\n- **Bodegas de Luján de Cuyo y Maipú**: Para tours de vino y, algunas, con actividades para niños.\n- **Puente del Inca**: Curiosidad natural en el camino a la alta montaña.\n- **Excursión a Malargüe**: Para visitar la **Caverna de las Brujas** y la reserva **La Payunia** (requiere día completo y vehículo adecuado).",
    mendoza_activities_recommended: "- Recorrido por bodegas con degustación (algunas ofrecen jugos y actividades para niños).\n- Visita a la alta montaña, incluyendo el Parque Provincial Aconcagua (mirador).\n- Rafting en el Río Mendoza (para edades adecuadas).\n- Paseo en bicicleta por los viñedos.\n- Viaje en auto a Malargüe para explorar sus paisajes volcánicos.\n- Caminatas y picnics en el Parque San Martín.\n- Exploración de la ciudad a pie, visitando sus plazas y calles arboladas.",
    mendoza_gastronomy_highlight: "Mendoza es un paraíso gastronómico, famoso por sus carnes a la parrilla, olivas y, por supuesto, la vasta oferta de vinos. Muchos restaurantes en bodegas ofrecen opciones de alta cocina.\n\n### Restaurantes recomendados\n| Restaurante             | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| Siete Cocinas           | Cocina regional / de autor | check        | check         |\n| Azafrán                 | Alta cocina con maridaje   | check        | check         |\n| La Marchigiana          | Cocina italiana clásica    | check        | cross         |\n| Bodega Zuccardi (Piedra Infinita) | Experiencia gourmet en bodega | check        | check         |\n\n### Confiterías y cafés\n| Confitería              | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| Mamma Mia               | Pastelería / Cafetería     | check        | check         |\n| Havanna (varias sucursales) | Alfajores / Café          | check        | check         |\n| The Bazaar Bar          | Café de especialidad       | check        | check         |",
    mendoza_accommodation_examples: "- [Mod Hotels Mendoza](https://www.modhotels.com.ar/)\n- Park Hyatt Mendoza\n- Diplomatic Hotel Mendoza\n- Cabañas o lodges en Chacras de Coria o Luján de Cuyo (zona de bodegas)\n- Airbnb en el centro o en barrios residenciales tranquilos.",
    mendoza_coordinates: "- 32° 53' S 68° 50' O",
    mendoza_family_tips: "- Consideren alquilar un auto para explorar las bodegas y la alta montaña a su propio ritmo.\n- Siempre lleven agua y protector solar, el clima es seco y soleado.\n- Algunas bodegas tienen áreas de juego o actividades para niños mientras los adultos degustan.\n- La ciudad es muy arbolada y con canales de riego, lo que la hace agradable para caminar.\n- En la alta montaña, las temperaturas pueden bajar considerablemente, incluso en verano.",
    mendoza_cultural_tips: "- La cultura del vino es central en Mendoza.\n- La \"siesta\" es una costumbre muy arraigada, con muchos comercios cerrando al mediodía.\n- Los mendocinos son muy orgullosos de su provincia y su producción vitivinícola.\n- La calidez de su gente es notable.",
    mendoza_map_link_text: "Ver mapa más grande de Mendoza",
    mendoza_map_link_url: "https://www.openstreetmap.org/#map=12/-32.889/-68.846",
    
    // MALARGUE (Detailed content)
    malargue_must_see: "- **Caverna de las Brujas**: Un sistema de cuevas con formaciones impresionantes.\n- **Reserva Provincial La Payunia**: Paisajes desérticos con volcanes.\n- **Observatorio Pierre Auger**: Uno de los observatorios de rayos cósmicos más importantes del mundo.\n- **Planetario Malargüe**: Para aprender sobre astronomía.",
    malargue_activities_recommended: "- Espeleología en la Caverna de las Brujas.\n- Trekking en La Payunia.\n- Visitas guiadas al Observatorio Pierre Auger.\n- Disfrutar de la gastronomía local, como el chivito.",
    malargue_gastronomy_highlight: "La gastronomía de Malargüe se centra en productos locales, especialmente el chivito (cabra joven) asado. También hay opciones de cocina regional y platos sencillos pero sabrosos.\n\n### Restaurantes recomendados\n| Restaurante | Tipo | Sin Gluten | Sin Azúcar |\n|---|---|---|---|\n| La Posta del Chivito | Parrilla / Chivito | check | cross |\n| El Bodegón de María | Comida casera regional | check | check |",
    malargue_accommodation_examples: "- Hotel Malargüe Inn & Suites\n- Cabañas en los alrededores\n- Hosterías y posadas locales",
    malargue_coordinates: "- 35° 28' S 69° 35' O",
    malargue_family_tips: "- Ideal para familias aventureras y con interés en la ciencia.\n- Las excursiones a La Payunia requieren vehículos 4x4 y guías.\n- Reservar la visita a Caverna de las Brujas con anticipación, tiene cupos limitados.",
    malargue_cultural_tips: "- Malargüe tiene una fuerte identidad ligada a la cría de cabras y la astronomía.\n- Es un destino menos masivo que otros en Mendoza, ofreciendo una experiencia más auténtica.",
    malargue_map_link_text: "Ver mapa más grande de Malargüe",
    malargue_map_link_url: "https://www.openstreetmap.org/#map=13/-35.476/-69.589",

    // JUJUY (Detailed content)
    jujuy_must_see: "- **Quebrada de Humahuaca**: Patrimonio de la Humanidad, con paisajes como la Paleta del Pintor en Maimará y el Cerro de los Siete Colores en Purmamarca.\n- **Purmamarca**: Pueblo pintoresco al pie del Cerro de los Siete Colores.\n- **Tilcara**: Ciudad con la Pucará (fortaleza prehispánica) y museos.\n- **Humahuaca**: Histórica ciudad con su Monumento a la Independencia y la Torre del Cabildo.\n- **Salinas Grandes**: Desierto de sal inmenso (compartido con Salta, accesible desde Purmamarca).\n- **Garganta del Diablo (Tilcara)**: Formación rocosa con cascada.\n- **San Salvador de Jujuy**: La capital, con su casco histórico y la Casa de Gobierno.",
    jujuy_activities_recommended: "- Recorridos por los pueblos de la Quebrada y sus mercados artesanales.\n- Caminatas suaves en Purmamarca o Tilcara.\n- Visita a la Pucará de Tilcara.\n- Excursión a Salinas Grandes (llevar protector solar y gafas de sol).\n- Observación de estrellas en la Quebrada (poca contaminación lumínica).\n- Disfrutar de la música folclórica y las danzas locales.\n- Probar las empanadas jujeñas y tamales.",
    jujuy_gastronomy_highlight: "La gastronomía jujeña es una fusión de sabores andinos y criollos, con platos a base de maíz, papa, llama y cabra. Las opciones sin gluten y bajas en carbohidratos pueden requerir adaptación en platos tradicionales, pero siempre hay alternativas con carnes y verduras.\n\n### Restaurantes recomendados\n| Restaurante             | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| El Patio de la Empanada | Comida regional / Empanadas | check        | cross         |\n| La Cocina del Colorado  | Cocina andina tradicional  | check        | check         |\n| Killa                  | Cocina de autor / Regional | check        | check         |\n\n### Confiterías y cafés\n| Confitería              | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| (Opciones locales)      | Panaderías / Cafés         | cross         | cross         |\n| Mercados artesanales    | Productos locales          | check        | check         |",
    jujuy_accommodation_examples: "- [Howard Johnson Plaza Jujuy](https://hojujuy.com.ar/)\n- Hoteles boutique en Purmamarca o Tilcara.\n- Estancias y hosterías rurales en la Quebrada.\n- Hoteles en San Salvador de Jujuy para mayor oferta.\n- Airbnb en casas de adobe tradicionales.",
    jujuy_coordinates: "- San Salvador de Jujuy: 24° 11' S 65° 18' O\n- Purmamarca: 23° 44' S 65° 30' O",
    jujuy_family_tips: "- La altura puede afectar a algunos viajeros (San Salvador está a ~1200m, Purmamarca a ~2300m, Humahuaca a ~3000m, Salinas Grandes a ~3500m). Hidrátense bien y caminen despacio los primeros días.\n- Lleven protector solar, sombrero y gafas de sol, la radiación solar es alta.\n- Vístanse en capas, las temperaturas varían mucho entre el día y la noche.\n- El alquiler de auto es recomendable para recorrer la Quebrada con libertad.\n- Siempre tengan cambio y billetes pequeños, especialmente en mercados locales.",
    jujuy_cultural_tips: "- La cultura andina es muy presente: respeto a la Pachamama (Madre Tierra), rituales, música (quenas, charangos).\n- El idioma español con influencia quechua es común.\n- La artesanía local es muy rica: textiles de llama/alpaca, cerámicas, trabajos en madera.\n- La amabilidad de la gente es una característica destacada.",
    jujuy_map_link_text: "Ver mapa más grande de Jujuy",
    jujuy_map_link_url: "https://www.openstreetmap.org/#map=10/-23.597/-65.405",
    
    // IGUAZU (Detailed content)
    iguazu_must_see: "- **Parque Nacional Iguazú (lado argentino)**: Con pasarelas sobre las cataratas, la Garganta del Diablo y el Tren Ecológico.\n- **Parque Nacional do Iguaçu (lado brasileño)**: Ofrece una vista panorámica impresionante de las cataratas.\n- **Hito de las Tres Fronteras**: Punto de encuentro de Argentina, Brasil y Paraguay.\n- **Güira Oga (Refugio de Animales Silvestres)**: Centro de rescate y rehabilitación de fauna.\n- **Jardín de los Picaflores**: Un lugar mágico para observar colibríes de cerca.\n- **Aripuca**: Un emprendimiento turístico cultural que revaloriza el bosque misionero.\n- **Museo de Cera**: Atracción familiar.",
    iguazu_activities_recommended: "- Caminatas por las pasarelas del lado argentino y brasileño de las cataratas.\n- Gran Aventura (paseo en gomón bajo las cataratas) – apto para edades adecuadas y sin restricciones de salud.\n- Navegación al atardecer por el río Iguazú.\n- Visita al Hito de las Tres Fronteras al atardecer.\n- Recorrer el Duty Free Shop (lado argentino).\n- Visitar el Parque das Aves (lado brasileño, si se cruza la frontera).\n- Explorar el Parque Nacional por sus diversos senderos.",
    iguazu_gastronomy_highlight: "La gastronomía en Puerto Iguazú ofrece una mezcla de cocina regional (pescados de río, mandioca), con opciones de comida internacional y parrillas. Es importante buscar lugares que ofrezcan variedad y preguntar por opciones para dietas especiales.\n\n### Restaurantes recomendados\n| Restaurante             | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| La Vaca Enamorada       | Parrilla / Carnes          | check        | cross         |\n| Aqva Restaurant         | Cocina de autor / Fusión   | check        | check         |\n| Lo de Juan              | Pescados de río / Regional | check        | cross         |\n| El Quincho del Tío Querido | Parrilla / Show folclórico | check        | cross         |\n\n### Confiterías y cafés\n| Confitería              | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| Café Central            | Cafetería / Panadería      | cross         | cross         |\n| Heladería Cremolatti    | Helados                    | check        | check         |",
    iguazu_accommodation_examples: "- [Mercure Iguazu Hotel Iru](https://all.accor.com/hotel/B1R5/index.es.shtml)\n- Gran Meliá Iguazú (dentro del Parque Nacional)\n- Amerian Portal del Iguazú\n- Hoteles y posadas más pequeños en el centro de Puerto Iguazú\n- Airbnb o cabañas en zonas más tranquilas.",
    iguazu_coordinates: "- Puerto Iguazú: 25° 36' S 54° 34' O\n- Cataratas del Iguazú: 25° 40' S 54° 26' O",
    iguazu_family_tips: "- Lleven repelente de insectos (fundamental), protector solar, sombrero y ropa liviana.\n- Usen calzado cómodo y antideslizante para las pasarelas.\n- En la Gran Aventura, se mojarán por completo; lleven ropa de recambio.\n- Si planean cruzar a Brasil, verifiquen los requisitos de visa y pasaporte para todos los integrantes de la familia.\n- Los monos y coatíes son comunes en el parque, no los alimenten ni los toquen.\n- El agua embotellada es recomendable.",
    iguazu_cultural_tips: "- La cultura de la región está muy influenciada por las tres fronteras (Argentina, Brasil, Paraguay).\n- El guaraní es un idioma cooficial en algunas zonas, aunque el español es dominante.\n- La mandioca es un alimento básico en la dieta local.\n- La calidez del clima se refleja en el ritmo de vida.",
    iguazu_map_link_text: "Ver mapa más grande de Puerto Iguazú",
    iguazu_map_link_url: "https://www.openstreetmap.org/#map=13/-25.594/-54.467",

    // IBERA (Detailed content)
    ibera_must_see: "- **Laguna Iberá**: Principal espejo de agua para las excursiones en lancha.\n- **Pasarelas de la Laguna Iberá**: Senderos elevados para observar la fauna.\n- **Centro de Interpretación de los Esteros**: Información sobre el ecosistema y la fauna.\n- **Miradores de aves**: Puntos estratégicos para la observación de aves.\n- **Pueblo de Colonia Carlos Pellegrini**: El punto de acceso turístico, con sus posadas y tranquilidad.\n- **Senderos de interpretación ambiental**: Para caminar y aprender sobre la flora y fauna local.",
    ibera_activities_recommended: "- Safaris en lancha por la Laguna Iberá para avistar yacarés, carpinchos, ciervos de los pantanos y aves.\n- Caminatas guiadas por los senderos para observar la fauna terrestre.\n- Safaris nocturnos (opcional, para ver animales de hábitos nocturnos).\n- Cabalgatas por los alrededores (para edades adecuadas).\n- Paseos en canoa o kayak (en zonas permitidas y con guía).\n- Avistaje de aves.\n- Disfrutar de la tranquilidad y el contacto con la naturaleza.",
    ibera_gastronomy_highlight: "La gastronomía en Iberá se basa en la cocina casera y regional, con ingredientes frescos de la zona. Las posadas suelen ofrecer pensión completa con platos típicos, a menudo adaptándose a necesidades dietéticas específicas si se avisa con antelación.\n\n### Restaurantes recomendados (Generalmente en Posadas)\n| Restaurante             | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| Posada de la Laguna     | Comida casera / Regional   | check        | check         |\n| Irupé Lodge             | Comida casera / Regional   | check        | check         |\n| Rincón del Carpincho    | Comida casera / Regional   | check        | check         |\n\n### Confiterías y cafés\n| Confitería              | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| (Opciones limitadas)    | Principalmente en posadas  | check        | check         |\n| Minimercados            | Para abastecerse           | check        | check         |",
    ibera_accommodation_examples: "- [Posada Aguapé](https://www.posadaaguape.com/)\n- Posada de la Laguna\n- Irupé Lodge\n- Cabañas y hospedajes rurales en Colonia Carlos Pellegrini\n- Camping (para los más aventureros).",
    ibera_coordinates: "- Colonia Carlos Pellegrini: 28° 32' S 57° 11' O",
    ibera_family_tips: "- **Repelente de insectos es ABSOLUTAMENTE CRUCIAL.** Llevar en gran cantidad.\n- Protector solar, sombrero y ropa de manga larga para protegerse del sol y los insectos.\n- Binoculares para observar aves y fauna.\n- Reserven alojamiento y excursiones con mucha anticipación, la oferta es limitada.\n- La mayoría de las actividades son al aire libre; estén preparados para diferentes condiciones climáticas.\n- Ideal para niños interesados en la naturaleza y los animales.",
    ibera_cultural_tips: "- La cultura guaraní y el respeto por la naturaleza son muy fuertes.\n- El ritmo de vida es tranquilo y en contacto con la naturaleza.\n- La hospitalidad de los lugareños es destacada.\n- Aprender algunas palabras en guaraní puede ser divertido para los niños.",
    ibera_map_link_text: "Ver mapa más grande de Esteros del Iberá (Colonia Carlos Pellegrini)",
    ibera_map_link_url: "https://www.openstreetmap.org/#map=13/-28.537/-57.140",

    // CORRIENTES (Detailed content)
    corrientes_must_see: "- **Costanera General San Martín**: Para paseos, atardeceres sobre el río y recreación.\n- **Puente General Belgrano**: Emblemático puente que conecta Corrientes con Resistencia.\n- **Museo Provincial de Bellas Artes \"Dr. Juan Ramón Vidal\"**: Con obras de artistas correntinos.\n- **Teatro Oficial Juan de Vera**: Joya arquitectónica con una importante agenda cultural.\n- **Manzana Franciscana**: Complejo histórico-religioso.\n- **Carnaval de Corrientes**: Si la visita coincide con la temporada (enero/febrero).\n- **Parque Mitre**: Uno de los pulmones verdes de la ciudad.",
    corrientes_activities_recommended: "- Paseos y deportes en la Costanera.\n- Visita al casco histórico y sus iglesias.\n- Disfrutar de un espectáculo de chamamé (música típica).\n- Explorar los mercados artesanales para comprar productos de cuero o cerámica.\n- Pesca deportiva en el río Paraná (con guías habilitados).\n- Visitar el Museo del Carnaval (en temporada baja).\n- Excursión de día completo a los Esteros del Iberá desde Corrientes (aunque pernoctar allí es lo ideal).",
    corrientes_gastronomy_highlight: "La gastronomía correntina está fuertemente influenciada por el río, con platos a base de pescado (dorado, surubí, pacú), y la tradición guaraní (mandioca, chipá). Hay opciones para todos los gustos, incluyendo parrillas y cocina internacional.\n\n### Restaurantes recomendados\n| Restaurante             | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| La Parrilla del Tío     | Parrilla / Carnes          | check        | cross         |\n| Pizzería La Previa      | Pizzería                   | cross         | cross         |\n| El Solar del Paraná     | Pescados de río / Regional | check        | cross         |\n| La Rosita               | Cocina casera              | check        | check         |\n\n### Confiterías y cafés\n| Confitería              | Tipo                       | Sin Gluten | Sin Azúcar |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| La Biela (local)        | Cafetería / Repostería     | cross         | cross         |\n| Café Martínez           | Cafetería (cadena)         | check        | check         |\n| Panaderías locales      | Chipá, productos regionales | check        | check         |",
    corrientes_accommodation_examples: "- Estadía en casa de familiares\n- Hotel de Turismo Corrientes\n- Hostal del Río\n- Apartamentos en el centro o cerca de la Costanera\n- Airbnb en barrios residenciales.",
    corrientes_coordinates: "- 27° 28' S 58° 49' O",
    corrientes_family_tips: "- La ciudad es cálida y húmeda; lleven ropa ligera, sombrero y protector solar.\n- Es fundamental llevar repelente de insectos, especialmente si planean estar cerca del río.\n- Disfruten de la Costanera al atardecer, es un paseo muy popular.\n- Los correntinos son muy amables y hospitalarios.\n- Consideren un viaje en lancha para ver la ciudad desde el río.",
    corrientes_cultural_tips: "- El chamamé es el ritmo musical y danza por excelencia de la provincia.\n- El guaraní es un idioma cooficial y su influencia se siente en el dialecto local.\n- La devoción a la Virgen de Itatí es muy fuerte.\n- El tereré (mate frío) es una bebida muy popular, especialmente en verano.",
    corrientes_map_link_text: "Ver mapa más grande de Corrientes",
    corrientes_map_link_url: "https://www.openstreetmap.org/#map=13/-27.468/-58.835",
    
    // Transport Leg Specific Keys
    transport_price_20k_ars: "{price} ARS",

    // Itinerary Program Section
    itinerary_program_title: "Análisis y Sugerencias del Itinerario",
    itinerary_program_current_plan_title: "Resumen de tu Plan Actual:",
    itinerary_program_duration_label: "Duración de la estadía en {cityName}:",
    itinerary_program_optimization_tips_title: "Consejos para Optimizar tu Viaje:",
    itinerary_optimization_tip_1: "Considera los tiempos de viaje y descanso entre destinos largos para evitar el agotamiento, especialmente con niños.",
    itinerary_optimization_tip_2: "Reserva vuelos y buses con anticipación, especialmente en temporada alta, para asegurar disponibilidad y mejores precios.",
    itinerary_optimization_tip_3: "Verifica la logística para llegar a destinos remotos como Esteros del Iberá (transfers desde ciudades cercanas).",
    itinerary_optimization_tip_4: "Deja flexibilidad en algunos días. Un día libre o con menos actividades planificadas puede ser beneficioso.",
    itinerary_optimization_tip_5: "Agrupa actividades por zona geográfica dentro de cada ciudad para minimizar tiempos de traslado.",
    itinerary_optimization_tip_6: "Para vuelos internos, revisa las políticas de equipaje, ya que suelen ser más restrictivas que los internacionales.",

    // Budget Section
    budget_summary_title: "Resumen del Presupuesto del Viaje",
    budget_summary_desc: "Estimación total basada en los promedios diarios de cada ciudad. Los valores son personalizables en la página de cada destino.",
    budget_summary_total_label: "Costo Total Estimado del Viaje:",
    budget_summary_calculating: "Calculando...",
    budget_summary_breakdown_title: "Desglose por Categoría",
    budget_table_concept: "Concepto",
    budget_table_estimated_price_usd: "Precio estimado (USD)",
    budget_table_actions: "Acciones",
    budget_table_restore_defaults: "Restaurar",
    budget_concept_accommodation: "Alojamiento (noche, familia)",
    budget_concept_food: "Comida (por día, familia)",
    budget_concept_transport: "Transporte público (por día)",
    budget_concept_activities: "Actividades y tours (por día)",
    budget_concept_museums: "Entradas museos/atracciones",
    budget_concept_accommodation_full: "Alojamiento (noche, todo incluido)",
    budget_concept_food_included: "Comida (incluida en tarifa)",
    budget_concept_transport_local: "Transporte local (pueblo)",
    budget_concept_activities_included: "Actividades (incluidas en tarifa)",
    budget_concept_international_flights: "Vuelos Internacionales (familia)",
    
  },
  [Language.HE]: {
    // General
    tituloPrincipal: "מסלול משפחתי בארגנטינה",
    idioma: "שפה:",
    moneda: "מטבע:",
    explore_btn: "גלה עוד פרטים",
    volverItinerario: "חזרה למסלול",
    loading: "טוען...",
    error: "שגיאה",
    generating: "יוצר...",
    duration_not_specified: "משך לא צוין",
    scroll_to_top_label: "חזור למעלה",
    share_app_label: "שתף אפליקציה",
    share_popover_title: "שתף קישור",
    share_popover_copy_button: "העתק",
    share_popover_copied_message: "הועתק!",
    share_popover_copy_failed_message: "לחץ Ctrl+C להעתקה",
    link_copied: "הקישור הועתק!",
    // Home Page
    bienvenidaPrincipal: "ברוכים הבאים! לחצו על כל עיר לצפייה במידע, מפות והמלצות.",
    transporte: "תחבורה בין ערים",
    desde: "מאת",
    hasta: "עד",
    medio: "אמצעי",
    tiempo: "זמן",
    precio: "מחיר משוער",
    compania: "חברה",
    mapaInteractivoTitulo: "מפה אינטראקטיבית של הטיול",
    mapaInteractivoBienvenida: "סיירו במסלול המשפחתי בארגנטינה. לחצו על כל עיר לפרטים.",
    // Packing List
    packing_title: "רשימת ציוד",
    packing_add: "הוסף",
    packing_essential: "חיוניים",
    packing_optional: "אופציונליים",
    packing_placeholder: "מה עוד אתם לוקחים?",
    packing_list_empty: "הרשימה ריקה. התחילו להוסיף פריטים!",
    // AI Consultation (Homepage)
    iaTitulo: "ייעוץ בינה מלאכותית כללי",
    iaPlaceholder: "שאלו את שאלתכם על הטיול...",
    consultarBtn: "התייעץ",
    iaError: "שגיאה בתקשורת עם הבינה המלאכותית. נסו שוב מאוחר יותר.",
    iaProcessing: "מעבד את פנייתך...",
    iaDescription: "השתמש בעוזר זה כדי לשאול שאלות כלליות על ארגנטינה, מזג האוויר, מנהגים, או כל שאלה אחרת שיש לך לגבי הטיול.",
    ai_prompt_general: "אתה עוזר נסיעות מומחה לארגנטינה. ענה על שאלות המשתמש על המדינה, תרבותה, מזג האוויר, טיפים לטיול וכל שאלה כללית אחרת. ספק תשובות מועילות, תמציתיות וידידותיות למשפחה המתכננת טיול.",
    // Currency Converter
    conversorTitulo: "ממיר מטבעות",
    convertirBtn: "המר",
    montoPlaceholder: "סכום",
    // Photo Album
    photo_album_title: "אלבום תמונות משפחתי",
    photo_album_description: "מקום לשמור את הזיכרונות מהטיול שלנו. לחץ על כפתור '+' כדי להוסיף תמונה חדשה.",
    photo_album_add_button: "הוסף תמונה",
    photo_album_placeholder_caption: "זיכרון מ-{cityName}",
    photo_album_empty: "האלבום ריק. הוסף את התמונה הראשונה של ההרפתקה!",
    photo_album_unclassified: "ללא סיווג",
    photo_album_trip_day: "יום",
    photo_album_edit_caption_label: "ערוך כיתוב",
    photo_album_delete_photo_label: "מחק תמונה",
    photo_album_confirm_delete: "האם אתה בטוח שברצונך למחוק תמונה זו?",
    photo_album_add_details_title: "הוסף פרטי תמונה",
    photo_album_city: "עיר",
    photo_album_date_taken: "תאריך צילום",
    photo_album_caption: "כיתוב",
    photo_album_cancel_button: "ביטול",
    photo_album_save_button: "שמור",
    // Flight Tickets
    flight_tickets_title: "כרטיסי טיסה בינלאומיים",
    flight_tickets_reservation: "הזמנה",
    flight_tickets_airline_ref: "מספר חברת תעופה",
    flight_tickets_status: "מצב",
    flight_tickets_approved: "מאושר",
    flight_tickets_passengers: "נוסעים",
    flight_tickets_flights: "פרטי טיסות",
    flight_tickets_leg: "קטע",
    flight_tickets_departure: "המראה",
    flight_tickets_arrival: "נחיתה",
    flight_tickets_duration: "משך",
    flight_tickets_connection_time: "זמן חיבור",
    flight_tickets_baggage_allowance: "כבודה מותרת (לנוסע)",
    flight_tickets_carry_on: "תיק יד 1 (עד 7 ק\"ג)",
    flight_tickets_checked_bags: "2 מזוודות לבטן המטוס (עד 23 ק\"ג כל אחת)",
    // Weather Forecast
    weather_title: "תחזית מזג האוויר",
    weather_select_city_label: "בחר עיר לצפייה במזג האוויר",
    weather_feels_like: "מרגיש כמו",
    weather_humidity: "לחות",
    weather_error_fetching: "לא ניתן היה לקבל את התחזית. אנא נסה שוב מאוחר יותר.",
    weather_error_city_not_found: "עיר לא נמצאה.",
    
    // Section Titles for Detail Page
    section_title_dates_duration: "תאריכים ומשך זמן",
    section_title_must_see: "מקומות שאסור לפספס",
    section_title_activities_recommended: "פעילויות מומלצות",
    section_title_gastronomy_highlight: "גסטרונומיה מומלצת",
    section_title_accommodation_examples: "לינה (דוגמאות)",
    section_title_coordinates: "קואורדינטות",
    section_title_family_tips: "טיפים למשפחות",
    section_title_cultural_tips: "טיפים תרבותיים",
    section_title_budget_table: "תקציב משוער",
    section_title_city_map: "מפת העיר",
    gastronomy_restaurants_subtitle: "מסעדות מומלצות",
    gastronomy_cafes_subtitle: "קונדיטוריות ובתי קפה",
    table_header_restaurant: "מסעדה",
    table_header_cafe: "קונדיטוריה",
    table_header_type: "סוג",
    table_header_gluten_free: "ללא גלוטן",
    table_header_sugar_free: "ללא סוכר",
    section_title_ai_event_finder: "מציאת אירועים עם בינה מלאכותית",
    ai_event_finder_description: "השתמש בבינה מלאכותית ובחיפוש Google כדי למצוא אירועים, פסטיבלים ושווקים מקומיים במהלך שהותך ב-{cityName}. התאריכים נלקחים אוטומטית מהמסלול.",
    ai_event_finder_button: "מצא אירועים",
    ai_event_finder_sources_title: "מקורות:",
    ai_event_finder_no_sources: "לא נמצאו מקורות.",
    ai_event_finder_error: "לא ניתן היה לחפש אירועים. נסה שוב.",

    // Footer
    footerText: "טיול משפחתי בארגנטינה. כל הזכויות שמורות.",
    // City Detail Page (generic titles)
    activities: "פעילויות מומלצות",
    accommodation: "אפשרויות לינה",
    budget: "תקציב משוער",

    // City Titles
    buenosaires_title: "בואנוס איירס",
    rosario_title: "רוסאריו",
    bariloche_title: "ברילוצ'ה",
    mendoza_title: "מנדוסה",
    malargue_title: "מלארגואה",
    jujuy_title: "חוחוי",
    iguazu_title: "פוארטו איגואסו",
    corrientes_title: "קוריינטס",
    ibera_title: "אסטרוס דל איברה",

    // MAIN DESCRIPTIONS FOR CITY CARDS (HE)
    buenosaires_desc_main: "בואנוס איירס היא בירת הרפובליקה הארגנטינאית, עיר קוסמופוליטית, תוססת ועם הצעות רבות ליהנות עם המשפחה.",
    rosario_desc_main: "רוסאריו, עיר הדגל, מציעה היסטוריה עשירה, פארקים רחבים וחיי תרבות תוססים על גדות נהר פרנה.",
    bariloche_desc_main: "סן קרלוס דה ברילוצ'ה, בירת האגמים, היא יעד הררי בפטגוניה הארגנטינאית, מפורסמת בנופי יערות, אגמים והרים מושלגים.",
    mendoza_desc_main: "מנדוסה, ארץ השמש והיין הטוב, שוכנת למרגלות הרי האנדים, ומציעה תרבות יין והרפתקאות.",
    malargue_desc_main: "מלארגואה, בדרום מנדוסה, היא יעד להרפתקאות ומדע, הידועה בנופים הוולקניים, המערות והמצפים האסטרונומיים שלה.",
    jujuy_desc_main: "מחוז חוחוי, בצפון-מערב ארגנטינה, הוא פיצוץ של צבעים ותרבות אנדינית, מפורסם בהריו הרב-גוניים וכפריו העתיקים.",
    iguazu_desc_main: "פוארטו איגואסו היא שער הכניסה למפלי איגואסו המרהיבים, אחד משבעת פלאי הטבע של העולם.",
    corrientes_desc_main: "קוריינטס, על גדות נהר פרנה, היא מרכז תרבותי תוסס, הידוע בקרנבל, בצ'ממה ובהיסטוריה העשירה שלו.",
    ibera_desc_main: "אסטרוס דל איברה הם אחד מבתי הגידול הלחים החשובים בעולם, גן עדן למגוון ביולוגי אידיאלי לתיירות אקולוגית משפחתית.",

    // --- DATES & DURATIONS (from itinerario_detallado_he.md) ---
    buenosaires_dates_duration: "- **שהייה**: 26/09 עד 29/09 (4 ימים)\n- **הגעה לארגנטינה**: 26/09/2025 (EZE)\n- **עזיבה מארגנטינה**: 28/10/2025 (EZE)",
    rosario_dates_duration: "- **שהייה**: 30/09 עד 03/10 (4 ימים)\n- **איך מגיעים**: אוטובוס מבואנוס איירס.",
    bariloche_dates_duration: "- **שהייה**: 05/10 עד 09/10 (5 ימים)\n- **איך מגיעים**: אוטובוס לילה מרוסאריו.",
    mendoza_dates_duration: "- **שהייה**: 10/10 עד 13/10 (4 ימים)\n- **איך מגיעים**: טיסה מברילוצ'ה (BRC).",
    jujuy_dates_duration: "- **שהייה**: 14/10 עד 18/10 (5 ימים)\n- **איך מגיעים**: אוטובוס ממנדוסה.",
    iguazu_dates_duration: "- **שהייה**: 19/10 עד 22/10 (4 ימים)\n- **איך מגיעים**: טיסה מחוחוי (JUJ).",
    ibera_dates_duration: "- **שהייה**: 23/10 עד 24/10 (יומיים)\n- **איך מגיעים**: הסעה מאיגואסו (IGR).",
    corrientes_dates_duration: "- **שהייה**: 25/10 עד 27/10 (3 ימים)\n- **איך מגיעים**: הסעה מאסטרוס דל איברה.",
    malargue_dates_duration: "- **הערה**: ניתן לבקר כטיול יום ממנדוסה.",
    
    // BUENOS AIRES (Detailed HE content)
    buenosaires_must_see: "- [האובליסק ושדרת 9 ביולי](https://es.wikipedia.org/wiki/Obelisco_de_Buenos_Aires)\n- [תיאטרון קולון (סיורים מודרכים)](https://teatrocolon.org.ar/es)\n- [קמיניטו ושכונת לה בוקה הצבעונית](https://es.wikipedia.org/wiki/Caminito)\n- [פלרמו: יערות, גן יפני, פלנטריום, מוזיאונים, בתי קפה וחנויות](https://es.wikipedia.org/wiki/Palermo_(Buenos_Aires))\n- [פוארטו מאדרו ושמורת טבע אקולוגית](https://es.wikipedia.org/wiki/Puerto_Madero)\n- [המוזיאון הלאומי לאמנויות יפות](https://www.bellasartes.gob.ar/)\n- [רקולטה: בית קברות היסטורי, יריד אומנים ובתי קפה](https://turismo.buenosaires.gob.ar/es/otros-lugares/cementerio-de-la-recoleta)\n- [פלאסה דה מאיו וקאסה רוסדה](https://es.wikipedia.org/wiki/Plaza_de_Mayo)\n- **טיול יום:** [טיול לדלתא של טיגרה](https://www.vivitigre.gob.ar/)\n- **טיול יום:** [קמפנופוליס, הכפר מימי הביניים](https://www.campanopolis.com.ar/)",
    buenosaires_activities_recommended: "- טנגו ומופעים טיפוסיים (סן טלמו או לה בוקה)\n- סיורים מודרכים ברגל או באופניים\n- פיקניק ביערות פלרמו\n- ביקור במוזיאונים וירידי אומנות\n- שייט בנהר ריו דה לה פלטה (פוארטו מאדרו)",
    buenosaires_gastronomy_highlight: "העיר מציעה ממסעדות גריל מסורתיות ועד מסעדות גורמה, אפשרויות צמחוניות/טבעוניות ובתי קפה היסטוריים.\n\n### מסעדות מומלצות\n| מסעדה | סוג | ללא גלוטן | ללא סוכר |\n|---|---|---|---|\n| [דון חוליו](https://www.parrilladonjulio.com/) | גריל קלאסי | check | cross |\n| [סאקרו](https://www.sacro.restaurant/) | טבעוני גורמה | check | check |\n| [ביו רסטורנטה](https://www.biorestaurante.com/) | אורגני | check | check |\n| [פארו אינקאס סושי וגריל](https://parurestaurant.com/) | פיוז'ן פרואני-יפני | check | cross |\n\n### קונדיטוריות ובתי קפה\n| קונדיטוריה | סוג | ללא גלוטן | ללא סוכר |\n|---|---|---|---|\n| [קפה טורטוני](https://www.cafetortoni.com.ar/) | היסטורי / קלאסי | cross | cross |\n| [הוואנה](https://www.havanna.com.ar/) | אלפחורס / קפה | check | check |\n| [קונפיטריה אידיאל](https://www.confiteriaideal.com/) | קונדיטוריה מסורתית | cross | cross |",
    buenosaires_accommodation_examples: "- [לוי סוויטס אמרלדה](https://www.loisuites.com.ar/es/hotel-esmeralda-buenos-aires)\n- מלון אלביאר פאלאס\n- מלון מאדרו\n- מלון איביס\n- Airbnb בפלרמו",
    buenosaires_coordinates: "- 34° 36' דרום 58° 22' 48\" מערב",
    buenosaires_family_tips: "- האזורים התיירותיים בטוחים ומחוברים היטב לתחבורה ציבורית (כרטיס SUBE).\n- ישנן פעילויות רבות בחינם ולכל הגילאים.\n- בסופי שבוע יש בדרך כלל מופעי רחוב וירידים.\n- מומלץ להזמין מקומות לינה מראש בפלרמו או רקולטה.",
    buenosaires_cultural_tips: "- השפה הרשמית היא ספרדית (ריו פלטנסה, מאוד ידידותית).\n- נהוג לברך בנשיקה על הלחי.\n- שעות הארוחות הן בדרך כלל מאוחרות יותר מאשר במדינות אחרות (ארוחת ערב החל מ-21:00).\n- מאטה הוא המשקה הלאומי.",
    buenosaires_map_link_text: "צפה במפה גדולה יותר של בואנוס איירס",
    buenosaires_map_link_url: "https://www.openstreetmap.org/#map=12/-34.60/-58.45",
    buenosaires_poi_obelisco_name: "האובליסק",
    buenosaires_poi_obelisco_desc: "אנדרטה היסטורית בשדרת 9 ביולי.",
    buenosaires_poi_teatrocolon_name: "תיאטרון קולון",
    buenosaires_poi_teatrocolon_desc: "אחד מבתי האופרה החשובים בעולם.",
    buenosaires_poi_caminito_name: "קמיניטו",
    buenosaires_poi_caminito_desc: "רחוב מוזיאון צבעוני בלה בוקה.",
    buenosaires_poi_palermo_name: "יערות פלרמו",
    buenosaires_poi_palermo_desc: "פארק עירוני גדול עם אגמים וגן ורדים.",
    buenosaires_poi_planetario_name: "פלנטריום גלילאו גליליי",
    buenosaires_poi_planetario_desc: "מרכז להפצת ידע אסטרונומי.",
    buenosaires_poi_puertomadero_name: "פוארטו מאדרו",
    buenosaires_poi_puertomadero_desc: "רובע נמל מודרני עם מסעדות וגשר האישה.",
    buenosaires_poi_bellasartes_name: "המוזיאון הלאומי לאמנויות יפות",
    buenosaires_poi_bellasartes_desc: "מוזיאון האמנות הראשי של ארגנטינה.",
    buenosaires_poi_recoleta_name: "בית הקברות רקולטה",
    buenosaires_poi_recoleta_desc: "בית קברות היסטורי עם מאוזוליאומים מרשימים.",
    buenosaires_poi_plazamayo_name: "פלאסה דה מאיו",
    buenosaires_poi_plazamayo_desc: "המרכז ההיסטורי והפוליטי של העיר, מול הקאסה רוסדה.",

    // AI Section Titles, Descriptions, Prompts, Placeholders (HE)
    ai_menu_title: "מחולל תפריט בריא",
    ai_menu_description: "שוחחו עם מומחה תזונה ליצירת תפריט יומי (בוקר, צהריים, ערב) המותאם לצרכים שלכם (דל פחמימות, סוכרתי, ללא גלוטן) בטעם של {cityName}.",
    ai_menu_button: "ייצר תפריט",
    ai_menu_input_placeholder: "בקש תפריט טבעוני, ללא דגים...",
    buenosaires_ai_prompt_menu: "אתה מומחה לגסטרונומיה ארגנטינאית ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת בבואנוס איירס. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן. שלב מנות ארגנטינאיות טיפוסיות מותאמות.",
    rosario_ai_prompt_menu: "אתה מומחה לגסטרונומיה ארגנטינאית ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת ברוסאריו. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ללא גלוטן אם אפשר, ובהשראת המטבח המקומי (למשל דג נהר).",
    bariloche_ai_prompt_menu: "אתה מומחה לגסטרונומיה פטגונית ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת בברילוצ'ה. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן. כלול דוגמאות למאכלים מקומיים כמו פורל או טלה מותאמים.",
    mendoza_ai_prompt_menu: "אתה מומחה לגסטרונומיה קוז'אנה ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת במנדוסה. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן, תוך הדגשת מרכיבים מקומיים והתאמות יין (למבוגרים, כמובן).",
    malargue_ai_prompt_menu: "אתה מומחה לגסטרונומיה קוז'אנה ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת במלארגואה. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן, תוך הדגשת הצ'יביטו המקומי המותאם.",
    jujuy_ai_prompt_menu: "אתה מומחה לגסטרונומיה אנדינית ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת בחוחוי. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן, תוך שימוש במרכיבים כמו קינואה, לאמה (מותאמת) או תירס.",
    iguazu_ai_prompt_menu: "אתה מומחה לגסטרונומיה מיסיונרית ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת בפוארטו איגואסו. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן, כולל דגי נהר או פירות טרופיים.",
    corrientes_ai_prompt_menu: "אתה מומחה לגסטרונומיה ליטורלניה ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת בקוריינטס. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן, עם דגי נהר כמו דוראדו או סורובי.",
    ibera_ai_prompt_menu: "אתה מומחה לגסטרונומיה אזורית של אסטרוס דל איברה ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת באיברה. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן, המבוססות על בישול ביתי ומוצרים מקומיים.",
    generic_ai_prompt_menu: "אתה מומחה לגסטרונומיה ארגנטינאית ותזונה. משימתך היא ליצור תוכנית תפריט יומית (ארוחת בוקר, צהריים, ערב) למשפחה המבקרת ב-{cityName}. האפשרויות צריכות להיות מתאימות לסוכרתיים, דלות פחמימות, ואם אפשר, ללא גלוטן. שלב מנות מקומיות טיפוסיות מותאמות.",

    ai_accommodation_title: "הצעות לינה עם בינה מלאכותית",
    ai_accommodation_description: "שוחחו עם סוכן נסיעות לקבלת המלצות לינה ב-{cityName}, תוך התחשבות באפשרויות ידידותיות למשפחות, בטוחות וממוקמות היטב.",
    ai_accommodation_button: "ייצר הצעות",
    ai_accommodation_input_placeholder: "בקש אפשרויות עם בריכה, קרוב למרכז...",
    buenosaires_ai_prompt_accommodation: "אתה סוכן נסיעות מומחה לבואנוס איירס. משימתך היא ליצור 3-5 הצעות לינה בבואנוס איירס, אידיאליות למשפחה עם 2 ילדים. קח בחשבון אפשרויות בטוחות, ממוקמות היטב ועם שירותים מתאימים למשפחות. כלול סוגים שונים (בתי מלון, דירות, Airbnb).",
    malargue_ai_prompt_accommodation: "אתה סוכן נסיעות מומחה. משימתך היא ליצור 3-5 הצעות לינה במלארגואה, אידיאליות למשפחה עם 2 ילדים. קח בחשבון אפשרויות בטוחות ומתאימות למשפחות המחפשות הרפתקאות. כלול סוגים שונים (בתי מלון, בקתות).",
    generic_ai_prompt_accommodation: "אתה סוכן נסיעות מומחה. משימתך היא ליצור 3-5 הצעות לינה ב-{cityName}, אידיאליות למשפחה עם 2 ילדים. קח בחשבון אפשרויות בטוחות, ממוקמות היטב ועם שירותים מתאימים למשפחות. כלול סוגים שונים (בתי מלון, דירות, Airbnb).",
    
    ai_family_tips_title: "טיפים נוספים למשפחות עם בינה מלאכותית",
    ai_family_tips_description: "שוחחו עם מדריך טיולים מומחה לקבלת טיפים מותאמים אישית לבילוי ב-{cityName} עם המשפחה, כולל פעילויות, בטיחות ולוגיסטיקה.",
    ai_family_tips_button: "ייצר טיפים",
    ai_family_tips_input_placeholder: "ציין גילי ילדים או תחומי עניין...",
    buenosaires_ai_prompt_family_tips: "אתה מדריך טיולים מומחה לבואנוס איירס למשפחות. משימתך היא לספק 5 טיפים מעשיים ומותאמים אישית למשפחה עם ילדים המבקרת בבואנוס איירס. כסה היבטים כמו פעילויות לילדים, בטיחות, תחבורה משפחתית וכיצד למקסם את השהייה.",
    malargue_ai_prompt_family_tips: "אתה מדריך טיולים מומחה למשפחות. משימתך היא לספק 5 טיפים מעשיים ומותאמים אישית למשפחה עם ילדים המבקרת במלארגואה. כסה פעילויות הרפתקניות (עם אמצעי זהירות), מדע ולוגיסטיקה.",
    generic_ai_prompt_family_tips: "אתה מדריך טיולים מומחה למשפחות. משימתך היא לספק 5 טיפים מעשיים ומותאמים אישית למשפחה עם ילדים המבקרת ב-{cityName}. כסה היבטים כמו פעילויות לילדים, בטיחות, תחבורה משפחתית וכיצד למקסם את השהייה.",

    ai_budget_analysis_title: "ניתוח תקציב עם בינה מלאכותית",
    ai_budget_analysis_description: "שוחחו עם יועץ פיננסי לקבלת ניתוח של התקציב המשוער לשהותכם ב-{cityName}, עם אופטימיזציות אפשריות.",
    ai_budget_analysis_button: "נתח תקציב",
    ai_budget_analysis_input_placeholder: "ציין תקציב כולל או סדרי עדיפויות...",
    buenosaires_ai_prompt_budget_analysis: "אתה יועץ פיננסי לטיולים. משימתך היא לנתח את התקציב המשוער למשפחה בבואנוס איירס (USD): לינה (לילה): 50-120, אוכל (יום): 30-70, תחבורה (יום): 3-5, פעילויות (יום): 20-50, כניסות: 0-15. ספק פירוט משוער ליום ולקטגוריה, והצע 2-3 דרכים לייעל תקציב זה מבלי לוותר על החוויה.",
    malargue_ai_prompt_budget_analysis: "אתה יועץ פיננסי לטיולים. משימתך היא לנתח את התקציב המשוער למשפחה במלארגואה. עיין בתקציב המפורט של העיר, ספק פירוט משוער ליום ולקטגוריה, והצע 2-3 דרכים לייעל תקציב זה.",
    generic_ai_prompt_budget_analysis: "אתה יועץ פיננסי לטיולים. משימתך היא לנתח את התקציב המשוער למשפחה ב-{cityName}. עיין בתקציב המפורט של העיר, ספק פירוט משוער ליום ולקטגוריה, והצע 2-3 דרכים לייעל תקציב זה מבלי לוותר על החוויה.",

    // AI Chat and Translation
    ai_chat_send_button: "שלח",
    ai_chat_input_placeholder: "כתוב את הודעתך...",
    ai_translate_button_text: "תרגם ל-{lang}",
    ai_translated_from_label: "תורגם מ-{lang}:",
    language_name_es: "ספרדית",
    language_name_he: "עברית",

    // ROSARIO (Detailed HE content) - (and all other cities as per prior full example)
    rosario_must_see: "- [אנדרטת הדגל הלאומית](https://www.monumentoalabandera.gob.ar/)\n- [פארק העצמאות](https://www.rosario.gob.ar/web/ciudad/parques-y-plazas/parque-de-la-independencia)\n- טיילת נהר פרנה\n- [אי ההמצאות](https://www.rosario.gob.ar/web/ciudad/cultura/infancia-y-juventud/isla-de-los-inventos)\n- מוזיאון למדעי הטבע \"ד\"ר אנחל גז'ארדו\"\n- שדרות אורוניו",
    rosario_activities_recommended: "- ביקור באנדרטת הדגל ועלייה לתצפית שלה.\n- שייט בנהר פרנה ובאיים שלו.\n- השכרת אופניים לטיול בטיילת ובפארקים.\n- פעילויות פנאי באי ההמצאות או בחוות הילדות.\n- פיקניק בפארקים הגדולים של העיר.\n- ביקורים במוזיאונים המותאמים לילדים.",
    rosario_gastronomy_highlight: "רוסאריו ידועה בגסטרונומיה המגוונת שלה, עם אפשרויות הנעות מגריל מסורתי ובשר על האש, ועד למנות דגי נהר טריים והיצע גדל והולך של מטבח מודרני ובריא.\n\n### מסעדות מומלצות\n| מסעדה | סוג | ללא גלוטן | ללא סוכר |\n|---|---|---|---|\n| דון פרו | גריל עם נוף לנהר | check | cross |\n| רוק אנד פלר'ס | אמריקאי / משפחתי | check | cross |\n| צ'ינצ'יבירה | מטבח שף / פיוז'ן | check | check |\n| אל וייחו בלקון | דגי נהר | check | cross |\n\n### קונדיטוריות ובתי קפה\n| קונדיטוריה | סוג | ללא גלוטן | ללא סוכר |\n|---|---|---|---|\n| אל קהיר | היסטורי / ספרותי | cross | cross |\n| גופרה | וופלים וקונדיטוריה | check | check |\n| סנדרלנד | מסורתי / קלאסי | cross | cross |",
    rosario_accommodation_examples: "- שהייה בבית של קרובי משפחה\n- מלון רוס טאואר\n- אספלנדור ביי ווינדהם סאבוי רוסאריו\n- דירות במרכז או ליד הטיילת\n- Airbnb בשכונות מגורים כמו פישרטון או פיצ'ינצ'ה",
    rosario_coordinates: "- 32° 57' דרום 60° 38' מערב",
    rosario_family_tips: "- נצלו את המרחבים הירוקים הרחבים והטיילת לפעילויות באוויר הפתוח.\n- התחבורה הציבורית יעילה (כרטיס MOVI).\n- העיר בטוחה באזורים התיירותיים ובמרכז.\n- שקלו שייט כדי לראות את העיר מהנהר.\n- בטיילת יש אפשרויות רבות למסעדות עם משחקים לילדים.",
    rosario_cultural_tips: "- \"צ'ה\" גווארה נולד ליד רוסאריו.\n- רוסאריו היא מולדתם של כדורגלנים גדולים (מסי, די מריה) ואמנים.\n- הסייסטה נפוצה בשעות הצהריים, ומשפיעה על שעות הפעילות של החנויות.\n- תושבי רוסאריו ידועים בהכנסת האורחים שלהם.",
    rosario_map_link_text: "צפה במפה גדולה יותר של רוסאריו",
    rosario_map_link_url: "https://www.openstreetmap.org/#map=12/-32.944/-60.655",

    // BARILOCHE (HE)
    bariloche_must_see: "- **המרכז האזרחי**: לב העיר עם ארכיטקטורה אלפינית.\n- **אגם נאוול ואפי**: לשייט ופעילויות מים.\n- **סירקuito צ'יקו**: מסלול פנורמי עם נופים מרהיבים.\n- **סרו קתדרל**: מרכז סקי בחורף, טרקים ונופים בקיץ.\n- **סרו קמפנריו**: נבחר בין הנופים הטובים בעולם, עם רכבל כיסאות.\n- **יער אראז'אנס**: יער ייחודי אליו מגיעים בשייט.\n- **פוארטו בלסט ומפל לוס קנטרוס**: טיול שייט באגם.",
    bariloche_activities_recommended: "- טעימות שוקולדים ובירות בוטיק.\n- שייט באגם נאוול ואפי.\n- טרקים והליכה (מותאמים למשפחות).\n- ספורט חורף (סקי, סנובורד, מזחלות).\n- רכיבה על סוסים או קנופי בסביבה.\n- ביקור בקולוניה סוויסה לטעימת קורנטו.\n- נסיעה בסירקuito צ'יקו ברכב או באופניים.",
    bariloche_gastronomy_highlight: "הגסטרונומיה של ברילוצ'ה מפורסמת בשוקולדים, בשר ציד (אייל, חזיר בר), פורלים ומעושנים. יש גם אפשרויות בריאות ולדיאטות מיוחדות.\n\n### מסעדות מומלצות\n| מסעדה                  | סוג                       | ללא גלוטן | ללא סוכר |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| אל בוליצ'ה דה אלברטו   | גריל / בשרים              | check        | cross         |\n| לה פונדה דל טיו        | אוכל פטגוני ביתי         | check        | check         |\n| באטרפליי                | מטבח עילית / פורל        | check        | check         |\n| ראפה נוי                | שוקולטריה / קפיטריה      | check        | check         |\n\n### קונדיטוריות ובתי קפה\n| קונדיטוריה              | סוג                       | ללא גלוטן | ללא סוכר |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| מאמושקה                | שוקולטריה / קונדיטוריה    | check        | check         |\n| אבואלה גוז'ה            | שוקולטריה / קפיטריה      | check        | check         |\n| אל אלמסן דה פלורס     | קפה מיוחד                 | check        | check         |",
    bariloche_accommodation_examples: "- [וילה הויניד הוטל בוסטיו](https://www.villahuinid.com.ar/hotel-bustillo)\n- מלון ז'או ז'או (יוקרה)\n- מלון פנאמריקנו ברילוצ'ה\n- בקתות ומתחמי תיירות עם פעילויות לילדים\n- Airbnb במרכז או ליד סירקuito צ'יקו",
    bariloche_coordinates: "- 41° 08' דרום 71° 18' מערב",
    bariloche_family_tips: "- התלבשו בשכבות (הטמפרטורה יכולה להשתנות מאוד).\n- הזמינו טיולים ולינה מראש, במיוחד בעונת השיא.\n- יש הרבה פעילויות לילדים: פארקי שלג, מסלולי הליכה קלים, שייט.\n- האזור בטוח מאוד לטיולים משפחתיים.\n- טעמו את השוקולדים המקומיים, אך במתינות אם יש מגבלות.",
    bariloche_cultural_tips: "- לברילוצ'ה השפעה חזקה של מהגרים שוויצרים וגרמנים, הנראית בארכיטקטורה ובגסטרונומיה שלה.\n- זהו יעד פופולרי לטיולי סיום תיכון, כך שייתכנו צעירים רבים בתקופות מסוימות.\n- תרבות ההרים מושרשת מאוד: כבוד לטבע, ספורט באוויר הפתוח.",
    bariloche_map_link_text: "צפה במפה גדולה יותר של ברילוצ'ה",
    bariloche_map_link_url: "https://www.openstreetmap.org/#map=12/-41.133/-71.328",

    // MENDOZA (HE)
    mendoza_must_see: "- **פארק חנרל סן מרטין**: אחד הפארקים העירוניים הגדולים בדרום אמריקה, עם אגם וגן ורדים.\n- **סרו דה לה גלוריה**: תצפית פנורמית על העיר והאנדים.\n- **יקבים בלוחאן דה קוז'ו ומאיפו**: לסיורי יין, וחלקם עם פעילויות לילדים.\n- **פואנטה דל אינקה**: תופעת טבע מעניינת בדרך להר הגבוה.\n- **טיול למלארגואה**: לביקור ב**מערת המכשפות** (Caverna de las Brujas) ושמורת **לה פאיוניה** (דורש יום שלם ורכב מתאים).",
    mendoza_activities_recommended: "- סיור ביקבים עם טעימות (חלקם מציעים מיצים ופעילויות לילדים).\n- ביקור בהר הגבוה, כולל פארק אקונקגואה (תצפית).\n- רפטינג בנהר מנדוסה (לגילאים מתאימים).\n- טיול אופניים בכרמים.\n- נסיעה ברכב למלארגואה לחקור את הנופים הוולקניים שלה.\n- הליכות ופיקניקים בפארק סן מרטין.\n- סיור רגלי בעיר, בכיכרות וברחובות המוצלים.",
    mendoza_gastronomy_highlight: "מנדוסה היא גן עדן גסטרונומי, מפורסמת בבשרים על האש, זיתים וכמובן, ההיצע הרחב של יינות. מסעדות רבות ביקבים מציעות מטבח עילית.\n\n### מסעדות מומלצות\n| מסעדה                          | סוג                       | ללא גלוטן | ללא סוכר |\n|---------------------------------|:--------------------------:|:----------:|:----------:|\n| סייטה קוסינאס                  | מטבח אזורי / שף           | check        | check         |\n| אספרן                           | מטבח עילית עם התאמת יין   | check        | check         |\n| לה מרקיחיאנה                   | מטבח איטלקי קלאסי        | check        | cross         |\n| יקב סוקרדי (פיידרה אינפיניטה) | חוויה גורמה ביקב          | check        | check         |\n\n### קונדיטוריות ובתי קפה\n| קונדיטוריה                     | סוג                       | ללא גלוטן | ללא סוכר |\n|---------------------------------|:--------------------------:|:----------:|:----------:|\n| מאמא מיה                        | קונדיטוריה / קפיטריה      | check        | check         |\n| הוואנה (סניפים שונים)          | אלפחורס / קפה             | check        | check         |\n| דה בזאר בר                     | קפה מיוחד                 | check        | check         |",
    mendoza_accommodation_examples: "- [מוד הוטלס מנדוסה](https://www.modhotels.com.ar/)\n- מלון פארק הייאט מנדוסה\n- מלון דיפלומטיק מנדוסה\n- בקתות או לודג'ים בצ'קרס דה קוריה או לוחאן דה קוז'ו (אזור היקבים)\n- Airbnb במרכז או בשכונות מגורים שקטות.",
    mendoza_coordinates: "- 32° 53' דרום 68° 50' מערב",
    mendoza_family_tips: "- שקלו לשכור רכב כדי לחקור את היקבים וההר הגבוה בקצב שלכם.\n- תמיד קחו מים וקרם הגנה, האקלים יבש ושמשי.\n- בחלק מהיקבים יש אזורי משחקים או פעילויות לילדים בזמן שהמבוגרים טועמים.\n- העיר מאוד מוצלת עם תעלות השקיה, מה שהופך אותה נעימה להליכה.\n- בהר הגבוה, הטמפרטורות יכולות לרדת משמעותית, גם בקיץ.",
    mendoza_cultural_tips: "- תרבות היין היא מרכזית במנדוסה.\n- ה\"סייסטה\" היא מנהג מושרש מאוד, עם חנויות רבות שנסגרות בצהריים.\n- תושבי מנדוסה גאים מאוד במחוז שלהם ובייצור היין.\n- חמימות האנשים בולטת.",
    mendoza_map_link_text: "צפה במפה גדולה יותר של מנדוסה",
    mendoza_map_link_url: "https://www.openstreetmap.org/#map=12/-32.889/-68.846",
    
    // MALARGUE (HE)
    malargue_must_see: "- **מערת המכשפות (Caverna de las Brujas)**: מערכת מערות עם תצורות מרשימות.\n- **שמורת הטבע לה פאיוניה (La Payunia)**: נופים מדבריים עם הרי געש.\n- **מצפה פייר אוז'ה (Pierre Auger Observatory)**: אחד ממצפי הקרניים הקוסמיות החשובים בעולם.\n- **פלנטריום מלארגואה**: ללמוד על אסטרונומיה.",
    malargue_activities_recommended: "- סיור מערות במערת המכשפות.\n- טרקים בלה פאיוניה.\n- סיורים מודרכים במצפה פייר אוז'ה.\n- הנאה מהגסטרונומיה המקומית, כמו צ'יביטו.",
    malargue_gastronomy_highlight: "הגסטרונומיה של מלארגואה מתמקדת בתוצרת מקומית, במיוחד בצ'יביטו (גדי צעיר) צלוי. ישנן גם אפשרויות למטבח אזורי ומנות פשוטות אך טעימות.\n\n### מסעדות מומלצות\n| מסעדה | סוג | ללא גלוטן | ללא סוכר |\n|---|---|---|---|\n| לה פוסטה דל צ'יביטו | גריל / צ'יביטו | check | cross |\n| אל בודגון דה מריה | אוכל ביתי אזורי | check | check |",
    malargue_accommodation_examples: "- מלון מלארגואה אין אנד סוויטס\n- בקתות בסביבה\n- פונדקים ואכסניות מקומיות",
    malargue_coordinates: "- 35° 28' דרום 69° 35' מערב",
    malargue_family_tips: "- אידיאלי למשפחות הרפתקניות ועם עניין במדע.\n- הטיולים ללה פאיוניה דורשים רכבי 4x4 ומדריכים.\n- הזמינו ביקור במערת המכשפות מראש, המקומות מוגבלים.",
    malargue_cultural_tips: "- למלארגואה יש זהות חזקה הקשורה לגידול עזים ולאסטרונומיה.\n- זהו יעד פחות המוני מאחרים במנדוסה, המציע חוויה אותנטית יותר.",
    malargue_map_link_text: "צפה במפה גדולה יותר של מלארגואה",
    malargue_map_link_url: "https://www.openstreetmap.org/#map=13/-35.476/-69.589",

    // JUJUY (HE)
    jujuy_must_see: "- **קבראדה דה אומאואקה**: אתר מורשת עולמית, עם נופים כמו פאלטה דל פינטור במאימארה וסרו דה לוס סייטה קולורס בפורממרקה.\n- **פורממרקה**: כפר ציורי למרגלות סרו דה לוס סייטה קולורס.\n- **טילקרה**: עיר עם פוקארה (מבצר פרה-היספני) ומוזיאונים.\n- **אומאואקה**: עיר היסטורית עם אנדרטת העצמאות ומגדל הקבילדו.\n- **סלינאס גרנדס**: מדבר מלח עצום (משותף עם סלטה, נגיש מפורממרקה).\n- **גרונטה דל דיאבלו (טילקרה)**: תצורת סלע עם מפל.\n- **סן סלבדור דה חוחוי**: הבירה, עם העיר העתיקה ובית הממשלה.",
    jujuy_activities_recommended: "- סיורים בכפרי הקבראדה ובשווקי האומנות שלהם.\n- הליכות קלות בפורממרקה או טילקרה.\n- ביקור בפוקארה של טילקרה.\n- טיול לסלינאס גרנדס (קחו קרם הגנה ומשקפי שמש).\n- תצפית כוכבים בקבראדה (זיהום אור נמוך).\n- הנאה ממוזיקה פולקלורית וריקודים מקומיים.\n- טעימת אמפנדס חוחויאניות וטמאלס.",
    jujuy_gastronomy_highlight: "הגסטרונומיה של חוחוי היא מיזוג של טעמים אנדיניים וקריאוליים, עם מנות המבוססות על תירס, תפוח אדמה, לאמה ועז. אפשרויות ללא גלוטן ודלות פחמימות עשויות לדרוש התאמה במנות מסורתיות, אך תמיד יש חלופות עם בשרים וירקות.\n\n### מסעדות מומלצות\n| מסעדה                  | סוג                       | ללא גלוטן | ללא סוכר |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| אל פטיו דה לה אמפנדה  | אוכל אזורי / אמפנדס      | check        | cross         |\n| לה קוסינה דל קולורדו   | מטבח אנדיני מסורתי       | check        | check         |\n| קילה                   | מטבח שף / אזורי           | check        | check         |\n\n### קונדיטוריות ובתי קפה\n| קונדיטוריה              | סוג                       | ללא גלוטן | ללא סוכר |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| (אפשרויות מקומיות)     | מאפיות / בתי קפה          | cross         | cross         |\n| שווקי אומנות           | מוצרים מקומיים             | check        | check         |",
    jujuy_accommodation_examples: "- [הווארד ג'ונסון פלאזה חוחוי](https://hojujuy.com.ar/)\n- מלונות בוטיק בפורממרקה או טילקרה.\n- אחוזות ופונדקים כפריים בקבראדה.\n- מלונות בסן סלבדור דה חוחוי להיצע גדול יותר.\n- Airbnb בבתי טיט מסורתיים.",
    jujuy_coordinates: "- סן סלבדור דה חוחוי: 24° 11' דרום 65° 18' מערב\n- פורממרקה: 23° 44' דרום 65° 30' מערב",
    jujuy_family_tips: "- הגובה יכול להשפיע על חלק מהמטיילים (סן סלבדור בגובה ~1200 מ', פורממרקה ~2300 מ', אומאואקה ~3000 מ', סלינאס גרנדס ~3500 מ'). שתו הרבה מים והלכו לאט בימים הראשונים.\n- קחו קרם הגנה, כובע ומשקפי שמש, קרינת השמש גבוהה.\n- התלבשו בשכבות, הטמפרטורות משתנות מאוד בין היום ללילה.\n- השכרת רכב מומלצת לטיול בקבראדה בחופשיות.\n- תמיד החזיקו כסף קטן, במיוחד בשווקים מקומיים.",
    jujuy_cultural_tips: "- התרבות האנדינית נוכחת מאוד: כבוד לפצ'אמאמה (אמא אדמה), טקסים, מוזיקה (קנות, צ'רנגוס).\n- השפה הספרדית עם השפעת קצ'ואה נפוצה.\n- האומנות המקומית עשירה מאוד: טקסטיל מלאמה/אלפקה, קרמיקה, עבודות עץ.\n- האדיבות של האנשים היא תכונה בולטת.",
    jujuy_map_link_text: "צפה במפה גדולה יותר של חוחוי",
    jujuy_map_link_url: "https://www.openstreetmap.org/#map=10/-23.597/-65.405",
    
    // IGUAZU (HE)
    iguazu_must_see: "- **הפארק הלאומי איגואסו (הצד הארגנטינאי)**: עם גשרים מעל המפלים, גרון השטן והרכבת האקולוגית.\n- **הפארק הלאומי איגואסו (הצד הברזילאי)**: מציע נוף פנורמי מרשים של המפלים.\n- **נקודת שלושת הגבולות**: נקודת מפגש של ארגנטינה, ברזיל ופרגוואי.\n- **גוירה אוגה (מקלט לחיות בר)**: מרכז הצלה ושיקום של בעלי חיים.\n- **גן היונקי הדבש**: מקום קסום לצפייה ביונקי דבש מקרוב.\n- **אריפוקה**: מיזם תיירותי-תרבותי המעריך מחדש את יער מיסיונס.\n- **מוזיאון השעווה**: אטרקציה משפחתית.",
    iguazu_activities_recommended: "- הליכה בגשרים בצד הארגנטינאי והברזילאי של המפלים.\n- הרפתקה גדולה (שייט בסירת גומי מתחת למפלים) – מתאים לגילאים מתאימים וללא מגבלות בריאותיות.\n- שייט בשקיעה בנהר איגואסו.\n- ביקור בנקודת שלושת הגבולות בשקיעה.\n- סיור בחנות הדיוטי פרי (הצד הארגנטינאי).\n- ביקור בפארק הציפורים (הצד הברזילאי, אם חוצים את הגבול).\n- חקירת הפארק הלאומי במסלולים השונים שלו.",
    iguazu_gastronomy_highlight: "הגסטרונומיה בפוארטו איגואסו מציעה שילוב של מטבח אזורי (דגי נהר, מנדיוקה), עם אפשרויות למאכלים בינלאומיים וגריל. חשוב לחפש מקומות המציעים מגוון ולשאול על אפשרויות לדיאטות מיוחדות.\n\n### מסעדות מומלצות\n| מסעדה                       | סוג                       | ללא גלוטן | ללא סוכר |\n|------------------------------|:--------------------------:|:----------:|:----------:|\n| לה ואקה אנמורדה             | גריל / בשרים              | check        | cross         |\n| אקווה רסטורנט                | מטבח שף / פיוז'ן           | check        | check         |\n| לו דה חואן                   | דגי נהר / אזורי           | check        | cross         |\n| אל קינצ'ו דל טיו קרידו      | גריל / מופע פולקלור       | check        | cross         |\n\n### קונדיטוריות ובתי קפה\n| קונדיטוריה                   | סוג                       | ללא גלוטן | ללא סוכר |\n|------------------------------|:--------------------------:|:----------:|:----------:|\n| קפה סנטרל                   | קפיטריה / מאפייה          | cross         | cross         |\n| גלידרייה קרמולטי            | גלידות                    | check        | check         |",
    iguazu_accommodation_examples: "- [מרקיור איגואסו הוטל אירו](https://all.accor.com/hotel/B1R5/index.es.shtml)\n- מלון גראן מליה איגואסו (בתוך הפארק הלאומי)\n- אמריאן פורטל דל איגואסו\n- מלונות ופונדקים קטנים יותר במרכז פוארטו איגואסו\n- Airbnb או בקתות באזורים שקטים יותר.",
    iguazu_coordinates: "- פוארטו איגואסו: 25° 36' דרום 54° 34' מערב\n- מפלי איגואסו: 25° 40' דרום 54° 26' מערב",
    iguazu_family_tips: "- קחו דוחה יתושים (חיוני), קרם הגנה, כובע ובגדים קלים.\n- נעלו נעליים נוחות ומונעות החלקה לגשרים.\n- בהרפתקה הגדולה, תירטבו לחלוטין; קחו בגדים להחלפה.\n- אם מתכננים לחצות לברזיל, בדקו את דרישות הוויזה והדרכון לכל בני המשפחה.\n- קופים וקואטים נפוצים בפארק, אל תאכילו אותם ואל תיגעו בהם.\n- מומלץ לשתות מים מינרליים.",
    iguazu_cultural_tips: "- תרבות האזור מושפעת מאוד משלושת הגבולות (ארגנטינה, ברזיל, פרגוואי).\n- גוארני היא שפה רשמית-משותפת באזורים מסוימים, אם כי ספרדית היא הדומיננטית.\n- מנדיוקה היא מזון בסיסי בתזונה המקומית.\n- חמימות האקלים משתקפת בקצב החיים.",
    iguazu_map_link_text: "צפה במפה גדולה יותר של פוארטו איגואסו",
    iguazu_map_link_url: "https://www.openstreetmap.org/#map=13/-25.594/-54.467",

    // IBERA (HE)
    ibera_must_see: "- **לגונת איברה**: גוף המים העיקרי לטיולי שייט.\n- **גשרי לגונת איברה**: שבילים מוגבהים לצפייה בבעלי חיים.\n- **מרכז המידע של האסטרוס**: מידע על המערכת האקולוגית ובעלי החיים.\n- **מצפי ציפורים**: נקודות אסטרטגיות לצפייה בציפורים.\n- **הכפר קולוניה קרלוס פלגריני**: נקודת הגישה התיירותית, עם הפונדקים והשלווה שבה.\n- **שבילי פרשנות סביבתית**: להליכה ולמידה על הצומח והחי המקומיים.",
    ibera_activities_recommended: "- ספארי שייט בלגונת איברה לצפייה בקיימנים, קפיברות, איילי ביצות וציפורים.\n- הליכות מודרכות בשבילים לצפייה בבעלי חיים יבשתיים.\n- ספארי לילה (אופציונלי, לצפייה בחיות לילה).\n- רכיבה על סוסים בסביבה (לגילאים מתאימים).\n- שייט בקאנו או קיאק (באזורים מותרים ועם מדריך).\n- צפייה בציפורים.\n- הנאה מהשקט והמגע עם הטבע.",
    ibera_gastronomy_highlight: "הגסטרונומיה באיברה מבוססת על בישול ביתי ואזורי, עם מרכיבים טריים מהאזור. הפונדקים בדרך כלל מציעים פנסיון מלא עם מנות טיפוסיות, ולעיתים קרובות מתאימים עצמם לצרכים תזונתיים ספציפיים אם מודיעים מראש.\n\n### מסעדות מומלצות (בדרך כלל בפונדקים)\n| מסעדה                  | סוג                       | ללא גלוטן | ללא סוכר |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| פוסאדה דה לה לגונה     | אוכל ביתי / אזורי           | check        | check         |\n| אירופה לודג'            | אוכל ביתי / אזורי           | check        | check         |\n| רינקון דל קרפינצ'ו     | אוכל ביתי / אזורי           | check        | check         |\n\n### קונדיטוריות ובתי קפה\n| קונדיטוריה              | סוג                       | ללא גלוטן | ללא סוכר |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| (אפשרויות מוגבלות)    | בעיקר בפונדקים             | check        | check         |\n| מינימרקטים             | להצטיידות                  | check        | check         |",
    ibera_accommodation_examples: "- [פוסאדה אגואפה](https://www.posadaaguape.com/)\n- פוסאדה דה לה לגונה\n- אירופה לודג'\n- בקתות ומקומות אירוח כפריים בקולוניה קרלוס פלגריני\n- קמפינג (להרפתקנים יותר).",
    ibera_coordinates: "- קולוניה קרלוס פלגריני: 28° 32' דרום 57° 11' מערב",
    ibera_family_tips: "- **דוחה יתושים הוא קריטי לחלוטין.** קחו כמות גדולה.\n- קרם הגנה, כובע ובגדים עם שרוולים ארוכים להגנה מהשמש והיתושים.\n- משקפת לצפייה בציפורים ובעלי חיים.\n- הזמינו לינה וטיולים מראש, ההיצע מוגבל.\n- רוב הפעילויות הן באוויר הפתוח; היו מוכנים לתנאי מזג אוויר שונים.\n- אידיאלי לילדים המתעניינים בטבע ובבעלי חיים.",
    ibera_cultural_tips: "- תרבות הגוארני והכבוד לטבע חזקים מאוד.\n- קצב החיים רגוע ובמגע עם הטבע.\n- הכנסת האורחים של המקומיים בולטת.\n- לימוד כמה מילים בגוארני יכול להיות מהנה לילדים.",
    ibera_map_link_text: "צפה במפה גדולה יותר של אסטרוס דל איברה (קולוניה קרלוס פלגריני)",
    ibera_map_link_url: "https://www.openstreetmap.org/#map=13/-28.537/-57.140",

    // CORRIENTES (HE)
    corrientes_must_see: "- **טיילת חנרל סן מרטין**: לטיולים, שקיעות מעל הנהר ופנאי.\n- **גשר חנרל בלגרנו**: גשר סמלי המחבר את קוריינטס עם רסיסטנסיה.\n- **המוזיאון המחוזי לאמנויות יפות \"ד\"ר חואן רמון וידאל\"**: עם יצירות של אמנים מקוריינטס.\n- **תיאטרון חואן דה ורה הרשמי**: פנינה ארכיטקטונית עם לוח אירועים תרבותי חשוב.\n- **מנסנה פרנסיסקנה**: מתחם היסטורי-דתי.\n- **קרנבל קוריינטס**: אם הביקור חופף לעונה (ינואר/פברואר).\n- **פארק מיטרה**: אחד הריאות הירוקות של העיר.",
    corrientes_activities_recommended: "- טיולים וספורט בטיילת.\n- ביקור בעיר העתיקה ובכנסיות שלה.\n- הנאה ממופע צ'ממה (מוזיקה טיפוסיקה).\n- חקירת שווקי האומנות לקניית מוצרי עור או קרמיקה.\n- דיג ספורטיבי בנהר פרנה (עם מדריכים מורשים).\n- ביקור במוזיאון הקרנבל (בעונה הנמוכה).\n- טיול יום מלא לאסטרוס דל איברה מקוריינטס (אם כי לינה שם היא האידיאלית).",
    corrientes_gastronomy_highlight: "הגסטרונומיה של קוריינטס מושפעת מאוד מהנהר, עם מנות המבוססות על דגים (דוראדו, סורובי, פאקו), והמסורת הגוארנית (מנדיוקה, צ'יפה). יש אפשרויות לכל הטעמים, כולל גריל ומטבח בינלאומי.\n\n### מסעדות מומלצות\n| מסעדה                  | סוג                       | ללא גלוטן | ללא סוכר |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| לה פריז'ה דל טיו      | גריל / בשרים              | check        | cross         |\n| פיצרייה לה פרביה       | פיצרייה                   | cross         | cross         |\n| אל סולר דל פרנה        | דגי נהר / אזורי           | check        | cross         |\n| לה רוסיטה              | אוכל ביתי                 | check        | check         |\n\n### קונדיטוריות ובתי קפה\n| קונדיטוריה              | סוג                       | ללא גלוטן | ללא סוכר |\n|-------------------------|:--------------------------:|:----------:|:----------:|\n| לה ביילה (מקומי)       | קפיטריה / קונדיטוריה      | cross         | cross         |\n| קפה מרטינס             | קפיטריה (רשת)            | check        | check         |\n| מאפיות מקומיות         | צ'יפה, מוצרים אזוריים     | check        | check         |",
    corrientes_accommodation_examples: "- שהייה בבית של קרובי משפחה\n- מלון דה טוריסמו קוריינטס\n- הוסטל דל ריו\n- דירות במרכז או ליד הטיילת\n- Airbnb בשכונות מגורים.",
    corrientes_coordinates: "- 27° 28' דרום 58° 49' מערב",
    corrientes_family_tips: "- העיר חמה ולחה; קחו בגדים קלים, כובע וקרם הגנה.\n- חיוני לקחת דוחה יתושים, במיוחד אם מתכננים להיות ליד הנהר.\n- תיהנו מהטיילת בשקיעה, זהו טיול פופולרי מאוד.\n- תושבי קוריינטס אדיבים ומכניסי אורחים מאוד.\n- שקלו טיול בסירה כדי לראות את העיר מהנהר.",
    corrientes_cultural_tips: "- הצ'ממה הוא קצב המוזיקה והריקוד המובהק של המחוז.\n- גוארני היא שפה רשמית-משותפת והשפעתה מורגשת בניב המקומי.\n- האדיקות לבתולה מאיטטי חזקה מאוד.\n- טררה (מאטה קר) הוא משקה פופולרי מאוד, במיוחד בקיץ.",
    corrientes_map_link_text: "צפה במפה גדולה יותר של קוריינטס",
    corrientes_map_link_url: "https://www.openstreetmap.org/#map=13/-27.468/-58.835",
    
    // Transport Leg Specific Keys (HE)
    transport_price_20k_ars: "ARS {price}",
    
    // Itinerary Program Section (HE)
    itinerary_program_title: "ניתוח והצעות למסלול",
    itinerary_program_current_plan_title: "סיכום התוכנית הנוכחית שלך:",
    itinerary_program_duration_label: "משך שהייה ב-{cityName}:",
    itinerary_program_optimization_tips_title: "טיפים לייעול הטיול שלך:",
    itinerary_optimization_tip_1: "קחו בחשבון זמני נסיעה ומנוחה בין יעדים ארוכים למניעת עייפות, במיוחד עם ילדים.",
    itinerary_optimization_tip_2: "הזמינו טיסות ואוטובוסים מראש, במיוחד בעונת השיא, כדי להבטיח זמינות ומחירים טובים יותר.",
    itinerary_optimization_tip_3: "בדקו את הלוגיסטיקה להגעה ליעדים מרוחקים כמו אסטרוס דל איברה (הסעות מערים קרובות).",
    itinerary_optimization_tip_4: "השאירו גמישות בימים מסוימים. יום חופשי או עם פחות פעילויות מתוכננות יכול להועיל.",
    itinerary_optimization_tip_5: "קבצו פעילויות לפי אזור גאוגרפי בתוך כל עיר כדי למזער זמני נסיעה.",
    itinerary_optimization_tip_6: "בטיסות פנים, בדקו את מדיניות הכבודה, שכן הן נוטות להיות מגבילות יותר מטיסות בינלאומיות.",

    // Budget Section
    budget_summary_title: "סיכום תקציב הטיול",
    budget_summary_desc: "הערכה כוללת המבוססת על הממוצעים היומיים של כל עיר. ניתן להתאים אישית את הערכים בדף של כל יעד.",
    budget_summary_total_label: "עלות משוערת כוללת לטיול:",
    budget_summary_calculating: "מחשב...",
    budget_summary_breakdown_title: "פירוט לפי קטגוריה",
    budget_table_concept: "סעיף",
    budget_table_estimated_price_usd: "מחיר משוער (USD)",
    budget_table_actions: "פעולות",
    budget_table_restore_defaults: "שחזר",
    budget_concept_accommodation: "לינה (לילה, משפחה)",
    budget_concept_food: "אוכל (ליום, משפחה)",
    budget_concept_transport: "תחבורה ציבורית (ליום)",
    budget_concept_activities: "פעילויות וסיורים (ליום)",
    budget_concept_museums: "כניסות למוזיאונים/אטרקציות",
    budget_concept_accommodation_full: "לינה (לילה, הכל כלול)",
    budget_concept_food_included: "אוכל (כלול במחיר)",
    budget_concept_transport_local: "תחבורה מקומית (בכפר)",
    budget_concept_activities_included: "פעילויות (כלולות במחיר)",
    budget_concept_international_flights: "טיסות בינלאומיות (משפחה)",
  },
};


const userProvidedTransportData: (string | number | (string | number)[])[] = [
    ["Buenos Aires", "Rosario", "Bus", "4 h", 20000, "<a href=\"https://www.flechabus.com.ar/\" target=\"_blank\">Flecha Bus</a>"],
    ["Rosario", "Bariloche", "Bus Nocturno", "20 h", 40000, "<a href=\"https://www.viabariloche.com.ar/\" target=\"_blank\">Via Bariloche</a>"],
    ["Bariloche", "Mendoza", "Vuelo", "1.5 h", 75000, "<a href=\"https://www.aerolineas.com.ar/\" target=\"_blank\">Aerolíneas Argentinas</a>"],
    ["Mendoza", "Jujuy", "Bus", "20 h", 45000, "<a href=\"https://www.andesmar.com/\" target=\"_blank\">Andesmar</a>"],
    ["Jujuy", "Iguazú", "Vuelo", "2 h", 95000, "<a href=\"https://www.aerolineas.com.ar/\" target=\"_blank\">Aerolíneas Argentinas</a>"],
    ["Iguazú", "Iberá", "Transfer", "5 h", 70000, "<a href=\"https://www.getyourguide.com/iguazu-falls-l461/iguazu-falls-shared-transfer-to-ibera-wetlands-t405401/\" target=\"_blank\">Transfers Privados</a>"],
    ["Iberá", "Corrientes", "Transfer", "4 h", 60000, "<a href=\"https://corrientes.tur.ar/\" target=\"_blank\">Transfers Locales</a>"],
    ["Corrientes", "Buenos Aires", "Vuelo", "1.5 h", 65000, "<a href=\"https://www.aerolineas.com.ar/\" target=\"_blank\">Aerolíneas Argentinas</a>"]
];

const cityNameToKeyMap: Record<string, string> = {
    "Buenos Aires": "buenosaires_title",
    "Rosario": "rosario_title",
    "Bariloche": "bariloche_title",
    "Mendoza": "mendoza_title",
    "Jujuy": "jujuy_title",
    "Iguazú": "iguazu_title",
    "Corrientes": "corrientes_title",
    "Iberá": "ibera_title"
};

export const TRANSPORT_DATA: TransportLeg[] = userProvidedTransportData.map((item, index) => ({
    id: (index + 1).toString(),
    fromKey: cityNameToKeyMap[item[0] as string] || (item[0] as string),
    toKey: cityNameToKeyMap[item[1] as string] || (item[1] as string),
    meanKey: `transport_mean_${(item[2] as string).toLowerCase().replace(/\s*\+\s*/, '_').replace(/\s+/, '_')}`, // e.g. transport_mean_bus or transport_mean_vuelo_bus
    timeKey: `transport_time_${(item[3] as string).toLowerCase().replace(/\s+/, '')}`, // e.g. transport_time_4h
    priceKey: 'transport_price_ars_generic', // Use a generic key for ARS prices
    company: item[5] as string, // This now directly holds the HTML string
    basePriceARS: item[4] as number,
}));

// Add dynamic translation keys for means and times if not already present
userProvidedTransportData.forEach(item => {
    const meanKey = `transport_mean_${(item[2] as string).toLowerCase().replace(/\s*\+\s*/, '_').replace(/\s+/, '_')}`;
    const timeKey = `transport_time_${(item[3] as string).toLowerCase().replace(/\s+/, '')}`;
    if (!translations.es[meanKey]) {
        translations.es[meanKey] = item[2] as string;
    }
    if (!translations.es[timeKey]) {
        translations.es[timeKey] = item[3] as string;
    }
    // Simple placeholder for Hebrew
    if (!translations.he[meanKey]) {
        const mean_es = item[2] as string;
        let mean_he = mean_es;
        if (mean_es.toLowerCase() === 'bus') mean_he = 'אוטובוס';
        if (mean_es.toLowerCase() === 'bus nocturno') mean_he = 'אוטובוס לילה';
        if (mean_es.toLowerCase() === 'vuelo') mean_he = 'טיסה';
        if (mean_es.toLowerCase() === 'transfer') mean_he = 'הסעה';
        translations.he[meanKey] = mean_he;
    }
    if (!translations.he[timeKey]) {
        translations.he[timeKey] = (item[3] as string).replace('h', 'ש');
    }
});

if (!translations.es['transport_price_ars_generic']) {
    translations.es['transport_price_ars_generic'] = "{price} ARS";
}
if (!translations.he['transport_price_ars_generic']) {
    translations.he['transport_price_ars_generic'] = "ARS {price}";
}

// For placeholder images if real ones are missing
export const DEFAULT_CITY_IMAGE = 'https://picsum.photos/seed/argentina/600/400';
