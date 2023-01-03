import "./App.css";
import { useEffect, useState } from "react";
import React from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ImageList from "@mui/material/ImageList";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";

function App() {
  const [data, setData] = useState([]);
  const [frImage, setFrImage] = useState([]);
  const [intrusionImage, setIntrusionImage] = useState([]);
  const [personName, setPersonName] = React.useState([]);
  const axios = require("axios");

  const theme = useTheme();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const names = ["FR_Image", "Intrusion"];

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const config = {
    method: "get",
    url: "http://localhost:3300/ems_event",
  };
  //API FR
  const getFrImage = axios
    .get("http://localhost:3300/frimage")
    .then((res) => {
      console.log(res.data);
      setFrImage(res.data);
    })
    .catch((err) => console.log(err));

  //API Intrusion
  const getIntrusionImage = axios
    .get("http://localhost:3300/intrusionimage")
    .then((res) => {
      console.log(res.data);
      setIntrusionImage(res.data);
    })
    .catch((err) => console.log(err));

  useEffect(() => {
    axios(config)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.log(err));
    getFrImage();
    setInterval(getFrImage, 50000);
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
   
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar variant="dense">
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 5 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                  Photos
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>

          <div>
            <FormControl sx={{ m: 1, width: 500 }}>
              <InputLabel id="demo-multiple-name-label">Name</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Name" />}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <ImageList sx={{ width: 800, height: 500, margin: "auto" }}>
            {frImage.map((image) => (
              <div className="style_image">
                {/* <img
                  src={`http://localhost:3300/FR_image/${image}`}
                  style={{
                    width: 250,
                    height: 250,
                    margin: "auto",
                    display: "block",
                  }}
                />
                <p>{image}</p> */}
              </div>
            ))}
          </ImageList>
          {/* 
          {intrusionImage.map((image) => (
            <div className="style_image">
              <img
                src={`http://localhost:3300/Inttrusion_image/${image}`}
                style={{
                  width: 250,
                  height: 250,
                  margin: "auto",
                  display: "block",
                }}
              />
              <p>{image}</p>
            </div>
          ))} */}

          {/* <table>
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
          </table> */}
        </div>
  
  );
}

export default App;
