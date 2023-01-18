import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import { TripsLayer } from '@deck.gl/geo-layers';
import { IconLayer, PathLayer } from '@deck.gl/layers';
import Slider from "@mui/material/Slider";
import '../css/trip.css';
import legend from '../img/legend.png';

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});
    
const pointLight = new PointLight({
    color: [255, 255, 255],
    intensity: 2.0,
    position: [-74.05, 40.7, 8000]
});
  
const lightingEffect = new LightingEffect({ambientLight, pointLight});
  
const material = {
    ambient: 0.1,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [60, 64, 70]
};
  
const DEFAULT_THEME = {
    buildingColor: [74, 80, 87],
    trailColor0: [253, 128, 93],
    trailColor1: [23, 184, 190],
    material,
    effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = {
    longitude: 127.38,
    latitude: 36.38,
    zoom: 10,
    minZoom: 12,
    maxZoom: 20,
    pitch: 0,
    bearing: 0
};

const mapStyle = 'mapbox://styles/spear5306/ckzcz5m8w002814o2coz02sjc';
const MAPBOX_TOKEN = `pk.eyJ1Ijoic3BlYXI1MzA2IiwiYSI6ImNremN5Z2FrOTI0ZGgycm45Mzh3dDV6OWQifQ.kXGWHPRjnVAEHgVgLzXn2g`; // eslint-disable-line

const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

const Trip = props => {
    const minTime = props.minTime;
    const maxTime = props.maxTime;
    const time = props.time;
    const animationSpeed = 1;

    const busStopPoint = props.busStopPoint;
    const busStopPath = props.busStopPath;
    const busTrip = props.busTrip;
    const carTrip = props.carTrip;
    const busPassenger = props.busPassenger;

    const [animationFrame, setAnimationFrame] = useState('');

    const animate = () => {
        props.setTime(time => {
        if (time > maxTime) {
            return minTime;
        } else {
            return time + (0.01) * animationSpeed;
        };
        });
        const af = window.requestAnimationFrame(animate);
        setAnimationFrame(af);
    };

    const layers = [
        new PathLayer({
            id: 'bus-stop-path',
            data: busStopPath,
            pickable: true,
            widthScale: 1,
            widthMinPixels: 2,
            getPath: d => d.path,
            getColor: d => d.type === 1 ? [255, 0, 0] : [255, 255, 0],
            getWidth: d => 1
        }),
        new IconLayer({
            id: 'bus-stop-point',
            data: busStopPoint,
            pickable: false,
            iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
            iconMapping: ICON_MAPPING,
            sizeMinPixels: 20,
            sizeMaxPixels: 20,
            sizeScale: 5,
            getIcon: d => 'marker',
            getPosition: d => d.loc,
            getSize: d => 10,
            getColor: d => d.type === 1 ? [255, 0, 0] : [255, 255, 0]
        }),
        new TripsLayer({
            id: 'bus-trip',
            data: busTrip,
            getPath: d => d.trip,
            getTimestamps: d => d.timestamp,
            getColor: d => [255, 0, 0],
            opacity: 1,
            widthMinPixels: 5,
            trailLength: 1,
            rounded: true,
            currentTime: time,
            shadowEnabled: false,
        }),
        new TripsLayer({
            id: 'car-trip',
            data: carTrip,
            getPath: d => d.trip,
            getTimestamps: d => d.timestamp,
            getColor: d => d.type === 'munji' ? [0, 255, 0] : [0, 0, 255],
            opacity: 1,
            widthMinPixels: 5,
            trailLength: 1,
            rounded: true,
            currentTime: time,
            shadowEnabled: false,
        }),
        new TripsLayer({
            id: 'bus-passenger',
            data: busPassenger,
            getPath: d => d.trip,
            getTimestamps: d => d.timestamp,
            getColor: [220, 180, 140],
            opacity: 1,
            widthMinPixels: 5,
            trailLength: 1,
            rounded: true,
            currentTime: time,
            shadowEnabled: false,
        }),
    ];

    useEffect(() => {
        animate();
        return () => window.cancelAnimationFrame(animationFrame);
    }, []);

    const SliderChange = (value) => {
        const time = value.target.value;
        props.setTime(time);
    };

    return (
        <div className='trip-container' style={{position: 'relative'}}>
            <DeckGL
                effects={DEFAULT_THEME.effects}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
            >
                <Map
                mapStyle={mapStyle}
                mapboxAccessToken={MAPBOX_TOKEN}
                />
            </DeckGL>
            <h1 className='time'>
                TIME : {(String(parseInt(Math.round(time) / 60) % 24).length === 2) ? parseInt(Math.round(time) / 60) % 24 : '0'+String(parseInt(Math.round(time) / 60) % 24)} : {(String(Math.round(time) % 60).length === 2) ? Math.round(time) % 60 : '0'+String(Math.round(time) % 60)}
            </h1>
            <Slider
                id="slider"
                value={time}
                min={minTime}
                max={maxTime}
                onChange={SliderChange}
                track="inverted"
            />
            <img className='legend' src={legend}></img>
        </div>
    )
}

export default Trip;