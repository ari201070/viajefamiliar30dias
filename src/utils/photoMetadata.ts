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
async function reverseGeocode(latitude: number, longitude: number): Promise<string | undefined> {
    try {
        let apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        
        // Fail-safe: Si Vite no inyectó la clave del .env, usar la de firebaseCredentials (que es la misma en este proyecto)
        if (!apiKey || apiKey === 'undefined' || apiKey === '') {
            console.warn('⚠️ [DEBUG] VITE_GOOGLE_API_KEY missing from env, using fallback from credentials');
            apiKey = firebaseCredentials.apiKey;
        }

        console.log('🔑 [DEBUG] API Key available?', !!apiKey, apiKey ? apiKey.substring(0, 7) + '...' : 'MISSING');
        
        if (!apiKey) {
            console.warn('❌ [DEBUG] Google Maps API key NOT found.');
            return undefined;
        }

        // Google Maps Geocoding API - Reverse Geocoding
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=es`;
        console.log('🌐 [DEBUG] Fetching:', url.replace(apiKey, 'HIDDEN'));
        
        const response = await fetch(url);
        console.log('📡 [DEBUG] Response Status:', response.status);

        if (!response.ok) {
            console.error('❌ [DEBUG] HTTP Error:', response.status, response.statusText);
            const text = await response.text();
            console.error('❌ [DEBUG] Body:', text);
            return undefined;
        }

        const data = await response.json();
        console.log('📦 [DEBUG] Data Status:', data.status);
        
        if (data.status !== 'OK' || !data.results || data.results.length === 0) {
            console.warn('⚠️ [DEBUG] API returned error or no results:', data);
            return undefined;
        }

        // Prioridad de resultados:
        // 1. "point_of_interest" (restaurante, hotel, atracción)
        // 2. "establishment" (negocios en general)
        // 3. "premise" (edificio/dirección específica)
        // 4. "route" (calle)
        
        const results = data.results;
        
        // Buscar primero puntos de interés (restaurantes, hoteles, etc.)
        const poi = results.find((r: any) => 
            r.types.includes('point_of_interest') || 
            r.types.includes('establishment')
        );
        
        if (poi) {
            console.log('Google Maps reverse geocoding result:', {
                coords: { latitude, longitude },
                placeName: poi.name || poi.formatted_address,
                types: poi.types,
                fullData: poi
            });
            
            // Usar el nombre del lugar (ej: "Don Julio") en lugar de la dirección completa
            return poi.name || poi.formatted_address.split(',')[0];
        }
        
        // Si no hay POI, usar el primer resultado (generalmente la dirección)
        const firstResult = results[0];
        const placeName = firstResult.formatted_address.split(',')[0]; // Primera parte de la dirección
        
        console.log('Google Maps reverse geocoding result:', {
            coords: { latitude, longitude },
            placeName,
            types: firstResult.types,
            fullData: firstResult
        });

        return placeName;

    } catch (error) {
        console.error('Error in Google Maps reverse geocoding:', error);
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
