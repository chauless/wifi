import React from 'react';
import './MarkerFormModal.css';

interface MarkerFormModalProps {
    state: {
        lat: number;
        lng: number;
        zoom: number;
        basemap: string;
        showModal: boolean;
        markerLat: number;
        markerLng: number;
        markerName: string;
        markerDescription: string;
    };
    handleCloseModal: () => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MarkerFormModal: React.FC<MarkerFormModalProps> = ({ state, handleCloseModal, handleInputChange, handleSubmit }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>&times;</span>

                <div id="animation"></div>

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
                    <button type="submit">Add Wifi network</button>
                </form>
            </div>
        </div>
    );
};

export default MarkerFormModal;
