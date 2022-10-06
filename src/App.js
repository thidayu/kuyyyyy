import "./App.css";

import { useEffect, useState } from "react";
import * as React from "react";
// import { DataGrid } from '@material-ui/data-grid';

function App() {
  const [data, setData] = useState([]);

  const axios = require("axios");
  const config = {
    method: "get",
    url: "http://localhost:3300/ems_event",
  };

  useEffect(() => {
    axios(config)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const arr = data.map((data, index) => {
    return (
      <tr>
        <th>{data.eventid}</th>
        <th>{data.applicationname}</th>
        <th>{data.cameraname}</th>
        <th>{data.eventname}</th>
        <th>{data.levelpriority}</th>
        <th>{data.monitorid}</th>
        <th>{data.regionname}</th>
        <th>{data.startedat}</th>
        <th>{data.zonename}</th>
      </tr>
    );
  });

  return (
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Test API</h1>
          <table>
            <tr>
              <th>ID</th>
              <th>Name of Application</th>
              <th>Camera</th>
              <th>Name of Event</th>
              <th>Level</th>
              <th>monitor</th>
              <th>location</th>
              <th>Datetime</th>
              <th>zoneName</th>
            </tr>
            {arr}
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

