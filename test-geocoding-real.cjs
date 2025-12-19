// test-geocoding-real.cjs
// Prueba de Geocoding + Places para identificar POIs precisos a partir de coordenadas.
// - Usa Places Nearby (rankby=distance) y Place Details para obtener nombre y dirección precisos.
// - Si la metadata de la foto incluye keywords (ej: "flores lago"), se usa como keyword para mejorar resultados.
// - Si no se encuentra POI cercano, hace reverse geocode como fallback.
// - Configurar GOOGLE_MAPS_API_KEY en las variables de entorno antes de ejecutar.

const https = require('https');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || ''; // Recomendado: export GOOGLE_MAPS_API_KEY="tu_key"

// Umbral en metros para considerar que un POI está "en" la coordenada (ajustar según precisión GPS)
const POI_DISTANCE_THRESHOLD_M = 150;

// Casos de prueba. Puedes agregar { name, lat, lng, keywords } donde keywords es string con palabras separadas por espacio.
const TEST_CASES = [
    { name: 'VIP Rosario', lat: -32.9493526, lng: -60.6300769 },
    { name: 'Esteros del Iberá', lat: -28.539824, lng: -57.147255 },
    // Ejemplo con coordenada del Parque Japonés y keywords para ayudar al match
    { name: 'Parque Japones (ejemplo)', lat: -34.5753016666667, lng: -58.4089783333333, keywords: 'flores lago jardín' }
];

// Helper: petición HTTPS GET y parseo JSON
function getJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(new Error('Error parseando JSON: ' + e.message));
                }
            });
        }).on('error', (e) => {
            reject(new Error('Error de red: ' + e.message));
        });
    });
}

