import React, { useState } from 'react';
import './css/MarkerFormModal.css';

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
                                                             handleSubmit,
                                                         }) => {
    const [errors, setErrors] = useState({
        markerName: '',
        markerDescription: '',
    });

    const validateField = (name: string, value: string) => {
        if (value.length < 2) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: 'Field must be at least 2 characters long',
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
        handleInputChange(e);
    };

    const validateForm = () => {
        const { markerName, markerDescription } = state;
        const newErrors = {
            markerName: markerName.length < 2 ? 'Field must be at least 2 characters long' : '',
            markerDescription: markerDescription.length < 2 ? 'Field must be at least 2 characters long' : '',
        };
        setErrors(newErrors);
        return !newErrors.markerName && !newErrors.markerDescription;
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            handleSubmit(e);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <svg className="close" onClick={handleCloseModal} viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor"
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                </svg>

                <img className="animation" src="/router.svg" alt="wifi icon"/>

                <form onSubmit={onSubmit}>
                    <label>
                        WiFi Name:
                        <input type="text" name="markerName" value={state.markerName} onChange={onInputChange}/>
                        {errors.markerName && <span className="error">{errors.markerName}</span>}
                    </label>
                    <label>
                        Description:
                        <textarea name="markerDescription" value={state.markerDescription}
                                  onChange={onInputChange}/>
                        {errors.markerDescription && <span className="error">{errors.markerDescription}</span>}
                    </label>
                    <br/>
                    <label>
                        Latitude:
                        <input type="text" name="markerLat" value={state.markerLat} readOnly/>
                    </label>
                    <label>
                        Longitude:
                        <input type="text" name="markerLng" value={state.markerLng} readOnly/>
                    </label>
                    <button type="submit" disabled={!!errors.markerName || !!errors.markerDescription}>
                        Add Wifi network
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MarkerFormModal;
