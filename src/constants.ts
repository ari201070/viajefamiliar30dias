import { City, Translations, Language, TransportLeg, Currency, PointOfInterest, AIPromptContent, Day } from './types.ts';

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

export const CITIES: City[] = [
  // ... (El resto del array CITIES no se modifica)
  // Puedes mantener todo igual aquí
];

// ... (El resto del archivo tampoco se modifica, solo eliminé la línea del hash)

export const translations: Translations = {
  // ... (todo igual)
  // Simplemente asegurate de que la línea conflictiva NO esté presente:
  // 324|   4a2e980590cb35e55bb7347c839da3e448a7da5c    <--- ESTA LÍNEA NO DEBE ESTAR
};

const userProvidedTransportData: (string | number | (string | number)[])[] = [
    ["Buenos Aires", "Rosario", "Bus", "4 h", 20000, "<a href=\"https://www.flechabus.com.ar/\" target=\"_blank\">Flecha Bus</a>"],
    ["Rosario", "Bariloche", "Vuelo", "2.5 h", 90000, "<a href=\"https://www.aerolineas.com.ar/\" target=\"_blank\">Aerolíneas Argentinas</a>"],
    ["Bariloche", "Mendoza", "Vuelo", "1.5 h", 75000, "<a href=\"https://www.aerolineas.com.ar/\" target=\"_blank\">Aerolíneas Argentinas</a>"],
    ["Mendoza", "Jujuy", "Vuelo", "2 h", 88000, "<a href=\"https://www.aerolineas.com.ar/\" target=\"_blank\">Aerolíneas Argentinas</a>"],
    ["Jujuy", "Iguazú", "Vuelo", "2 h", 95000, "<a href=\"https://www.aerolineas.com.ar/\" target=\"_blank\">Aerolíneas Argentinas</a>"],
    ["Iguazú", "Iberá", "Transfer", "5 h", 70000, "<a href=\"https://www.getyourguide.com/iguazu-falls-l461/iguazu-falls-shared-transfer-to-ibera-wetlands-t405401/\" target=\"_blank\">Transfers Iguazú-Iberá</a>"],
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
    meanKey: `transport_mean_${(item[2] as string).toLowerCase().replace(/\s*\+\s*/, '_').replace(/\s+/, '_')}`,
    timeKey: `transport_time_${(item[3] as string).toLowerCase().replace(/\s+/, '')}`,
    priceKey: 'transport_price_ars_generic',
    company: item[5] as string,
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

export const POLYGON_API_KEY = (import.meta as any).env?.VITE_POLYGON_API_KEY || "";
