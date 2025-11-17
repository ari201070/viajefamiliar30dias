import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, FC } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { City, PointOfInterest } from '../types.ts';

declare const L: any; // Use 'any' for Leaflet since we're loading it from a CDN

interface InteractiveMapProps {
    cities: City[];
    selectedCityCoords?: [number, number];
    pointsOfInterest?: PointOfInterest[];
    zoomLevel?: number;
}

const InteractiveMap: FC<InteractiveMapProps> = ({ cities, selectedCityCoords, pointsOfInterest, zoomLevel = 5 }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const { t } = useAppContext();

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            const centerCoords: [number, number] = selectedCityCoords || [-40, -64]; // Center of Argentina approx.
            
            mapInstance.current = L.map(mapRef.current).setView(centerCoords, zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
        }

        // Clear existing markers before adding new ones
        mapInstance.current.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                mapInstance.current.removeLayer(layer);
            }
        });

        // Add city markers
        cities.forEach(city => {
            L.marker(city.coords).addTo(mapInstance.current)
                .bindPopup(`<b>${t(city.nameKey)}</b>`);
        });

        // Add points of interest markers for detail view
        if (pointsOfInterest) {
            pointsOfInterest.forEach(poi => {
                 L.circleMarker(poi.coords, {
                    color: 'red',
                    radius: 8,
                    fillOpacity: 0.7
                 }).addTo(mapInstance.current)
                .bindPopup(`<b>${t(poi.nameKey)}</b><br>${t(poi.descriptionKey)}`);
            });
        }
        
        // Pan and zoom if selected city changes
        if(selectedCityCoords) {
             mapInstance.current.setView(selectedCityCoords, zoomLevel);
        }


    }, [cities, selectedCityCoords, pointsOfInterest, zoomLevel, t]);

    return <div ref={mapRef} className="leaflet-container" />;
};

export default InteractiveMap;