import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, FC } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { City, PointOfInterest } from '../types.ts';

// Define un tipo para las capas de marcadores para poder limpiarlas selectivamente.
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
    const markersRef = useRef<MarkerLayers>([]); // Usamos una ref para guardar los marcadores
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

        // Función de limpieza: se ejecuta cuando el componente se desmonta.
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []); // El array vacío [] asegura que esto se ejecute solo una vez.

    // EFECTO 2: Se ejecuta SOLO cuando la vista seleccionada cambia.
    useEffect(() => {
        if (mapInstance.current && selectedCityCoords) {
             mapInstance.current.setView(selectedCityCoords, zoomLevel);
        }
    }, [selectedCityCoords, zoomLevel]);

    // EFECTO 3: Se ejecuta SOLO si los datos de los marcadores (ciudades, POIs) cambian.
    useEffect(() => {
        if (!mapInstance.current) return; // No hacer nada si el mapa no está listo.

        // Limpia los marcadores anteriores
        markersRef.current.forEach(marker => {
            if (mapInstance.current) {
                mapInstance.current.removeLayer(marker);
            }
        });
        markersRef.current = []; // Resetea la referencia

        // Añade los marcadores de las ciudades
        cities.forEach(city => {
            const marker = L.marker(city.coords).bindPopup(`<b>${t(city.nameKey)}</b>`);
            if (mapInstance.current) {
                marker.addTo(mapInstance.current);
                markersRef.current.push(marker);
            }
        });

        // Añade los marcadores de los puntos de interés
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
    }, [cities, pointsOfInterest, t]); // 't' es necesario aquí para los popups

    // Se eliminó la declaración 'declare const L: any;' porque ya se importa arriba.
    return <div ref={mapRef} className="leaflet-container" />;
};

export default InteractiveMap;