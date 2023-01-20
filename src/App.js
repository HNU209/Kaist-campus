import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Trip from "./components/Trip";
import Splash from "./components/Splash";
import "./css/app.css";

const getData = (name) => {
  const res = axios.get(`data/${name}.json`);
  // const res = axios.get(`https://raw.githubusercontent.com/HNU209/Kaist-campus/main/src/data/${name}.json`);
  const data = res.then((r) => r.data);
  return data;
};

const App = () => {
  const minTime = 480;
  const maxTime = 660;
  const [time, setTime] = useState(minTime);
  const [electricCarTrip, setElectricCarTrip] = useState([]);
  const [busTrip, setBusTrip] = useState([]);
  const [busFoot, setBusFoot] = useState([]);
  const [busStopLoc, setBusStopLoc] = useState([]);
  const [busPath, setBusPath] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getFetchData = async () => {
      const electricCarTrip = await getData("electric_car_trip");
      const busTrip = await getData("bus_trip");
      const busFoot = await getData("bus_foot");
      const busStopLoc = await getData("bus_stop_point");
      const busPath = await getData("bus_stop_path");

      if (electricCarTrip && busStopLoc && busPath && busTrip && busFoot) {
        setElectricCarTrip((prev) => electricCarTrip);
        setBusTrip((prev) => busTrip);
        setBusFoot((prev) => busFoot);
        setBusStopLoc((prev) => busStopLoc);
        setBusPath((prev) => busPath);
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
            busTrip={busTrip}
            busFoot={busFoot}
            busStopLoc={busStopLoc}
            busPath={busPath}
            minTime={minTime}
            maxTime={maxTime}
            time={time}
            setTime={setTime}
          ></Trip>
          <Trip
            electricCarTrip={electricCarTrip}
            minTime={minTime}
            maxTime={maxTime}
            time={time}
            setTime={setTime}
          ></Trip>
        </>
      ) : (
        <Splash></Splash>
      )}
    </div>
  );
};

export default App;
