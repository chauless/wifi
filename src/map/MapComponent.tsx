import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import BasemapSelector from '../basemap/BasemapSelector';
import './css/Map.css';
import MapClickHandler from './MapClickHandler';
import { useOnline } from '@react-hooks-library/core';
import 'leaflet/dist/leaflet.css';
import MarkerFormModal from './MarkerComponent';
import { db, collection, addDoc, getDocs } from './extras/firebase';
import {MarkerData} from "./extras/types";
import {customIcon, userLocationIcon} from "./extras/icons";

L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.5.0/dist/images/';

const MapComponent: React.FC = () => {
    // Check if user is online
    const isOnline = useOnline();

    // Initialize state with default values
    const [state, setState] = useState({
        lat: 50.082,
        lng: 14.391,
        zoom: 14,
        basemap: 'osm',
        markers: [] as MarkerData[],
        showModal: false,
        markerLat: 0,
        markerLng: 0,
        markerName: '',
        markerDescription: '',
        isOnline: navigator.onLine,
    });

    // Fetch markers from Firebase when the component mounts
    useEffect(() => {
        const fetchMarkers = async () => {
            const querySnapshot = await getDocs(collection(db, 'markers'));
            const markers = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    lat: data.lat,
                    lng: data.lng,
                } as MarkerData;
            });
            setState(prevState => ({ ...prevState, markers }));
        };
        fetchMarkers();
    }, []);

    // Load saved markers from local storage when the component mounts
    useEffect(() => {
        const savedMarkers = localStorage.getItem('markers');
        if (savedMarkers) {
            setState(prevState => ({
                ...prevState,
                markers: JSON.parse(savedMarkers),
            }));
        }
    }, []);

    // Update state with online status changes
    useEffect(() => {
        const handleOnlineStatus = () => {
            setState(prevState => ({
                ...prevState,
                isOnline: navigator.onLine,
            }));
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    // Alert the user if they are offline
    useEffect(() => {
        if (!state.isOnline) {
            alert('Отсутствует подключение к интернету');
        }
    }, [state.isOnline]);

    // Get the user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log('Geolocation fetched: ', position);
                    const { latitude, longitude } = position.coords;
                    const userMarker: MarkerData = {
                        name: 'Your Location',
                        description: 'You are here',
                        lat: latitude,
                        lng: longitude,
                    };
                    setState(prevState => ({
                        ...prevState,
                        lat: latitude,
                        lng: longitude,
                        zoom: 14,
                        markers: [...prevState.markers, userMarker],
                    }));
                    localStorage.setItem('markers', JSON.stringify([...state.markers, userMarker]));
                },
                error => {
                    console.error('Error fetching geolocation: ', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    // Handle basemap changes
    const onBMChange = (bm: string): void => {
        setState(prevState => ({
            ...prevState,
            basemap: bm,
        }));
    };

    // Basemaps dictionary
    const basemapsDict: { [key: string]: string } = {
        osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        opnv: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        cycle: 'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    };

    // Handle modal open/close
    const handleCloseModal = () => {
        setState(prevState => ({
            ...prevState,
            showModal: false,
        }));
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { markerLat, markerLng, markerName, markerDescription } = state;
        const newMarker: MarkerData = {
            name: markerName,
            description: markerDescription,
            lat: markerLat,
            lng: markerLng,
        };

        // Save marker to Firebase
        try {
            await addDoc(collection(db, 'markers'), newMarker);
            console.log('Document written with ID: ', newMarker.id);
            setState(prevState => ({
                ...prevState,
                markers: [...prevState.markers, newMarker],
                showModal: false,
                markerName: '',
                markerDescription: '',
            }));

            // Play sound when marker is saved
            const audio = new Audio('/saveSound.mp3');
            audio.play().then(r => console.log('Sound played'));
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <>
            {isOnline && (
                <MapContainer center={[state.lat, state.lng]} zoom={state.zoom} scrollWheelZoom={true}>
                    <TileLayer url={basemapsDict[state.basemap]} />
                    <BasemapSelector basemap={state.basemap} onChange={onBMChange} />
                    <MapClickHandler state={state} setState={setState} />
                    {state.markers.map((marker, index) => (
                        // Display markers on the map
                        <Marker
                            key={index}
                            position={[marker.lat, marker.lng]}
                            icon={marker.name === 'Your Location' ? userLocationIcon : customIcon}
                        >
                            {/*Popup with marker information*/}
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

            {/*Show modal form when user clicks on the map*/}
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
