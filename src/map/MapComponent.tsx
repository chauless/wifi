import React, {useState, useEffect} from 'react';
import L from 'leaflet';
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import BasemapSelector from "../basemap/BasemapSelector";
import './Map.css';
import MapClickHandler from "./MapClickHandler";
import {useOnline} from '@react-hooks-library/core'
import 'leaflet/dist/leaflet.css';
import MarkerFormModal from "./MarkerComponent";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const userLocationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
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
    const isOnline = useOnline();

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
        markerDescription: "",
        isOnline: navigator.onLine
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

    useEffect(() => {
        const handleOnlineStatus = () => {
            setState((prevState) => ({
                ...prevState,
                isOnline: navigator.onLine
            }));
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    useEffect(() => {
        if (!state.isOnline) {
            alert('Отсутствует подключение к интернету');
        }
    }, [state.isOnline]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Geolocation fetched: ", position);
                    const {latitude, longitude} = position.coords;
                    const userMarker: MarkerData = {
                        name: "Your Location",
                        description: "You are here",
                        lat: latitude,
                        lng: longitude
                    };
                    setState((prevState) => ({
                        ...prevState,
                        lat: latitude,
                        lng: longitude,
                        zoom: 14,
                        markers: [...prevState.markers, userMarker]
                    }));
                    localStorage.setItem('markers', JSON.stringify([...state.markers, userMarker]));
                },
                (error) => {
                    console.error("Error fetching geolocation: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
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

    const handleCloseModal = () => {
        setState((prevState) => ({
            ...prevState,
            showModal: false,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {markerLat, markerLng, markerName, markerDescription} = state;
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

        const audio = new Audio("/saveSound.mp3");
        audio.play().then(r => console.log("Sound played"));
    };

    return (
        <>
            {isOnline && (
                <MapContainer center={[state.lat, state.lng]} zoom={state.zoom} scrollWheelZoom={true}>
                    <TileLayer url={basemapsDict[state.basemap]}/>
                    <BasemapSelector basemap={state.basemap} onChange={onBMChange}/>
                    <MapClickHandler state={state} setState={setState}/>
                    {state.markers.map((marker, index) => (
                        <Marker key={index} position={[marker.lat, marker.lng]}
                                icon={marker.name === "Your Location" ? userLocationIcon : customIcon}>
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
            )}

            {state.showModal && (
                <MarkerFormModal
                    state={state}
                    handleCloseModal={handleCloseModal}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                />
            )}
        </>
    );
};

export default MapComponent;
