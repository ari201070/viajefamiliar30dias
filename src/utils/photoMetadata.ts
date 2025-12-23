import exifr from 'exifr';
import { firebaseCredentials } from '../firebaseCredentials';

export interface PhotoMetadata {
    dateTaken?: string; // ISO date string
    latitude?: number;
    longitude?: number;
    camera?: string;
    suggestedCityId?: string;
    suggestedCaption?: string; // Place name from reverse geocoding
}

/**
 * Realiza geocodificación inversa usando Google Maps Geocoding API
 * Convierte coordenadas GPS → nombre del lugar
 * Mucho más preciso que Nominatim para restaurantes, hoteles, etc.
 */
// Cache to store geocoding results and reduce API usage
const GEOCODE_CACHE_KEY = 'geocode_cache';
interface GeocodeCache {
    [key: string]: string;
}

function getGeocodeCache(): GeocodeCache {
    try {
        const cache = localStorage.getItem(GEOCODE_CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    } catch (e) {
        return {};
    }
}

function saveGeocodeResult(lat: number, lng: number, placeName: string) {
    try {
        const cache = getGeocodeCache();
        // Use 4 decimal places for key (~11m precision), sufficient for grouping nearby photos
        const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        cache[key] = placeName;
        localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.warn('Failed to save to geocode cache:', e);
    }
}

function checkGeocodeCache(lat: number, lng: number): string | undefined {
    const cache = getGeocodeCache();
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    return cache[key];
}

/**
 * Realiza geocodificación inversa + Places Nearby Search
 * 1. Busca en caché local.
 * 2. Intenta Google Geocoding API priorizando POIs.
 * 3. Si es genérico, intenta Google Places Nearby Search para mayor precisión.
 */
async function reverseGeocode(latitude: number, longitude: number): Promise<string | undefined> {
    // 1. Check Cache
    const cachedType = checkGeocodeCache(latitude, longitude);
    if (cachedType) {
        console.log('📍 [Geocoding] Cache hit:', cachedType);
        return cachedType;
    }

    let apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    // Fail-safe
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        console.warn('⚠️ [Geocoding] VITE_GOOGLE_API_KEY missing, using fallback.');
        apiKey = firebaseCredentials.apiKey;
    }

    if (!apiKey) {
        console.warn('❌ [Geocoding] No API Key available.');
        return undefined;
    }

    try {
        // 2. Try Geocoding API with result_type filtering
        // We ask for point_of_interest and establishment specifically to avoid generic street names if possible.
        // However, if we ONLY ask for these and there are none, we might get ZERO_RESULTS.
        // Strategy: Ask for everything but prioritize in code, or use a broad list.
        // Better Strategy from Plan: Use result_type in the query to hint what we want.
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=point_of_interest|establishment|premise&key=${apiKey}&language=es`;
        
        const geocodeRes = await fetch(geocodeUrl);
        const geocodeData = await geocodeRes.json();

        if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
            const result = geocodeData.results[0]; // Google ranks them by specificity usually
            const isSpecific = result.types.includes('point_of_interest') || result.types.includes('establishment') || result.types.includes('tourist_attraction');
            
            if (isSpecific) {
                // If it's a specific place, we trust it.
                // Depending on the result, 'formatted_address' might be "Don Julio, Guatemala 4699..."
                // We try to extract the name if it's available in address_components or just use the first part.
                // For Geocoding API, the 'name' field isn't always top-level like Places API.
                // Usually formatted_address starts with the name for establishments.
                const name = result.formatted_address.split(',')[0];
                
                // CRITICAL FIX: Google sometimes returns a "Plus Code" (e.g., "6J54+XR") OR a street address as the name.
                // We MUST reject these to force the Places Nearby fallback.
                
                // 1. Check for Plus Code
                const isPlusCode = /^[A-Z0-9]{2,8}\+[A-Z0-9]{2,5}$/.test(name.trim()) || name.includes('+');
                
                // 2. Check for Street Address patterns (starts with Av., Calle, Ruta, or contains numbers likely being an address)
                // This prevents "Av. Belgrano 500" from being accepted as a landmark name.
                // Updated to include full words "Avenida", "Boulevard"
                const isAddress = /^(Av\.|Avenida|Calle|Ruta|Camino|Bv\.|Boulevard|Autopista)\s/i.test(name) || (/\d+/.test(name) && !/^\d+\sde\s/.test(name)); // Allow "25 de Mayo" but reject "Belgrano 1234"

                if (!isPlusCode && !isAddress) {
                    console.log('📍 [Geocoding] Found POI via Geocoding:', name);
                    saveGeocodeResult(latitude, longitude, name);
                    return name;
                } else {
                    console.log(`📍 [Geocoding] Result "${name}" rejected (PlusCode/Address), falling back to Places Nearby...`);
                }
            }
        }

        // 3. Fallback: Places Nearby Search (New API v1)
        // Updated to use the modern "Places API (New)" which supports CORS and is what the user enabled.
        // Endpoint: https://places.googleapis.com/v1/places:searchNearby
        console.log('📍 [Geocoding] No specific POI from Geocoding, trying Places Nearby (New API)...');
        
        const placesUrl = `https://places.googleapis.com/v1/places:searchNearby`;
        const requestBody = {
            includedTypes: [
                "tourist_attraction", 
                "lodging", 
                "restaurant", 
                "park", 
                "museum", 
                "historical_landmark", 
                "place_of_worship", 
                "town_square", 
                "cultural_center"
            ],
            maxResultCount: 1,
            locationRestriction: {
                circle: {
                    center: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    radius: 300.0 // Increased from 150m to capture large monuments/plazas even if photo is from edge
                }
            },
            languageCode: "es"
        };

        const placesRes = await fetch(placesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress'
            },
            body: JSON.stringify(requestBody)
        });

        if (!placesRes.ok) {
             const errText = await placesRes.text();
             console.warn('⚠️ [Geocoding] Places API (New) request failed:', placesRes.status, errText);
        } else {
             const placesData = await placesRes.json();
             if (placesData.places && placesData.places.length > 0) {
                 const place = placesData.places[0];
                 const name = place.displayName ? place.displayName.text : null;
                 if (name) {
                     console.log('📍 [Geocoding] Found via Places Nearby (New):', name);
                     saveGeocodeResult(latitude, longitude, name);
                     return name;
                 }
             }
        }

        // 4. Final Fallback: Basic Geocoding (Address/Route)
        // If Places also fails (e.g. middle of nowhere), just get the locality/route from a basic geocode call without strict types
        // Or reuse the result from step 2 if we had any.
        if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
             const fallbackName = geocodeData.results[0].formatted_address.split(',')[0];
             console.log('📍 [Geocoding] Fallback to basic address:', fallbackName);
             saveGeocodeResult(latitude, longitude, fallbackName);
             return fallbackName;
        }

        return undefined;

    } catch (error) {
        console.error('❌ [Geocoding] Error:', error);
        return undefined;
    }
}

