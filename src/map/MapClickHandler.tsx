import React from 'react';
import { useMapEvents } from 'react-leaflet';

const MapClickHandler: React.FC<{ state: any, setState: any }> = ({ state, setState }) => {
    // Add event listener for map click events
    useMapEvents({
        click: (e) => {
            // Get latitude and longitude from click event
            const { lat, lng } = e.latlng;

            // Update state with new marker position and showModal flag
            setState((prevState: any) => ({
                ...prevState,
                showModal: true,
                markerLat: lat,
                markerLng: lng
            }));
        }
    });

    return null;
};

export default MapClickHandler;
