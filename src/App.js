import "./App.css";
import { useEffect, useState } from "react";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

function App() {
  const [data, setData] = useState([]);
  const [frImage, setFrImage] = useState([]);
  const [intrusionImage, setIntrusionImage] = useState([]);

  const [filter, setFilter] = useState([]);
  const axios = require("axios");

  const searchText = (event) => {
    setFilter(event.target.value);
  };
  let dataSearch = data.filter((item) => {
    return Object.keys(item).some((key) =>
      item[key]
        .toString()
        .toLowerCase()
        .includes(filter.toString().toLowerCase())
    );
  });

  const config = {
    method: "get",
    url: "http://localhost:3300/ems_event",
  };
  // //API FR
  // const getFrImage = axios
  //   .get("http://localhost:3300/frimage")
  //   .then((res) => {
  //     console.log(res.data);
  //     setFrImage(res.data);
  //   })
  //   .catch((err) => console.log(err));

  // //API Intrusion
  // const getIntrusionImage = axios
  //   .get("http://localhost:3300/intrusionimage")
  //   .then((res) => {
  //     console.log(res.data);
  //     setIntrusionImage(res.data);
  //   })
  //   .catch((err) => console.log(err));

  useEffect(() => {
    axios(config)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setFrImage(res.data);
      })
      .catch((err) => console.log(err));

    // setInterval(getFrImage, 50000);
    // setInterval(getIntrusionImage, 50000);
  }, []);

  return (
    <section className="py-4 container">
      <div className="row justify-content-center">
        <div className="col-12 md-5">
          <div className="mb-5 col-5 mx-auto text-center">
          <SearchIcon />
            <input
              type="text"
              className="input"
              value={filter}
              onChange={searchText.bind(this)}
              placeholder={"search. . ."}
            />
          </div>
        </div>

        {dataSearch.map((data, index) => {
          return (
            <div className="col-11 col-md-6 col-lg-3 mx-0 mb-4">
              <div className="card p-0 overflow-hidden h-100 shadow">
                {data.image && (
                  <img
                    src={`http://localhost:3300/FR_image/${data.image}`}
                    className="card-img-top"
                  />
                )}
                <div className="card-body text-center">
                  <h5 className="card-title">{data.ProfileId}</h5>
                  <p className="card-text">{data.Identity}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default App;
