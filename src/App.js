import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Trip from "./components/Trip";
import "./css/app.css";

const getData = (name) => {
  const res = axios.get(`https://raw.githubusercontent.com/HNU209/Kaist-campus/main/src/data/${name}.json`);
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
  const [busPassenger, setBusPassenger] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getFetchData = async () => {
      const car_trip = await getData("trip");
      const bus_stop_point = await getData("bus_stop_point");
      const bus_stop_path = await getData("bus_stop_path");
      const bus_trip = await getData("bus_trip");
      const bus_passenger = await getData("bus_passenger");

      if (
        car_trip &&
        bus_stop_point &&
        bus_stop_path &&
        bus_trip &&
        bus_passenger
      ) {
        setCarTrip((prev) => car_trip);
        setBusStopPoint((prev) => bus_stop_point);
        setBusStopPath((prev) => bus_stop_path);
        setBusTrip((prev) => bus_trip);
        setBusPassenger((prev) => bus_passenger);
        setLoaded(true);
      }
    };

    getFetchData();
  }, []);

  return (
    <div className="container">
      {loaded ? (
        <>
          <Trip
            busStopPoint={busStopPoint}
            busStopPath={busStopPath}
            busTrip={busTrip}
            busPassenger={busPassenger}
            minTime={minTime}
            maxTime={maxTime}
            time={time}
            setTime={setTime}
          ></Trip>
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

        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