// Haversine: distancia en metros entre dos coordenadas
function distanceMeters(lat1, lng1, lat2, lng2) {
    const toRad = (v) => v * Math.PI / 180;
    const R = 6371000; // metros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Llamada al Places Nearby Search (rankby=distance)
// Opcional: keyword para priorizar resultados relacionados con la foto (flores, lago, etc.)
async function placesNearby(lat, lng, type, keyword) {
    // Construimos URL. rankby=distance implica que no se usa radius.
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=${encodeURIComponent(type)}&key=${API_KEY}&language=es`;
    if (keyword && keyword.trim().length > 0) {
        url += `&keyword=${encodeURIComponent(keyword)}`;
    }
    const json = await getJSON(url);
    return json;
}

// Places Text Search (útil cuando tenemos keywords y queremos buscar por texto alrededor de la ubicacion)
async function placesTextSearch(lat, lng, queryStr, radiusMeters = 500) {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(queryStr)}&location=${lat},${lng}&radius=${radiusMeters}&key=${API_KEY}&language=es`;
    const json = await getJSON(url);
    return json;
}

// Place Details
async function placeDetails(place_id, fields = ['name','formatted_address','geometry','types']) {
    const fieldsParam = fields.join(',');
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=${encodeURIComponent(fieldsParam)}&key=${API_KEY}&language=es`;
    const json = await getJSON(url);
    return json;
}

// Reverse Geocode
async function reverseGeocode(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}&language=es`;
    const json = await getJSON(url);
    return json;
}

// Lógica para encontrar el mejor POI: intenta Nearby por tipos, usa keyword si está, TextSearch como refuerzo, y fallback a reverse geocode.
async function findBestPlace(lat, lng, keywords) {
    // Tipos en orden de preferencia
    const typesToTry = ['point_of_interest', 'park', 'tourist_attraction', 'establishment'];

    // Si hay keywords, intentamos Text Search primero (con radius razonable) para capturar cosas como "parque japones"
    if (keywords && keywords.trim().length > 0) {
        try {
            const q = keywords.trim();
            const textRes = await placesTextSearch(lat, lng, q, 1000); // 1 km radius
            if (textRes.status === 'OK' && Array.isArray(textRes.results) && textRes.results.length > 0) {
                // Revisamos si alguno de los resultados está suficientemente cerca
                for (const r of textRes.results) {
                    if (!r.geometry || !r.geometry.location) continue;
                    const d = distanceMeters(lat, lng, r.geometry.location.lat, r.geometry.location.lng);
                    if (d <= POI_DISTANCE_THRESHOLD_M) {
                        // Tenemos match textual cercano; pedimos detalles
                        try {
                            if (r.place_id) {
                                const det = await placeDetails(r.place_id);
                                if (det.status === 'OK' && det.result) {
                                    return {
                                        source: 'text_search_place_details',
                                        distanceMeters: Math.round(d),
                                        place: det.result
                                    };
                                }
                            }
                            // Si no hay place_id o detalles, devolvemos el result básico
                            return {
                                source: 'text_search_basic',
                                distanceMeters: Math.round(d),
                                place: {
                                    name: r.name,
                                    formatted_address: r.formatted_address || r.vicinity,
                                    geometry: r.geometry,
                                    types: r.types
                                }
                            };
                        } catch (e) {
                            // continuar con la búsqueda normal en caso de error
                            console.warn('Warning: error obteniendo detalles desde text search:', e.message);
                        }
                    }
                }
            }
        } catch (err) {
            console.warn('Warning: error en Text Search:', err.message);
        }
    }

    // Intentamos Nearby por tipos, usando keyword si existe
    for (const type of typesToTry) {
        try {
            const nearRes = await placesNearby(lat, lng, type, keywords);
            if (nearRes.status === 'OK' && Array.isArray(nearRes.results) && nearRes.results.length > 0) {
                for (const r of nearRes.results) {
                    const loc = r.geometry && r.geometry.location;
                    if (!loc) continue;
                    const d = distanceMeters(lat, lng, loc.lat, loc.lng);
                    if (d <= POI_DISTANCE_THRESHOLD_M) {
                        // Pedimos detalles para asegurar formatted_address y tipos
                        try {
                            if (r.place_id) {
                                const det = await placeDetails(r.place_id);
                                if (det.status === 'OK' && det.result) {
                                    return {
                                        source: 'nearby_place_details',
                                        typeSearched: type,
                                        distanceMeters: Math.round(d),
                                        place: det.result
                                    };
                                }
                            }
                        } catch (e) {
                            // Si falla Place Details, devolvemos el nearby básico
                            return {
                                source: 'nearby_basic',
                                typeSearched: type,
                                distanceMeters: Math.round(d),
                                place: {
                                    name: r.name,
                                    vicinity: r.vicinity,
                                    geometry: r.geometry,
                                    types: r.types
                                }
                            };
                        }
                    }
                }
            } else {
                // seguir con el siguiente tipo
            }
        } catch (err) {
            console.warn(`Warning: error buscando nearby tipo=${type}: ${err.message}`);
        }
    }

    // Fallback: reverse geocode y tratar de encontrar en los resultados un point_of_interest o establishment cercano
    try {
        const geocode = await reverseGeocode(lat, lng);
        if (geocode.status === 'OK' && Array.isArray(geocode.results) && geocode.results.length > 0) {
            const poi = geocode.results.find(r =>
                r.types.includes('point_of_interest') ||
                r.types.includes('establishment') ||
                r.types.includes('park') ||
                r.types.includes('tourist_attraction')
            );
            const best = poi || geocode.results[0];
            return {
                source: 'reverse_geocode',
                geocodeStatus: geocode.status,
                place: {
                    formatted_address: best.formatted_address,
                    types: best.types,
                    address_components: best.address_components,
                    geometry: best.geometry
                }
            };
        } else {
            return { source: 'reverse_geocode', geocodeStatus: geocode.status, place: null };
        }
    } catch (err) {
        throw new Error('Error en reverseGeocode: ' + err.message);
    }
}

// Ejecución principal
(async () => {
    if (!API_KEY || API_KEY.length < 10) {
        console.error('❌ ERROR: GOOGLE_MAPS_API_KEY no configurada. Exportala como variable de entorno antes de ejecutar.');
        console.error('   En *nix: export GOOGLE_MAPS_API_KEY="tu_key"');
        process.exit(1);
    }

    console.log('Iniciando test de Geocoding + Places...');
    for (const t of TEST_CASES) {
        console.log(`\n--- Probando: ${t.name} (${t.lat}, ${t.lng}) ---`);
        try {
            const result = await findBestPlace(t.lat, t.lng, t.keywords);
            if (!result) {
                console.log('⚠️ No se obtuvo resultado.');
                continue;
            }

            if (result.source === 'place_details' || result.source === 'nearby_place_details' || result.source === 'text_search_place_details') {
                const p = result.place;
                console.log('✅ POI detectado con Place Details:');
                console.log('   Nombre:', p.name || 'N/D');
                console.log('   Dirección:', p.formatted_address || 'N/D');
                if (p.types) console.log('   Tipos:', p.types.join(', '));
                if (result.distanceMeters !== undefined && result.distanceMeters !== null) console.log('   Distancia estimada (m):', result.distanceMeters);
                console.log('   Fuente:', result.source, result.typeSearched ? `(tipo buscado: ${result.typeSearched})` : '');
            } else if (result.source === 'nearby_basic' || result.source === 'text_search_basic') {
                const p = result.place;
                console.log('✅ POI detectado (básico):');
                console.log('   Nombre:', p.name || 'N/D');
                console.log('   Dirección/Vicinity:', p.formatted_address || p.vicinity || 'N/D');
                if (p.types) console.log('   Tipos:', p.types.join(', '));
                if (result.distanceMeters !== undefined && result.distanceMeters !== null) console.log('   Distancia estimada (m):', result.distanceMeters);
                console.log('   Fuente:', result.source);
            } else if (result.source === 'reverse_geocode') {
                if (result.place) {
                    console.log('🔎 No se encontró POI cercano. Resultado de Reverse Geocode:');
                    console.log('   Dirección:', result.place.formatted_address || 'N/D');
                    if (result.place.types) console.log('   Tipos:', result.place.types.join(', '));
                } else {
                    console.log('❌ Reverse Geocode no devolvió resultados. Estado:', result.geocodeStatus);
                }
            } else {
                console.log('Resultado:', result);
            }
        } catch (err) {
            console.error('❌ Error durante la búsqueda:', err.message);
        }
    }
})();