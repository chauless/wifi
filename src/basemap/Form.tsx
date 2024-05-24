import React from 'react';

const Form: React.FC = () => {
    return (
        <div className="form-container">
            <div className="form-content">
                <h2>Add WiFi Router</h2>
                <form>
                    <label>
                        WiFi Name:
                        <input type="text" name="wifiName" />
                    </label>
                    <br />
                    <label>
                        Description:
                        <textarea name="description" />
                    </label>
                    <br />
                    <button type="submit">Add WiFi Router</button>
                </form>
            </div>
        </div>
    );
};

export default Form;
