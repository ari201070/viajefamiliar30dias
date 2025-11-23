/* src/components/InteractiveMap.tsx */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, FC } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { City, PointOfInterest } from '../types.ts';

// --- ARREGLO PARA LOS ICONOS ROTOS DE LEAFLET EN VITE ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});
// --- FIN DEL ARREGLO ---

type MarkerLayers = (L.Marker | L.CircleMarker)[];

interface InteractiveMapProps {
    cities: City[];
    selectedCityCoords?: [number, number];
    pointsOfInterest?: PointOfInterest[];
    zoomLevel?: number;
}

const InteractiveMap: FC<InteractiveMapProps> = ({ cities, selectedCityCoords, pointsOfInterest, zoomLevel = 5 }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersRef = useRef<MarkerLayers>([]);
    const { t } = useAppContext();

    // EFECTO 1: Se ejecuta UNA SOLA VEZ para crear el mapa.
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            const centerCoords: [number, number] = selectedCityCoords || [-40, -64];

            mapInstance.current = L.map(mapRef.current).setView(centerCoords, zoomLevel);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // EFECTO 2: Centra la vista cuando las coordenadas cambian.
    useEffect(() => {
        if (mapInstance.current && selectedCityCoords) {
            mapInstance.current.setView(selectedCityCoords, zoomLevel);
        }
    }, [selectedCityCoords, zoomLevel]);

    // EFECTO 3: Actualiza los marcadores cuando los datos cambian.
    useEffect(() => {
        if (!mapInstance.current) return;

        markersRef.current.forEach(marker => {
            if (mapInstance.current) mapInstance.current.removeLayer(marker);
        });
        markersRef.current = [];

        cities.forEach(city => {
            const marker = L.marker(city.coords).bindPopup(`<b>${t(city.nameKey)}</b>`);
            if (mapInstance.current) {
                marker.addTo(mapInstance.current);
                markersRef.current.push(marker);
            }
        });

        if (pointsOfInterest) {
            pointsOfInterest.forEach(poi => {
                const circleMarker = L.circleMarker(poi.coords, {
                    color: 'red',
                    radius: 8,
                    fillOpacity: 0.7
                }).bindPopup(`<b>${t(poi.nameKey)}</b><br>${t(poi.descriptionKey)}`);

                if (mapInstance.current) {
                    circleMarker.addTo(mapInstance.current);
                    markersRef.current.push(circleMarker);
                }
            });
        }
    }, [cities, pointsOfInterest, t]);

    return <div ref={mapRef} className="leaflet-container" />;
};

export default InteractiveMap;