/**
 * Calcula la distancia entre dos puntos GPS (en km)
 * Usando la fórmula de Haversine
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Sugiere la ciudad más cercana basada en coordenadas GPS
 */
function suggestCityFromCoordinates(latitude: number, longitude: number): string | undefined {
    // Coordenadas aproximadas de las ciudades del itinerario
    // IMPORTANTE: Los IDs deben coincidir EXACTAMENTE con constants.ts
    const cityCoordinates: Record<string, { lat: number, lon: number }> = {
        'buenos-aires': { lat: -34.6037, lon: -58.3816 },
        'rosario': { lat: -32.9468, lon: -60.6393 },
        'bariloche': { lat: -41.1335, lon: -71.3103 },
        'mendoza': { lat: -32.8895, lon: -68.8458 },
        'malargue': { lat: -35.4756, lon: -69.5847 },
        'jujuy': { lat: -24.1858, lon: -65.2995 },
        'iguazu': { lat: -25.6953, lon: -54.4367 },
        'corrientes': { lat: -27.4692, lon: -58.8306 },
        'esteros_ibera': { lat: -28.5167, lon: -57.1833 } // Cambiado de 'ibera' a 'esteros_ibera'
    };

    let closestCity: string | undefined;
    let minDistance = Infinity;

    for (const [cityId, coords] of Object.entries(cityCoordinates)) {
        const distance = calculateDistance(latitude, longitude, coords.lat, coords.lon);
        if (distance < minDistance) {
            minDistance = distance;
            closestCity = cityId;
        }
    }

    // Solo sugerir si está dentro de 200km de una ciudad
    // (aumentado de 100km para cubrir áreas provinciales como Mercedes, Corrientes)
    return minDistance < 200 ? closestCity : undefined;
}

/**
 * Extrae metadatos EXIF de un archivo de imagen
 */
export async function extractPhotoMetadata(file: File): Promise<PhotoMetadata> {
    try {
        const exif = await exifr.parse(file, {
            gps: true,
            exif: true,
            iptc: false
        });

        if (!exif) {
            console.log('No EXIF data found in file:', file.name);
            return {};
        }

        const metadata: PhotoMetadata = {};

        // Extraer fecha y hora
        if (exif.DateTimeOriginal) {
            // DateTimeOriginal viene como Date object
            metadata.dateTaken = exif.DateTimeOriginal.toISOString().split('T')[0];
        } else if (exif.DateTime) {
            metadata.dateTaken = exif.DateTime.toISOString().split('T')[0];
        }

        // Extraer coordenadas GPS
        if (exif.latitude && exif.longitude) {
            metadata.latitude = exif.latitude;
            metadata.longitude = exif.longitude;
            
            // Sugerir ciudad basada en coordenadas
            metadata.suggestedCityId = suggestCityFromCoordinates(
                exif.latitude,
                exif.longitude
            );

            // Obtener nombre del lugar (geocodificación inversa)
            try {
                metadata.suggestedCaption = await reverseGeocode(
                    exif.latitude,
                    exif.longitude
                );
            } catch (error) {
                console.warn('Reverse geocoding failed, continuing without place name:', error);
            }
        }

        // Información de cámara (opcional)
        if (exif.Make && exif.Model) {
            metadata.camera = `${exif.Make} ${exif.Model}`.trim();
        } else if (exif.Model) {
            metadata.camera = exif.Model;
        }

        console.log('Extracted metadata for', file.name, metadata);
        return metadata;

    } catch (error) {
        console.error('Error extracting EXIF from', file.name, error);
        return {};
    }
}

/**
 * Extrae metadatos de múltiples archivos en paralelo
 */
export async function extractBatchMetadata(files: File[]): Promise<PhotoMetadata[]> {
    const promises = files.map(file => extractPhotoMetadata(file));
    return Promise.all(promises);
}
