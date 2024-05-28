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

const MarkerFormModal: React.FC<MarkerFormModalProps> = ({
                                                             state,
                                                             handleCloseModal,
                                                             handleInputChange,
                                                             handleSubmit
                                                         }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <svg className="close" onClick={handleCloseModal} viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor"
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                </svg>

                <img className="animation" src="/router.svg" alt="wifi icon"/>

                <p>Latitude: {state.markerLat}</p>
                <p>Longitude: {state.markerLng}</p>
                <form onSubmit={handleSubmit}>
                    <label>
                        WiFi Name:
                        <input type="text" name="markerName" value={state.markerName} onChange={handleInputChange}/>
                    </label>
                    <br/>
                    <label>
                        Description:
                        <textarea name="markerDescription" value={state.markerDescription}
                                  onChange={handleInputChange}/>
                    </label>
                    <br/>
                    <button type="submit">Add Wifi network</button>
                </form>
            </div>
        </div>
    );
};

export default MarkerFormModal;
