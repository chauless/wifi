import React, { ChangeEvent, Component, ReactNode } from 'react';

interface BasemapProps {
    basemap: string;
    onChange?: (basemap: string) => void;
}

class BasemapSelector extends Component<BasemapProps> {
    onChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        const bm: string = e.currentTarget.value;

        if (this.props.onChange) {
            this.props.onChange(bm);
        }
    }

    render(): ReactNode {
        return (
            <div className="basemaps-container">
                <select value={this.props.basemap} onChange={this.onChange}>
                    <option value="osm">OSM</option>
                    <option value="opnv">OPNV (public transport)</option>
                    <option value="dark">DARK</option>
                    <option value="cycle">CYCLE MAP</option>
                </select>
            </div>
        );
    }
}

export default BasemapSelector;