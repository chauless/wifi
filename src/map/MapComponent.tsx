// Обновленный компонент MapComponent

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import Basemap from "../basemap/Basemap";
import './Map.css';

import 'leaflet/dist/leaflet.css';

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MarkerData {
    name: string;
    description: string;
    lat: number;
    lng: number;
}

const MapComponent: React.FC = () => {
    const [state, setState] = useState({
        lat: 50.082,
        lng: 14.391,
        zoom: 14,
        basemap: 'osm',
        markers: [] as MarkerData[],
        showModal: false,
        markerLat: 0,
        markerLng: 0,
        markerName: "",
        markerDescription: ""
    });

    useEffect(() => {
        const savedMarkers = localStorage.getItem('markers');
        if (savedMarkers) {
            setState((prevState) => ({
                ...prevState,
                markers: JSON.parse(savedMarkers)
            }));
        }
    }, []);

    const onBMChange = (bm: string): void => {
        setState((prevState) => ({
            ...prevState,
            basemap: bm
        }));
    };

    const basemapsDict: { [key: string]: string } = {
        osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        opnv: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
        dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                setState((prevState) => ({
                    ...prevState,
                    showModal: true,
                    markerLat: lat,
                    markerLng: lng
                }));
            }
        });
        return null;
    };

    const handleCloseModal = () => {
        setState((prevState) => ({
            ...prevState,
            showModal: false,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { markerLat, markerLng, markerName, markerDescription } = state;
        const newMarker: MarkerData = {
            name: markerName,
            description: markerDescription,
            lat: markerLat,
            lng: markerLng
        };
        setState((prevState) => ({
            ...prevState,
            markers: [...prevState.markers, newMarker],
            showModal: false,
            markerName: "",
            markerDescription: ""
        }));
        localStorage.setItem('markers', JSON.stringify([...state.markers, newMarker]));
    };

    return (
        <>
            <MapContainer center={[state.lat, state.lng]} zoom={state.zoom} scrollWheelZoom={true}>
                <TileLayer url={basemapsDict[state.basemap]} />
                <Basemap basemap={state.basemap} onChange={onBMChange} />
                <MapClickHandler />
                {state.markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={[marker.lat, marker.lng]}
                        icon={customIcon} // Используем разные иконки для активного и неактивного маркера
                    >
                        <Popup>
                            <div>
                                <h3>{marker.name}</h3>
                                <p>{marker.description}</p>
                                <p>Latitude: {marker.lat}</p>
                                <p>Longitude: {marker.lng}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            {state.showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <p>Latitude: {state.markerLat}</p>
                        <p>Longitude: {state.markerLng}</p>
                        <form onSubmit={handleSubmit}>
                            <label>
                                WiFi Name:
                                <input type="text" name="markerName" value={state.markerName} onChange={handleInputChange} />
                            </label>
                            <br />
                            <label>
                                Description:
                                <textarea name="markerDescription" value={state.markerDescription} onChange={handleInputChange} />
                            </label>
                            <br />
                            <button type="submit">Add WiFi Router</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MapComponent;
