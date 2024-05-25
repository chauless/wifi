import React from 'react';
import { useMapEvents } from 'react-leaflet';

const MapClickHandler: React.FC<{ state: any, setState: any }> = ({ state, setState }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
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
