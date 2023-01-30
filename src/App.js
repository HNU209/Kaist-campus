import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import Splash from "./components/Splash";
import Trip from "./components/Trip";
import "./css/app.css";

const fetchData = (name) => {
  const res = axios.get(`https://raw.githubusercontent.com/HNU209/Kaist-campus/main/src/data/${name}.json`);
  const data = res.then((r) => r.data);
  return data;
};

const App = () => {
  const [electricCarTrip, setElectricCarTrip] = useState([]);
  const [busTrip, setBusTrip] = useState([]);
  const [busFoot, setBusFoot] = useState([]);
  const [busStopLoc, setBusStopLoc] = useState([]);
  const [busPath, setBusPath] = useState([]);
  const [isloaded, setIsLoaded] = useState(false);

  const getData = useCallback(async () => {
    const electricCarTrip = await fetchData("electric_car_trip");
    const busTrip = await fetchData("shuttle_bus_trip");
    const busFoot = await fetchData("shuttle_bus_foot_trip");
    const busStopLoc = await fetchData("bus_stop_point");
    const busPath = await fetchData("bus_stop_path");

    setElectricCarTrip((prev) => electricCarTrip);
    setBusTrip((prev) => busTrip);
    setBusFoot((prev) => busFoot);
    setBusStopLoc((prev) => busStopLoc);
    setBusPath((prev) => busPath);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container">
      {!isloaded && <Splash />}
      {isloaded && (
        <>
          <Trip
            name={"버스"}
            busTrip={busTrip}
            busFoot={busFoot}
            busStopLoc={busStopLoc}
            busPath={busPath}
          ></Trip>
          <Trip name={"초소형 전기차"} electricCarTrip={electricCarTrip}></Trip>
        </>
      )}
    </div>
  );
};

export default App;
