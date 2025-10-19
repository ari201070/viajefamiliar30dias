import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext.jsx';

const InteractiveMap = ({ cities, selectedCityCoords, pointsOfInterest, zoomLevel = 5 }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const { t } = useAppContext();

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            const centerCoords = selectedCityCoords || [-40, -64]; // Center of Argentina approx.
            
            mapInstance.current = L.map(mapRef.current).setView(centerCoords, zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
        }

        // Clear existing markers before adding new ones
        mapInstance.current.eachLayer((layer) => {
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