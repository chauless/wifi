import React from 'react';
import L from 'leaflet';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import Basemap from "../basemap/Basemap";
import './Map.css';

import 'leaflet/dist/leaflet.css';

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

class MapComponent extends React.Component {

    state = {
        lat: 50.082,
        lng: 14.391,
        zoom: 14,
        basemap: 'osm'
    };

    onBMChange = (bm: string): void => {
        this.setState({
            basemap: bm
        });
    }

    render() {

        const basemapsDict: { [key: string]: string } = {
            osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            opnv: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
            dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
            cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
        }

        return (
            <MapContainer center={[this.state.lat, this.state.lng]} zoom={this.state.zoom} scrollWheelZoom={true}>
                <TileLayer
                    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={basemapsDict[this.state.basemap]}
                />
                <Basemap basemap={this.state.basemap} onChange={this.onBMChange} />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br/> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        );
    }
}

export default MapComponent;
