import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import axios from "axios";
import Trip from "./components/Trip";
import "./css/app.css";

const getData = (name) => {
  const res = axios.get(`./data/${name}.json`);
  const data = res.then((r) => r.data);
  return data;
};

const App = () => {
  const minTime = 480;
  const maxTime = 660;
  const [time, setTime] = useState(minTime);
  const [busStopPoint, setBusStopPoint] = useState([]);
  const [busStopPath, setBusStopPath] = useState([]);
  const [busTrip, setBusTrip] = useState([]);
  const [carTrip, setCarTrip] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getFetchData = async () => {
      const car_trip = await getData("trip");
      const bus_stop_point = await getData("bus_stop_point");
      const bus_stop_path = await getData("bus_stop_path");
      const bus_trip = await getData("bus_trip");

      if (car_trip && bus_stop_point && bus_stop_path && bus_trip) {
        setCarTrip((prev) => car_trip);
        setBusStopPoint((prev) => bus_stop_point);
        setBusStopPath((prev) => bus_stop_path);
        setBusTrip((prev) => bus_trip);
        setLoaded(true);
      }
    };

    getFetchData();
  }, []);

  const SliderChange = (value) => {
    const time = value.target.value;
    setTime(time);
  };

  return (
    <div className="container">
      {loaded ? (
        <>
          <Trip
            busStopPoint={busStopPoint}
            busStopPath={busStopPath}
            carTrip={carTrip}
            busTrip={busTrip}
            minTime={minTime}
            maxTime={maxTime}
            time={time}
            setTime={setTime}
          ></Trip>
          <Slider
            id="slider"
            value={time}
            min={minTime}
            max={maxTime}
            onChange={SliderChange}
            track="inverted"
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
