import React from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from '../marker'

const markers = [
    {
        lat: 11.0543891,
        lng: 106.6652194,
        text: "Node 1",
        value: "No_1",
    },
    {
        lat: 11.0545158,
        lng: 106.6655872,
        text: "Node 2",
        value: "No_2",
    },

]

class GoogleMap extends React.Component {
    static defaultProps = {
        center: {
            lat: 10.9212591,
            lng: 106.6747851
        },
        zoom: 11
    };

    render() {
        const MapOption = {
            scrollwheel: false,
            fullscreenEnabled: false,
            zoomControl: true,
            rotateControl: false,
            clickableIcon: false};

        const {onMarkerClick, sensorData} = this.props

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '85vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "GOOGLE_MAPS_API" }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    options={MapOption}
                >
                    {markers.map(marker => (
                        <Marker
                            lat={marker.lat}
                            lng={marker.lng}
                            text={marker.text}
                            value={marker.value}
                            onClick={onMarkerClick}
                            sensorData={sensorData}
                        />
                    ))}
                </GoogleMapReact>
            </div>
        );
    }
}

export default GoogleMap;